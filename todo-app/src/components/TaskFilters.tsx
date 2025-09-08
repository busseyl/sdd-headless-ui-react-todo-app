import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { FunnelIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { TaskCategory } from '@/types'
import type { FilterType } from '@/types'
import { SearchBar } from './SearchBar'

interface TaskFiltersProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  taskCounts: Record<string, number>
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

interface FilterOption {
  value: FilterType
  label: string
  count?: number
  color?: string
}

export function TaskFilters({ 
  currentFilter, 
  onFilterChange, 
  taskCounts, 
  searchQuery = '', 
  onSearchChange 
}: TaskFiltersProps) {
  const statusFilters: FilterOption[] = [
    { value: 'all', label: 'All Tasks', count: taskCounts.total },
    { value: 'active', label: 'Active', count: taskCounts.active },
    { value: 'completed', label: 'Completed', count: taskCounts.completed },
  ]

  const categoryFilters: FilterOption[] = [
    { value: TaskCategory.WORK, label: 'Work', count: taskCounts.work, color: 'text-blue-600' },
    { value: TaskCategory.PERSONAL, label: 'Personal', count: taskCounts.personal, color: 'text-green-600' },
    { value: TaskCategory.SHOPPING, label: 'Shopping', count: taskCounts.shopping, color: 'text-purple-600' },
    { value: TaskCategory.HEALTH, label: 'Health', count: taskCounts.health, color: 'text-red-600' },
    { value: TaskCategory.OTHER, label: 'Other', count: taskCounts.other, color: 'text-gray-600' },
  ]

  const allFilters = [...statusFilters, ...categoryFilters]
  const selectedFilter = allFilters.find(f => f.value === currentFilter) || statusFilters[0]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-testid="task-filters">
      <div className="flex flex-col gap-4">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="w-5 h-5 mr-2 text-gray-500" />
            Filter Tasks
          </h2>

          {/* Search Bar */}
          {onSearchChange && (
            <div className="flex-1 max-w-md">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                placeholder="Search tasks by title, description, or category..."
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Quick Status Filters */}
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentFilter === filter.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                }`}
                data-testid={`filter-${filter.value}`}
              >
                {filter.label}
                {filter.count !== undefined && (
                  <span className="ml-1 text-xs opacity-75">
                    ({filter.count})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          <Listbox value={currentFilter} onChange={onFilterChange}>
            <div className="relative">
              <ListboxButton 
                className="relative w-full sm:w-40 py-1.5 pl-3 pr-8 text-left bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="category-filter-dropdown"
              >
                <span className={`block truncate ${selectedFilter.color || 'text-gray-900'}`}>
                  {statusFilters.some(f => f.value === currentFilter) 
                    ? 'Categories' 
                    : selectedFilter.label
                  }
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              
              <ListboxOptions className="absolute right-0 z-10 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                    Categories
                  </div>
                  {categoryFilters.map((filter) => (
                    <ListboxOption
                      key={filter.value}
                      value={filter.value}
                      className={({ focus }) =>
                        `relative cursor-pointer select-none py-2 pl-8 pr-4 rounded ${
                          focus ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                      data-testid={`category-filter-${filter.value}`}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'} ${filter.color}`}>
                            {filter.label}
                            {filter.count !== undefined && filter.count > 0 && (
                              <span className="ml-1 text-xs opacity-75">
                                ({filter.count})
                              </span>
                            )}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-600">
                              <CheckIcon className="w-4 h-4" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </div>
              </ListboxOptions>
            </div>
          </Listbox>

          {/* Clear Filter Button */}
          {currentFilter !== 'all' && (
            <button
              onClick={() => onFilterChange('all')}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              data-testid="clear-filter"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {currentFilter !== 'all' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-blue-800">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                selectedFilter.color?.includes('blue') ? 'bg-blue-500' :
                selectedFilter.color?.includes('green') ? 'bg-green-500' :
                selectedFilter.color?.includes('purple') ? 'bg-purple-500' :
                selectedFilter.color?.includes('red') ? 'bg-red-500' :
                selectedFilter.color?.includes('yellow') ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              Active filter: <span className="font-medium ml-1">{selectedFilter.label}</span>
            </div>
            <button
              onClick={() => onFilterChange('all')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              data-testid="remove-filter"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
