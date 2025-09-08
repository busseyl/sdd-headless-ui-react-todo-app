import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { TaskCategory } from '@/types'
import type { Task } from '@/types'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: TaskFormData) => void
  initialTask?: Task | null
  title: string
}

export interface TaskFormData {
  title: string
  description: string
  category: string
  important: boolean
  dueDate?: Date
}

const categoryOptions = [
  { value: TaskCategory.PERSONAL, label: 'Personal', color: 'text-green-600' },
  { value: TaskCategory.WORK, label: 'Work', color: 'text-blue-600' },
  { value: TaskCategory.SHOPPING, label: 'Shopping', color: 'text-purple-600' },
  { value: TaskCategory.HEALTH, label: 'Health', color: 'text-red-600' },
  { value: TaskCategory.OTHER, label: 'Other', color: 'text-gray-600' },
]

export function TaskForm({ isOpen, onClose, onSubmit, initialTask, title }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(() => ({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    category: initialTask?.category || TaskCategory.PERSONAL,
    important: initialTask?.important || false,
    dueDate: initialTask?.dueDate ? new Date(initialTask.dueDate) : undefined,
  }))

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: TaskCategory.PERSONAL,
      important: false,
      dueDate: undefined,
    })
    setErrors({})
    onClose()
  }

  const selectedCategory = categoryOptions.find(cat => cat.value === formData.category) || categoryOptions[0]

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>
            <button
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Close dialog"
              data-testid="task-form-close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="task-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter task title..."
                data-testid="task-title-input"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600" data-testid="task-title-error">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task description..."
                data-testid="task-description-input"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="task-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Listbox 
                value={formData.category} 
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <div className="relative">
                  <ListboxButton 
                    id="task-category"
                    className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="task-category-select"
                  >
                    <span className={`block truncate ${selectedCategory.color}`}>
                      {selectedCategory.label}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  
                  <ListboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                    {categoryOptions.map((category) => (
                      <ListboxOption
                        key={category.value}
                        value={category.value}
                        className={({ focus }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            focus ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                          }`
                        }
                        data-testid={`category-option-${category.value}`}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'} ${category.color}`}>
                              {category.label}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>

            {/* Due Date Input */}
            <div>
              <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dueDate: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="task-due-date-input"
              />
            </div>

            {/* Important Checkbox */}
            <div className="flex items-center">
              <input
                id="task-important"
                type="checkbox"
                checked={formData.important}
                onChange={(e) => setFormData(prev => ({ ...prev, important: e.target.checked }))}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                data-testid="task-important-checkbox"
              />
              <label htmlFor="task-important" className="ml-2 text-sm text-gray-700">
                Mark as important
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                data-testid="task-form-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                data-testid="task-form-submit"
              >
                {initialTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
