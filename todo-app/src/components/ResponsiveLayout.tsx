import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640) // sm breakpoint
      setIsTablet(width >= 640 && width < 1024) // sm to lg breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const layoutClasses = `
    min-h-screen bg-gray-50
    ${isMobile ? 'px-2 py-4' : isTablet ? 'px-4 py-6' : 'px-4 py-8'}
    ${className}
  `.trim()

  const containerClasses = `
    container mx-auto max-w-6xl
    ${isMobile ? 'space-y-4' : isTablet ? 'space-y-6' : 'space-y-8'}
  `.trim()

  return (
    <div className={layoutClasses}>
      <div className={containerClasses} data-mobile={isMobile} data-tablet={isTablet}>
        {children}
      </div>
    </div>
  )
}

// Hook to get current screen size info
export function useResponsive() {
  const [screenInfo, setScreenInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenInfo({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height,
      })
    }

    updateScreenInfo()
    window.addEventListener('resize', updateScreenInfo)
    
    return () => window.removeEventListener('resize', updateScreenInfo)
  }, [])

  return screenInfo
}
