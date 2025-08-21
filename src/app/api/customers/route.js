// customers/routes.js

import { NextResponse } from 'next/server';
import prisma from '../../../../vite/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// import { PrismaClient } from '../../../src/generated/prisma';

// // Create a singleton instance for edge runtime
// const globalForPrisma = globalThis;

// // Initialize Prisma Client with proper configuration for edge runtime
// const prisma = globalForPrisma.prisma || new PrismaClient({
//   // Add any edge-specific configuration here if needed
//   log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
// });

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma;
// }


export async function GET(request) {
  try {
    // const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    // Build query filters
    const where = {};
    if (email) {
      where.email = email;
    }
    
    // Fetch customers with optional email filter
    const customer = await prisma.customer.findFirst({
      where: {
        email: email
      },
      include: {
        location: true,
      }
    });

    // If no customer found, return 404
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const response = {
      id: customer?.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      role: customer.role,
      isActive: customer.isActive,
      clerkUserId: customer.clerkUserId,
      location: customer.location,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, userId, login } = body;

    if (login) {
      // Handle customer login
      const where = {};
      if (email) {
        where.email = email;
      }
      
      // Fetch customer with email filter
      const customers = await prisma.customer.findFirst({
        where: {
          email: email
        },
        include: {
          location: true,
        }
      });

      if (!customers) {
        return NextResponse.json({ error: 'Please register first.' }, { status: 404 });
      }

      const customerRoles = ['CUSTOMER'];
      if (!customerRoles.includes(customers.role)) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      try {
        // Extract customer data
        const {
          firstName,
          lastName,
          phone,
        } = customers;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        // Return customer data for login
        return NextResponse.json({
          id: customers.id,
          email: customers.email,
          firstName: customers.firstName,
          lastName: customers.lastName,
          role: customers.role,
          phone: customers.phone,
          isActive: customers.isActive,
          clerkUserId: customers.clerkUserId,
          location: customers.location,
          subscriptions: customers.subscriptions,
          orders: customers.orders,
          appointments: customers.appointments,
          notes: customers.notes,
          location: customers.location,
          csiRecords: customers.csiRecords,
        });
        
      } catch (error) {
        console.error('Error extracting customer data:', error);
        return NextResponse.json(
          { error: 'Failed to extract customer data' },
          { status: 500 }
        );
      }

    } else {
      // Handle customer registration
      const {
        firstName,
        lastName,
        phone,
        locationId,
        dogName,
        dogBreed,
        dogAge,
        dogWeight,
        allergies,
        preferredGroomer,
        notes,
      } = body;

      try {
        // Check if customer already exists with this email
        const existingCustomer = await prisma.customer.findFirst({
          where: {
            email,
            ...(locationId && { locationId }) // Only add locationId to query if it exists
          }
        });

        if (existingCustomer) {
          return NextResponse.json(
            { error: 'Customer already exists with this email' },
            { status: 409 }
          );
        }

        // Create the customer
        const customer = await prisma.customer.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            ...(locationId && { locationId }), // Only add locationId if provided
            dogName,
            dogBreed,
            dogAge: dogAge ? parseInt(dogAge) : null,
            dogWeight: dogWeight ? parseFloat(dogWeight) : null,
            allergies,
            preferredGroomer,
            notes,
            role: 'CUSTOMER', // Every customer gets CUSTOMER role
            // Note: NOT setting userId - customers don't link to User records
            isActive: true
          },
          include: {
            location: true,
          }
        });

        return NextResponse.json(customer);

      } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Delete the customer
    await prisma.customer.delete({
      where: { id: customerId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}