import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../../../../lib/prisma';

// Handle CORS preflight requests
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  // Create response with CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { code, redirectUri, stateData } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Received OAuth callback:', { code, redirectUri, stateData });

    // Check for required environment variables
    const clientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'Google OAuth credentials not configured. Please add GOOGLE_CLIENT_SECRET to your .env file.',
          details: {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret
          }
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Google OAuth2 token endpoint
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';

    // Prepare the request to exchange code for tokens
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    console.log('Exchanging authorization code for tokens...');

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString()
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.json(
        { 
          error: 'Failed to exchange authorization code',
          details: errorData 
        },
        { status: tokenResponse.status, headers: corsHeaders }
      );
    }

    const tokens = await tokenResponse.json();
    console.log('Tokens received successfully');

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch user info');
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: userInfoResponse.status, headers: corsHeaders }
      );
    }

    const userInfo = await userInfoResponse.json();
    console.log('User info retrieved:', userInfo);

    // Determine if this is a sign-in or registration flow
    const isSignIn = stateData?.mode === 'signin';
    
    if (isSignIn) {
      // SIGN-IN FLOW: Check if user exists and create ticket
      console.log('Processing sign-in flow for:', userInfo.email);
      
      try {
        // 1. Check if user exists in your database
        const existingCustomer = await prisma.customer.findFirst({
          where: { email: userInfo.email }
        });
        
        if (!existingCustomer) {
          // User doesn't exist - they need to register
          console.log('No customer found for email:', userInfo.email);
          return NextResponse.json({
            success: false,
            needsRegistration: true,
            googleUser: userInfo,
            message: 'No account found. Please register first.'
          }, { headers: corsHeaders });
        }
        
        console.log('Customer found:', existingCustomer.id);
        console.log('Customer data:', {
          firstName: existingCustomer.firstName,
          lastName: existingCustomer.lastName,
          email: existingCustomer.email,
          locationId: existingCustomer.locationId
        });
        
        // 2. Find the Clerk user
        const clerkUsers = await clerkClient.users.getUserList({
          emailAddress: [userInfo.email]
        });
        
        if (clerkUsers.length === 0) {
          // Database record exists but no Clerk user - data inconsistency
          console.error('Customer exists but no Clerk user found');
          return NextResponse.json({
            success: false,
            error: 'Account configuration error. Please contact support.',
            needsSupport: true
          }, { headers: corsHeaders });
        }
        
        // 3. Create a sign-in ticket
        const clerkUser = clerkUsers[0];
        console.log('Creating sign-in ticket for Clerk user:', clerkUser.id);
        console.log('Clerk user data:', {
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.emailAddresses[0]?.emailAddress
        });
        
        const signInToken = await clerkClient.signInTokens.createSignInToken({
          userId: clerkUser.id,
          expiresInSeconds: 60, // Ticket expires in 60 seconds
        });
        
        console.log('Sign-in ticket created successfully');
        
        // If customer doesn't have names but Clerk does, update the customer record
        if ((!existingCustomer.firstName || !existingCustomer.lastName) && 
            (clerkUser.firstName || clerkUser.lastName)) {
          console.log('Updating customer record with names from Clerk');
          
          const updatedCustomer = await prisma.customer.update({
            where: { id: existingCustomer.id },
            data: {
              firstName: existingCustomer.firstName || clerkUser.firstName || '',
              lastName: existingCustomer.lastName || clerkUser.lastName || ''
            }
          });
          
          console.log('Customer record updated:', {
            firstName: updatedCustomer.firstName,
            lastName: updatedCustomer.lastName
          });
          
          // Use updated data
          existingCustomer.firstName = updatedCustomer.firstName;
          existingCustomer.lastName = updatedCustomer.lastName;
        }
        
        // 4. Return success with ticket
        return NextResponse.json({
          success: true,
          mode: 'signin',
          ticket: signInToken.token,
          user: {
            id: existingCustomer.id,
            email: existingCustomer.email,
            firstName: existingCustomer.firstName,
            lastName: existingCustomer.lastName,
            clerkUserId: clerkUser.id,
            // Also include these for frontend debugging
            dbFirstName: existingCustomer.firstName,
            dbLastName: existingCustomer.lastName,
            clerkFirstName: clerkUser.firstName,
            clerkLastName: clerkUser.lastName
          }
        }, { headers: corsHeaders });
        
      } catch (dbError) {
        console.error('Database or Clerk error during sign-in:', dbError);
        return NextResponse.json({
          success: false,
          error: 'Failed to process sign-in',
          message: dbError.message
        }, { status: 500, headers: corsHeaders });
      }
      
    } else {
      // REGISTRATION FLOW: Return Google user data
      console.log('Processing registration flow');
      
      // Check if user already exists (to prevent duplicate registrations)
      try {
        const existingCustomer = await prisma.customer.findFirst({
          where: { email: userInfo.email }
        });
        
        if (existingCustomer) {
          console.log('User already exists, redirecting to sign-in');
          return NextResponse.json({
            success: false,
            alreadyExists: true,
            message: 'An account with this email already exists. Please sign in instead.'
          }, { headers: corsHeaders });
        }
      } catch (dbError) {
        console.error('Error checking existing customer:', dbError);
        // Continue with registration flow even if check fails
      }
      
      // Return Google user info for registration
      return NextResponse.json({
        success: true,
        mode: 'register',
        user: {
          id: userInfo.id,
          email: userInfo.email,
          verified_email: userInfo.verified_email,
          name: userInfo.name,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          picture: userInfo.picture,
          locale: userInfo.locale,
          // Additional fields from stateData
          selectedPlan: stateData?.selectedPlan,
          registrationType: stateData?.type
        }
      }, { headers: corsHeaders });
    }
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 