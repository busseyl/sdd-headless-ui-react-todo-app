import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  isStorageAvailable,
  getStorageInfo,
} from '../storage'

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear console warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getStorageItem', () => {
    it('should return default value when key does not exist', () => {
      const result = getStorageItem('nonexistent', 'default')
      expect(result).toBe('default')
    })

    it('should return parsed value when key exists', () => {
      localStorage.setItem('test', JSON.stringify({ foo: 'bar' }))
      const result = getStorageItem('test', {})
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should return default value when JSON parsing fails', () => {
      localStorage.setItem('invalid', 'invalid json')
      const result = getStorageItem('invalid', 'default')
      expect(result).toBe('default')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Error reading localStorage key "invalid"'),
        expect.any(Error)
      )
    })

    it('should handle different data types correctly', () => {
      // String
      localStorage.setItem('string', JSON.stringify('hello'))
      expect(getStorageItem('string', '')).toBe('hello')

      // Number
      localStorage.setItem('number', JSON.stringify(42))
      expect(getStorageItem('number', 0)).toBe(42)

      // Boolean
      localStorage.setItem('boolean', JSON.stringify(true))
      expect(getStorageItem('boolean', false)).toBe(true)

      // Array
      localStorage.setItem('array', JSON.stringify([1, 2, 3]))
      expect(getStorageItem('array', [])).toEqual([1, 2, 3])

      // Object
      localStorage.setItem('object', JSON.stringify({ a: 1, b: 2 }))
      expect(getStorageItem('object', {})).toEqual({ a: 1, b: 2 })
    })

    it('should return default value in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = getStorageItem('test', 'default')
      expect(result).toBe('default')

      global.window = originalWindow
    })
  })

  describe('setStorageItem', () => {
    it('should store values correctly and return true', () => {
      const result = setStorageItem('test', { foo: 'bar' })
      expect(result).toBe(true)
      expect(localStorage.getItem('test')).toBe('{"foo":"bar"}')
    })

    it('should handle different data types', () => {
      expect(setStorageItem('string', 'hello')).toBe(true)
      expect(setStorageItem('number', 42)).toBe(true)
      expect(setStorageItem('boolean', true)).toBe(true)
      expect(setStorageItem('array', [1, 2, 3])).toBe(true)
      expect(setStorageItem('object', { a: 1 })).toBe(true)

      expect(JSON.parse(localStorage.getItem('string')!)).toBe('hello')
      expect(JSON.parse(localStorage.getItem('number')!)).toBe(42)
      expect(JSON.parse(localStorage.getItem('boolean')!)).toBe(true)
      expect(JSON.parse(localStorage.getItem('array')!)).toEqual([1, 2, 3])
      expect(JSON.parse(localStorage.getItem('object')!)).toEqual({ a: 1 })
    })

    it('should return false in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = setStorageItem('test', 'value')
      expect(result).toBe(false)

      global.window = originalWindow
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
      mockSetItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const result = setStorageItem('test', 'value')
      expect(result).toBe(false)
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Error setting localStorage key "test"'),
        expect.any(Error)
      )

      mockSetItem.mockRestore()
    })
  })

  describe('removeStorageItem', () => {
    it('should remove existing items and return true', () => {
      localStorage.setItem('test', 'value')
      expect(localStorage.getItem('test')).toBe('value')

      const result = removeStorageItem('test')
      expect(result).toBe(true)
      expect(localStorage.getItem('test')).toBeNull()
    })

    it('should return true even when item does not exist', () => {
      const result = removeStorageItem('nonexistent')
      expect(result).toBe(true)
    })

    it('should return false in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = removeStorageItem('test')
      expect(result).toBe(false)

      global.window = originalWindow
    })

    it('should handle localStorage errors gracefully', () => {
      const mockRemoveItem = jest.spyOn(Storage.prototype, 'removeItem')
      mockRemoveItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const result = removeStorageItem('test')
      expect(result).toBe(false)
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Error removing localStorage key "test"'),
        expect.any(Error)
      )

      mockRemoveItem.mockRestore()
    })
  })

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true)
    })

    it('should return false in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(isStorageAvailable()).toBe(false)

      global.window = originalWindow
    })

    it('should return false when localStorage throws errors', () => {
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
      mockSetItem.mockImplementation(() => {
        throw new Error('Storage not available')
      })

      expect(isStorageAvailable()).toBe(false)

      mockSetItem.mockRestore()
    })
  })

  describe('getStorageInfo', () => {
    it('should return correct info when storage is available', () => {
      // Add some data to localStorage
      localStorage.setItem('test1', 'value1')
      localStorage.setItem('test2', 'value2')

      const info = getStorageInfo()
      
      expect(info.isAvailable).toBe(true)
      expect(info.used).toBeGreaterThan(0)
      expect(info.quota).toBe(5 * 1024 * 1024) // 5MB
      expect(info.percentage).toBeGreaterThan(0)
      expect(info.percentage).toBeLessThanOrEqual(100)
    })

    it('should return unavailable info in server environment', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const info = getStorageInfo()
      
      expect(info.isAvailable).toBe(false)
      expect(info.used).toBe(0)
      expect(info.quota).toBe(0)
      expect(info.percentage).toBe(0)

      global.window = originalWindow
    })

    it('should handle errors gracefully', () => {
      // Mock isStorageAvailable to return true but localStorage to throw
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const info = getStorageInfo()
      
      expect(info.isAvailable).toBe(true)
      expect(info.used).toBe(0)
      expect(info.quota).toBe(0)
      expect(info.percentage).toBe(0)
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Error calculating storage info'),
        expect.any(Error)
      )
    })

    it('should calculate percentage correctly', () => {
      // Clear storage first
      localStorage.clear()
      
      // Add a known amount of data
      const testData = 'x'.repeat(1000) // 1KB of data
      localStorage.setItem('test', testData)

      const info = getStorageInfo()
      const expectedUsed = testData.length + 'test'.length
      const expectedPercentage = (expectedUsed / (5 * 1024 * 1024)) * 100

      expect(info.used).toBe(expectedUsed)
      expect(info.percentage).toBeCloseTo(expectedPercentage, 2)
    })
  })
})
