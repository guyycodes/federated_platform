// src/app/api/github/dispatch/callback/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../vite/lib/prisma';
/**
 * Route For GitHub Callback (NON STREAMING)
 * @param {*} request 
 * @param {*} param1 
 * @returns 
 */
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const isStreamEndpoint = url.pathname.endsWith('/stream');
    
    console.log(`[Callback POST] ID: ${id}, Stream endpoint: ${isStreamEndpoint}`);
    
    const body = await request.json();
    console.log(`[callback/[id]/route.js POST] Body:`, body);
    
    if (isStreamEndpoint) {
      // Update with stream data
      await prisma.githubCallback.upsert({
        where: { callbackId: id },
        update: {
          streamUrl: body.stream_url,
          streamStatus: body.status,
          data: body
        },
        create: {
          callbackId: id,
          streamUrl: body.stream_url,
          streamStatus: body.status,
          data: body
        }
      });
      console.log(`[Callback POST] Stream data updated for ${id}`);
    } else {
      // Create or update callback
      await prisma.githubCallback.upsert({
        where: { callbackId: id },
        update: { data: body },
        create: {
          callbackId: id,
          data: body
        }
      });
      console.log(`[Callback POST] Callback data updated for ${id}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Callback received' 
    });
    
  } catch (error) {
    console.error('[callback/[id]/route.js POST] Error processing callback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process callback' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {

    if(request.headers.get('Authorization')){
      //the header extraction only happens when we validate the callback before creating a database entry
      try{
      const id = request.headers.get('Authorization');
      const callbackID = id.replace('Bearer ', '');
      // Retry logic for prepared statement errors
      let callback;
      let retries = 3;
      while (retries > 0) {
        try {
          callback = await prisma.githubCallback.findUnique({
            where: { callbackId: callbackID }
          });
          break; // Success, exit loop
        } catch (error) {
          if (error.message?.includes('prepared statement') && retries > 1) {
            console.log(`[Callback GET Auth] Prepared statement error, retrying... (${retries - 1} retries left)`);
            retries--;
            await new Promise(resolve => setTimeout(resolve, 100));
            await prisma.$disconnect();
            await prisma.$connect();
          } else {
            throw error;
          }
        }
      }
      return NextResponse.json(callback);
      } catch (error) {
        console.error('[Callback GET] Error retrieving callback:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to retrieve callback' },
          { status: 500 }
        );
      }
    }


    const { id } = await params;
    console.log(`[Callback GET] Fetching callback: ${id}`);
    
    // Retry logic for prepared statement errors
    let callback;
    let retries = 3;
    while (retries > 0) {
      try {
        callback = await prisma.githubCallback.findUnique({
          where: { callbackId: id }
        });
        break; // Success, exit loop
      } catch (error) {
        if (error.message?.includes('prepared statement') && retries > 1) {
          console.log(`[Callback GET] Prepared statement error, retrying... (${retries - 1} retries left)`);
          retries--;
          // Wait a bit before retry
          await new Promise(resolve => setTimeout(resolve, 100));
          // Try to reset the connection
          await prisma.$disconnect();
          await prisma.$connect();
        } else {
          throw error; // Re-throw if not a prepared statement error or no retries left
        }
      }
    }
    
    console.log(`[Callback GET] Found callback:`, callback ? 'Yes' : 'No');
    console.log(`[Callback GET] Callback data:`, callback?.data);
    
    if (!callback) {
      return NextResponse.json(
        { error: 'Callback not found' },
        { status: 404 }
      );
    }
    
    // Return the data in the expected format
    const response = {
      ...(callback.data || {}),
      stream: callback.streamUrl ? {
        stream_url: callback.streamUrl,
        status: callback.streamStatus
      } : null
    };
    
    console.log(`[Callback GET] Returning response with stream:`, response.stream ? 'Yes' : 'No');
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[Callback GET] Error retrieving callback:', error);
    console.error('[Callback GET] Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve callback' },
      { status: 500 }
    );
  }
}