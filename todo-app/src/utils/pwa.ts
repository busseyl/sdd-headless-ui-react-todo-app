import { Workbox } from 'workbox-window'

/**
 * Service Worker registration and management
 * Handles PWA installation, updates, and offline functionality
 */
export class PWAManager {
  private wb: Workbox | null = null
  private registrationPromise: Promise<ServiceWorkerRegistration | undefined> | null = null

  constructor() {
    if ('serviceWorker' in navigator) {
      this.wb = new Workbox('/sw.js')
      this.setupEventListeners()
    }
  }

  /**
   * Register the service worker
   */
  async register(): Promise<ServiceWorkerRegistration | undefined> {
    if (!this.wb) {
      console.warn('Service Worker not supported')
      return
    }

    if (this.registrationPromise) {
      return this.registrationPromise
    }

    this.registrationPromise = this.wb.register()
    
    try {
      const registration = await this.registrationPromise
      console.log('Service Worker registered successfully')
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return undefined
    }
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<void> {
    if (!this.wb) return

    try {
      await this.wb.update()
    } catch (error) {
      console.error('Failed to check for updates:', error)
    }
  }

  /**
   * Force reload to activate new service worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.wb) return

    try {
      await this.wb.messageSkipWaiting()
      window.location.reload()
    } catch (error) {
      console.error('Failed to skip waiting:', error)
    }
  }

  /**
   * Setup event listeners for service worker events
   */
  private setupEventListeners(): void {
    if (!this.wb) return

    // Service worker is installed for the first time
    this.wb.addEventListener('installed', (event) => {
      console.log('Service Worker installed:', event)
      this.showInstallNotification()
    })

    // Service worker is waiting to activate (update available)
    this.wb.addEventListener('waiting', (event) => {
      console.log('Service Worker waiting (update available):', event)
      this.showUpdateNotification()
    })

    // Service worker has been activated (after update)
    this.wb.addEventListener('controlling', (event) => {
      console.log('Service Worker controlling:', event)
      window.location.reload()
    })
  }

  /**
   * Show notification that app is ready for offline use
   */
  private showInstallNotification(): void {
    // Create a simple notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50'
    notification.textContent = 'App is ready for offline use!'
    notification.style.animation = 'slideIn 0.3s ease-out'
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 4000)
  }

  /**
   * Show notification that an update is available
   */
  private showUpdateNotification(): void {
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2'
    
    notification.innerHTML = `
      <span>App update available!</span>
      <button 
        class="bg-white text-blue-500 px-2 py-1 rounded text-sm font-medium hover:bg-gray-100"
        onclick="window.pwaManager?.skipWaiting()"
      >
        Update
      </button>
      <button 
        class="bg-transparent text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
        onclick="this.parentElement.remove()"
      >
        ×
      </button>
    `
    
    document.body.appendChild(notification)
  }

  /**
   * Check if app can be installed as PWA
   */
  canInstall(): boolean {
    return 'beforeinstallprompt' in window
  }

  /**
   * Get installation status
   */
  isInstalled(): boolean {
    return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
  }
}

// Global instance
declare global {
  interface Window {
    pwaManager: PWAManager
  }
}

// Create and export singleton instance
export const pwaManager = new PWAManager()

// Make available globally for button handlers
if (typeof window !== 'undefined') {
  window.pwaManager = pwaManager
}
