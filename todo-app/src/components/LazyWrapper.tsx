import React, { Suspense } from 'react'

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
}

export class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-4 text-red-600 dark:text-red-400">
          <p>Failed to load component. Please refresh the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  errorFallback
}) => (
  <LazyErrorBoundary fallback={errorFallback}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </LazyErrorBoundary>
)

// Hook to dynamically import components
export const useDynamicImport = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const [component, setComponent] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let isMounted = true

    const loadComponent = async () => {
      try {
        const { default: Component } = await importFunc()
        if (isMounted) {
          setComponent(() => Component)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Component loading failed'))
          setLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      isMounted = false
    }
  }, [importFunc])

  return { component, loading, error }
}
