import { useMemo } from 'react'
import type { Task } from '@/types'

interface TaskStatsProps {
  tasks: Task[]
  filteredTasks: Task[]
  currentFilter: string
}

interface StatCard {
  label: string
  value: number
  color: string
  testId: string
}

export function TaskStats({ tasks, filteredTasks, currentFilter }: TaskStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const active = total - completed
    const important = tasks.filter(t => t.important && !t.completed).length
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false
      const dueDate = new Date(task.dueDate)
      return dueDate < today
    }).length
    
    const dueToday = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate < tomorrow
    }).length

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      active,
      important,
      overdue,
      dueToday,
      completionRate,
    }
  }, [tasks])

  const statCards: StatCard[] = [
    {
      label: 'Total',
      value: stats.total,
      color: 'text-blue-600',
      testId: 'stat-total',
    },
    {
      label: 'Active',
      value: stats.active,
      color: 'text-orange-600',
      testId: 'stat-active',
    },
    {
      label: 'Completed',
      value: stats.completed,
      color: 'text-green-600',
      testId: 'stat-completed',
    },
    {
      label: 'Important',
      value: stats.important,
      color: 'text-yellow-600',
      testId: 'stat-important',
    },
  ]

  // Add conditional stats based on context
  if (stats.overdue > 0) {
    statCards.push({
      label: 'Overdue',
      value: stats.overdue,
      color: 'text-red-600',
      testId: 'stat-overdue',
    })
  }

  if (stats.dueToday > 0) {
    statCards.push({
      label: 'Due Today',
      value: stats.dueToday,
      color: 'text-purple-600',
      testId: 'stat-due-today',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-testid="task-stats">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Task Statistics
        </h2>
        {stats.total > 0 && (
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              Progress
            </div>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
                data-testid="progress-bar"
              />
            </div>
            <div className="text-sm font-medium text-gray-900" data-testid="completion-rate">
              {stats.completionRate}%
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.testId}
            className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100"
            data-testid={stat.testId}
          >
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Context */}
      {currentFilter !== 'all' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              Showing <span className="font-medium">{filteredTasks.length}</span> tasks
              {currentFilter !== 'all' && (
                <span> in <span className="font-medium capitalize">{currentFilter}</span> filter</span>
              )}
            </div>
            {filteredTasks.length !== stats.total && (
              <div className="text-xs text-blue-600">
                {stats.total - filteredTasks.length} hidden
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Insights */}
      {stats.total > 0 && (
        <div className="mt-4 space-y-2">
          {stats.overdue > 0 && (
            <div className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {stats.overdue} task{stats.overdue === 1 ? ' is' : 's are'} overdue
            </div>
          )}
          
          {stats.dueToday > 0 && (
            <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {stats.dueToday} task{stats.dueToday === 1 ? ' is' : 's are'} due today
            </div>
          )}
          
          {stats.completionRate >= 80 && stats.active > 0 && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Great progress! You're almost done.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
