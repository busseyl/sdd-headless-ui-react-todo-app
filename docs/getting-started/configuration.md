# Configuration

Learn how to configure and customize the Headless UI Todo App for your specific needs. This guide covers environment variables, build settings, theming, and advanced configuration options.

## 📁 Configuration Files Overview

The application uses several configuration files:

```
todo-app/
├── .env                    # Environment variables
├── .env.local             # Local overrides (not tracked)
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── prettier.config.js     # Prettier configuration
├── jest.config.ts         # Jest testing configuration
├── playwright.config.ts   # Playwright E2E configuration
└── public/
    └── manifest.json      # PWA manifest
```

## ⚙️ Environment Variables

### Basic Configuration

Create a `.env` file in the project root:

```bash
# .env
VITE_APP_TITLE="My Todo App"
VITE_APP_DESCRIPTION="A beautiful task management application"
VITE_APP_VERSION="1.0.0"

# API Configuration (if using external APIs)
VITE_API_BASE_URL="https://api.example.com"
VITE_API_TIMEOUT=5000

# PWA Configuration
VITE_PWA_NAME="Todo App"
VITE_PWA_SHORT_NAME="TodoApp"
VITE_PWA_THEME_COLOR="#6366f1"

# Analytics (optional)
VITE_GA_TRACKING_ID=""
VITE_SENTRY_DSN=""

# Development Settings
VITE_DEV_TOOLS=true
VITE_LOG_LEVEL="debug"
```

### Environment-Specific Files

=== "Development (.env.development)"
    ```bash
    # Development-specific settings
    VITE_APP_ENV=development
    VITE_DEV_TOOLS=true
    VITE_LOG_LEVEL=debug
    VITE_HOT_RELOAD=true
    ```

=== "Production (.env.production)"
    ```bash
    # Production-specific settings
    VITE_APP_ENV=production
    VITE_DEV_TOOLS=false
    VITE_LOG_LEVEL=error
    VITE_ENABLE_ANALYTICS=true
    ```

=== "Testing (.env.test)"
    ```bash
    # Testing environment
    VITE_APP_ENV=test
    VITE_DEV_TOOLS=false
    VITE_LOG_LEVEL=silent
    VITE_MOCK_API=true
    ```

!!! warning "Security Note"
    Only variables prefixed with `VITE_` are exposed to the client. Never put sensitive data like API keys in environment variables that will be bundled with your application.

## 🎨 Theming Configuration

### Tailwind CSS Customization

Modify `tailwind.config.js` to customize the design:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom color palette
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Custom semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      
      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // Custom breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
  ],
}
```

### Dark Mode Configuration

Enable system-based dark mode:

```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // or 'media' for system preference
  theme: {
    extend: {
      colors: {
        // Define dark mode colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
        }
      }
    }
  }
}
```

## 🔧 Build Configuration

### Vite Configuration

Customize `vite.config.ts` for your needs:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
      manifest: {
        name: process.env.VITE_PWA_NAME || 'Todo App',
        short_name: process.env.VITE_PWA_SHORT_NAME || 'TodoApp',
        description: process.env.VITE_APP_DESCRIPTION || 'Task management app',
        theme_color: process.env.VITE_PWA_THEME_COLOR || '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  
  // Development server
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
  },
  
  // Build options
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react'],
        },
      },
    },
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
```

### TypeScript Configuration

Customize `tsconfig.json` for strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🧪 Testing Configuration

### Jest Configuration

Customize `jest.config.ts`:

```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  
  // Module mapping for path aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Test patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
}

export default config
```

### Playwright Configuration

