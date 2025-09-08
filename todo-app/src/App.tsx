import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { 
  TaskStats, 
  TaskFilters, 
  TaskList, 
  ErrorBoundary,
  ResponsiveLayout,
  PWAStatus,
  LazyWrapper,
  TaskFormSkeleton,
  PerformanceMonitor,
  DevPerformanceOverlay
} from '@/components'
import { 
  TaskForm as LazyTaskForm,
  KeyboardShortcutsHelp as LazyKeyboardShortcutsHelp,
  PWAInstallPrompt as LazyPWAInstallPrompt
} from '@/components/LazyComponents'
import { TaskProvider, useTaskContext } from '@/contexts'
import { useKeyboardShortcuts, usePerformanceMonitoring } from '@/hooks'
import { TaskCategory } from '@/types'
import type { TaskFormData } from '@/components'

// Main App content component (wrapped by providers)
function AppContent() {
  const {
    tasks,
    filteredTasks,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleImportant,
    taskStats,
    taskCategories,
    clearCompleted,
  } = useTaskContext()

  // Performance monitoring
  usePerformanceMonitoring('AppContent')

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  // Handle PWA shortcuts from manifest
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('action') === 'new') {
      setIsAddFormOpen(true)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Enhanced keyboard shortcuts with help modal
  const { isHelpVisible, toggleHelp } = useKeyboardShortcuts({
    onNewTask: () => setIsAddFormOpen(true),
    onToggleFilter: () => {
      const filters = ['all', 'active', 'completed'] as const
      const currentIndex = filters.indexOf(currentFilter as typeof filters[number])
      const nextIndex = (currentIndex + 1) % filters.length
      setCurrentFilter(filters[nextIndex])
    },
    onClearCompleted: () => {
      if (taskStats.completed > 0) {
        clearCompleted()
      }
    },
    onSearch: () => {
      // Focus the search input
      const searchInput = document.querySelector('[data-testid="search-input"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    },
    onSelectAll: () => {
      // Show all tasks
      setCurrentFilter('all')
    },
    onToggleImportant: () => {
      // Show active/incomplete tasks  
      setCurrentFilter('active')
    },
    onShowCompleted: () => {
      // Show completed tasks
      setCurrentFilter('completed')
    },
    onRefresh: () => {
      // Could implement data refresh here
      window.location.reload()
    },
    onEscape: () => {
      if (isAddFormOpen) {
        setIsAddFormOpen(false)
      }
    },
    onToggleHelp: () => toggleHelp(),
  })

  const handleAddTask = (formData: TaskFormData) => {
    addTask(formData.title, {
      description: formData.description,
      category: formData.category as TaskCategory,
      important: formData.important,
      dueDate: formData.dueDate,
    })
  }

  const taskCounts = {
    total: taskStats.total,
    active: taskStats.active,
    completed: taskStats.completed,
    work: taskCategories.work,
    personal: taskCategories.personal,
    shopping: taskCategories.shopping,
    health: taskCategories.health,
    other: taskCategories.other,
  }

  return (
    <ResponsiveLayout>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Todo App Logo" 
              className="w-8 h-8 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Todo App
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Organize your tasks!
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAddFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
            data-testid="add-task-button"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="mb-4 lg:mb-6">
        <TaskStats
          tasks={tasks}
          filteredTasks={filteredTasks}
          currentFilter={currentFilter}
        />
      </div>

      {/* Task Filters */}
      <div className="mb-4 lg:mb-6">
        <TaskFilters
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          taskCounts={taskCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tasks
              {filteredTasks.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredTasks.length})
                </span>
              )}
            </h2>
            
            {taskStats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm text-red-600 hover:text-red-700 font-medium self-start sm:self-auto"
                data-testid="clear-completed-button"
              >
                Clear Completed ({taskStats.completed})
              </button>
            )}
          </div>
          
          <TaskList
            tasks={filteredTasks}
            onToggleTask={toggleTask}
            onToggleImportant={toggleImportant}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            emptyStateMessage={
              searchQuery 
                ? `No tasks found for "${searchQuery}"`
                : currentFilter === 'all'
                ? "No tasks yet"
                : `No ${currentFilter} tasks`
            }
          />
        </div>
      </div>

      {/* Enhanced Keyboard Shortcuts Help */}
      <div className="mt-6 lg:mt-8 text-center">
        <button
          onClick={toggleHelp}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Keyboard shortcuts (?)
        </button>
      </div>

      {/* Add Task Form */}
      <LazyWrapper fallback={<TaskFormSkeleton />}>
        <LazyTaskForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onSubmit={handleAddTask}
          initialTask={null}
          title="Add New Task"
        />
      </LazyWrapper>

      {/* Keyboard Shortcuts Help Modal */}
      <LazyWrapper fallback={<div>Loading shortcuts...</div>}>
        <LazyKeyboardShortcutsHelp
          isOpen={isHelpVisible}
          onClose={toggleHelp}
        />
      </LazyWrapper>

      {/* PWA Components */}
      <LazyWrapper fallback={<div>Loading PWA features...</div>}>
        <LazyPWAInstallPrompt />
      </LazyWrapper>
      <PWAStatus />

      {/* Performance Monitoring (development) */}
      <PerformanceMonitor />
      <DevPerformanceOverlay />
    </ResponsiveLayout>
  )
}

// Root App component with providers and error boundary
function App() {
  return (
    <ErrorBoundary>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ErrorBoundary>
  )
}

export default App
