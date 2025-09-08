# Testing Guide

Comprehensive testing guide for the Todo App covering unit tests, integration tests, and end-to-end testing.

## 🧪 Testing Philosophy

Our testing strategy follows the testing pyramid:

1. **Unit Tests (70%)**: Fast, isolated tests for individual functions and components
2. **Integration Tests (20%)**: Tests for component interactions and data flow
3. **E2E Tests (10%)**: Complete user workflow validation

## 🛠️ Testing Stack

### Core Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing framework
- **@testing-library/jest-dom**: Extended Jest matchers
- **@axe-core/react**: Accessibility testing

### Configuration Files

- `jest.config.ts`: Jest configuration with TypeScript support
- `playwright.config.ts`: Playwright configuration for E2E tests
- `src/test/setup.ts`: Global test setup and mocks

## 📝 Writing Unit Tests

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '../TaskItem';
import { mockTask } from '../../test/mocks';

describe('TaskItem', () => {
  const defaultProps = {
    task: mockTask,
    onToggleComplete: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task title and description', () => {
    render(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });

  test('calls onToggleComplete when checkbox is clicked', () => {
    render(<TaskItem {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(defaultProps.onToggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  test('shows completion status correctly', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem {...defaultProps} task={completedTask} />);
    
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );
    
    expect(result.current[0]).toBe('initial');
  });

  test('updates localStorage when value changes', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(localStorage.getItem('test-key')).toBe(
      JSON.stringify('updated')
    );
  });
});
```

### Utility Function Testing

```typescript
import { validateTask, formatTaskDate } from '../taskUtils';
import { TaskCategory } from '../../types';

describe('taskUtils', () => {
  describe('validateTask', () => {
    test('returns true for valid task', () => {
      const validTask = {
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.PERSONAL,
        priority: 'medium' as const,
        dueDate: new Date().toISOString(),
      };
      
      expect(validateTask(validTask)).toBe(true);
    });

    test('returns false for task without title', () => {
      const invalidTask = {
        title: '',
        description: 'Test Description',
        category: TaskCategory.PERSONAL,
      };
      
      expect(validateTask(invalidTask)).toBe(false);
    });
  });

  describe('formatTaskDate', () => {
    test('formats date correctly', () => {
      const date = '2024-01-15T10:30:00.000Z';
      const formatted = formatTaskDate(date);
      
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    test('handles invalid date', () => {
      expect(formatTaskDate('invalid')).toBe('Invalid date');
    });
  });
});
```

## 🔗 Integration Testing

### Context Integration

```typescript
import { render, screen } from '@testing-library/react';
import { TaskProvider } from '../contexts/TaskContext';
import { TaskList } from '../components/TaskList';

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <TaskProvider>
      {component}
    </TaskProvider>
  );
};

describe('TaskList Integration', () => {
  test('displays tasks from context', () => {
    renderWithContext(<TaskList />);
    
    // Test that tasks from context are displayed
    expect(screen.getByText('Sample Task')).toBeInTheDocument();
  });

  test('updates context when task is completed', async () => {
    renderWithContext(<TaskList />);
    
    const checkbox = screen.getByRole('checkbox', { name: /sample task/i });
    fireEvent.click(checkbox);
    
    // Verify context update
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });
});
```

### Storage Integration

```typescript
import { renderHook } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../contexts/TaskContext';

describe('Task Storage Integration', () => {
  test('persists tasks to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskProvider>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.PERSONAL,
        priority: 'medium',
      });
    });

    const stored = localStorage.getItem('tasks');
    expect(stored).toContain('Test Task');
  });
});
```

## 🎭 End-to-End Testing

### Basic User Flows

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo App E2E', () => {
  test('creates and manages tasks', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Create new task
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="task-title"]', 'E2E Test Task');
    await page.fill('[data-testid="task-description"]', 'Test Description');
    await page.selectOption('[data-testid="task-category"]', 'PERSONAL');
    await page.click('[data-testid="save-task"]');

    // Verify task appears in list
    await expect(page.locator('text=E2E Test Task')).toBeVisible();

    // Complete task
    await page.click('[data-testid="task-checkbox"]');
    await expect(page.locator('[data-testid="task-checkbox"]')).toBeChecked();

    // Delete task
    await page.click('[data-testid="delete-task"]');
    await expect(page.locator('text=E2E Test Task')).not.toBeVisible();
  });

  test('filters tasks by category', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Add tasks with different categories
    await addTask(page, 'Work Task', 'WORK');
    await addTask(page, 'Personal Task', 'PERSONAL');

    // Filter by work category
    await page.selectOption('[data-testid="category-filter"]', 'WORK');
    
    await expect(page.locator('text=Work Task')).toBeVisible();
    await expect(page.locator('text=Personal Task')).not.toBeVisible();
  });
});
```

