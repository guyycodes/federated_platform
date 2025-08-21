import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      "@mui/material/Box",
    ],
  },
  logLevel: 'info',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',  // Build to separate dist folder
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'animation-vendor': ['framer-motion', 'lottie-react'],
        }
      }
    }
  },
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'robots.txt', '*.jpg', '*.png'],
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB limit
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
    //   },
    //   manifest: {
    //     name: 'Reality Check',
    //     short_name: 'Reality Check',
    //     description: 'Pet Grooming Platform',
    //     theme_color: '#ffffff',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: '/192x192Icon.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: '/512x512Icon.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
  ],
})