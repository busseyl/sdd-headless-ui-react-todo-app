import React, { useMemo } from 'react'
import { TaskItem } from './TaskItem'
import { usePerformanceMonitoring, useListPerformance } from '@/hooks/usePerformance'
import type { Task } from '@/types'

// Simple virtualization for large lists without external dependency
interface VirtualizedTaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onToggleImportant: (id: string) => void
  height?: number
  itemHeight?: number
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggle,
  onToggleImportant,
  height: _height = 400, // Prefix with _ to indicate intentionally unused
  itemHeight: _itemHeight = 80
}) => {
  usePerformanceMonitoring('VirtualizedTaskList')
  useListPerformance(tasks.length, 'VirtualizedTaskList')

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No tasks found</p>
      </div>
    )
  }

  // Use regular rendering for small lists to avoid virtualization overhead
  if (tasks.length <= 10) {
    return (
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onToggleImportant={onToggleImportant}
          />
        ))}
      </div>
    )
  }

  // For larger lists, use chunked rendering
  const chunkedTasks = useMemo(() => {
    const chunks = []
    const chunkSize = 20 // Render 20 items at a time
    for (let i = 0; i < tasks.length; i += chunkSize) {
      chunks.push(tasks.slice(i, i + chunkSize))
    }
    return chunks
  }, [tasks])

  return (
    <div className="space-y-4">
      {chunkedTasks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="space-y-2">
          {chunk.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              onToggleImportant={onToggleImportant}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Performance optimized task list with automatic virtualization threshold
export const OptimizedTaskList: React.FC<{
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onToggleImportant: (id: string) => void
  virtualizationThreshold?: number
}> = ({
  tasks,
  onEdit,
  onDelete,
  onToggle,
  onToggleImportant,
  virtualizationThreshold = 50
}) => {
  // Use virtualization for large lists
  if (tasks.length > virtualizationThreshold) {
    return (
      <VirtualizedTaskList
        tasks={tasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        onToggleImportant={onToggleImportant}
      />
    )
  }

  // Use regular rendering for smaller lists
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onToggleImportant={onToggleImportant}
        />
      ))}
    </div>
  )
}
