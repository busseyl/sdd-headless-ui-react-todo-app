import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentMountTime: number
  lastUpdate: number
}

// Hook to monitor component performance
export const usePerformanceMonitoring = (componentName: string) => {
  const mountTimeRef = useRef(performance.now())
  const lastRenderRef = useRef(performance.now())
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMountTime: 0,
    lastUpdate: 0
  })

  useEffect(() => {
    const mountTime = performance.now() - mountTimeRef.current
    setMetrics(prev => ({
      ...prev,
      componentMountTime: mountTime
    }))

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`)
    }
  }, [componentName])

  useEffect(() => {
    const renderTime = performance.now() - lastRenderRef.current
    setMetrics(prev => ({
      ...prev,
      renderTime,
      lastUpdate: performance.now()
    }))
    lastRenderRef.current = performance.now()
  })

  return metrics
}

// Hook to monitor list rendering performance
export const useListPerformance = (itemCount: number, componentName: string) => {
  const previousCountRef = useRef(itemCount)
  const renderStartRef = useRef(performance.now())

  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current
    const itemsChanged = Math.abs(itemCount - previousCountRef.current)

    if (process.env.NODE_ENV === 'development' && itemsChanged > 0) {
      console.log(
        `[List Performance] ${componentName} rendered ${itemCount} items ` +
        `(${itemsChanged > 0 ? '+' : ''}${itemsChanged}) in ${renderTime.toFixed(2)}ms ` +
        `(${(renderTime / itemCount).toFixed(2)}ms per item)`
      )
    }

    previousCountRef.current = itemCount
    renderStartRef.current = performance.now()
  }, [itemCount, componentName])

  return {
    itemCount,
    averageRenderTimePerItem: itemCount > 0 ? 
      (performance.now() - renderStartRef.current) / itemCount : 0
  }
}

// Hook to track user interactions and performance
export const useInteractionPerformance = () => {
  const [interactions, setInteractions] = useState<Array<{
    type: string
    timestamp: number
    duration: number
  }>>([])

  const trackInteraction = (type: string, startTime?: number) => {
    const start = startTime || performance.now()
    
    return {
      finish: () => {
        const duration = performance.now() - start
        setInteractions(prev => [
          ...prev.slice(-9), // Keep last 10 interactions
          { type, timestamp: start, duration }
        ])

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Interaction] ${type} completed in ${duration.toFixed(2)}ms`)
        }
      }
    }
  }

  return {
    interactions,
    trackInteraction,
    averageInteractionTime: interactions.length > 0 
      ? interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length 
      : 0
  }
}

// Performance budget checker
export const usePerformanceBudget = () => {
  const [budgetExceeded, setBudgetExceeded] = useState<string[]>([])

  const checkBudget = (metricName: string, value: number, budget: number) => {
    if (value > budget) {
      setBudgetExceeded(prev => 
        prev.includes(metricName) ? prev : [...prev, metricName]
      )
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Performance Budget] ${metricName} exceeded budget: ${value.toFixed(2)}ms > ${budget}ms`
        )
      }
    } else {
      setBudgetExceeded(prev => prev.filter(name => name !== metricName))
    }
  }

  return {
    budgetExceeded,
    checkBudget,
    isWithinBudget: budgetExceeded.length === 0
  }
}

// Web Vitals monitoring
export const useWebVitals = () => {
  const [vitals, setVitals] = useState<{
    CLS?: number
    FID?: number
    FCP?: number
    LCP?: number
    TTFB?: number
  }>({})

  useEffect(() => {
    // Dynamically import web-vitals to avoid blocking initial load
    const loadWebVitals = async () => {
      try {
        const webVitalsModule = await import('web-vitals')
        
        // Use dynamic property access to handle different versions
        if ('getCLS' in webVitalsModule) {
          (webVitalsModule as any).getCLS((metric: any) => setVitals(prev => ({ ...prev, CLS: metric.value })))
        }
        if ('getFID' in webVitalsModule) {
          (webVitalsModule as any).getFID((metric: any) => setVitals(prev => ({ ...prev, FID: metric.value })))
        }
        if ('getFCP' in webVitalsModule) {
          (webVitalsModule as any).getFCP((metric: any) => setVitals(prev => ({ ...prev, FCP: metric.value })))
        }
        if ('getLCP' in webVitalsModule) {
          (webVitalsModule as any).getLCP((metric: any) => setVitals(prev => ({ ...prev, LCP: metric.value })))
        }
        if ('getTTFB' in webVitalsModule) {
          (webVitalsModule as any).getTTFB((metric: any) => setVitals(prev => ({ ...prev, TTFB: metric.value })))
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Web Vitals not available:', error)
        }
      }
    }

    // Load after a short delay to not impact initial render
    const timer = setTimeout(loadWebVitals, 1000)
    return () => clearTimeout(timer)
  }, [])

  return vitals
}
