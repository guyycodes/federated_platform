import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function exploreDirectory(dirPath, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return { truncated: true };
  
  try {
    const items = await readdir(dirPath);
    const result = {};
    
    for (const item of items) {
      try {
        const itemPath = join(dirPath, item);
        const stats = await stat(itemPath);
        
        if (stats.isDirectory()) {
          result[`${item}/`] = await exploreDirectory(itemPath, maxDepth, currentDepth + 1);
        } else {
          result[item] = {
            size: stats.size,
            type: 'file'
          };
        }
      } catch (err) {
        result[item] = { error: err.message };
      }
    }
    
    return result;
  } catch (err) {
    return { error: err.message };
  }
}

export async function GET() {
  try {
    const cwd = process.cwd();
    
    const info = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        PWD: process.env.PWD,
      },
      paths: {
        'process.cwd()': cwd,
        '__dirname equivalent': join(cwd),
      },
      fileSystem: {
        root: await exploreDirectory(cwd, 2),
        dist: await exploreDirectory(join(cwd, 'dist'), 3),
      },
      distCheck: {
        distExists: false,
        distContents: null,
        assetsExists: false,
        assetsContents: null,
      }
    };

    // Check specific paths
    try {
      const distPath = join(cwd, 'dist');
      info.distCheck.distExists = true;
      info.distCheck.distContents = await readdir(distPath);
      
      const assetsPath = join(cwd, 'dist', 'assets');
      info.distCheck.assetsExists = true;
      info.distCheck.assetsContents = await readdir(assetsPath);
    } catch (err) {
      info.distCheck.error = err.message;
    }

    return NextResponse.json(info, { 
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      } 
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      cwd: process.cwd(),
    }, { status: 500 });
  }
}