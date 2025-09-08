# Component API Documentation

This document provides detailed API documentation for all React components in the Todo App.

## 📋 Task Components

### TaskList

The main component for displaying and managing tasks.

```typescript
interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  isLoading?: boolean;
}
```

**Features:**
- Virtualized rendering for performance with large lists
- Keyboard navigation support
- Accessibility compliance with ARIA labels
- Loading states and error handling

**Usage:**
```tsx
<TaskList
  tasks={tasks}
  onToggleComplete={handleToggleComplete}
  onDeleteTask={handleDeleteTask}
  onEditTask={handleEditTask}
  isLoading={isLoading}
/>
```

### TaskForm

Form component for creating and editing tasks.

```typescript
interface TaskFormProps {
  task?: Task;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**Features:**
- Form validation with error messages
- Date picker for due dates
- Category and priority selection
- Auto-save functionality

**Usage:**
```tsx
<TaskForm
  task={editingTask}
  onSave={handleSaveTask}
  onCancel={handleCancelEdit}
  isLoading={isSaving}
/>
```

### TaskItem

Individual task display component.

```typescript
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isSelected?: boolean;
  tabIndex?: number;
}
```

**Features:**
- Checkbox for completion toggle
- Edit and delete actions
- Keyboard interaction support
- Priority and category indicators

## 🎨 UI Components

### Button

Accessible button component with multiple variants.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
}
```

**Usage:**
```tsx
<Button
  variant="primary"
  size="md"
  onClick={handleClick}
  aria-label="Save task"
>
  Save Task
</Button>
```

### Modal

Accessible modal dialog component.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Features:**
- Focus trap management
- Escape key handling
- Backdrop click to close
- ARIA compliance

### Select

Accessible dropdown select component.

```typescript
interface SelectProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
}
```

## 🎨 Layout Components

### AppLayout

Main application layout wrapper.

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}
```

**Features:**
- Responsive layout
- Skip links for accessibility
- Theme provider integration

### Header

Application header with navigation and actions.

```typescript
interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  showThemeToggle?: boolean;
}
```

## 🔌 Lazy Components

### LazyTaskForm

Lazy-loaded version of TaskForm with skeleton loading.

```typescript
const LazyTaskForm = React.lazy(() => import('./TaskForm'));
```

**Usage:**
```tsx
<Suspense fallback={<TaskFormSkeleton />}>
  <LazyTaskForm {...props} />
</Suspense>
```

### LazyKeyboardShortcuts

Lazy-loaded keyboard shortcuts help modal.

```typescript
const LazyKeyboardShortcuts = React.lazy(() => 
  import('./KeyboardShortcuts')
);
```

## 📱 PWA Components

### PWAInstallPrompt

Component for PWA installation prompts.

```typescript
interface PWAInstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}
```

### PWAUpdatePrompt

Component for PWA update notifications.

```typescript
interface PWAUpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}
```

## 🎯 Filtering Components

### FilterBar

Component for task filtering and sorting.

```typescript
interface FilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

**Features:**
- Category filtering
- Priority filtering
- Status filtering
- Search functionality
- Sort options

## 🔧 Utility Components

### PerformanceMonitor

Development-only component for performance monitoring.

```typescript
interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
```

### ErrorBoundary

Error boundary component with fallback UI.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

## 🎨 Styling Guidelines

### CSS Classes

All components use Tailwind CSS classes with consistent patterns:

- **Spacing**: `p-4`, `m-2`, `space-y-4`
- **Colors**: `bg-blue-600`, `text-gray-900`, `border-gray-300`
- **Interactive**: `hover:bg-blue-700`, `focus:ring-2`, `focus:ring-blue-500`
- **Responsive**: `sm:text-lg`, `md:p-6`, `lg:grid-cols-3`

### Theme Support

Components support both light and dark themes through CSS variables:

```css
.dark {
  --color-bg-primary: #1f2937;
  --color-text-primary: #f9fafb;
}
```

## 🧪 Testing Components

All components include comprehensive test coverage:

```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from './TaskItem';

test('toggles task completion', () => {
  const mockToggle = jest.fn();
  render(
    <TaskItem
      task={mockTask}
      onToggleComplete={mockToggle}
      onDelete={jest.fn()}
      onEdit={jest.fn()}
    />
  );
  
  fireEvent.click(screen.getByRole('checkbox'));
  expect(mockToggle).toHaveBeenCalledWith(mockTask.id);
});
```

## 📋 Props Conventions

### Standard Props

All components follow these conventions:

- **Event Handlers**: Prefixed with `on` (e.g., `onClick`, `onChange`)
- **Boolean Props**: Prefixed with `is` or `has` (e.g., `isLoading`, `hasError`)
- **Data Props**: Descriptive names (e.g., `tasks`, `user`, `config`)
- **Optional Props**: Marked with `?` in TypeScript interfaces

### Accessibility Props

All interactive components support standard accessibility props:

- `aria-label`: Accessible name
- `aria-describedby`: Additional description
- `role`: ARIA role override
- `tabIndex`: Tab order control

## 🔄 State Management

Components use various state management patterns:

- **Local State**: `useState` for component-specific state
- **Context**: `useContext` for shared application state
- **Custom Hooks**: Encapsulated logic and state management
- **Ref Management**: `useRef` for DOM manipulation

## 🚀 Performance Considerations

### Optimization Techniques

- **React.memo**: Memoized components to prevent unnecessary re-renders
- **useMemo**: Memoized expensive calculations
- **useCallback**: Memoized event handlers
- **Lazy Loading**: Code splitting for non-critical components

### Bundle Impact

Components are organized by bundle impact:

- **Core Components** (~15KB): TaskList, TaskItem, TaskForm
- **UI Components** (~8KB): Button, Modal, Select
- **Lazy Components** (~5KB): Loaded on demand
- **Utility Components** (~3KB): Error handling, monitoring

---

For implementation examples and advanced usage patterns, see the [Testing Guide](./TESTING.md) and [Performance Guide](./PERFORMANCE.md).
