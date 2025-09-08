import { test, expect } from '@playwright/test'

test.describe('Todo App - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should support global keyboard shortcuts', async ({ page }) => {
    // Test new task shortcut (N)
    await page.keyboard.press('n')
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    // Close with Escape
    await page.keyboard.press('Escape')
    await expect(page.getByText('Add New Task')).not.toBeVisible()
    
    // Create a task first for filter testing
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Test Task')
    await page.getByTestId('task-form-submit').click()
    
    // Complete the task
    await page.locator('[data-testid^="task-toggle-"]').first().click()
    
    // Test filter toggle shortcut (F)
    await page.keyboard.press('f')
    // Should cycle through filters - check by looking at active filter indicator
    
    // Test search focus shortcut (S)
    await page.keyboard.press('s')
    await expect(page.getByTestId('search-input')).toBeFocused()
    
    // Test show all tasks (A)
    await page.keyboard.press('a')
    
    // Test show active tasks (I)
    await page.keyboard.press('i')
    
    // Test show completed tasks (C)
    await page.keyboard.press('c')
    // Completed task should be removed
    await expect(page.getByText('Test Task')).not.toBeVisible()
  })

  test('should navigate task form with keyboard', async ({ page }) => {
    await page.getByTestId('add-task-button').click()
    
    // Should auto-focus on title input
    await expect(page.getByTestId('task-title-input')).toBeFocused()
    
    // Fill title and move to description
    await page.getByTestId('task-title-input').fill('Keyboard Navigation Test')
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-description-input')).toBeFocused()
    
    // Fill description and move to category
    await page.getByTestId('task-description-input').fill('Testing keyboard navigation')
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-category-select')).toBeFocused()
    
    // Open category dropdown with Enter or Space
    await page.keyboard.press('Enter')
    // Navigate through options with Arrow keys
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown') // Select 'shopping'
    await page.keyboard.press('Enter')
    
    // Move to due date
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-due-date-input')).toBeFocused()
    
    // Move to important checkbox
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-important-checkbox')).toBeFocused()
    
    // Toggle checkbox with Space
    await page.keyboard.press('Space')
    await expect(page.getByTestId('task-important-checkbox')).toBeChecked()
    
    // Navigate to buttons
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-form-cancel')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('task-form-submit')).toBeFocused()
    
    // Submit with Enter
    await page.keyboard.press('Enter')
    
    // Verify task was created
    await expect(page.getByText('Keyboard Navigation Test')).toBeVisible()
    await expect(page.getByText('shopping')).toBeVisible()
  })

  test('should navigate task items with keyboard', async ({ page }) => {
    // Create multiple tasks
    const tasks = ['First Task', 'Second Task', 'Third Task']
    
    for (const title of tasks) {
      await page.getByTestId('add-task-button').click()
      await page.getByTestId('task-title-input').fill(title)
      await page.getByTestId('task-form-submit').click()
    }
    
    // Start tabbing through the page
    await page.keyboard.press('Tab') // Add task button
    await page.keyboard.press('Tab') // First filter button
    await page.keyboard.press('Tab') // Second filter button
    await page.keyboard.press('Tab') // Third filter button
    await page.keyboard.press('Tab') // Category dropdown
    await page.keyboard.press('Tab') // Clear completed button (if visible)
    
    // Now we should be at task items
    // First task toggle button
    const firstTaskToggle = page.locator('[data-testid^="task-toggle-"]').first()
    await expect(firstTaskToggle).toBeFocused()
    
    // Toggle with Space
    await page.keyboard.press('Space')
    
    // Task should be completed
    const firstTaskTitle = page.locator('[data-testid^="task-title-"]').first()
    await expect(firstTaskTitle).toHaveClass(/line-through/)
  })

  test('should navigate task menu with keyboard', async ({ page }) => {
    // Create a task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Menu Navigation Test')
    await page.getByTestId('task-form-submit').click()
    
    // Tab to the task menu button
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    const menuButton = taskItem.locator('[data-testid^="task-menu-"]')
    
    // Make menu visible by hovering or focusing
    await taskItem.hover()
    await menuButton.focus()
    
    // Open menu with Enter
    await page.keyboard.press('Enter')
    
    // Navigate through menu items with Arrow keys
    await page.keyboard.press('ArrowDown') // Edit
    await page.keyboard.press('ArrowDown') // Toggle important
    await page.keyboard.press('ArrowDown') // Delete
    await page.keyboard.press('ArrowUp')   // Back to toggle important
    
    // Select with Enter
    await page.keyboard.press('Enter')
    
    // Should toggle importance
    await expect(page.locator('[aria-label="Important task"]')).toBeVisible()
  })

  test('should handle escape key properly', async ({ page }) => {
    // Open add task dialog
    await page.getByTestId('add-task-button').click()
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    // Escape should close dialog
    await page.keyboard.press('Escape')
    await expect(page.getByText('Add New Task')).not.toBeVisible()
    
    // Focus should return to add task button
    await expect(page.getByTestId('add-task-button')).toBeFocused()
    
    // Test escape in dropdowns
    await page.getByTestId('category-filter-dropdown').click()
    await page.keyboard.press('Escape')
    // Dropdown should close
  })

  test('should handle tab trapping in modals', async ({ page }) => {
    await page.getByTestId('add-task-button').click()
    
    // Tab should cycle within the modal
    await page.keyboard.press('Tab') // Title input -> Description
    await page.keyboard.press('Tab') // Description -> Category
    await page.keyboard.press('Tab') // Category -> Due date
    await page.keyboard.press('Tab') // Due date -> Important checkbox
    await page.keyboard.press('Tab') // Important -> Cancel button
    await page.keyboard.press('Tab') // Cancel -> Submit button
    await page.keyboard.press('Tab') // Submit -> Close button (X)
    await page.keyboard.press('Tab') // Close -> Title input (wrapped)
    
    await expect(page.getByTestId('task-title-input')).toBeFocused()
    
    // Shift+Tab should go backwards
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByTestId('task-form-close')).toBeFocused()
  })

  test('should support arrow key navigation in dropdowns', async ({ page }) => {
    await page.getByTestId('add-task-button').click()
    
    // Open category dropdown
    await page.getByTestId('task-category-select').click()
    
    // Use arrow keys to navigate
    await page.keyboard.press('ArrowDown') // Personal -> Work
    await page.keyboard.press('ArrowDown') // Work -> Shopping
    await page.keyboard.press('ArrowUp')   // Shopping -> Work
    
    // Select with Enter
    await page.keyboard.press('Enter')
    
    // Should have selected 'work'
    await expect(page.getByTestId('task-category-select')).toContainText('Work')
  })

  test('should handle keyboard shortcuts in input fields correctly', async ({ page }) => {
    await page.getByTestId('add-task-button').click()
    
    // Focus on title input
    const titleInput = page.getByTestId('task-title-input')
    await titleInput.focus()
    
    // Type title with shortcuts that should NOT trigger global shortcuts
    await titleInput.fill('Control+N should not trigger when typing')
    
    // Global shortcuts should not work when in input fields
    await page.keyboard.press('Control+n')
    
    // Dialog should still be open (shortcut ignored)
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    // But Escape should still work
    await page.keyboard.press('Escape')
    await expect(page.getByText('Add New Task')).not.toBeVisible()
  })

  test('should provide visible focus indicators', async ({ page }) => {
    // Test focus visibility on various interactive elements
    const interactiveElements = [
      page.getByTestId('add-task-button'),
      page.getByTestId('filter-all'),
      page.getByTestId('category-filter-dropdown'),
    ]
    
    for (const element of interactiveElements) {
      await element.focus()
      
      // Element should be focused and have visible focus styles
      await expect(element).toBeFocused()
      
      // Check for focus ring or other focus indicators
      // This would typically check for CSS classes like 'ring-2' or similar
      const elementClass = await element.getAttribute('class')
      expect(elementClass).toMatch(/focus:/)
    }
  })

  test('should announce dynamic content changes', async ({ page }) => {
    // Create a task
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Dynamic content test')
    await page.getByTestId('task-form-submit').click()
    
    // Check that task count is updated
    await expect(page.getByText('Tasks')).toBeVisible()
    
    // Complete the task
    await page.locator('[data-testid^="task-toggle-"]').first().click()
    
    // Statistics should update
    const completedStat = page.getByTestId('stat-completed')
    await expect(completedStat).toContainText('1')
    
    // Apply filter
    await page.getByTestId('filter-completed').click()
    
    // Filter indicator should show
    await expect(page.getByText('Active filter:')).toBeVisible()
  })
})