Customize `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',
    
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 🎯 Feature Configuration

### Local Storage Configuration

Configure data persistence in `src/utils/storage.ts`:

```typescript
export const STORAGE_CONFIG = {
  // Storage keys
  TASKS_KEY: 'headlessui-todo-tasks',
  FILTERS_KEY: 'headlessui-todo-filters',
  SETTINGS_KEY: 'headlessui-todo-settings',
  
  // Data retention
  MAX_TASKS: 1000,
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  
  // Backup settings
  ENABLE_BACKUP: true,
  BACKUP_FREQUENCY: 7 * 24 * 60 * 60 * 1000, // 7 days
}
```

### Task Categories Configuration

Customize task categories in `src/types/task.ts`:

```typescript
export const TASK_CATEGORIES = [
  { id: 'work', label: 'Work', color: 'blue', icon: 'briefcase' },
  { id: 'personal', label: 'Personal', color: 'green', icon: 'user' },
  { id: 'shopping', label: 'Shopping', color: 'purple', icon: 'shopping-bag' },
  { id: 'health', label: 'Health', color: 'red', icon: 'heart' },
  { id: 'learning', label: 'Learning', color: 'yellow', icon: 'book' },
  { id: 'other', label: 'Other', color: 'gray', icon: 'folder' },
] as const
```

### Accessibility Configuration

Configure accessibility settings in `src/config/accessibility.ts`:

```typescript
export const ACCESSIBILITY_CONFIG = {
  // Focus management
  FOCUS_VISIBLE_OUTLINE: '2px solid #3b82f6',
  FOCUS_VISIBLE_OFFSET: '2px',
  
  // Screen reader
  ANNOUNCE_DELAY: 100,
  LIVE_REGION_TIMEOUT: 5000,
  
  // Keyboard navigation
  ENABLE_SKIP_LINKS: true,
  ENABLE_FOCUS_TRAP: true,
  
  // Animation preferences
  RESPECT_PREFERS_REDUCED_MOTION: true,
  
  // High contrast mode
  ENABLE_HIGH_CONTRAST: true,
}
```

## 📱 PWA Configuration

### Manifest Customization

Modify `public/manifest.json`:

```json
{
  "name": "Headless UI Todo App",
  "short_name": "TodoApp",
  "description": "A beautiful, accessible task management application",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "categories": ["productivity", "utilities"],
  "lang": "en-US",
  "scope": "/",
  "icons": [
    {
      "src": "pwa-48x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "New Task",
      "short_name": "New",
      "description": "Create a new task",
      "url": "/?action=new-task",
      "icons": [
        {
          "src": "pwa-96x96.png",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

## 🚀 Deployment Configuration

### Environment-Specific Builds

Create build scripts in `package.json`:

```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production",
    "build:analyze": "vite build && npx vite-bundle-analyzer dist/stats.html"
  }
}
```

### Docker Configuration

Create `Dockerfile`:

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔍 Validation and Testing

### Configuration Validation

Add configuration validation:

```typescript
// src/config/validate.ts
import { z } from 'zod'

const ConfigSchema = z.object({
  APP_TITLE: z.string().min(1),
  APP_VERSION: z.string().regex(/^\d+\.\d+\.\d+$/),
  PWA_NAME: z.string().min(1),
  API_TIMEOUT: z.number().positive(),
})

export function validateConfig() {
  try {
    ConfigSchema.parse({
      APP_TITLE: import.meta.env.VITE_APP_TITLE,
      APP_VERSION: import.meta.env.VITE_APP_VERSION,
      PWA_NAME: import.meta.env.VITE_PWA_NAME,
      API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT),
    })
    console.log('✅ Configuration is valid')
  } catch (error) {
    console.error('❌ Configuration validation failed:', error)
    throw new Error('Invalid configuration')
  }
}
```

### Test Configuration

Test your configuration:

```bash
# Validate all configurations
npm run config:validate

# Test build with different environments
npm run build:dev
npm run build:staging
npm run build:prod

# Test PWA functionality
npm run test:pwa

# Validate accessibility configuration
npm run test:a11y
```

## 📚 Next Steps

With your configuration complete:

1. **[Run the Application](quick-start.md)** - Start developing
2. **[Explore Features](../user-guide/features.md)** - Learn the functionality
3. **[Development Workflow](../developer-guide/architecture.md)** - Understand the codebase
4. **[Deploy](../deployment/overview.md)** - Deploy to production

---

**Questions?** If you need help with configuration, check our [FAQ](../about/contributing.md#faq) or [create an issue](https://github.com/busseyl/sdd-headless-ui-react-todo-app/issues).
