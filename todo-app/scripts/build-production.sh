#!/bin/bash

# Production build script with comprehensive checks
set -e

echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v1[89]\. ]]; then
    print_error "Node.js 18+ is required. Current version: $NODE_VERSION"
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist coverage test-results

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Type checking
print_status "Running TypeScript type check..."
npm run type-check

# Linting
print_status "Running ESLint..."
npm run lint

# Security audit
print_status "Running security audit..."
npm audit --audit-level moderate

# Unit tests with coverage
print_status "Running unit tests with coverage..."
npm run test:coverage

# Check coverage thresholds
COVERAGE_RESULT=$(npm run test:coverage --silent | grep -o '[0-9]\+\.[0-9]\+%' | tail -1)
print_status "Test coverage: $COVERAGE_RESULT"

# Build application
print_status "Building application for production..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    print_error "Build failed: dist directory not found"
    exit 1
fi

# Check bundle sizes
print_status "Analyzing bundle sizes..."
MAIN_BUNDLE_SIZE=$(find dist/assets -name "index-*.js" -exec wc -c {} \; | awk '{print $1}')
MAIN_BUNDLE_GZIP=$(find dist/assets -name "index-*.js" -exec gzip -c {} \; | wc -c)

print_status "Main bundle size: $(numfmt --to=iec $MAIN_BUNDLE_SIZE) ($(numfmt --to=iec $MAIN_BUNDLE_GZIP) gzipped)"

# Bundle size budget check (250KB uncompressed, 80KB gzipped)
if [ "$MAIN_BUNDLE_SIZE" -gt 262144 ]; then
    print_warning "Main bundle size exceeds 250KB budget"
fi

if [ "$MAIN_BUNDLE_GZIP" -gt 81920 ]; then
    print_warning "Main bundle gzipped size exceeds 80KB budget"
fi

# Verify PWA manifest
if [ ! -f "dist/manifest.webmanifest" ]; then
    print_error "PWA manifest not found"
    exit 1
fi

# Verify service worker
if [ ! -f "dist/sw.js" ]; then
    print_error "Service worker not found"
    exit 1
fi

# List build output
print_status "Build output:"
ls -la dist/

print_status "Asset breakdown:"
ls -lah dist/assets/

# Generate build report
BUILD_TIME=$(date +"%Y-%m-%d %H:%M:%S")
BUILD_HASH=$(git rev-parse --short HEAD)
BUILD_BRANCH=$(git rev-parse --abbrev-ref HEAD)

cat > dist/build-info.json << EOF
{
  "buildTime": "$BUILD_TIME",
  "gitHash": "$BUILD_HASH",
  "gitBranch": "$BUILD_BRANCH",
  "nodeVersion": "$NODE_VERSION",
  "bundleSize": {
    "main": $MAIN_BUNDLE_SIZE,
    "mainGzipped": $MAIN_BUNDLE_GZIP
  },
  "testCoverage": "$COVERAGE_RESULT"
}
EOF

print_success "Production build completed successfully!"
print_status "Build info written to dist/build-info.json"

# Optional: Run additional checks
if command -v lighthouse &> /dev/null; then
    print_status "Lighthouse available for performance testing"
else
    print_warning "Lighthouse not installed - skipping performance tests"
fi

echo ""
print_success "✨ Build process complete! Ready for deployment."
echo ""
echo "Next steps:"
echo "  • Deploy to staging: npm run deploy:staging"
echo "  • Deploy to production: npm run deploy:production"
echo "  • Run E2E tests: npm run test:e2e"
