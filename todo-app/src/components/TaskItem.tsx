import { useState, useRef, useEffect } from 'react'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { EllipsisVerticalIcon, StarIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import type { Task } from '@/types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onToggleImportant: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onUpdateTitle?: (id: string, newTitle: string) => void
}

const categoryColors = {
  work: 'bg-blue-100 text-blue-800 border-blue-200',
  personal: 'bg-green-100 text-green-800 border-green-200',
  shopping: 'bg-purple-100 text-purple-800 border-purple-200',
  health: 'bg-red-100 text-red-800 border-red-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
} as const

export function TaskItem({ task, onToggle, onToggleImportant, onEdit, onDelete, onUpdateTitle }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  const handleTitleDoubleClick = () => {
    if (!task.completed && onUpdateTitle) {
      setIsEditingTitle(true)
      setEditTitle(task.title)
    }
  }

  const handleTitleSubmit = () => {
    const trimmedTitle = editTitle.trim()
    if (trimmedTitle && trimmedTitle !== task.title && onUpdateTitle) {
      onUpdateTitle(task.id, trimmedTitle)
    }
    setIsEditingTitle(false)
    setEditTitle(task.title)
  }

  const handleTitleCancel = () => {
    setIsEditingTitle(false)
    setEditTitle(task.title)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleTitleCancel()
    }
  }

  const handleTaskKeyDown = (e: React.KeyboardEvent) => {
    // F2 key to start inline editing (common UI pattern)
    if (e.key === 'F2' && !task.completed && onUpdateTitle && !isEditingTitle) {
      e.preventDefault()
      handleTitleDoubleClick()
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()

  return (
    <div
      className={`group relative p-4 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        task.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm focus:border-blue-500'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleTaskKeyDown}
      tabIndex={0}
      data-testid={`task-item-${task.id}`}
      aria-label={`Task: ${task.title}. ${task.completed ? 'Completed' : 'Active'}. Press F2 to edit title.`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-600 border-green-600 text-white'
              : 'border-gray-300 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
          }`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          data-testid={`task-toggle-${task.id}`}
        >
          {task.completed && (
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onBlur={handleTitleSubmit}
                    className="flex-1 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid={`task-title-edit-${task.id}`}
                  />
                  <button
                    onClick={handleTitleSubmit}
                    className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded"
                    aria-label="Save title"
                    data-testid={`task-title-save-${task.id}`}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleTitleCancel}
                    className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
                    aria-label="Cancel editing"
                    data-testid={`task-title-cancel-${task.id}`}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <h3
                  className={`font-medium break-words cursor-pointer ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900 hover:text-blue-600'
                  } ${!task.completed && onUpdateTitle ? 'hover:bg-gray-50 px-1 -mx-1 rounded' : ''}`}
                  onDoubleClick={handleTitleDoubleClick}
                  data-testid={`task-title-${task.id}`}
                  title={
                    !task.completed && onUpdateTitle 
                      ? 'Double-click to edit or press F2 when task is focused' 
                      : undefined
                  }
                  role="button"
                  aria-label={
                    !task.completed && onUpdateTitle 
                      ? `Task title: ${task.title}. Double-click to edit or press F2 when task is focused.`
                      : `Task title: ${task.title}`
                  }
                >
                  {task.title}
                  {task.important && (
                    <StarIconSolid
                      className="inline-block w-4 h-4 ml-2 text-yellow-500"
                      aria-label="Important task"
                    />
                  )}
                </h3>
              )}
              
              {task.description && (
                <p
                  className={`text-sm mt-1 break-words ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  data-testid={`task-description-${task.id}`}
                >
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions Menu */}
            <Menu as="div" className="relative">
              <MenuButton
                className={`p-1 rounded-md transition-opacity ${
                  isHovered || task.completed 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover:opacity-100'
                } hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                aria-label="Task actions"
                data-testid={`task-menu-${task.id}`}
              >
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
              </MenuButton>
              
              <MenuItems className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 focus:outline-none">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onEdit(task)}
                      className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                        focus ? 'bg-gray-100' : ''
                      }`}
                      data-testid={`task-edit-${task.id}`}
                    >
                      <PencilIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Edit task details
                    </button>
                  )}
                </MenuItem>
                
                {onUpdateTitle && !task.completed && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={handleTitleDoubleClick}
                        className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                          focus ? 'bg-gray-100' : ''
                        }`}
                        data-testid={`task-quick-edit-${task.id}`}
                      >
                        <PencilIcon className="w-4 h-4 mr-2 text-blue-500" />
                        Quick edit title
                      </button>
                    )}
                  </MenuItem>
                )}
                
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onToggleImportant(task.id)}
                      className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                        focus ? 'bg-gray-100' : ''
                      }`}
                      data-testid={`task-toggle-important-${task.id}`}
                    >
                      {task.important ? (
                        <>
                          <StarIcon className="w-4 h-4 mr-2 text-gray-500" />
                          Remove from important
                        </>
                      ) : (
                        <>
                          <StarIconSolid className="w-4 h-4 mr-2 text-yellow-500" />
                          Mark as important
                        </>
                      )}
                    </button>
                  )}
                </MenuItem>
                
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onDelete(task.id)}
                      className={`flex items-center w-full px-3 py-2 text-sm text-left text-red-600 ${
                        focus ? 'bg-red-50' : ''
                      }`}
                      data-testid={`task-delete-${task.id}`}
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete task
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* Task Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${
                categoryColors[task.category as keyof typeof categoryColors]
              } ${task.completed ? 'opacity-50' : ''}`}
              data-testid={`task-category-${task.id}`}
            >
              {task.category}
            </span>
            
            <span className="text-xs text-gray-500" data-testid={`task-created-${task.id}`}>
              Created {formatDate(task.createdAt)}
            </span>
            
            {task.dueDate && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.completed
                    ? 'bg-gray-100 text-gray-500'
                    : isOverdue
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
                data-testid={`task-due-date-${task.id}`}
              >
                Due {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
