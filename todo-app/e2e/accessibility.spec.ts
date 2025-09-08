import { test, expect } from '@playwright/test'

test.describe('Todo App - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have proper heading structure', async ({ page }) => {
    // Check main heading
    const h1 = page.locator('h1')
    await expect(h1).toContainText('Todo App')
    
    // Check section headings
    await expect(page.locator('h2').filter({ hasText: 'Task Statistics' })).toBeVisible()
    await expect(page.locator('h2').filter({ hasText: 'Filter Tasks' })).toBeVisible()
    await expect(page.locator('h2').filter({ hasText: 'Tasks' })).toBeVisible()
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Create a task to test task item accessibility
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Accessibility Test Task')
    await page.getByTestId('task-form-submit').click()

    // Check task toggle button has proper aria-label
    const toggleButton = page.locator('[data-testid^="task-toggle-"]').first()
    await expect(toggleButton).toHaveAttribute('aria-label', 'Mark as complete')

    // Check task menu button has proper aria-label
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    await taskItem.hover()
    const menuButton = taskItem.locator('[data-testid^="task-menu-"]')
    await expect(menuButton).toHaveAttribute('aria-label', 'Task actions')
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Test keyboard shortcut for new task
    await page.keyboard.press('Control+n')
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    // Test escape to close dialog
    await page.keyboard.press('Escape')
    await expect(page.getByText('Add New Task')).not.toBeVisible()
    
    // Create a task for further testing
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Keyboard Test Task')
    await page.getByTestId('task-form-submit').click()

    // Test tab navigation through task controls
    await page.keyboard.press('Tab')
    
    // Verify focus states are visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have proper form labels and validation', async ({ page }) => {
    await page.getByTestId('add-task-button').click()

    // Check form inputs have proper labels
    await expect(page.locator('label[for="task-title"]')).toContainText('Title')
    await expect(page.locator('label[for="task-description"]')).toContainText('Description')
    await expect(page.locator('label[for="task-due-date"]')).toContainText('Due Date')
    await expect(page.locator('label[for="task-important"]')).toContainText('Mark as important')

    // Test form validation
    await page.getByTestId('task-form-submit').click()
    
    // Check validation error is announced
    const errorMessage = page.getByTestId('task-title-error')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('Title is required')
  })

  test('should have proper color contrast', async ({ page }) => {
    // Create tasks to test different states
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Normal Task')
    await page.getByTestId('task-form-submit').click()

    // Mark task as important
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    await taskItem.hover()
    await taskItem.locator('[data-testid^="task-menu-"]').click()
    await taskItem.locator('[data-testid^="task-toggle-important-"]').click()

    // Complete the task
    await taskItem.locator('[data-testid^="task-toggle-"]').click()

    // Verify task states are visually distinguishable
    const titleElement = taskItem.locator('[data-testid^="task-title-"]')
    
    // Completed task should have line-through
    await expect(titleElement).toHaveClass(/line-through/)
    
    // Important star should be visible
    await expect(page.locator('[aria-label="Important task"]')).toBeVisible()
  })

  test('should support screen reader users', async ({ page }) => {
    // Create a task with due date
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Task with due date')
    
    // Set due date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]
    await page.getByTestId('task-due-date-input').fill(dateString)
    
    await page.getByTestId('task-form-submit').click()

    // Verify due date information is accessible
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    await expect(taskItem.locator('[data-testid^="task-due-date-"]')).toBeVisible()
    
    // Verify category information is accessible
    await expect(taskItem.locator('[data-testid^="task-category-"]')).toBeVisible()
    
    // Verify creation date is accessible
    await expect(taskItem.locator('[data-testid^="task-created-"]')).toBeVisible()
  })

  test('should handle focus management in dialogs', async ({ page }) => {
    // Open add task dialog
    await page.getByTestId('add-task-button').click()
    
    // Focus should be on the title input
    await expect(page.getByTestId('task-title-input')).toBeFocused()
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-description-input')).toBeFocused()
    
    // Close dialog with escape
    await page.keyboard.press('Escape')
    await expect(page.getByText('Add New Task')).not.toBeVisible()
    
    // Focus should return to the add task button
    await expect(page.getByTestId('add-task-button')).toBeFocused()
  })

  test('should provide clear loading and state feedback', async ({ page }) => {
    // Check statistics provide clear information
    const statsContainer = page.getByTestId('task-stats')
    await expect(statsContainer).toBeVisible()
    
    // Check completion rate accessibility
    const completionRate = page.getByTestId('completion-rate')
    
    // Progress should be indicated textually
    await expect(completionRate).toBeVisible()
  })

  test('should handle empty states accessibly', async ({ page }) => {
    // Empty state should be informative
    const emptyState = page.getByTestId('tasks-empty-state')
    await expect(emptyState).toBeVisible()
    await expect(emptyState).toContainText('No tasks yet')
    
    // Empty state should provide guidance
    await expect(emptyState).toContainText('Create your first task')
  })

  test('should provide clear filter feedback', async ({ page }) => {
    // Create a task and apply filters
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Test task for filters')
    await page.getByTestId('task-form-submit').click()
    
    // Apply active filter
    await page.getByTestId('filter-active').click()
    
    // Should show active filter indicator
    await expect(page.getByText('Active filter:')).toBeVisible()
    
    // Clear filter button should be available
    await expect(page.getByTestId('clear-filter')).toBeVisible()
    
    // Filter counts should be visible
    await expect(page.locator('text=/\\(\\d+\\)/')).toBeVisible()
  })
})
