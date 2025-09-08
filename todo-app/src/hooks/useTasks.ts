import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { createTask, updateTask as updateTaskUtil, validateTasks } from '@/utils/taskValidation'
import type { Task, FilterType } from '@/types'
import { TaskCategory } from '@/types'

const TASKS_STORAGE_KEY = 'todo-app-tasks'
const FILTER_STORAGE_KEY = 'todo-app-filter'
const SEARCH_STORAGE_KEY = 'todo-app-search'

/**
 * Custom hook for managing tasks with localStorage persistence
 */
export function useTasks() {
  // Persist tasks in localStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, [])
  
  // Persist current filter in localStorage
  const [currentFilter, setCurrentFilter] = useLocalStorage<FilterType>(
    FILTER_STORAGE_KEY, 
    'all'
  )

  // Persist search query in localStorage
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    SEARCH_STORAGE_KEY,
    ''
  )

  // Validate tasks data integrity
  const validatedTasks = useMemo(() => {
    if (!validateTasks(tasks)) {
      console.warn('Invalid tasks data detected, resetting to empty array')
      return []
    }
    return tasks
  }, [tasks])

  // Add a new task
  const addTask = useCallback(
    (
      title: string,
      options: {
        description?: string
        category?: TaskCategory
        important?: boolean
        dueDate?: Date
      } = {}
    ) => {
      try {
        const newTask = createTask(title, options)
        setTasks(prevTasks => [...prevTasks, newTask])
        return newTask
      } catch (error) {
        console.error('Error adding task:', error)
        throw error
      }
    },
    [setTasks]
  )

  // Update an existing task
  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      setTasks(prevTasks => {
        const taskIndex = prevTasks.findIndex(task => task.id === id)
        if (taskIndex === -1) {
          console.warn(`Task with id ${id} not found`)
          return prevTasks
        }

        try {
          const existingTask = prevTasks[taskIndex]
          const updatedTask = updateTaskUtil(existingTask, updates)
          
          const newTasks = [...prevTasks]
          newTasks[taskIndex] = updatedTask
          return newTasks
        } catch (error) {
          console.error('Error updating task:', error)
          return prevTasks
        }
      })
    },
    [setTasks]
  )

  // Delete a task
  const deleteTask = useCallback(
    (id: string) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
    },
    [setTasks]
  )

  // Toggle task completion status
  const toggleTask = useCallback(
    (id: string) => {
      updateTask(id, { completed: !validatedTasks.find(t => t.id === id)?.completed })
    },
    [updateTask, validatedTasks]
  )

  // Toggle task importance
  const toggleImportant = useCallback(
    (id: string) => {
      updateTask(id, { important: !validatedTasks.find(t => t.id === id)?.important })
    },
    [updateTask, validatedTasks]
  )

  // Clear all completed tasks
  const clearCompleted = useCallback(() => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed))
  }, [setTasks])

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    setTasks([])
  }, [setTasks])

  // Get filtered tasks based on current filter and search query
  const filteredTasks = useMemo(() => {
    let filtered = validatedTasks.filter(task => {
      switch (currentFilter) {
        case 'all':
          return true
        case 'active':
          return !task.completed
        case 'completed':
          return task.completed
        case 'work':
        case 'personal':
        case 'shopping':
        case 'health':
        case 'other':
          return task.category === currentFilter
        default:
          return true
      }
    })

    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [validatedTasks, currentFilter, searchQuery])

  // Get important tasks
  const importantTasks = useMemo(() => {
    return validatedTasks.filter(task => task.important && !task.completed)
  }, [validatedTasks])

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    const now = new Date()
    return validatedTasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    )
  }, [validatedTasks])

  // Get tasks due today
  const tasksDueToday = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return validatedTasks.filter(task => {
      if (!task.dueDate || task.completed) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate < tomorrow
    })
  }, [validatedTasks])

  // Task statistics
  const taskStats = useMemo(() => {
    const total = validatedTasks.length
    const completed = validatedTasks.filter(t => t.completed).length
    const active = total - completed
    const important = validatedTasks.filter(t => t.important && !t.completed).length
    const overdue = overdueTasks.length

    return {
      total,
      completed,
      active,
      important,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [validatedTasks, overdueTasks])

  // Task categories with counts
  const taskCategories = useMemo(() => {
    const categories = {
      work: 0,
      personal: 0,
      shopping: 0,
      health: 0,
      other: 0,
    }

    validatedTasks.forEach(task => {
      if (!task.completed) {
        categories[task.category]++
      }
    })

    return categories
  }, [validatedTasks])

  return {
    // Core data
    tasks: validatedTasks,
    filteredTasks,
    importantTasks,
    overdueTasks,
    tasksDueToday,
    
    // Current state
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    
    // Task operations
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleImportant,
    clearCompleted,
    clearAllTasks,
    
    // Statistics
    taskStats,
    taskCategories,
  }
}
