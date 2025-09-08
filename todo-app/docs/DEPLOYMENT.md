# Deployment Guide

Comprehensive guide for deploying the Todo App to production environments.

## 🚀 Deployment Overview

The Todo App is designed for static hosting deployment with Progressive Web App capabilities. This guide covers multiple deployment scenarios and best practices.

## 📋 Pre-Deployment Checklist

### Code Quality Verification

```bash
# Run complete test suite
npm run test:all

# Check TypeScript compilation
npm run type-check

# Verify linting standards
npm run lint

# Check accessibility compliance
npm run test:a11y

# Verify bundle size budgets
npm run build
npm run analyze-bundle
```

### Performance Validation

```bash
# Run performance tests
npm run test:performance

# Check Web Vitals compliance
npm run lighthouse

# Verify PWA compliance
npm run test:pwa
```

### Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix any found issues
npm audit fix

# Verify dependencies
npm run check-dependencies
```

## 🏗️ Production Build Configuration

### Environment Setup

```bash
# .env.production
VITE_APP_TITLE="Todo App"
VITE_APP_DESCRIPTION="Modern task management application"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENVIRONMENT="production"
VITE_ANALYTICS_ID="G-XXXXXXXXXX"
VITE_ERROR_TRACKING_DSN="https://xxxx@sentry.io/xxxx"
```

### Build Optimization

```typescript
// vite.config.ts - Production configuration
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/todo-app/' : '/',
  
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable in production
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'headless-ui': ['@headlessui/react'],
          'icons': ['@heroicons/react/24/outline', '@heroicons/react/24/solid'],
          'utilities': ['clsx', 'date-fns']
        },
        
        // Optimize chunk names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    }
  },
  
  // PWA configuration for production
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Todo App',
        short_name: 'TodoApp',
        description: 'Modern task management application',
        theme_color: '#3B82F6',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
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
          }
        ]
      }
    })
  ]
}));
```

### Build Script

```bash
#!/bin/bash
# scripts/build-production.sh

set -e

echo "🚀 Starting production build..."

# Clean previous builds
rm -rf dist

# Run tests
echo "🧪 Running tests..."
npm run test:coverage

# Check TypeScript
echo "📝 Type checking..."
npm run type-check

# Lint code
echo "🔍 Linting..."
npm run lint

# Build application
echo "🏗️ Building application..."
npm run build

# Verify build
echo "✅ Verifying build..."
ls -la dist/

# Check bundle sizes
echo "📊 Analyzing bundle..."
npm run analyze-bundle

echo "✨ Production build complete!"
```

## 🌐 Static Hosting Platforms

### Netlify Deployment

**netlify.toml:**
```toml
[build]
  base = "/"
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*.html"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Deployment Steps:**
1. Connect repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables
4. Deploy

### Vercel Deployment

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

**Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### GitHub Pages Deployment

**GitHub Actions Workflow (.github/workflows/deploy.yml):**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Build application
        run: npm run build
        env:
          VITE_BASE: '/todo-app/'
          
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### AWS S3 + CloudFront

**Deployment Script:**
```bash
#!/bin/bash
# scripts/deploy-aws.sh

AWS_REGION="us-east-1"
S3_BUCKET="todo-app-static-hosting"
CLOUDFRONT_ID="E1234567890"

# Build application
npm run build

# Sync to S3
aws s3 sync dist/ s3://$S3_BUCKET/ \
  --region $AWS_REGION \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "sw.js"

# Upload HTML with no-cache
aws s3 cp dist/index.html s3://$S3_BUCKET/ \
  --cache-control "public, max-age=0, must-revalidate"

# Upload service worker with no-cache
aws s3 cp dist/sw.js s3://$S3_BUCKET/ \
  --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"

echo "✅ Deployment complete!"
```

