import { test, expect } from '@playwright/test'

test.describe('Todo App - Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Todo App')
  })

  test('should display empty state when no tasks exist', async ({ page }) => {
    await expect(page.getByTestId('tasks-empty-state')).toBeVisible()
    await expect(page.getByText('No tasks yet')).toBeVisible()
  })

  test('should create a new task', async ({ page }) => {
    // Click add task button
    await page.getByTestId('add-task-button').click()
    
    // Verify form is open
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    // Fill in task details
    await page.getByTestId('task-title-input').fill('Test Task')
    await page.getByTestId('task-description-input').fill('This is a test task description')
    
    // Select category
    await page.getByTestId('task-category-select').click()
    await page.getByTestId('category-option-work').click()
    
    // Mark as important
    await page.getByTestId('task-important-checkbox').check()
    
    // Submit form
    await page.getByTestId('task-form-submit').click()
    
    // Verify task appears in list
    await expect(page.getByTestId('tasks-list')).toBeVisible()
    await expect(page.getByText('Test Task')).toBeVisible()
    await expect(page.getByText('This is a test task description')).toBeVisible()
    
    // Verify task has work category
    await expect(page.getByText('work')).toBeVisible()
    
    // Verify task is marked as important (star icon)
    await expect(page.locator('[aria-label="Important task"]')).toBeVisible()
  })

  test('should toggle task completion', async ({ page }) => {
    // Create a task first
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Task to toggle')
    await page.getByTestId('task-form-submit').click()
    
    // Find the task item
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    const toggleButton = taskItem.locator('[data-testid^="task-toggle-"]')
    const taskTitle = taskItem.locator('[data-testid^="task-title-"]')
    
    // Verify task is initially not completed
    await expect(taskTitle).not.toHaveClass(/line-through/)
    
    // Toggle task completion
    await toggleButton.click()
    
    // Verify task is now completed (has strikethrough)
    await expect(taskTitle).toHaveClass(/line-through/)
    
    // Toggle back to incomplete
    await toggleButton.click()
    
    // Verify task is no longer completed
    await expect(taskTitle).not.toHaveClass(/line-through/)
  })

  test('should edit an existing task', async ({ page }) => {
    // Create a task first
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Original Task')
    await page.getByTestId('task-form-submit').click()
    
    // Open task menu and click edit
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    await taskItem.hover()
    await taskItem.locator('[data-testid^="task-menu-"]').click()
    await taskItem.locator('[data-testid^="task-edit-"]').click()
    
    // Verify edit form is open
    await expect(page.getByText('Edit Task')).toBeVisible()
    
    // Update task details
    await page.getByTestId('task-title-input').clear()
    await page.getByTestId('task-title-input').fill('Updated Task Title')
    await page.getByTestId('task-description-input').fill('Updated description')
    
    // Submit changes
    await page.getByTestId('task-form-submit').click()
    
    // Verify task is updated
    await expect(page.getByText('Updated Task Title')).toBeVisible()
    await expect(page.getByText('Updated description')).toBeVisible()
  })

  test('should delete a task', async ({ page }) => {
    // Create a task first
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-title-input').fill('Task to delete')
    await page.getByTestId('task-form-submit').click()
    
    // Verify task exists
    await expect(page.getByText('Task to delete')).toBeVisible()
    
    // Open task menu and delete
    const taskItem = page.locator('[data-testid^="task-item-"]').first()
    await taskItem.hover()
    await taskItem.locator('[data-testid^="task-menu-"]').click()
    await taskItem.locator('[data-testid^="task-delete-"]').click()
    
    // Verify task is removed
    await expect(page.getByText('Task to delete')).not.toBeVisible()
    await expect(page.getByTestId('tasks-empty-state')).toBeVisible()
  })

  test('should filter tasks by status', async ({ page }) => {
    // Create multiple tasks
    const tasks = [
      { title: 'Active Task 1', complete: false },
      { title: 'Active Task 2', complete: false },
      { title: 'Completed Task', complete: true },
    ]

    for (const task of tasks) {
      await page.getByTestId('add-task-button').click()
      await page.getByTestId('task-title-input').fill(task.title)
      await page.getByTestId('task-form-submit').click()
      
      if (task.complete) {
        const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({ hasText: task.title })
        await taskItem.locator('[data-testid^="task-toggle-"]').click()
      }
    }

    // Test 'All' filter (default)
    await expect(page.getByText('Active Task 1')).toBeVisible()
    await expect(page.getByText('Active Task 2')).toBeVisible()
    await expect(page.getByText('Completed Task')).toBeVisible()

    // Test 'Active' filter
    await page.getByTestId('filter-active').click()
    await expect(page.getByText('Active Task 1')).toBeVisible()
    await expect(page.getByText('Active Task 2')).toBeVisible()
    await expect(page.getByText('Completed Task')).not.toBeVisible()

    // Test 'Completed' filter
    await page.getByTestId('filter-completed').click()
    await expect(page.getByText('Active Task 1')).not.toBeVisible()
    await expect(page.getByText('Active Task 2')).not.toBeVisible()
    await expect(page.getByText('Completed Task')).toBeVisible()

    // Back to 'All'
    await page.getByTestId('filter-all').click()
    await expect(page.getByText('Active Task 1')).toBeVisible()
    await expect(page.getByText('Completed Task')).toBeVisible()
  })

  test('should filter tasks by category', async ({ page }) => {
    // Create tasks with different categories
    const tasks = [
      { title: 'Work Task', category: 'work' },
      { title: 'Personal Task', category: 'personal' },
      { title: 'Shopping Task', category: 'shopping' },
    ]

    for (const task of tasks) {
      await page.getByTestId('add-task-button').click()
      await page.getByTestId('task-title-input').fill(task.title)
      await page.getByTestId('task-category-select').click()
      await page.getByTestId(`category-option-${task.category}`).click()
      await page.getByTestId('task-form-submit').click()
    }

    // All tasks should be visible initially
    await expect(page.getByText('Work Task')).toBeVisible()
    await expect(page.getByText('Personal Task')).toBeVisible()
    await expect(page.getByText('Shopping Task')).toBeVisible()

    // Filter by work category
    await page.getByTestId('category-filter-dropdown').click()
    await page.getByTestId('category-filter-work').click()
    
    await expect(page.getByText('Work Task')).toBeVisible()
    await expect(page.getByText('Personal Task')).not.toBeVisible()
    await expect(page.getByText('Shopping Task')).not.toBeVisible()

    // Clear filter
    await page.getByTestId('clear-filter').click()
    
    // All tasks should be visible again
    await expect(page.getByText('Work Task')).toBeVisible()
    await expect(page.getByText('Personal Task')).toBeVisible()
    await expect(page.getByText('Shopping Task')).toBeVisible()
  })

  test('should clear completed tasks', async ({ page }) => {
    // Create and complete multiple tasks
    const tasks = ['Task 1', 'Task 2', 'Task 3']

    for (const title of tasks) {
      await page.getByTestId('add-task-button').click()
      await page.getByTestId('task-title-input').fill(title)
      await page.getByTestId('task-form-submit').click()
    }

    // Complete first two tasks
    for (let i = 0; i < 2; i++) {
      const taskItem = page.locator('[data-testid^="task-item-"]').nth(i)
      await taskItem.locator('[data-testid^="task-toggle-"]').click()
    }

    // Click clear completed
    await page.getByTestId('clear-completed-button').click()

    // Only the uncompleted task should remain
    await expect(page.getByText('Task 1')).not.toBeVisible()
    await expect(page.getByText('Task 2')).not.toBeVisible()
    await expect(page.getByText('Task 3')).toBeVisible()
  })

  test('should validate form inputs', async ({ page }) => {
    // Try to submit empty form
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-form-submit').click()
    
    // Should show validation error
    await expect(page.getByTestId('task-title-error')).toBeVisible()
    await expect(page.getByText('Title is required')).toBeVisible()
    
    // Form should not close
    await expect(page.getByText('Add New Task')).toBeVisible()
  })

  test('should close form with cancel button', async ({ page }) => {
    await page.getByTestId('add-task-button').click()
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    await page.getByTestId('task-form-cancel').click()
    await expect(page.getByText('Add New Task')).not.toBeVisible()
  })

  test('should close form with X button', async ({ page }) => {
    await page.getByTestId('add-task-button').click()
    await expect(page.getByText('Add New Task')).toBeVisible()
    
    await page.getByTestId('task-form-close').click()
    await expect(page.getByText('Add New Task')).not.toBeVisible()
  })
})
