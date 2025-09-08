import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Todo App - Task Management',
        short_name: 'Todo App',
        description: 'A simple and accessible todo application built with React and Headless UI',
        theme_color: '#3B82F6',
        background_color: '#FFFFFF',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['productivity', 'utilities'],
        shortcuts: [
          {
            name: 'Add New Task',
            short_name: 'New Task',
            description: 'Quickly add a new task',
            url: '/?action=new',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          'react-core': ['react', 'react-dom'],
          // UI library
          'headless-ui': ['@headlessui/react'],
          // Icons (separate chunk for caching)
          'icons': ['@heroicons/react/24/outline', '@heroicons/react/24/solid'],
          // Performance libraries
          'performance': ['web-vitals', 'react-window'],
          // Utilities
          'utils': ['uuid']
        },
        // Optimize chunk file names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.ts', '').replace('.tsx', '') 
            : 'chunk'
          return `assets/${facadeModuleId}-[hash].js`
        }
      }
    },
    // Enable source maps for production debugging (optional)
    sourcemap: process.env.NODE_ENV === 'development',
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning limit
  },
  // Performance optimizations for development
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@headlessui/react',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      'uuid'
    ],
  },
  // Development server performance
  server: {
    // Faster HMR for development
    hmr: {
      overlay: false
    }
  }
})
