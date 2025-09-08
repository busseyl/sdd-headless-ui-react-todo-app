# Testing Overview

This guide covers the comprehensive testing strategy for the Headless UI Todo App, including unit tests, integration tests, end-to-end tests, and accessibility testing.

## Testing Philosophy

Our testing approach follows the testing pyramid principle:

- **Unit Tests (70%)**: Test individual components and functions in isolation
- **Integration Tests (20%)**: Test component interactions and data flow
- **End-to-End Tests (10%)**: Test complete user workflows

## Testing Stack

| Technology | Purpose | Configuration |
|------------|---------|---------------|
| **Jest** | Unit & Integration Testing | `jest.config.ts` |
| **React Testing Library** | Component Testing | Built-in matchers |
| **Playwright** | End-to-End Testing | `playwright.config.ts` |
| **Vitest** | Alternative Test Runner | `vite.config.ts` |

## Test Structure

```
src/
├── components/
│   ├── TaskForm/
│   │   ├── TaskForm.tsx
│   │   └── TaskForm.test.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useTasks.test.ts
└── test/
    ├── setup.ts
    ├── utils/
    └── mocks/
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Watch Mode
```bash
npm run test:watch
```

## Test Categories

### Unit Tests

Test individual components and utility functions:

```typescript
// Example: TaskForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('should submit task with correct data', () => {
    const mockOnSubmit = jest.fn();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: 'New task' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      description: 'New task',
      priority: 'medium'
    });
  });
});
```

### Integration Tests

Test component interactions and context providers:

```typescript
// Example: TaskManagement.integration.test.tsx
import { render, screen } from '@testing-library/react';
import { TaskProvider } from '../contexts/TaskContext';
import { App } from '../App';

describe('Task Management Integration', () => {
  it('should add and display new task', async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );
    
    // Add task
    await userEvent.type(
      screen.getByLabelText(/new task/i), 
      'Integration test task'
    );
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    
    // Verify task appears
    expect(screen.getByText('Integration test task')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

Test complete user workflows using Playwright:

```typescript
// Example: task-management.spec.ts
import { test, expect } from '@playwright/test';

test('complete task workflow', async ({ page }) => {
  await page.goto('/');
  
  // Add new task
  await page.fill('[data-testid="task-input"]', 'E2E test task');
  await page.click('[data-testid="add-task-button"]');
  
  // Verify task appears
  await expect(page.locator('text=E2E test task')).toBeVisible();
  
  // Mark as completed
  await page.click('[data-testid="task-checkbox"]');
  await expect(page.locator('[data-testid="task-item"]')).toHaveClass(/completed/);
});
```

## Accessibility Testing

### Automated Testing

We use several tools for automated accessibility testing:

```typescript
// Example: accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Testing Checklist

- [ ] **Keyboard Navigation**: All interactive elements are reachable via keyboard
- [ ] **Screen Reader**: Content is properly announced
- [ ] **Focus Management**: Focus is managed correctly for dynamic content
- [ ] **Color Contrast**: All text meets WCAG contrast requirements
- [ ] **ARIA Labels**: All interactive elements have proper labels

## Performance Testing

### Core Web Vitals

We monitor these key metrics:

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Tests

```typescript
// Example: performance.test.ts
import { measurePerformance } from '../test/utils/performance';

describe('Performance', () => {
  it('should render task list within performance budget', async () => {
    const metrics = await measurePerformance(() => {
      render(<TaskList tasks={largeMockDataset} />);
    });
    
    expect(metrics.renderTime).toBeLessThan(16); // 60fps budget
  });
});
```

## Test Coverage

We maintain high test coverage standards:

- **Statements**: > 85%
- **Branches**: > 80%
- **Functions**: > 85%
- **Lines**: > 85%

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Continuous Integration

### GitHub Actions

Our CI pipeline runs all tests automatically:

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
```

## Test Data Management

### Mock Data

We use consistent mock data across tests:

```typescript
// test/mocks/tasks.ts
export const mockTasks = [
  {
    id: '1',
    description: 'Complete project documentation',
    completed: false,
    priority: 'high',
    createdAt: new Date('2024-01-01')
  },
  // ...more mock data
];
```

### Test Utilities

Common testing utilities are centralized:

```typescript
// test/utils/render.tsx
import { render } from '@testing-library/react';
import { TaskProvider } from '../../contexts/TaskContext';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <TaskProvider>
      {ui}
    </TaskProvider>
  );
};
```

## Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor` for async updates
2. **Timer Functions**: Mock timers with Jest
3. **Network Requests**: Mock with MSW (Mock Service Worker)
4. **Local Storage**: Clear between tests

### Debug Commands

```bash
# Run specific test file
npm test TaskForm.test.tsx

# Run tests in debug mode
npm test -- --debug

# Run with verbose output
npm test -- --verbose
```

## Best Practices

### Writing Tests

1. **Use descriptive test names** that explain the expected behavior
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Test behavior, not implementation** details
4. **Use data-testid** for reliable element selection
5. **Keep tests focused** on single behaviors

### Maintaining Tests

1. **Update tests** when changing component behavior
2. **Remove obsolete tests** when refactoring
3. **Keep mock data** up to date with real data structures
4. **Regular review** of test coverage and effectiveness

## Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
