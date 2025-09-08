import React, { useState, useEffect } from 'react'
import { useWebVitals, usePerformanceBudget } from '@/hooks/usePerformance'

interface PerformanceMonitorProps {
  enabled?: boolean
  showInProduction?: boolean
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  showInProduction = false
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const vitals = useWebVitals()
  const { budgetExceeded, isWithinBudget } = usePerformanceBudget()

  // Only show in development or when explicitly enabled for production
  const shouldShow = enabled || (process.env.NODE_ENV === 'production' && showInProduction)

  if (!shouldShow) {
    return null
  }

  const getVitalStatus = (value: number | undefined, thresholds: [number, number]) => {
    if (value === undefined) return 'unknown'
    const [good, needsImprovement] = thresholds
    if (value <= good) return 'good'
    if (value <= needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  const vitalsThresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    FCP: [1800, 3000],
    LCP: [2500, 4000],
    TTFB: [800, 1800]
  }

  const statusColors = {
    good: 'text-green-600 bg-green-100',
    'needs-improvement': 'text-yellow-600 bg-yellow-100',
    poor: 'text-red-600 bg-red-100',
    unknown: 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`p-2 rounded-full shadow-lg transition-colors ${
          isWithinBudget 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Performance Monitor
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Budget Status */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Budget Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                isWithinBudget ? statusColors.good : statusColors.poor
              }`}>
                {isWithinBudget ? 'Within Budget' : 'Over Budget'}
              </span>
            </div>
            {budgetExceeded.length > 0 && (
              <div className="text-xs text-red-600 dark:text-red-400">
                Exceeded: {budgetExceeded.join(', ')}
              </div>
            )}
          </div>

          {/* Web Vitals */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
              Core Web Vitals
            </h4>
            
            {Object.entries(vitalsThresholds).map(([metric, thresholds]) => {
              const value = vitals[metric as keyof typeof vitals]
              const status = getVitalStatus(value, thresholds)
              
              return (
                <div key={metric} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {metric}:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {value !== undefined ? Math.round(value * 100) / 100 : '—'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
                      {status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Memory Info (if available) */}
          {(performance as any).memory && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
                Memory Usage
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>
                  Used: {Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB
                </div>
                <div>
                  Total: {Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)}MB
                </div>
                <div>
                  Limit: {Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)}MB
                </div>
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100">
                Performance Tips
              </summary>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>• Use lazy loading for large lists</div>
                <div>• Minimize re-renders with React.memo</div>
                <div>• Implement code splitting for route-based chunks</div>
                <div>• Optimize images and assets</div>
                <div>• Use service workers for caching</div>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}

// Performance overlay for development
export const DevPerformanceOverlay: React.FC = () => {
  const [fps, setFps] = useState(0)
  const [frameCount, setFrameCount] = useState(0)
  const [lastTime, setLastTime] = useState(performance.now())

  useEffect(() => {
    let animationId: number

    const updateFPS = () => {
      const now = performance.now()
      const delta = now - lastTime
      
      if (delta >= 1000) { // Update every second
        setFps(Math.round(frameCount * 1000 / delta))
        setFrameCount(0)
        setLastTime(now)
      } else {
        setFrameCount(prev => prev + 1)
      }
      
      animationId = requestAnimationFrame(updateFPS)
    }

    if (process.env.NODE_ENV === 'development') {
      animationId = requestAnimationFrame(updateFPS)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [frameCount, lastTime])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-mono z-50">
      FPS: {fps}
    </div>
  )
}
