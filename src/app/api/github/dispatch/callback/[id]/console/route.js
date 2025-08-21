// src/app/api/github/dispatch/callback/[id]/console/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../../vite/lib/prisma';
/**
 * Route For Websocket Callbacks
 * @param {*} request 
 * @param {*} param1 
 * @returns 
 */
// Unscramble function (backwards = true)
function unscrambleAddress(scrambled) {
  let unscrambled = "";
  for (let i = 0; i < scrambled.length; i++) {
    let charCode = scrambled.charCodeAt(i);
    if (i % 2 === 0) {
      // Right shift for even indices (reverse of left shift)
      charCode = ((charCode - 32 - 5 + 95) % 95 + 32);
    } else {
      // Left shift for odd indices (reverse of right shift)
      charCode = ((charCode - 32 + 3) % 95 + 32);
    }
    unscrambled += String.fromCharCode(charCode);
  }
  return unscrambled;
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log(`[Console POST] Received data for callback: ${id}`);
    console.log(`[Console POST] Raw body:`, JSON.stringify(body, null, 2));
    
    let streamUrl = '';
    
    // Decode the scrambled WebSocket URL
    if (body.type === 'scrambled' && body.data) {
      try {
        streamUrl = unscrambleAddress(body.data);
        console.log(`[Console POST] Unscrambled WebSocket URL: ${streamUrl}`);
      } catch (err) {
        console.error(`[Console POST] Failed to unscramble:`, err);
      }
    } else {
      console.log(`[Console POST] No scrambled data to decode (type: ${body.type})`);
    }
    
    // Log all the data we received
    console.log(`[Console POST] Full decoded data:`, {
      callbackId: id,
      streamUrl: streamUrl,
      sessionId: body.session_id,
      status: body.status,
      type: body.type,
      timestamp: new Date().toISOString()
    });
    
    // Only save if we have a valid stream URL
    if (streamUrl) {
      try {
        const updated = await prisma.githubCallback.upsert({
          where: { callbackId: id },
          update: {
            streamUrl: streamUrl,
            streamStatus: body.status || 'ready',
            data: {
              ...body,
              decodedStreamUrl: streamUrl,
              receivedAt: new Date().toISOString()
            }
          },
          create: {
            callbackId: id,
            streamUrl: streamUrl,
            streamStatus: body.status || 'ready',
            data: {
              ...body,
              decodedStreamUrl: streamUrl,
              receivedAt: new Date().toISOString()
            }
          }
        });
        console.log(`[Console POST] Successfully saved stream URL to database for ${id}`);
      } catch (dbError) {
        console.error(`[Console POST] Database error:`, dbError);
      }
    } else {
      console.log(`[Console POST] No stream URL to save. /callback/[id]/console/route.js`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Console data received and decoded',
      callbackId: id,
      // For debugging only - remove in production
      debug: { streamUrl }
    });
    
  } catch (error) {
    console.error('[Console POST] Error:', error);
    console.error('[Console POST] Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to process console data' },
      { status: 500 }
    );
  }
} 