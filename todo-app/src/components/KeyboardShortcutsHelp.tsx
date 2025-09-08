import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: 'N', description: 'Create new task' },
        { keys: 'S', description: 'Focus search' },
        { keys: 'R', description: 'Refresh data' },
        { keys: 'Escape', description: 'Close dialogs/cancel actions' },
        { keys: '?', description: 'Toggle this help' },
      ],
    },
    {
      category: 'Filtering',
      items: [
        { keys: 'F', description: 'Toggle between filters' },
        { keys: 'A', description: 'Show all tasks' },
        { keys: 'I', description: 'Show active tasks' },
        { keys: 'C', description: 'Show completed tasks' },
      ],
    },
    {
      category: 'Task Management',
      items: [
        { keys: 'Space', description: 'Toggle task completion (when focused)' },
        { keys: 'Enter', description: 'Edit task (when focused)' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { keys: 'Tab', description: 'Navigate forward' },
        { keys: 'Shift + Tab', description: 'Navigate backward' },
        { keys: 'Arrow Keys', description: 'Navigate within menus/lists' },
        { keys: 'Enter', description: 'Activate focused element' },
      ],
    },
  ]

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <CommandLineIcon className="w-6 h-6 text-blue-600 mr-3" />
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Keyboard Shortcuts
                </DialogTitle>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close help"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shortcuts.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {shortcut.description}
                          </span>
                          <kbd className="ml-3 px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-200 rounded text-gray-700 whitespace-nowrap">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Most shortcuts work globally throughout the app, 
                      except when typing in input fields. Press <kbd className="px-1 py-0.5 text-xs bg-blue-100 border border-blue-300 rounded">Escape</kbd> to cancel actions or close dialogs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Got it
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
