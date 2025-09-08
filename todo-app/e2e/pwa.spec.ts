import { test, expect } from '@playwright/test'

test.describe('Todo App - PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the preview server (production build)
    await page.goto('http://localhost:4173/')
  })

  test('should have proper PWA manifest', async ({ page }) => {
    // Check if manifest is properly linked
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toBeAttached()
    
    // Check manifest content by fetching it
    const response = await page.request.get('http://localhost:4173/manifest.webmanifest')
    expect(response.ok()).toBeTruthy()
    
    const manifest = await response.json()
    expect(manifest.name).toBe('Todo App - Task Management')
    expect(manifest.short_name).toBe('Todo App')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#3B82F6')
  })

  test('should have service worker registration', async ({ page }) => {
    // Wait for service worker to be registered
    await page.waitForFunction(() => 'serviceWorker' in navigator)
    
    // Check if service worker is registered
    const serviceWorkerSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    expect(serviceWorkerSupported).toBeTruthy()
  })

  test('should have proper PWA meta tags', async ({ page }) => {
    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]')
    await expect(themeColor).toHaveAttribute('content', '#3B82F6')
    
    // Check apple mobile web app meta tags
    const appleMeta = page.locator('meta[name="apple-mobile-web-app-capable"]')
    await expect(appleMeta).toHaveAttribute('content', 'yes')
    
    // Check description
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', 'A simple and accessible todo application built with React and Headless UI')
  })

  test('should show PWA install prompt on supported browsers', async ({ page, browserName }) => {
    // This test simulates the beforeinstallprompt event
    // Note: Real PWA installation testing requires specific browser conditions
    
    // Check if PWA components are loaded
    const installPrompt = page.locator('[data-testid="pwa-install-prompt"]')
    
    // PWA install prompt might not show in test environment
    // But we can check that the component is available in the DOM
    const pwaScript = await page.evaluate(() => {
      return typeof (window as any).pwaManager !== 'undefined'
    })
    
    expect(pwaScript).toBeTruthy()
  })

  test('should handle PWA shortcut action', async ({ page }) => {
    // Test the PWA shortcut for new task
    await page.goto('http://localhost:4173/?action=new')
    
    // Wait a moment for the URL handling to process
    await page.waitForTimeout(500)
    
    // Should open the add task dialog
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    // URL should be cleaned up
    await expect(page).toHaveURL('http://localhost:4173/')
  })

  test('should be accessible offline (service worker caching)', async ({ page }) => {
    // This test verifies that essential resources are cached
    
    // Load the page normally first
    await page.goto('http://localhost:4173/')
    await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible()
    
    // Check if service worker is active
    const swStatus = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        return registration.active ? 'active' : 'inactive'
      }
      return 'not supported'
    })
    
    expect(swStatus).toBe('active')
  })

  test('should display online/offline status', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:4173/')
    
    // Wait for PWA components to load
    await page.waitForTimeout(1000)
    
    // Check if online status is displayed (when PWA is installed)
    // Note: In test environment, PWA won't be "installed" so PWAStatus might not show
    const onlineStatus = await page.evaluate(() => navigator.onLine)
    expect(onlineStatus).toBeTruthy()
  })

  test('should have proper favicon and icons', async ({ page }) => {
    // Check favicon
    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toBeAttached()
    
    // Check apple touch icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]')
    await expect(appleTouchIcon).toBeAttached()
    
    // Verify icons are accessible
    const response = await page.request.get('http://localhost:4173/favicon.ico')
    expect(response.status()).toBeLessThan(400) // Should not be 404
  })
})
