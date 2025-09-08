# Accessibility Guide

Comprehensive guide to accessibility features and compliance in the Todo App.

## ♿ Accessibility Overview

The Todo App is designed with accessibility as a core principle, ensuring usability for all users regardless of their abilities or assistive technologies used.

### Compliance Standards

- **WCAG 2.1 AA**: Full compliance with Web Content Accessibility Guidelines
- **Section 508**: US federal accessibility requirements
- **ADA**: Americans with Disabilities Act compliance
- **EN 301 549**: European accessibility standard

## 🎯 Core Accessibility Features

### Keyboard Navigation

**Complete Keyboard Accessibility:**
- All interactive elements accessible via keyboard
- Logical tab order throughout the application
- Skip links for main content areas
- Focus indicators clearly visible

**Keyboard Shortcuts:**
```
Ctrl/Cmd + N     - Add new task
Ctrl/Cmd + F     - Focus search
Tab              - Navigate forward
Shift + Tab      - Navigate backward
Enter            - Activate focused element
Space            - Toggle checkboxes
Escape           - Cancel/close dialogs
Arrow Keys       - Navigate within components
```

### Screen Reader Support

**Semantic HTML Structure:**
- Proper heading hierarchy (h1, h2, h3)
- Landmark regions (main, nav, aside)
- List structures for task collections
- Form labels and descriptions

**ARIA Implementation:**
```typescript
// Example: Task list with proper ARIA
<main role="main" aria-label="Task Management">
  <h1>My Tasks</h1>
  <section aria-label="Task filters">
    <label htmlFor="category-filter">
      Filter by category
    </label>
    <select 
      id="category-filter"
      aria-describedby="filter-help"
    >
      {/* options */}
    </select>
    <div id="filter-help" className="sr-only">
      Choose a category to filter tasks
    </div>
  </section>
  
  <ul 
    role="list" 
    aria-label="Task list"
    aria-live="polite"
    aria-relevant="additions removals"
  >
    {tasks.map(task => (
      <TaskItem 
        key={task.id} 
        task={task}
        aria-label={`Task: ${task.title}`}
      />
    ))}
  </ul>
</main>
```

### Visual Accessibility

**Color and Contrast:**
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Color never used as the sole means of conveying information
- High contrast mode support

**Typography:**
- Scalable fonts supporting zoom up to 200%
- Clear font choices (Inter font family)
- Adequate line spacing and letter spacing
- Responsive text sizing

**Visual Indicators:**
- Clear focus indicators (2px blue outline)
- Error states with multiple indicators (color + icon + text)
- Loading states with appropriate feedback
- Status changes announced to screen readers

## 🧪 Testing Accessibility

### Automated Testing

