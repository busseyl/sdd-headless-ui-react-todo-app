import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  isStorageAvailable,
} from '../storage'

// Simple storage tests that work with jsdom environment
describe('Storage Utilities - Basic Functionality', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
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

    it('should handle different data types correctly', () => {
      localStorage.setItem('string', JSON.stringify('hello'))
      expect(getStorageItem('string', '')).toBe('hello')

      localStorage.setItem('number', JSON.stringify(42))
      expect(getStorageItem('number', 0)).toBe(42)

      localStorage.setItem('boolean', JSON.stringify(true))
      expect(getStorageItem('boolean', false)).toBe(true)

      localStorage.setItem('array', JSON.stringify([1, 2, 3]))
      expect(getStorageItem('array', [])).toEqual([1, 2, 3])
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

      expect(JSON.parse(localStorage.getItem('string')!)).toBe('hello')
      expect(JSON.parse(localStorage.getItem('number')!)).toBe(42)
      expect(JSON.parse(localStorage.getItem('boolean')!)).toBe(true)
      expect(JSON.parse(localStorage.getItem('array')!)).toEqual([1, 2, 3])
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
  })

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true)
    })
  })
})
