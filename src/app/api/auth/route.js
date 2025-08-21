// app/api/auth/route.js

import prisma from '../../../../vite/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName, lastName, phone } = body;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        ownedLocations: true,
        locationAccess: {
          include: {
            location: true
          }
        },
        customerAccount: true
      }
    });

    // Create or update user
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: email || '',
          firstName: firstName || '',
          lastName: lastName || '',
          phone: phone || null,
          role: 'CUSTOMER' // Default role for customer registration
        },
        include: {
          ownedLocations: true,
          locationAccess: {
            include: {
              location: true
            }
          },
          customerAccount: true
        }
      });
    } else {
      // Update user info if needed
      user = await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          email: email || user.email,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          phone: phone || user.phone
        },
        include: {
          ownedLocations: true,
          locationAccess: {
            include: {
              location: true
            }
          },
          customerAccount: true
        }
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 