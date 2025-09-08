import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

// Basic tests for useLocalStorage hook
describe('useLocalStorage Hook - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('default')
    expect(typeof result.current[1]).toBe('function')
    expect(typeof result.current[2]).toBe('function')
  })

  it('should update value and persist to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe('"new-value"')
  })

  it('should restore value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('stored-value')
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
})
