// src/middleware.js
import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// "Public" API and static‐serving routes that shouldn't require auth:
const isPublic = createRouteMatcher([
    '/api/static/:path*',   // your SPA HTML
    '/api/assets/:path*',   // your Vite assets
    '/api/github/dispatch',  // GitHub dispatch endpoint (uses GitHub token auth)
    '/api/github/dispatch/callback/:path*',
]);

export default async function middleware(req, ev) {
  const { pathname } = req.nextUrl;

  // 1) Let Next.js internals and all your static assets through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/static') ||
    pathname.startsWith('/api/assets') ||
    pathname.startsWith('/api/github/dispatch') ||
    pathname.startsWith('/api/github/dispatch/callback') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2) in dev, still run your old Vite middleware (so your Supabase/Prisma + Clerk logic there fires)
  if (
    process.env.NODE_ENV === 'development' &&
    pathname.startsWith('/vite')
  ) {
    try {
      const { default: viteHandler } = await import('../vite/middleware.js');
      return viteHandler(req, ev);
    } catch (err) {
      console.debug('No Vite middleware (prod?), skipping:', err);
    }
  }

  // 2) Protect only genuine API calls
  if (pathname.startsWith('/api')) {
    console.log('[Middleware] API request:', req.method, pathname);
    if (isPublic(req)) {
      console.log('[Middleware] Public route, passing through');
      return NextResponse.next();
    }
    // This will enforce sign-in, then forward to your route handler
    console.log('[Middleware] Protected route, running Clerk middleware');
    return clerkMiddleware()(req, ev);
  }

  // 3) Everything else is just your Vite “app” being served via rewrite → /api/static
  return NextResponse.next();
}

// tell Next to bundle this in Node mode (so you can use fs, path, etc. in your /api/static handler)
export const config = {
  matcher: ['/api/:path*'],
};