**axe-core Integration:**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('TaskList has no accessibility violations', async () => {
  const { container } = render(<TaskList tasks={mockTasks} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**ESLint jsx-a11y Rules:**
```javascript
// eslint.config.js
{
  extends: ['plugin:jsx-a11y/recommended'],
  rules: {
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
  }
}
```

### Manual Testing Checklist

**Keyboard Testing:**
- [ ] Tab through entire interface
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] Keyboard shortcuts work
- [ ] No keyboard traps

**Screen Reader Testing:**
- [ ] Content read in logical order
- [ ] Headings properly structured
- [ ] Form labels announced
- [ ] Status updates announced
- [ ] Error messages clear

**Visual Testing:**
- [ ] Text scalable to 200%
- [ ] Contrast ratios meet requirements
- [ ] Content visible in high contrast mode
- [ ] No reliance on color alone

### E2E Accessibility Tests

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility E2E', () => {
  test('has no accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Test tab order
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'add-task-button');

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'search-input');

    // Test keyboard shortcuts
    await page.keyboard.press('Control+KeyN');
    await expect(page.locator('[data-testid="task-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="task-title"]')).toBeFocused();
  });

  test('screen reader announcements', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Create task and verify announcement
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="task-title"]', 'Test Task');
    await page.click('[data-testid="save-task"]');

    // Check aria-live region
    const announcement = await page.locator('[aria-live="polite"]').textContent();
    expect(announcement).toContain('Task created');
  });
});
```

## 🎨 Accessible Component Patterns

### Form Components

```typescript
interface AccessibleFormProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const AccessibleInput: React.FC<AccessibleFormProps> = ({
  label,
  error,
  helperText,
  required,
  ...props
}) => {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <input
        id={id}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ')}
        aria-invalid={error ? 'true' : 'false'}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />
      
      {helperText && (
        <div id={helperId} className="text-sm text-gray-600">
          {helperText}
        </div>
      )}
      
      {error && (
        <div 
          id={errorId} 
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};
```

### Modal Components

```typescript
const AccessibleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const titleId = useId();
  
  useEffect(() => {
    if (isOpen) {
      // Focus trap implementation
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h2 id={titleId} className="text-lg font-semibold mb-4">
              {title}
            </h2>
            
            {children}
            
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Button Components

```typescript
interface AccessibleButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  children,
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
      disabled={isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            opacity="0.75"
          />
        </svg>
      )}
      
      <span className={isLoading ? 'sr-only' : ''}>
        {children}
      </span>
      
      {isLoading && (
        <span aria-live="polite">
          {loadingText}
        </span>
      )}
    </button>
  );
};
```

## 🌐 Internationalization Support

### Screen Reader Text

```typescript
// Utility for screen reader only text
const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">
    {children}
  </span>
);

// Usage in components
<button>
  <TrashIcon className="w-4 h-4" aria-hidden="true" />
  <ScreenReaderOnly>Delete task</ScreenReaderOnly>
</button>
```

### Live Regions

```typescript
const LiveRegion: React.FC<{
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
}> = ({ message, politeness = 'polite' }) => (
  <div
    aria-live={politeness}
    aria-relevant="additions"
    className="sr-only"
  >
    {message}
  </div>
);

// Usage for status updates
const [announcement, setAnnouncement] = useState('');

const handleTaskComplete = (taskId: string) => {
  // Update task
  toggleTask(taskId);
  // Announce to screen readers
  setAnnouncement('Task marked as complete');
};
```

## 📱 Mobile Accessibility

### Touch Targets

- Minimum 44px × 44px touch targets
- Adequate spacing between interactive elements
- Touch-friendly hover states

### Mobile Screen Readers

- VoiceOver (iOS) support
- TalkBack (Android) support
- Proper swipe gesture support

### Responsive Focus Management

```typescript
const useFocusManagement = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const focusElement = (element: HTMLElement) => {
    if (!isMobile) {
      element.focus();
    }
    // On mobile, screen readers handle focus differently
  };

  return { isMobile, focusElement };
};
```

## 🎨 High Contrast and Dark Mode

### CSS Custom Properties

```css
:root {
  --color-text: #1f2937;
  --color-background: #ffffff;
  --color-border: #d1d5db;
  --color-focus: #2563eb;
}

.dark {
  --color-text: #f9fafb;
  --color-background: #1f2937;
  --color-border: #374151;
  --color-focus: #60a5fa;
}

@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
    --color-background: #ffffff;
    --color-border: #000000;
  }
}
```

### Component Implementation

```typescript
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const updateTheme = () => {
      if (contrastQuery.matches) {
        setTheme('high-contrast');
      } else if (mediaQuery.matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    contrastQuery.addEventListener('change', updateTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
      contrastQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  return { theme };
};
```

## 🛠️ Development Tools

### Browser Extensions

- **axe DevTools**: Real-time accessibility scanning
- **WAVE**: Visual accessibility evaluation
- **Lighthouse**: Accessibility auditing
- **Color Oracle**: Color blindness simulation

### Screen Reader Testing

**Desktop:**
- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS, built-in)

**Mobile:**
- **VoiceOver** (iOS)
- **TalkBack** (Android)

### Testing Commands

```bash
# Run accessibility linting
npm run lint:a11y

# Run axe-core tests
npm run test:a11y

# Generate accessibility report
npm run test:coverage -- --testNamePattern="accessibility"
```

## 📋 Accessibility Checklist

### Design Phase

- [ ] Color contrast ratios verified
- [ ] Focus indicators designed
- [ ] Touch targets sized appropriately
- [ ] Text scalability considered
- [ ] Alternative text planned for images

### Development Phase

- [ ] Semantic HTML structure
- [ ] ARIA labels and descriptions
- [ ] Keyboard navigation implemented
- [ ] Focus management working
- [ ] Form validation accessible

### Testing Phase

- [ ] Automated tests passing
- [ ] Keyboard testing completed
- [ ] Screen reader testing done
- [ ] Mobile accessibility verified
- [ ] High contrast mode tested

### Deployment Phase

- [ ] Accessibility statement created
- [ ] User feedback mechanism available
- [ ] Monitoring tools configured
- [ ] Training materials prepared

---

For more information on component-specific accessibility features, see the [Component API Documentation](./COMPONENTS.md) and [Testing Guide](./TESTING.md).
