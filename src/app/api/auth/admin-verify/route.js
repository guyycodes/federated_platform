import prisma from '../../../../../vite/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// this gets called first when checking if the user is an admin
export async function GET(request) {
  try {
    // Note: During login flow, Clerk session might not be fully established yet
    // So we're temporarily not checking auth() here
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    // Build query filters
    const where = {};
    if (email) {
      where.email = email;
    }
    
    // Find single user with the email
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      include: {
        ownedLocations: true,
        locationAccess: true,
      }
    });

    // If no user found, return 404
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user with role information
    const response = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      clerkUserId: user.clerkUserId,
      ownedLocations: user.ownedLocations,
      locationAccess: user.locationAccess
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error, please contact administrator....' }, { status: 500 });
  }
}

// this gets called when the user is an admin and they are logging in
export async function POST(request) {
  try {

    const body = await request.json();
    const { email, userId } = body;
    
    // console.log('Admin verify POST - Request body:', body);
    // console.log('Admin verify POST - Email extracted:', email);

    // Find user by email and verify they have admin role
    const user = await prisma.user.findUnique({
      where: { 
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in system' }, { status: 404 });
    }

    // Check if user has admin role (USER_ADMIN or USER)
    const adminRoles = ['USER_ADMIN', 'USER'];
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient privileges' }, { status: 403 });
    }

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        clerkUserId: user.clerkUserId,
        ownedLocations: user.ownedLocations,
        locationAccess: user.locationAccess
      }
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 