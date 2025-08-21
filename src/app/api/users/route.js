import prisma from '../../../../vite/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/users - Get all users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get single user
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          ownedLocations: true,
          locationAccess: {
            include: {
              location: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json(user)
    }

    // Get all users
    const users = await prisma.user.findMany({
      include: {
        ownedLocations: true,
        locationAccess: {
          include: {
            location: true
          }
        }
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phone, clerkUserId, role } = body

    // Validate required fields
    if (!email || !firstName || !lastName || !clerkUserId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName, clerkUserId' },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone: phone || null,
        clerkUserId,
        role: role || 'UNSET'
      },
      include: {
        ownedLocations: true,
        locationAccess: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email or Clerk ID already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update user
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id },
      data: body,
      include: {
        ownedLocations: true,
        locationAccess: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('PUT /api/users error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Delete user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/users error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
} 