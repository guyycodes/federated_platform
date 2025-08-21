import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname.replace('/api/static', '');
    
    console.log('=== Static Route Debug ===');
    console.log('Full URL:', request.url);
    console.log('URL pathname:', url.pathname);
    console.log('Pathname after replace:', pathname);
    console.log('CWD:', process.cwd());
    
    let filePath;
    
    // Handle different path cases
    if (pathname === '/' || pathname === '' || pathname === '/index.html') {
      // Root requests → serve index.html with dynamic asset injection
      filePath = join(process.cwd(), 'dist', 'index.html');
      console.log('→ Serving root page (index.html)');
      
      try {
        let htmlContent = await readFile(filePath, 'utf-8');
        
        // Dynamically update asset references in index.html
        const assetsDir = join(process.cwd(), 'dist', 'assets');
        const assetsFiles = await readdir(assetsDir);
        console.log('→ Available assets for injection:', assetsFiles);
        
        // Find the actual index JS file
        const indexJsFile = assetsFiles.find(file => file.startsWith('index-') && file.endsWith('.js'));
        if (indexJsFile) {
          // Replace any index-*.js reference with the actual file
          htmlContent = htmlContent.replace(/\/assets\/index-[a-zA-Z0-9\-_]+\.js/g, `/assets/${indexJsFile}`);
          console.log(`→ Updated asset reference to: /assets/${indexJsFile}`);
        }
        
        // Find and update CSS files if any
        const cssFile = assetsFiles.find(file => file.startsWith('index-') && file.endsWith('.css'));
        if (cssFile) {
          htmlContent = htmlContent.replace(/\/assets\/index-[a-zA-Z0-9\-_]+\.css/g, `/assets/${cssFile}`);
          console.log(`→ Updated CSS reference to: /assets/${cssFile}`);
        }
        
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        console.error('Error processing index.html:', err);
        throw err;
      }
      
    } else if (pathname.startsWith('/assets/')) {
      // 🎯 SMART ASSET RESOLUTION - Handle hash mismatches
      const requestedFile = pathname.split('/').pop(); // Get "index-B2Ee-rT5.js"
      const filePrefix = requestedFile.split('-')[0]; // Get "index" part
      
      console.log('→ Asset request for:', requestedFile);
      console.log('→ Looking for files starting with:', filePrefix);
      
      try {
        const assetsDir = join(process.cwd(), 'dist', 'assets');
        const assetsFiles = await readdir(assetsDir);
        console.log('→ Available assets:', assetsFiles);
        
        // Find file that starts with the same prefix (e.g., "index-")
        const matchingFile = assetsFiles.find(file => file.startsWith(filePrefix + '-'));
        
        if (matchingFile) {
          filePath = join(assetsDir, matchingFile);
          console.log('🎯 Smart match found:', matchingFile, 'for request:', requestedFile);
        } else {
          // Fallback to direct path
          filePath = join(process.cwd(), 'dist', pathname.slice(1));
          console.log('→ No smart match, using direct path');
        }
      } catch (err) {
        console.log('→ Assets dir error:', err.message);
        filePath = join(process.cwd(), 'dist', pathname.slice(1));
      }
    } else if (pathname.includes('.')) {
      // Any other file request
      const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      filePath = join(process.cwd(), 'dist', cleanPath);
      console.log('→ Serving file:', cleanPath);
    } else {
      // Non-file requests (SPA routes) → serve index.html with dynamic updates
      filePath = join(process.cwd(), 'dist', 'index.html');
      console.log('→ Serving SPA route (index.html)');
      
      // Same dynamic injection logic as root
      try {
        let htmlContent = await readFile(filePath, 'utf-8');
        const assetsDir = join(process.cwd(), 'dist', 'assets');
        const assetsFiles = await readdir(assetsDir);
        
        const indexJsFile = assetsFiles.find(file => file.startsWith('index-') && file.endsWith('.js'));
        if (indexJsFile) {
          htmlContent = htmlContent.replace(/\/assets\/index-[a-zA-Z0-9\-_]+\.js/g, `/assets/${indexJsFile}`);
        }
        
        const cssFile = assetsFiles.find(file => file.startsWith('index-') && file.endsWith('.css'));
        if (cssFile) {
          htmlContent = htmlContent.replace(/\/assets\/index-[a-zA-Z0-9\-_]+\.css/g, `/assets/${cssFile}`);
        }
        
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        console.error('Error processing SPA route:', err);
      }
    }
    
    // For non-HTML files, serve as before
    if (filePath && !pathname.endsWith('.html') && pathname !== '/' && pathname !== '') {
      console.log('Final file path:', filePath);
      
      const fileBuffer = await readFile(filePath);
      console.log('✅ File read successfully, size:', fileBuffer.length, 'bytes');
      
      // Set appropriate content type
      const ext = filePath.split('.').pop()?.toLowerCase();
      const contentTypes = {
        'html': 'text/html; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'mjs': 'application/javascript; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'webp': 'image/webp',
        'woff': 'font/woff',
        'woff2': 'font/woff2',
        'ttf': 'font/ttf',
        'eot': 'application/vnd.ms-fontobject',
        'json': 'application/json',
        'webmanifest': 'application/manifest+json',
      };
      
      const contentType = contentTypes[ext] || 'application/octet-stream';
      console.log('Content-Type:', contentType);
      
      const headers = new Headers({
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
      });

      if (ext === 'html') {
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        headers.set('Cache-Control', 'public, max-age=1600');
      }
      
      console.log('=== End Debug ===\n');
      return new Response(fileBuffer, { headers });
    }
    
  } catch (error) {
    console.error('❌ Static file error:', error);
    console.error('Error details:', {
      code: error.code,
      path: error.path,
      message: error.message,
      requestUrl: request.url
    });
    
    // For 404s, serve index.html (SPA fallback) - but NOT for assets
    if (error.code === 'ENOENT') {
      const pathname = url.pathname.replace('/api/static', '');
      
      // Don't serve index.html for asset requests that failed
      if (pathname.startsWith('/assets/') || pathname.includes('.js') || pathname.includes('.css')) {
        console.log('❌ Asset not found, returning 404');
        return NextResponse.json({ 
          error: 'Asset not found', 
          path: error.path,
          requestUrl: request.url,
          pathname: pathname
        }, { status: 404 });
      }
      
      try {
        const indexPath = join(process.cwd(), 'dist', 'index.html');
        console.log('🔄 Serving fallback index.html from:', indexPath);
        let htmlContent = await readFile(indexPath, 'utf-8');
        
        // Dynamic asset injection for fallback too
        const assetsDir = join(process.cwd(), 'dist', 'assets');
        const assetsFiles = await readdir(assetsDir);
        
        const indexJsFile = assetsFiles.find(file => file.startsWith('index-') && file.endsWith('.js'));
        if (indexJsFile) {
          htmlContent = htmlContent.replace(/\/assets\/index-[a-zA-Z0-9\-_]+\.js/g, `/assets/${indexJsFile}`);
        }
        
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (indexError) {
        console.error('❌ Index file error:', indexError);
        return NextResponse.json({ 
          error: 'File not found', 
          path: error.path,
          requestUrl: request.url 
        }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}