import { test, expect } from '@playwright/test'

test.describe('Todo App - Basic Test', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')
    
    // Check that the main heading is present
    await expect(page.locator('h1')).toContainText('Todo App')
    
    // Check that the add task button is present
    await expect(page.getByTestId('add-task-button')).toBeVisible()
    
    // Check that empty state is shown
    await expect(page.getByTestId('tasks-empty-state')).toBeVisible()
  })
})
