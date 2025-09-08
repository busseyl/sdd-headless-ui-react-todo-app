import { toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
      toHaveKeyboardFocus(): R
      toBeAccessible(): R
      toHaveAriaLabel(label: string): R
      toHaveAriaDescribedBy(id: string): R
    }
  }
}

// Add axe-core matcher
expect.extend(toHaveNoViolations)

// Custom accessibility matchers
const toHaveKeyboardFocus = function (received: unknown) {
  const element = received as HTMLElement
  const pass = element === document.activeElement
  
  if (pass) {
    return {
      message: () => `Expected element not to have keyboard focus`,
      pass: true,
    }
  } else {
    return {
      message: () => `Expected element to have keyboard focus, but focus was on: ${document.activeElement?.tagName || 'null'}`,
      pass: false,
    }
  }
}

const toBeAccessible = function (received: unknown) {
  const element = received as HTMLElement
  // Basic accessibility checks
  const hasTabIndex = element.hasAttribute('tabindex')
  const hasRole = element.hasAttribute('role') || element.tagName.toLowerCase() in ['button', 'input', 'a', 'textarea', 'select']
  const hasAccessibleName = element.hasAttribute('aria-label') || 
                           element.hasAttribute('aria-labelledby') ||
                           element.textContent ||
                           element.hasAttribute('title')

  const isAccessible = (hasTabIndex && parseInt(element.getAttribute('tabindex') || '0') >= 0) || hasRole
  const hasGoodSemantics = hasAccessibleName

  const pass = isAccessible && hasGoodSemantics

  if (pass) {
    return {
      message: () => `Expected element not to be accessible`,
      pass: true,
    }
  } else {
    const issues: string[] = []
    if (!isAccessible) issues.push('not focusable or lacks proper role')
    if (!hasGoodSemantics) issues.push('lacks accessible name')
    
    return {
      message: () => `Expected element to be accessible, but: ${issues.join(', ')}`,
      pass: false,
    }
  }
}

const toHaveAriaLabel = function (received: unknown, ...args: unknown[]) {
  const element = received as HTMLElement
  const expectedLabel = args[0] as string
  const ariaLabel = element.getAttribute('aria-label')
  const pass = ariaLabel === expectedLabel

  if (pass) {
    return {
      message: () => `Expected element not to have aria-label "${expectedLabel}"`,
      pass: true,
    }
  } else {
    return {
      message: () => `Expected element to have aria-label "${expectedLabel}", but got: "${ariaLabel}"`,
      pass: false,
    }
  }
}

const toHaveAriaDescribedBy = function (received: unknown, ...args: unknown[]) {
  const element = received as HTMLElement
  const expectedId = args[0] as string
  const ariaDescribedBy = element.getAttribute('aria-describedby')
  const pass = ariaDescribedBy?.includes(expectedId) ?? false

  if (pass) {
    return {
      message: () => `Expected element not to have aria-describedby containing "${expectedId}"`,
      pass: true,
    }
  } else {
    return {
      message: () => `Expected element to have aria-describedby containing "${expectedId}", but got: "${ariaDescribedBy}"`,
      pass: false,
    }
  }
}

// Register custom matchers
expect.extend({
  toHaveKeyboardFocus,
  toBeAccessible,
  toHaveAriaLabel,
  toHaveAriaDescribedBy,
})
