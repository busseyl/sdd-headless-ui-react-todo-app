import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { TaskProvider } from '@/contexts'
import type { Task } from '@/types'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // For now, we'll use a simple provider without initial tasks
  // since the current TaskProvider doesn't support them
}

export function renderWithProviders(
  ui: ReactElement,
  { ...options }: CustomRenderOptions = {}
): RenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <TaskProvider>
        {children}
      </TaskProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock data factory functions
export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: `task-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  category: 'personal',
  important: false,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  ...overrides,
})

export const createMockTasks = (count: number): Task[] => 
  Array.from({ length: count }, (_, index) => 
    createMockTask({
      title: `Task ${index + 1}`,
      completed: index % 2 === 0,
      category: index % 2 === 0 ? 'work' : 'personal',
    })
  )

// Test data constants
export const testTasks: Task[] = [
  createMockTask({
    id: 'task-1',
    title: 'Complete project documentation',
    category: 'work',
    completed: false,
    important: true,
  }),
  createMockTask({
    id: 'task-2',
    title: 'Buy groceries',
    category: 'shopping',
    completed: true,
    important: false,
  }),
  createMockTask({
    id: 'task-3',
    title: 'Schedule doctor appointment',
    category: 'health',
    completed: false,
    important: true,
  }),
]

// Async testing utilities
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve(void 0)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

// Keyboard testing utilities
export const pressKey = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true })
  target.dispatchEvent(event)
}

export const pressEnter = (target: Element = document.body) => pressKey('Enter', target)
export const pressEscape = (target: Element = document.body) => pressKey('Escape', target)
export const pressTab = (target: Element = document.body) => pressKey('Tab', target)

// Custom testing assertions
export const expectToHaveFocus = (element: Element | null) => {
  expect(element).toBe(document.activeElement)
}

export const expectToBeVisible = (element: Element | null) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

// Re-export commonly used testing utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
