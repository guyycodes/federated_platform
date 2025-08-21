import { NextResponse } from 'next/server';
import prisma from '../../../../../vite/lib/prisma';

// GET /api/plugins/[id] - Get a specific plugin by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const plugin = await prisma.plugin.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true
          }
        },
        purchases: {
          select: {
            id: true,
            userId: true,
            purchasedAt: true
          }
        },
        _count: {
          select: {
            purchases: true,
            usageRecords: true
          }
        }
      }
    });
    
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(plugin);
  } catch (error) {
    console.error('[Plugin GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plugin' },
      { status: 500 }
    );
  }
}

// PUT /api/plugins/[id] - Update a plugin by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Define valid deployment status transitions
    const VALID_TRANSITIONS = {
      'NEW': ['DEVELOPMENT'],
      'DEVELOPMENT': ['STAGING', 'ERROR'],
      'STAGING': ['PRODUCTION', 'DEVELOPMENT', 'ERROR'],
      'PRODUCTION': ['STAGING', 'ERROR'],
      'ERROR': ['NEW', 'DEVELOPMENT', 'STAGING', 'PRODUCTION']
    };
    
    // First, check if the plugin exists and get current status
    const plugin = await prisma.plugin.findUnique({
      where: { id },
      select: {
        id: true,
        deploymentStatus: true
      }
    });
    
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }
    
    // Validate deployment status transition
    if (body.deploymentStatus && body.deploymentStatus !== plugin.deploymentStatus) {
      const currentStatus = plugin.deploymentStatus;
      const newStatus = body.deploymentStatus;
      const validTransitions = VALID_TRANSITIONS[currentStatus] || [];
      
      if (!validTransitions.includes(newStatus)) {
        return NextResponse.json(
          { 
            error: `Invalid deployment status transition from ${currentStatus} to ${newStatus}`,
            validTransitions 
          },
          { status: 400 }
        );
      }
      
      console.log(`[Plugin PUT] Valid deployment status transition: ${currentStatus} → ${newStatus}`);
    }
    
    // Update only the deploymentStatus
    const updatedPlugin = await prisma.plugin.update({
      where: { id },
      data: {
        deploymentStatus: body.deploymentStatus
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            purchases: true,
            usageRecords: true
          }
        }
      }
    });
    
    console.log(`[Plugin PUT] Updated plugin ${id} - deploymentStatus: ${body.deploymentStatus}`);
    
    return NextResponse.json({
      success: true,
      message: 'Plugin updated successfully',
      plugin: updatedPlugin
    });
  } catch (error) {
    console.error('[Plugin PUT] Error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update plugin' },
      { status: 500 }
    );
  }
}

// DELETE /api/plugins/[id] - Delete a plugin by ID
export async function DELETE(request, { params }) {
  try {
    // Get the user ID from Authorization header
    const authHeader = request.headers.get('Authorization');
    const clerkUserId = authHeader?.replace('Bearer ', '');
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // First, check if the plugin exists and belongs to the user
    const plugin = await prisma.plugin.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
        name: true,
        gitRepo: true
      }
    });
    
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (plugin.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this plugin' },
        { status: 403 }
      );
    }
    
    // Delete the plugin and all related records (cascading deletes)
    const deletedPlugin = await prisma.plugin.delete({
      where: { id }
    });
    
    console.log(`[Plugin DELETE] Deleted plugin: ${plugin.name} (${id})`);
    
    return NextResponse.json({
      success: true,
      message: 'Plugin deleted successfully',
      plugin: {
        id: deletedPlugin.id,
        name: deletedPlugin.name,
        gitRepo: deletedPlugin.gitRepo
      }
    });
  } catch (error) {
    console.error('[Plugin DELETE] Error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Plugin not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete plugin' },
      { status: 500 }
    );
  }
}
