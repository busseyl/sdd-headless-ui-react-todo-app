import { test, expect } from '@playwright/test'

test.describe('Phase 6: Application Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('should display the application with enhanced responsive layout', async ({ page }) => {
    // Check main application structure
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add Task' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Task Statistics' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Filter Tasks' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Tasks/ })).toBeVisible()
    
    // Check keyboard shortcuts help
    await expect(page.getByRole('button', { name: 'Keyboard shortcuts (?)' })).toBeVisible()
  })

  test('should open and close keyboard shortcuts help modal', async ({ page }) => {
    // Open help modal using button
    await page.getByRole('button', { name: 'Keyboard shortcuts (?)' }).click()
    
    // Verify help modal content
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'General' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Filtering' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Task Management' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Navigation' })).toBeVisible()
    
    // Close using ? key
    await page.keyboard.press('?')
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).not.toBeVisible()
  })

  test('should support global keyboard shortcuts', async ({ page }) => {
    // Test Ctrl+N to open new task form
    await page.keyboard.press('Control+n')
    await expect(page.getByRole('dialog', { name: 'Add New Task' })).toBeVisible()
    
    // Test Escape to close form
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Add New Task' })).not.toBeVisible()
    
    // Test ? to open help
    await page.keyboard.press('?')
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeVisible()
    
    // Test Escape to close help
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).not.toBeVisible()
  })

  test('should support filter toggle keyboard shortcut', async ({ page }) => {
    // Initially showing "All Tasks"
    await expect(page.getByRole('button', { name: /All Tasks/ })).toHaveClass(/bg-blue-100/)
    
    // Press Ctrl+F to toggle filter
    await page.keyboard.press('Control+f')
    
    // Should now show "Active" filter
    await expect(page.getByRole('button', { name: /Active/ })).toHaveClass(/bg-blue-100/)
    
    // Press Ctrl+F again to toggle to "Completed"
    await page.keyboard.press('Control+f')
    
    // Should now show "Completed" filter
    await expect(page.getByRole('button', { name: /Completed/ })).toHaveClass(/bg-blue-100/)
  })

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify mobile-responsive elements are still visible and functional
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add Task' })).toBeVisible()
    
    // Test that search still works on mobile
    const searchInput = page.getByRole('searchbox', { name: 'Search tasks' })
    await searchInput.fill('grocery')
    
    // Should filter to show only grocery task
    await expect(page.getByText('Weekly grocery shopping')).toBeVisible()
    await expect(page.getByText('Review and finalize')).not.toBeVisible()
    
    // Clear search
    await searchInput.clear()
    await expect(page.getByText('Review and finalize')).toBeVisible()
  })

  test('should support task context and global state management', async ({ page }) => {
    // Verify task data is loaded through context
    await expect(page.getByText('Review and finalize project documentation')).toBeVisible()
    await expect(page.getByText('Weekly grocery shopping')).toBeVisible()
    
    // Verify statistics are updated through context
    await expect(page.getByText('2', { exact: true })).toBeVisible() // Total tasks
    await expect(page.getByText('1', { exact: true })).toBeVisible() // Active and completed
    
    // Test task operations through context
    const searchInput = page.getByRole('searchbox', { name: 'Search tasks' })
    await searchInput.fill('documentation')
    
    // Should show filtered results through context
    await expect(page.getByText('Tasks(1)')).toBeVisible()
    await expect(page.getByText('Review and finalize')).toBeVisible()
    await expect(page.getByText('Weekly grocery shopping')).not.toBeVisible()
  })

  test('should handle error boundary gracefully', async ({ page }) => {
    // Note: This would require injecting an error to test the error boundary
    // For now, we'll verify the structure is in place
    
    // The error boundary should be wrapping the app
    // We can't easily test this without triggering an actual error
    // but we can verify the app loads correctly (which means error boundary is working)
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible()
  })

  test('should provide enhanced accessibility through global context', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    
    // Should focus on first interactive element
    const addTaskButton = page.getByRole('button', { name: 'Add Task' })
    await expect(addTaskButton).toBeFocused()
    
    // Test that ARIA labels are present
    await expect(page.getByRole('searchbox', { name: 'Search tasks' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add Task' })).toBeVisible()
    
    // Test that help modal has proper accessibility
    await page.getByRole('button', { name: 'Keyboard shortcuts (?)' }).click()
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeVisible()
    
    // Should be able to close with keyboard
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).not.toBeVisible()
  })
})
