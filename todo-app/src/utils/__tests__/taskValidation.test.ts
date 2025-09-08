import {
  isValidTaskCategory,
  validateTask,
  validateTasks,
  sanitizeTask,
  createTask,
  generateTaskId,
  updateTask,
} from '../taskValidation'
import { TaskCategory } from '@/types'
import type { Task } from '@/types'

describe('Task Validation Utilities', () => {
  const mockDate = new Date('2025-01-01T00:00:00.000Z')
  
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('isValidTaskCategory', () => {
    it('should return true for valid categories', () => {
      expect(isValidTaskCategory('work')).toBe(true)
      expect(isValidTaskCategory('personal')).toBe(true)
      expect(isValidTaskCategory('shopping')).toBe(true)
      expect(isValidTaskCategory('health')).toBe(true)
      expect(isValidTaskCategory('other')).toBe(true)
    })

    it('should return false for invalid categories', () => {
      expect(isValidTaskCategory('invalid')).toBe(false)
      expect(isValidTaskCategory('')).toBe(false)
      expect(isValidTaskCategory('WORK')).toBe(false)
      expect(isValidTaskCategory('123')).toBe(false)
    })
  })

  describe('validateTask', () => {
    const validTask: Task = {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      important: false,
      category: TaskCategory.WORK,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should return true for valid task objects', () => {
      expect(validateTask(validTask)).toBe(true)
    })

    it('should return true for valid task with optional fields', () => {
      const taskWithOptionals = {
        ...validTask,
        description: undefined,
        dueDate: new Date(),
      }
      expect(validateTask(taskWithOptionals)).toBe(true)
    })

    it('should return false for null or undefined', () => {
      expect(validateTask(null)).toBe(false)
      expect(validateTask(undefined)).toBe(false)
    })

    it('should return false for non-object values', () => {
      expect(validateTask('not an object')).toBe(false)
      expect(validateTask(123)).toBe(false)
      expect(validateTask([])).toBe(false)
    })

    it('should return false for missing required fields', () => {
      expect(validateTask({ ...validTask, id: undefined })).toBe(false)
      expect(validateTask({ ...validTask, title: undefined })).toBe(false)
      expect(validateTask({ ...validTask, completed: undefined })).toBe(false)
      expect(validateTask({ ...validTask, important: undefined })).toBe(false)
    })

    it('should return false for empty string id or title', () => {
      expect(validateTask({ ...validTask, id: '' })).toBe(false)
      expect(validateTask({ ...validTask, id: '   ' })).toBe(false)
      expect(validateTask({ ...validTask, title: '' })).toBe(false)
      expect(validateTask({ ...validTask, title: '   ' })).toBe(false)
    })

    it('should return false for invalid types', () => {
      expect(validateTask({ ...validTask, id: 123 })).toBe(false)
      expect(validateTask({ ...validTask, title: 123 })).toBe(false)
      expect(validateTask({ ...validTask, completed: 'true' })).toBe(false)
      expect(validateTask({ ...validTask, important: 'false' })).toBe(false)
      expect(validateTask({ ...validTask, description: 123 })).toBe(false)
    })

    it('should return false for invalid category', () => {
      expect(validateTask({ ...validTask, category: 'invalid' })).toBe(false)
      expect(validateTask({ ...validTask, category: 123 })).toBe(false)
    })

    it('should return false for invalid dates', () => {
      expect(validateTask({ ...validTask, createdAt: 'invalid date' })).toBe(false)
      expect(validateTask({ ...validTask, updatedAt: 123 })).toBe(false)
      expect(validateTask({ ...validTask, dueDate: 'invalid' })).toBe(false)
    })

    it('should accept string dates', () => {
      const taskWithStringDates = {
        ...validTask,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      }
      expect(validateTask(taskWithStringDates)).toBe(true)
    })
  })

  describe('validateTasks', () => {
    const validTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Task 1',
        description: '',
        completed: false,
        important: false,
        category: TaskCategory.WORK,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Task 2',
        description: '',
        completed: true,
        important: true,
        category: TaskCategory.PERSONAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('should return true for valid task arrays', () => {
      expect(validateTasks(validTasks)).toBe(true)
      expect(validateTasks([])).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(validateTasks('not an array')).toBe(false)
      expect(validateTasks({ tasks: validTasks })).toBe(false)
      expect(validateTasks(null)).toBe(false)
    })

    it('should return false if any task is invalid', () => {
      const invalidTasks = [
        ...validTasks,
        { id: '', title: 'Invalid Task' } // Missing required fields
      ]
      expect(validateTasks(invalidTasks)).toBe(false)
    })
  })

  describe('sanitizeTask', () => {
    it('should trim string fields', () => {
      const dirtyTask = {
        id: '  task-1  ',
        title: '  Test Task  ',
        description: '  Test Description  ',
      }
      
      const sanitized = sanitizeTask(dirtyTask)
      
      expect(sanitized.id).toBe('task-1')
      expect(sanitized.title).toBe('Test Task')
      expect(sanitized.description).toBe('Test Description')
    })

    it('should preserve valid values', () => {
      const task = {
        completed: true,
        important: false,
        category: TaskCategory.WORK,
      }
      
      const sanitized = sanitizeTask(task)
      
      expect(sanitized.completed).toBe(true)
      expect(sanitized.important).toBe(false)
      expect(sanitized.category).toBe(TaskCategory.WORK)
    })

    it('should convert date strings to Date objects', () => {
      const task = {
        createdAt: '2025-01-01T00:00:00.000Z' as any,
        updatedAt: '2025-01-02T00:00:00.000Z' as any,
        dueDate: '2025-01-03T00:00:00.000Z' as any,
      }
      
      const sanitized = sanitizeTask(task)
      
      expect(sanitized.createdAt).toBeInstanceOf(Date)
      expect(sanitized.updatedAt).toBeInstanceOf(Date)
      expect(sanitized.dueDate).toBeInstanceOf(Date)
    })

    it('should ignore invalid values', () => {
      const dirtyTask = {
        id: 123 as any, // Invalid type
        title: '', // Empty string
        category: 'invalid' as any, // Invalid category
        completed: 'true' as any, // Invalid type
      }
      
      const sanitized = sanitizeTask(dirtyTask)
      
      expect(sanitized.id).toBeUndefined()
      expect(sanitized.title).toBeUndefined()
      expect(sanitized.category).toBeUndefined()
      expect(sanitized.completed).toBeUndefined()
    })
  })

  describe('generateTaskId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateTaskId()
      const id2 = generateTaskId()
      
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^task_\d+_[a-z0-9]+$/)
      expect(id2).toMatch(/^task_\d+_[a-z0-9]+$/)
    })

    it('should include timestamp in ID', () => {
      const id = generateTaskId()
      expect(id).toContain(mockDate.getTime().toString())
    })
  })

  describe('createTask', () => {
    it('should create a valid task with minimal parameters', () => {
      const task = createTask('Test Task')
      
      expect(task.title).toBe('Test Task')
      expect(task.description).toBe('')
      expect(task.completed).toBe(false)
      expect(task.important).toBe(false)
      expect(task.category).toBe(TaskCategory.PERSONAL)
      expect(task.createdAt).toEqual(mockDate)
      expect(task.updatedAt).toEqual(mockDate)
      expect(task.id).toMatch(/^task_\d+_[a-z0-9]+$/)
    })

    it('should create a task with all options', () => {
      const dueDate = new Date('2025-12-31')
      const task = createTask('Test Task', {
        description: 'Test Description',
        category: TaskCategory.WORK,
        important: true,
        dueDate,
      })
      
      expect(task.title).toBe('Test Task')
      expect(task.description).toBe('Test Description')
      expect(task.category).toBe(TaskCategory.WORK)
      expect(task.important).toBe(true)
      expect(task.dueDate).toBe(dueDate)
    })

    it('should trim title and description', () => {
      const task = createTask('  Test Task  ', {
        description: '  Test Description  ',
      })
      
      expect(task.title).toBe('Test Task')
      expect(task.description).toBe('Test Description')
    })

    it('should throw error for invalid title', () => {
      expect(() => createTask('')).toThrow('Task title is required')
      expect(() => createTask('   ')).toThrow('Task title is required')
      expect(() => createTask(null as any)).toThrow('Task title is required')
      expect(() => createTask(123 as any)).toThrow('Task title is required')
    })
  })

  describe('updateTask', () => {
    const existingTask: Task = {
      id: 'task-1',
      title: 'Original Task',
      description: 'Original Description',
      completed: false,
      important: false,
      category: TaskCategory.PERSONAL,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }

    it('should update task fields correctly', () => {
      const updates = {
        title: 'Updated Task',
        completed: true,
        important: true,
      }
      
      const updatedTask = updateTask(existingTask, updates)
      
      expect(updatedTask.title).toBe('Updated Task')
      expect(updatedTask.completed).toBe(true)
      expect(updatedTask.important).toBe(true)
      expect(updatedTask.updatedAt).toEqual(mockDate)
    })

    it('should preserve id and createdAt', () => {
      const updates = {
        title: 'Updated Task',
        id: 'new-id', // Should be ignored
        createdAt: new Date('2025-01-02'), // Should be ignored
      }
      
      const updatedTask = updateTask(existingTask, updates)
      
      expect(updatedTask.id).toBe(existingTask.id)
      expect(updatedTask.createdAt).toEqual(existingTask.createdAt)
    })

    it('should sanitize update values', () => {
      const updates = {
        title: '  Updated Task  ',
        description: '  Updated Description  ',
      }
      
      const updatedTask = updateTask(existingTask, updates)
      
      expect(updatedTask.title).toBe('Updated Task')
      expect(updatedTask.description).toBe('Updated Description')
    })

    it('should throw error if updated task is invalid', () => {
      // This would be hard to trigger with current validation,
      // but we can mock validateTask to return false
      const originalValidateTask = require('../taskValidation').validateTask
      jest.doMock('../taskValidation', () => ({
        ...jest.requireActual('../taskValidation'),
        validateTask: jest.fn(() => false)
      }))

      expect(() => updateTask(existingTask, { title: 'Updated' }))
        .toThrow('Updated task failed validation')

      // Restore original function
      jest.doMock('../taskValidation', () => ({
        ...jest.requireActual('../taskValidation'),
        validateTask: originalValidateTask
      }))
    })
  })
})
