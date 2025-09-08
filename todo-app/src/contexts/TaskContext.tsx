import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useTasks } from '@/hooks'
import type { Task, FilterType } from '@/types'

interface TaskContextValue {
  // Task data
  tasks: Task[]
  filteredTasks: Task[]
  taskStats: {
    total: number
    active: number
    completed: number
    important: number
  }
  taskCategories: {
    work: number
    personal: number
    shopping: number
    health: number
    other: number
  }

  // Filter state
  currentFilter: FilterType
  setCurrentFilter: (filter: FilterType) => void
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Task operations
  addTask: (title: string, options?: Partial<Omit<Task, 'id' | 'title' | 'completed' | 'createdAt' | 'updatedAt'>>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  toggleImportant: (id: string) => void
  clearCompleted: () => void

  // UI state
  isLoading: boolean
  error: string | null
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)

interface TaskProviderProps {
  children: ReactNode
}

export function TaskProvider({ children }: TaskProviderProps) {
  const taskData = useTasks()

  // Add UI state management
  const [isLoading] = React.useState(false)
  const [error] = React.useState<string | null>(null)

  const contextValue: TaskContextValue = {
    ...taskData,
    isLoading,
    error,
  }

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  
  return context
}

// Custom hooks for specific context slices
export function useTaskData() {
  const { tasks, filteredTasks, taskStats, taskCategories } = useTaskContext()
  return { tasks, filteredTasks, taskStats, taskCategories }
}

export function useTaskFilters() {
  const { currentFilter, setCurrentFilter, searchQuery, setSearchQuery } = useTaskContext()
  return { currentFilter, setCurrentFilter, searchQuery, setSearchQuery }
}

export function useTaskOperations() {
  const { 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask, 
    toggleImportant, 
    clearCompleted 
  } = useTaskContext()
  
  return { 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask, 
    toggleImportant, 
    clearCompleted 
  }
}

export function useTaskUI() {
  const { isLoading, error } = useTaskContext()
  return { isLoading, error }
}
