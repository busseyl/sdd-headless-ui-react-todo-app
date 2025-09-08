import type { Task } from '@/types'
import { TaskCategory } from '@/types'

/**
 * Task validation utilities
 */

/**
 * Validate if a string is a valid task category
 */
export function isValidTaskCategory(category: string): category is TaskCategory {
  return Object.values(TaskCategory).includes(category as TaskCategory)
}

/**
 * Validate a task object structure
 */
export function validateTask(task: unknown): task is Task {
  if (!task || typeof task !== 'object') {
    return false
  }

  const t = task as Record<string, unknown>

  // Check required string fields
  if (typeof t.id !== 'string' || t.id.trim() === '') {
    return false
  }

  if (typeof t.title !== 'string' || t.title.trim() === '') {
    return false
  }

  // Check optional description
  if (t.description !== undefined && typeof t.description !== 'string') {
    return false
  }

  // Check boolean fields
  if (typeof t.completed !== 'boolean') {
    return false
  }

  if (typeof t.important !== 'boolean') {
    return false
  }

  // Check category
  if (!isValidTaskCategory(t.category as string)) {
    return false
  }

  // Check dates
  if (!(t.createdAt instanceof Date) && typeof t.createdAt !== 'string') {
    return false
  }

  if (!(t.updatedAt instanceof Date) && typeof t.updatedAt !== 'string') {
    return false
  }

  // Check optional due date
  if (t.dueDate !== undefined && 
      !(t.dueDate instanceof Date) && 
      typeof t.dueDate !== 'string') {
    return false
  }

  return true
}

/**
 * Validate an array of tasks
 */
export function validateTasks(tasks: unknown): tasks is Task[] {
  if (!Array.isArray(tasks)) {
    return false
  }

  return tasks.every(validateTask)
}

/**
 * Sanitize and normalize a task object
 */
export function sanitizeTask(task: Partial<Task>): Partial<Task> {
  const sanitized: Partial<Task> = {}

  if (task.id && typeof task.id === 'string') {
    sanitized.id = task.id.trim()
  }

  if (task.title && typeof task.title === 'string') {
    sanitized.title = task.title.trim()
  }

  if (task.description && typeof task.description === 'string') {
    sanitized.description = task.description.trim()
  }

  if (typeof task.completed === 'boolean') {
    sanitized.completed = task.completed
  }

  if (typeof task.important === 'boolean') {
    sanitized.important = task.important
  }

  if (task.category && isValidTaskCategory(task.category)) {
    sanitized.category = task.category
  }

  if (task.createdAt) {
    sanitized.createdAt = new Date(task.createdAt)
  }

  if (task.updatedAt) {
    sanitized.updatedAt = new Date(task.updatedAt)
  }

  if (task.dueDate) {
    sanitized.dueDate = new Date(task.dueDate)
  }

  return sanitized
}

/**
 * Create a new task with validation
 */
export function createTask(
  title: string,
  options: {
    description?: string
    category?: TaskCategory
    important?: boolean
    dueDate?: Date
  } = {}
): Task {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Task title is required and must be a non-empty string')
  }

  const now = new Date()
  const task: Task = {
    id: generateTaskId(),
    title: title.trim(),
    description: options.description?.trim() || '',
    completed: false,
    important: options.important || false,
    category: options.category || TaskCategory.PERSONAL,
    createdAt: now,
    updatedAt: now,
    dueDate: options.dueDate,
  }

  if (!validateTask(task)) {
    throw new Error('Failed to create valid task')
  }

  return task
}

/**
 * Generate a unique task ID
 */
export function generateTaskId(): string {
  // Generate a timestamp-based ID with random suffix
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `task_${timestamp}_${random}`
}

/**
 * Update a task with validation
 */
export function updateTask(
  existingTask: Task,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Task {
  const updatedTask: Task = {
    ...existingTask,
    ...sanitizeTask(updates),
    id: existingTask.id, // Preserve original ID
    createdAt: existingTask.createdAt, // Preserve creation date
    updatedAt: new Date(), // Update modification time
  }

  if (!validateTask(updatedTask)) {
    throw new Error('Updated task failed validation')
  }

  return updatedTask
}
