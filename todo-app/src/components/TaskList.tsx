import { useState } from 'react'
import { TaskItem } from './TaskItem'
import { TaskForm } from './TaskForm'
import type { TaskFormData } from './TaskForm'
import type { Task } from '@/types'

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (id: string) => void
  onToggleImportant: (id: string) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  emptyStateMessage?: string
}

export function TaskList({
  tasks,
  onToggleTask,
  onToggleImportant,
  onUpdateTask,
  onDeleteTask,
  emptyStateMessage = "No tasks found",
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category as Task['category'],
        important: formData.important,
        dueDate: formData.dueDate,
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleUpdateTitle = (id: string, newTitle: string) => {
    onUpdateTask(id, { title: newTitle })
  }

  if (tasks.length === 0) {
    return (
      <>
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
          data-testid="tasks-empty-state"
        >
          <div className="w-16 h-16 mb-4 text-gray-300">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {emptyStateMessage}
          </h3>
          <p className="text-gray-500 max-w-sm">
            {emptyStateMessage === "No tasks found" 
              ? "Create your first task to get started with organizing your work."
              : "Try adjusting your filters to see more tasks."
            }
          </p>
        </div>

        <TaskForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialTask={editingTask}
          title="Edit Task"
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-3" data-testid="tasks-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onToggleImportant={onToggleImportant}
            onEdit={handleEdit}
            onDelete={onDeleteTask}
            onUpdateTitle={handleUpdateTitle}
          />
        ))}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
        title="Edit Task"
      />
    </>
  )
}