**CloudFront Configuration:**
```json
{
  "Origins": [
    {
      "DomainName": "todo-app-static-hosting.s3.amazonaws.com",
      "Id": "S3-todo-app",
      "S3OriginConfig": {
        "OriginAccessIdentity": "origin-access-identity/cloudfront/ABCDEFG1234567"
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-todo-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "Compress": true
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }
  ]
}
```

## 🔒 Security Configuration

### Content Security Policy

**CSP Headers:**
```typescript
// public/_headers (Netlify) or similar
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.analytics.com
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Environment Secrets Management

```bash
# Production environment setup
export VITE_ANALYTICS_ID="$ANALYTICS_ID"
export VITE_ERROR_TRACKING_DSN="$SENTRY_DSN"
export VITE_API_ENDPOINT="$API_ENDPOINT"

# Netlify environment variables
# Set in Netlify dashboard: Site settings > Environment variables

# Vercel environment variables
# Set in Vercel dashboard: Settings > Environment Variables

# GitHub Secrets
# Set in repository: Settings > Secrets and variables > Actions
```

## 📊 Monitoring and Analytics

### Error Tracking Setup

```typescript
// src/utils/errorTracking.ts
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_APP_ENVIRONMENT,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  });
}

export const captureError = (error: Error, context?: any) => {
  Sentry.captureException(error, { extra: context });
};
```

### Analytics Implementation

```typescript
// src/utils/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const initAnalytics = () => {
  if (import.meta.env.VITE_ANALYTICS_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.gtag = function() {
      // @ts-ignore
      (window.dataLayer = window.dataLayer || []).push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_ANALYTICS_ID);
  }
};

export const trackEvent = (eventName: string, parameters?: any) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};
```

### Performance Monitoring

```typescript
// src/utils/performanceMonitoring.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initPerformanceMonitoring = () => {
  const sendToAnalytics = (metric: any) => {
    window.gtag?.('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.value),
      non_interaction: true
    });
  };

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};
```

## 🔄 CI/CD Pipeline

### Complete GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint
        
      - name: Unit tests
        run: npm run test:coverage
        
      - name: E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Security audit
        run: npm audit --audit-level high
        
      - name: Check dependencies
        run: npx depcheck

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [test, security]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
          VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
          
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.1
        with:
          publish-dir: './dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🚨 Rollback Procedures

### Automated Rollback

```bash
#!/bin/bash
# scripts/rollback.sh

PREVIOUS_VERSION=$1

if [ -z "$PREVIOUS_VERSION" ]; then
  echo "Error: Please provide previous version number"
  echo "Usage: ./rollback.sh v1.0.0"
  exit 1
fi

echo "🔄 Rolling back to version $PREVIOUS_VERSION..."

# Checkout previous version
git checkout tags/$PREVIOUS_VERSION

# Build and deploy
npm ci
npm run build
npm run deploy

echo "✅ Rollback to $PREVIOUS_VERSION complete!"
```

### Health Checks

```typescript
// src/utils/healthCheck.ts
export const performHealthCheck = async (): Promise<boolean> => {
  try {
    // Check core functionality
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      JSON.parse(tasks);
    }
    
    // Check PWA functionality
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      throw new Error('Service worker not registered');
    }
    
    // Check performance
    const performanceEntries = performance.getEntriesByType('navigation');
    if (performanceEntries.length === 0) {
      throw new Error('No performance entries found');
    }
    
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

## 📈 Performance Optimization for Production

### Asset Optimization

```typescript
// vite.config.ts - Asset optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          
          return `assets/[name]-[hash].${extType}`;
        }
      }
    }
  }
});
```

### CDN Integration

```html
<!-- public/index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Preload critical assets -->
<link rel="preload" href="/assets/main.js" as="script">
<link rel="preload" href="/assets/main.css" as="style">
```

---

This deployment guide ensures a robust, secure, and performant production deployment. For more details on specific configurations, see the [Performance Guide](./PERFORMANCE.md) and [Component API Documentation](./COMPONENTS.md).
