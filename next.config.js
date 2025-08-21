/** @type {import('next').NextConfig} */
const nextConfig = {
    // Minimal config for API routes only
    reactStrictMode: true,
  
    // Disable ESLint during build for hybrid setup
    eslint: {
      ignoreDuringBuilds: true,
    },
    // Only look for pages in app directory, ignore vite
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    // Exclude Vite source files from Next.js compilation
    webpack: (config, { isServer }) => {
      // Ignore vite directory during webpack compilation
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/vite/**', // Ignore entire vite directory
          '**/dist/**',
          '**/*.json',
        ],
      };
  
      // Add resolve alias to prevent Next.js from finding vite files
      config.resolve.alias = {
        ...config.resolve.alias,
        // Prevent Next.js from resolving vite files
        '@/vite': false,
      };
  
      return config;
    },
    // Configure Next.js to serve Vite build from dist folder
    async rewrites() {
      return [
        // Serve Vite assets
        {
          source: '/assets/:path*',
          destination: '/api/assets/:path*',  // ✅ Points to asset route
        },
        // Catch all other routes (except API) and serve Vite app
        {
          source: '/((?!api|_next|favicon.ico).*)',
          destination: '/api/static',
        },
      ];
    },
    // Add headers for caching
    async headers() {
      return [
        {
          source: '/api/static/assets/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  }
  
  export default nextConfig 