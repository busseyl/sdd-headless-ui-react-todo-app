import { useEffect, useCallback, useState } from 'react'

export interface UseKeyboardShortcutsOptions {
  onNewTask?: () => void
  onToggleFilter?: () => void
  onClearCompleted?: () => void
  onSearch?: () => void
  onToggleImportant?: () => void
  onShowCompleted?: () => void
  onEscape?: () => void
  onToggleHelp?: () => void
  onSelectAll?: () => void
  onRefresh?: () => void
  enabled?: boolean
}

/**
 * Custom hook for global keyboard shortcuts
 * Provides comprehensive keyboard navigation for the todo app
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions) {
  const {
    onNewTask,
    onToggleFilter,
    onClearCompleted,
    onSearch,
    onToggleImportant,
    onShowCompleted,
    onEscape,
    onToggleHelp,
    onSelectAll,
    onRefresh,
    enabled = true,
  } = options

  const [isHelpVisible, setIsHelpVisible] = useState(false)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when user is typing in input fields
      const target = event.target as HTMLElement
      const isInInputField = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('[contenteditable="true"]')

      if (isInInputField) {
        // Allow Escape key even in input fields
        if (event.key === 'Escape' && onEscape) {
          onEscape()
          return
        }
        return
      }

      const { key, ctrlKey, metaKey, shiftKey, altKey } = event
      const isModifierPressed = ctrlKey || metaKey

      // Handle help toggle first (works everywhere)
      if (key === '?' && !isModifierPressed && !shiftKey && !altKey) {
        event.preventDefault()
        setIsHelpVisible(prev => !prev)
        onToggleHelp?.()
        return
      }

      switch (key) {
        case 'n':
        case 'N':
          if (!isModifierPressed && !shiftKey && !altKey && onNewTask) {
            event.preventDefault()
            onNewTask()
          }
          break

        case 'f':
        case 'F':
          if (!isModifierPressed && !shiftKey && !altKey && onToggleFilter) {
            event.preventDefault()
            onToggleFilter()
          }
          break

        case 's':
        case 'S':
          if (!isModifierPressed && !shiftKey && !altKey && onSearch) {
            event.preventDefault()
            onSearch()
          }
          break

        case 'i':
        case 'I':
          if (!isModifierPressed && !shiftKey && !altKey && onToggleImportant) {
            event.preventDefault()
            onToggleImportant()
          }
          break

        case 'a':
        case 'A':
          if (!isModifierPressed && !shiftKey && !altKey && onSelectAll) {
            event.preventDefault()
            onSelectAll()
          }
          break

        case 'r':
        case 'R':
          if (!isModifierPressed && !shiftKey && !altKey && onRefresh) {
            event.preventDefault()
            onRefresh()
          }
          break

        case 'c':
        case 'C':
          if (!isModifierPressed && !shiftKey && !altKey && onShowCompleted) {
            event.preventDefault()
            onShowCompleted()
          }
          break

        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
            // Also hide help if visible
            if (isHelpVisible) {
              setIsHelpVisible(false)
            }
          }
          break

        default:
          break
      }
    },
    [
      enabled,
      onNewTask,
      onToggleFilter,
      onClearCompleted,
      onSearch,
      onToggleImportant,
      onShowCompleted,
      onEscape,
      onToggleHelp,
      onSelectAll,
      onRefresh,
      isHelpVisible,
    ]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  // Return helpful information about available shortcuts and state
  const shortcuts = {
    newTask: { keys: 'N', description: 'Create new task' },
    toggleFilter: { keys: 'F', description: 'Toggle filter' },
    search: { keys: 'S', description: 'Focus search' },
    showActive: { keys: 'I', description: 'Show active tasks' },
    showAll: { keys: 'A', description: 'Show all tasks' },
    refresh: { keys: 'R', description: 'Refresh data' },
    showCompleted: { keys: 'C', description: 'Show completed tasks' },
    escape: { keys: 'Escape', description: 'Close dialogs/cancel actions' },
    help: { keys: '?', description: 'Toggle keyboard shortcuts help' },
  }

  return { 
    shortcuts, 
    isHelpVisible, 
    setIsHelpVisible,
    toggleHelp: () => setIsHelpVisible(prev => !prev)
  }
}
