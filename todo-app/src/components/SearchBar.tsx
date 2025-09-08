import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search tasks...",
  className = ""
}: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounce the search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [localQuery, onSearchChange])

  // Sync with external changes
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleClear = () => {
    setLocalQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon 
          className="h-5 w-5 text-gray-400" 
          aria-hidden="true" 
        />
      </div>
      
      <input
        type="search"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        aria-label="Search tasks"
        data-testid="search-input"
      />
      
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
          aria-label="Clear search"
          data-testid="search-clear"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}

      {/* Screen reader announcement for search results */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        data-testid="search-announcement"
      >
        {localQuery ? `Searching for: ${localQuery}` : ''}
      </div>
    </div>
  )
}
