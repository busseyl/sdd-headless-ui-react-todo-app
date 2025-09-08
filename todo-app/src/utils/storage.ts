/**
 * localStorage utilities with error handling and type safety
 */

/**
 * Get an item from localStorage with type safety
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist or parsing fails
 * @returns Parsed value or default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    const item = window.localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }

    return JSON.parse(item) as T
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Set an item in localStorage with error handling
 * @param key - The localStorage key
 * @param value - Value to store
 * @returns true if successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Remove an item from localStorage
 * @param key - The localStorage key to remove
 * @returns true if successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Check if localStorage is available
 * @returns true if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, 'test')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage information
 * @returns Storage usage information
 */
export function getStorageInfo() {
  if (!isStorageAvailable()) {
    return {
      isAvailable: false,
      used: 0,
      quota: 0,
      percentage: 0,
    }
  }

  try {
    // Calculate approximate storage usage
    let used = 0
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Most browsers have a 5-10MB limit for localStorage
    const estimatedQuota = 5 * 1024 * 1024 // 5MB in bytes
    const percentage = (used / estimatedQuota) * 100

    return {
      isAvailable: true,
      used,
      quota: estimatedQuota,
      percentage: Math.min(percentage, 100),
    }
  } catch (error) {
    console.warn('Error calculating storage info:', error)
    return {
      isAvailable: true,
      used: 0,
      quota: 0,
      percentage: 0,
    }
  }
}
