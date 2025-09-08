#!/bin/bash

# Health check script for production deployment
set -e

BASE_URL=${1:-"https://your-todo-app.netlify.app"}
TIMEOUT=${2:-30}

echo "🏥 Running health checks for: $BASE_URL"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

FAILED_CHECKS=0

# Check 1: Basic connectivity
print_status "Checking basic connectivity..."
if curl -s --max-time $TIMEOUT -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    print_success "Site is reachable"
else
    print_error "Site is not reachable"
    ((FAILED_CHECKS++))
fi

# Check 2: PWA manifest
print_status "Checking PWA manifest..."
if curl -s --max-time $TIMEOUT -o /dev/null -w "%{http_code}" "$BASE_URL/manifest.webmanifest" | grep -q "200"; then
    print_success "PWA manifest is accessible"
else
    print_error "PWA manifest is not accessible"
    ((FAILED_CHECKS++))
fi

# Check 3: Service worker
print_status "Checking service worker..."
if curl -s --max-time $TIMEOUT -o /dev/null -w "%{http_code}" "$BASE_URL/sw.js" | grep -q "200"; then
    print_success "Service worker is accessible"
else
    print_error "Service worker is not accessible"
    ((FAILED_CHECKS++))
fi

# Check 4: Essential assets
print_status "Checking critical assets..."
MAIN_HTML=$(curl -s --max-time $TIMEOUT "$BASE_URL")

if echo "$MAIN_HTML" | grep -q "assets/index-"; then
    print_success "Main JavaScript bundle is referenced"
else
    print_error "Main JavaScript bundle not found"
    ((FAILED_CHECKS++))
fi

if echo "$MAIN_HTML" | grep -q "assets/index-.*\.css"; then
    print_success "Main CSS bundle is referenced"
else
    print_error "Main CSS bundle not found"
    ((FAILED_CHECKS++))
fi

# Check 5: Meta tags
print_status "Checking essential meta tags..."
if echo "$MAIN_HTML" | grep -q "<title>.*Todo App"; then
    print_success "Page title is set"
else
    print_error "Page title is missing or incorrect"
    ((FAILED_CHECKS++))
fi

if echo "$MAIN_HTML" | grep -q 'name="viewport"'; then
    print_success "Viewport meta tag is present"
else
    print_error "Viewport meta tag is missing"
    ((FAILED_CHECKS++))
fi

if echo "$MAIN_HTML" | grep -q 'name="description"'; then
    print_success "Description meta tag is present"
else
    print_error "Description meta tag is missing"
    ((FAILED_CHECKS++))
fi

# Check 6: Security headers (if available)
print_status "Checking security headers..."
HEADERS=$(curl -s -I --max-time $TIMEOUT "$BASE_URL")

if echo "$HEADERS" | grep -qi "x-frame-options"; then
    print_success "X-Frame-Options header is set"
else
    print_error "X-Frame-Options header is missing"
    ((FAILED_CHECKS++))
fi

if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    print_success "X-Content-Type-Options header is set"
else
    print_error "X-Content-Type-Options header is missing"
    ((FAILED_CHECKS++))
fi

# Check 7: Performance (basic)
print_status "Checking basic performance..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL")
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc -l | cut -d. -f1)

if [ "$RESPONSE_TIME_MS" -lt 2000 ]; then
    print_success "Initial response time: ${RESPONSE_TIME_MS}ms (< 2s)"
else
    print_error "Initial response time: ${RESPONSE_TIME_MS}ms (>= 2s)"
    ((FAILED_CHECKS++))
fi

# Check 8: Content verification
print_status "Checking page content..."
if echo "$MAIN_HTML" | grep -q "root"; then
    print_success "React root element is present"
else
    print_error "React root element is missing"
    ((FAILED_CHECKS++))
fi

# Check 9: Build info (if available)
print_status "Checking build information..."
BUILD_INFO=$(curl -s --max-time $TIMEOUT "$BASE_URL/build-info.json" 2>/dev/null || echo "{}")

if echo "$BUILD_INFO" | grep -q "buildTime"; then
    BUILD_TIME=$(echo "$BUILD_INFO" | grep -o '"buildTime":"[^"]*"' | cut -d'"' -f4)
    print_success "Build info available (Built: $BUILD_TIME)"
else
    print_status "Build info not available (optional)"
fi

# Summary
echo ""
echo "🏥 Health Check Summary"
echo "======================"

if [ $FAILED_CHECKS -eq 0 ]; then
    print_success "All health checks passed! ✨"
    echo ""
    echo "🚀 Deployment appears healthy and ready for users."
    exit 0
else
    print_error "$FAILED_CHECKS health check(s) failed!"
    echo ""
    echo "❌ Deployment has issues that should be investigated."
    exit 1
fi
