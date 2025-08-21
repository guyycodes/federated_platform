import { NextResponse } from 'next/server';
import prisma from '../../../../../../vite/lib/prisma';
import { auth } from '@clerk/nextjs/server';
export async function GET(request) {
  try {
    // Get the user ID from Authorization header
    const authHeader = request.headers.get('Authorization');
    // console.log('Authorization header:', authHeader);
    // Clerk auth isnt avaliable here, unles by the header
    // console.log('\n==== TESTING CLERK AUTH() ====');
    // try {
    //   const authResult = await auth();
    //   console.log('auth() result:', authResult);
    //   console.log('auth() userId:', authResult?.userId);
    // } catch (authError) {
    //   console.log('auth() error:', authError);
    // }
    
    const clerkUserId = authHeader?.replace('Bearer ', '');
    // console.log('User ID from header:', clerkUserId);
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user in our database with their plugins
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        createdPlugins: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format plugins to match mockProjects.json structure
    const formattedPlugins = user.createdPlugins.map(plugin => ({
      id: plugin.id,
      name: plugin.name,
      description: plugin.description,
      category: plugin.category,
      deploymentStatus: plugin.deploymentStatus,
      deploymentUrl: plugin.deploymentUrl,
      apiEndpoint: plugin.apiEndpoint,
      totalInstalls: plugin.totalInstalls,
      monthlyActiveUsers: plugin.monthlyActiveUsers,
      totalRevenue: plugin.totalRevenue,
      createdAt: plugin.createdAt.toISOString(),
      isPublished: plugin.isPublished,
      isActive: plugin.isActive,
      gitRepo: plugin.gitRepo
    }));

    return NextResponse.json({
      plugins: formattedPlugins,
      total: formattedPlugins.length
    });

  } catch (error) {
    console.error('Error fetching user plugins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plugins', details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint for creating plugins or getting plugin details
export async function POST(request) {
    try {
      const body = await request.json();

      // Check if this is a plugin creation request
      if (body.action === 'create') {
        const { clerkUserId } = body;
        
        if (!clerkUserId) {
          return NextResponse.json({ error: 'Clerk user ID is required' }, { status: 400 });
        }
        console.log('request body on server:', body);
        // Get single user
        const user = await prisma.user.findUnique({
          where: { clerkUserId },
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
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
  
        // Map pricing model from frontend format to Prisma enum
        const pricingModelMap = {
          'one-time': 'ONE_TIME',
          'subscription': 'SUBSCRIPTION',
          'usage': 'USAGE_BASED',
          'freemium': 'FREEMIUM',
          'free': 'FREE'
        };

        const categoryMap = {
          'development': 'DEVELOPMENT',
          'productivity': 'PRODUCTIVITY',
          'analytics': 'ANALYTICS',
          'language': 'LANGUAGE',
          'ai-ml': 'AI_ML',
          'automation': 'AUTOMATION',
          'integration': 'INTEGRATION',
          'other': 'OTHER'
        };
        console.log("attempting to create plugin");
        // Create the plugin
        const plugin = await prisma.plugin.create({
          data: {
            creatorId: user.id,
            name: body.name,
            description: body.description,
            category: categoryMap[body.category] || 'OTHER',
            templateId: body.templateId || body.template?.id || 'custom',
            template: body.template || {},
            gitRepo: body.gitRepo,
            pricingModel: pricingModelMap[body.pricingModel] || 'FREEMIUM',
            oneTimePrice: body.pricingModel === 'one-time' ? parseFloat(body.oneTimePrice) || null : null,
            subscriptionTier: body.pricingModel === 'subscription' ? body.subscriptionTier || 'none' : 'none',
            usagePrice: body.pricingModel === 'usage' ? parseFloat(body.tokenCostPer1M) || null : null,
            whiteLabel: body.whiteLabel || false,
            isPublished: false,
            isActive: true,
            deploymentStatus: body.deploymentStatus || 'NEW',
            deploymentUrl: body.deploymentUrl || null,
            apiEndpoint: body.apiEndpoint || null,
            totalInstalls: 0,
            monthlyActiveUsers: 0,
            totalRevenue: 0
          }
        });
  
        return NextResponse.json({ 
          success: true, 
          plugin,
          message: 'Plugin created successfully' 
        });
      }
    } catch (error) {
      console.error('Plugin creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create plugin in database', details: error.message }, 
        { status: 500 }
      );
    }
  }

// OPTIONS route for explicit user refresh
export async function OPTIONS(request) {
    try {
      const { clerkUserId } = request;
      
      if (!clerkUserId) {
        throw new Error('No authenticated user found');
      }
  
      // Find user by clerkUserId and refresh data
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
        include: {
          ownedLocations: true,
          locationAccess: {
            include: {
              location: true
            }
          },
          createdPlugins: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
  
      if (!user) {
        throw new Error('User not found in database');
      }

      // Just return success message
      return NextResponse.json({ 
        success: true,
        message: 'User data refreshed successfully' 
      });

    } catch (error) {
      console.error('User refresh error:', error);
      return NextResponse.json(
        { error: 'Failed to refresh user data', details: error.message },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } 