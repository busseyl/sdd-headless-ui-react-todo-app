import { renderHook, act } from '@testing-library/react'
import { useLocalStorage, useLocalStorageWithUtils } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('useLocalStorage', () => {
    it('should return default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      expect(result.current[0]).toBe('default')
    })

    it('should return stored value when localStorage contains data', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'))
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      expect(result.current[0]).toBe('stored-value')
    })

    it('should update both state and localStorage when setValue is called', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      act(() => {
        result.current[1]('new-value')
      })
      
      expect(result.current[0]).toBe('new-value')
      expect(localStorage.getItem('test-key')).toBe('"new-value"')
    })

    it('should handle functional updates', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 10))
      
      act(() => {
        result.current[1](prev => prev + 5)
      })
      
      expect(result.current[0]).toBe(15)
      expect(localStorage.getItem('test-key')).toBe('15')
    })

    it('should work with complex objects', () => {
      const defaultValue = { count: 0, items: [] as string[] }
      const { result } = renderHook(() => useLocalStorage('test-key', defaultValue))
      
      const newValue = { count: 5, items: ['a', 'b'] }
      
      act(() => {
        result.current[1](newValue)
      })
      
      expect(result.current[0]).toEqual(newValue)
      expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(newValue)
    })

    it('should clear value and reset to default', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'))
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      expect(result.current[0]).toBe('stored-value')
      
      act(() => {
        result.current[2]() // clearValue
      })
      
      expect(result.current[0]).toBe('default')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Mock localStorage.setItem to throw an error
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
      mockSetItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      act(() => {
        result.current[1]('new-value')
      })
      
      // State should still update even if localStorage fails
      expect(result.current[0]).toBe('new-value')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in useLocalStorage setValue'),
        expect.any(Error)
      )
      
      mockSetItem.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should sync with localStorage changes from other tabs', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      // Simulate storage event from another tab
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('value-from-other-tab'),
        oldValue: JSON.stringify('default'),
      })
      
      act(() => {
        window.dispatchEvent(storageEvent)
      })
      
      expect(result.current[0]).toBe('value-from-other-tab')
    })

    it('should handle storage deletion events', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      // Set initial value
      act(() => {
        result.current[1]('stored-value')
      })
      
      expect(result.current[0]).toBe('stored-value')
      
      // Simulate deletion from another tab
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: null,
        oldValue: JSON.stringify('stored-value'),
      })
      
      act(() => {
        window.dispatchEvent(storageEvent)
      })
      
      expect(result.current[0]).toBe('default')
    })

    it('should ignore storage events for other keys', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      const initialValue = result.current[0]
      
      // Simulate storage event for different key
      const storageEvent = new StorageEvent('storage', {
        key: 'other-key',
        newValue: JSON.stringify('other-value'),
      })
      
      act(() => {
        window.dispatchEvent(storageEvent)
      })
      
      // Value should remain unchanged
      expect(result.current[0]).toBe(initialValue)
    })

    it('should handle malformed JSON in storage events', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      
      renderHook(() => useLocalStorage('test-key', 'default'))
      
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: 'invalid json',
      })
      
      act(() => {
        window.dispatchEvent(storageEvent)
      })
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error parsing storage event'),
        expect.any(Error)
      )
      
      consoleSpy.mockRestore()
    })

    it('should work in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
      
      expect(result.current[0]).toBe('default')
      
      // setValue should not throw in server environment
      act(() => {
        result.current[1]('new-value')
      })
      
      expect(result.current[0]).toBe('new-value')
      
      global.window = originalWindow
    })
  })

  describe('useLocalStorageWithUtils', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should provide all basic functionality', () => {
      const { result } = renderHook(() => 
        useLocalStorageWithUtils('test-key', 'default')
      )
      
      expect(result.current.value).toBe('default')
      expect(typeof result.current.setValue).toBe('function')
      expect(typeof result.current.clearValue).toBe('function')
      expect(typeof result.current.refresh).toBe('function')
      expect(typeof result.current.isAvailable).toBe('boolean')
    })

    it('should indicate storage availability', () => {
      const { result } = renderHook(() => 
        useLocalStorageWithUtils('test-key', 'default')
      )
      
      expect(result.current.isAvailable).toBe(true)
    })

    it('should refresh value from localStorage', () => {
      // Set value directly in localStorage
      localStorage.setItem('test-key', JSON.stringify('direct-value'))
      
      const { result } = renderHook(() => 
        useLocalStorageWithUtils('test-key', 'default')
      )
      
      expect(result.current.value).toBe('direct-value')
      
      // Change localStorage directly
      localStorage.setItem('test-key', JSON.stringify('updated-value'))
      
      act(() => {
        result.current.refresh()
      })
      
      expect(result.current.value).toBe('updated-value')
    })

    it('should handle all operations correctly', () => {
      const { result } = renderHook(() => 
        useLocalStorageWithUtils('test-key', 'default')
      )
      
      // Set value
      act(() => {
        result.current.setValue('new-value')
      })
      
      expect(result.current.value).toBe('new-value')
      expect(localStorage.getItem('test-key')).toBe('"new-value"')
      
      // Clear value
      act(() => {
        result.current.clearValue()
      })
      
      expect(result.current.value).toBe('default')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should work when storage is not available', () => {
      // Mock isStorageAvailable to return false
      jest.doMock('@/utils/storage', () => ({
        ...jest.requireActual('@/utils/storage'),
        isStorageAvailable: () => false,
      }))
      
      const { result } = renderHook(() => 
        useLocalStorageWithUtils('test-key', 'default')
      )
      
      expect(result.current.isAvailable).toBe(false)
      expect(result.current.value).toBe('default')
      
      // Operations should still work
      act(() => {
        result.current.setValue('new-value')
      })
      
      expect(result.current.value).toBe('new-value')
    })
  })
})
