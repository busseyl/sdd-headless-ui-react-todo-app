import { useState, useEffect, useCallback, useRef } from 'react'
import { getStorageItem, setStorageItem, isStorageAvailable } from '@/utils/storage'

/**
 * Custom hook for localStorage with React state synchronization
 * Provides type-safe localStorage access with automatic serialization
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use a ref to track if we're in a browser environment
  const isBrowser = useRef(typeof window !== 'undefined')
  
  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser.current || !isStorageAvailable()) {
      return defaultValue
    }
    return getStorageItem(key, defaultValue)
  })

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function to match useState API
        const valueToStore = value instanceof Function ? value(storedValue) : value
        
        // Update React state
        setStoredValue(valueToStore)
        
        // Update localStorage if available
        if (isBrowser.current && isStorageAvailable()) {
          setStorageItem(key, valueToStore)
        }
      } catch (error) {
        console.warn(`Error in useLocalStorage setValue for key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Clear value from both state and localStorage
  const clearValue = useCallback(() => {
    setStoredValue(defaultValue)
    if (isBrowser.current && isStorageAvailable()) {
      try {
        window.localStorage.removeItem(key)
      } catch (error) {
        console.warn(`Error clearing localStorage key "${key}":`, error)
      }
    }
  }, [key, defaultValue])

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    if (!isBrowser.current || !isStorageAvailable()) {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error)
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was deleted
        setStoredValue(defaultValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, defaultValue])

  // Sync with localStorage on mount (in case it was updated outside React)
  useEffect(() => {
    if (!isBrowser.current || !isStorageAvailable()) {
      return
    }

    const currentValue = getStorageItem(key, defaultValue)
    if (JSON.stringify(currentValue) !== JSON.stringify(storedValue)) {
      setStoredValue(currentValue)
    }
  }, [key, defaultValue, storedValue])

  return [storedValue, setValue, clearValue]
}

/**
 * Hook for localStorage with additional utilities
 */
export function useLocalStorageWithUtils<T>(
  key: string,
  defaultValue: T
) {
  const [value, setValue, clearValue] = useLocalStorage(key, defaultValue)
  
  const isAvailable = isStorageAvailable()
  
  const refresh = useCallback(() => {
    if (isAvailable) {
      const currentValue = getStorageItem(key, defaultValue)
      setValue(currentValue)
    }
  }, [key, defaultValue, setValue, isAvailable])

  return {
    value,
    setValue,
    clearValue,
    refresh,
    isAvailable,
  }
}