### Accessibility Testing

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab through interface
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="add-task-button"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused();

    // Test keyboard shortcuts
    await page.keyboard.press('Control+KeyN');
    await expect(page.locator('[data-testid="task-form"]')).toBeVisible();
  });
});
```

### PWA Testing

```typescript
test.describe('PWA Features', () => {
  test('works offline', async ({ page, context }) => {
    await page.goto('http://localhost:5173');

    // Go offline
    await context.setOffline(true);

    // Verify app still works
    await page.click('[data-testid="add-task-button"]');
    await expect(page.locator('[data-testid="task-form"]')).toBeVisible();

    // Verify service worker is active
    const serviceWorker = await page.evaluate(() => 
      navigator.serviceWorker.controller?.state
    );
    expect(serviceWorker).toBe('activated');
  });

  test('shows install prompt', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Trigger install prompt
    await page.evaluate(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'));
    });

    await expect(page.locator('[data-testid="install-prompt"]')).toBeVisible();
  });
});
```

## 📊 Test Data Management

### Mock Data

```typescript
// src/test/mocks/taskMocks.ts
import { Task, TaskCategory } from '../../types';

export const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  category: TaskCategory.PERSONAL,
  priority: 'medium',
  createdAt: new Date('2024-01-01').toISOString(),
  dueDate: new Date('2024-01-15').toISOString(),
};

export const mockTasks: Task[] = [
  mockTask,
  {
    id: '2',
    title: 'Work Task',
    description: 'Important work task',
    completed: true,
    category: TaskCategory.WORK,
    priority: 'high',
    createdAt: new Date('2024-01-02').toISOString(),
  },
];
```

### Test Utilities

```typescript
// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { TaskProvider } from '../contexts/TaskContext';
import { ThemeProvider } from '../contexts/ThemeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 🎯 Testing Best Practices

### Test Organization

```typescript
describe('Component/Feature Name', () => {
  // Group related tests
  describe('rendering', () => {
    test('renders with default props', () => {});
    test('renders with custom props', () => {});
  });

  describe('user interactions', () => {
    test('handles click events', () => {});
    test('handles keyboard events', () => {});
  });

  describe('edge cases', () => {
    test('handles empty data', () => {});
    test('handles error states', () => {});
  });
});
```

### Assertions

```typescript
// Good: Specific assertions
expect(screen.getByRole('button', { name: 'Save Task' })).toBeInTheDocument();

// Good: Accessibility-focused queries
expect(screen.getByLabelText('Task title')).toHaveValue('Test Task');

// Good: User-centric assertions
expect(screen.getByText('Task created successfully')).toBeVisible();

// Avoid: Implementation details
// expect(wrapper.find('.task-item')).toHaveLength(1);
```

### Async Testing

```typescript
import { waitFor, screen } from '@testing-library/react';

test('loads data asynchronously', async () => {
  render(<TaskList />);

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  expect(screen.getByText('Task List')).toBeInTheDocument();
});
```

## 📈 Coverage and Quality

### Coverage Requirements

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### Quality Metrics

```typescript
// jest.config.ts
module.exports = {
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

## 🔧 Debugging Tests

### Debug Strategies

```typescript
import { screen, prettyDOM } from '@testing-library/react';

test('debug failing test', () => {
  render(<Component />);

  // Debug: Print DOM
  console.log(prettyDOM());

  // Debug: List available roles
  screen.logTestingPlaygroundURL();

  // Debug: Check what's actually rendered
  screen.debug();
});
```

### Common Issues

1. **Element not found**: Use more specific queries
2. **Async timing**: Add proper waits with `waitFor`
3. **Context missing**: Wrap with proper providers
4. **Mocks not working**: Check mock setup in `beforeEach`

## 🚀 Continuous Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

For more advanced testing patterns and examples, see the [Component API Documentation](./COMPONENTS.md) and [Accessibility Guide](./ACCESSIBILITY.md).
