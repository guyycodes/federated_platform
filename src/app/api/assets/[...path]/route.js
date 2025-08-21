// app/api/assets/[...path]/route.js

import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request, { params }) {
  try {
    const { path } = params;
    const requestedFile = path[path.length - 1]; // Get the filename
    
    console.log('=== Direct Asset Route ===');
    console.log('Full URL:', request.url);
    console.log('Path segments:', path);
    console.log('Requested file:', requestedFile);
    
    // Smart matching for hash mismatches
    const filePrefix = requestedFile.split('-')[0]; // Get "index" part
    const fileExtension = requestedFile.split('.').pop(); // Get file extension
    
    const assetsDir = join(process.cwd(), 'dist', 'assets');
    
    let assetsFiles;
    try {
      assetsFiles = await readdir(assetsDir);
      console.log('Available assets:', assetsFiles);
    } catch (dirError) {
      console.error('❌ Cannot read assets directory:', dirError);
      return NextResponse.json({ 
        error: 'Assets directory not found',
        path: assetsDir,
        details: dirError.message
      }, { status: 500 });
    }
    
    // Find file that starts with the same prefix and has the same extension
    const matchingFile = assetsFiles.find(file => 
      file.startsWith(filePrefix + '-') && file.endsWith('.' + fileExtension)
    );
    
    let filePath;
    if (matchingFile) {
      filePath = join(assetsDir, matchingFile);
      console.log('🎯 Smart match:', matchingFile, 'for request:', requestedFile);
    } else {
      // Direct match attempt
      filePath = join(assetsDir, requestedFile);
      console.log('→ Direct match attempt for:', requestedFile);
    }
    
    const fileBuffer = await readFile(filePath);
    console.log('✅ Asset read successfully, size:', fileBuffer.length, 'bytes');
    
    // Set appropriate content type
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypes = {
      'js': 'application/javascript; charset=utf-8',
      'mjs': 'application/javascript; charset=utf-8',
      'css': 'text/css; charset=utf-8',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'eot': 'application/vnd.ms-fontobject',
      'webp': 'image/webp',
      'ico': 'image/x-icon',
      'json': 'application/json',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    console.log('Content-Type:', contentType, 'for extension:', ext);
    
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=16000, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
    
  } catch (error) {
    console.error('❌ Asset file error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: 'Asset not found',
      requestedFile: params.path?.[params.path.length - 1],
      path: params.path,
      details: error.message,
      code: error.code
    }, { status: 404 });
  }
}