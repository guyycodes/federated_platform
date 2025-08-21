import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return handleRequest(request, params);
}

export async function POST(request, { params }) {
  return handleRequest(request, params);
}

async function handleRequest(request, { params }) {
  const { plugin, rest } = params;
  
  try {
    // Proxy to plugin's deployed backend
    const targetUrl = `https://${plugin}.fly.dev/api/${rest.join('/')}`;
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries()),
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error(`Error proxying to plugin ${plugin}:`, error);
    return NextResponse.json(
      { error: 'Plugin not available' },
      { status: 503 }
    );
  }
}