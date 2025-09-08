import { lazy } from 'react'

// Lazy load non-critical components for better initial load performance
export const TaskForm = lazy(() => import('./TaskForm').then(module => ({
  default: module.TaskForm
})))

export const KeyboardShortcutsHelp = lazy(() => import('./KeyboardShortcutsHelp').then(module => ({
  default: module.KeyboardShortcutsHelp
})))

export const PWAInstallPrompt = lazy(() => import('./PWAInstallPrompt').then(module => ({
  default: module.PWAInstallPrompt
})))

// Loading fallback component with skeleton UI
export const ComponentSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-md h-4 mb-2"></div>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-md h-4 w-3/4 mb-2"></div>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-md h-4 w-1/2"></div>
  </div>
)

// Preloader for critical components
export const TaskFormSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <ComponentSkeleton className="mb-4" />
      <ComponentSkeleton className="mb-4" />
      <div className="flex gap-2 justify-end">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-md h-10 w-20"></div>
        <div className="bg-blue-200 dark:bg-blue-700 rounded-md h-10 w-20"></div>
      </div>
    </div>
  </div>
)
