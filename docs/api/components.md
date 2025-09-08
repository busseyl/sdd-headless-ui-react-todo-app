# Component API Reference

Complete API documentation for all React components in the Headless UI Todo App. Each component is documented with its props, usage examples, and accessibility features.

## 📋 Task Components

### TaskList

The main component for displaying and managing a list of tasks.

```typescript
interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, updates: Partial<Task>) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tasks` | `Task[]` | ✅ | - | Array of tasks to display |
| `onToggleComplete` | `(id: string) => void` | ✅ | - | Callback when task completion is toggled |
| `onDeleteTask` | `(id: string) => void` | ✅ | - | Callback when task is deleted |
| `onEditTask` | `(id: string, updates: Partial<Task>) => void` | ✅ | - | Callback when task is edited |
| `isLoading` | `boolean` | ❌ | `false` | Whether the list is in loading state |
| `emptyMessage` | `string` | ❌ | `"No tasks found"` | Message shown when list is empty |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { TaskList } from '@/components/TaskList'

function TaskPage() {
  const { tasks, toggleComplete, deleteTask, updateTask } = useTasks()
  
  return (
    <TaskList
      tasks={tasks}
      onToggleComplete={toggleComplete}
      onDeleteTask={deleteTask}
      onEditTask={updateTask}
      emptyMessage="Create your first task to get started!"
    />
  )
}
```

#### Accessibility Features

- **Keyboard Navigation**: Full keyboard support with Tab and Arrow keys
- **Screen Reader**: Proper ARIA labels and announcements
- **Focus Management**: Focus stays on logical elements during interactions
- **High Contrast**: Supports high contrast mode

---

### TaskItem

Individual task display component with interactive elements.

```typescript
interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<Task>) => void
  isEditing?: boolean
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `task` | `Task` | ✅ | - | Task object to display |
| `onToggleComplete` | `(id: string) => void` | ✅ | - | Toggle completion callback |
| `onDelete` | `(id: string) => void` | ✅ | - | Delete task callback |
| `onEdit` | `(id: string, updates: Partial<Task>) => void` | ✅ | - | Edit task callback |
| `isEditing` | `boolean` | ❌ | `false` | Whether item is in edit mode |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { TaskItem } from '@/components/TaskItem'

function TaskItemExample() {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <TaskItem
      task={task}
      onToggleComplete={handleToggle}
      onDelete={handleDelete}
      onEdit={handleEdit}
      isEditing={isEditing}
    />
  )
}
```

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Toggle completion |
| `Enter` | Start editing |
| `Delete` | Delete task (with confirmation) |
| `Escape` | Cancel editing |

---

### TaskForm

Form component for creating and editing tasks.

```typescript
interface TaskFormProps {
  task?: Partial<Task>
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  isLoading?: boolean
  submitText?: string
  title?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `task` | `Partial<Task>` | ❌ | `{}` | Initial task data for editing |
| `onSave` | `(task: TaskData) => void` | ✅ | - | Save callback with task data |
| `onCancel` | `() => void` | ✅ | - | Cancel callback |
| `isLoading` | `boolean` | ❌ | `false` | Loading state |
| `submitText` | `string` | ❌ | `"Save"` | Submit button text |
| `title` | `string` | ❌ | `"New Task"` | Form title |

#### Usage

```tsx
import { TaskForm } from '@/components/TaskForm'
import { Dialog } from '@headlessui/react'

function NewTaskDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <TaskForm
        onSave={handleSave}
        onCancel={onClose}
        title="Create New Task"
        submitText="Create Task"
      />
    </Dialog>
  )
}
```

#### Form Validation

The form includes built-in validation:

- **Title**: Required, 1-200 characters
- **Description**: Optional, max 1000 characters
- **Category**: Required, must be valid category
- **Priority**: Optional, low/medium/high

---

## 🎛️ UI Components

### Button

Customizable button component with multiple variants.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  leftIcon?: React.ComponentType<any>
  rightIcon?: React.ComponentType<any>
  children: React.ReactNode
  className?: string
  onClick?: () => void
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | ❌ | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | `'md'` | Button size |
| `isLoading` | `boolean` | ❌ | `false` | Shows loading spinner |
| `disabled` | `boolean` | ❌ | `false` | Disables button |
| `leftIcon` | `React.ComponentType` | ❌ | - | Icon on the left |
| `rightIcon` | `React.ComponentType` | ❌ | - | Icon on the right |
| `children` | `React.ReactNode` | ✅ | - | Button content |
| `className` | `string` | ❌ | `""` | Additional CSS classes |
| `onClick` | `() => void` | ❌ | - | Click handler |

#### Usage

```tsx
import { Button } from '@/components/ui/Button'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

function ButtonExamples() {
  return (
    <div className="space-y-4">
      {/* Primary button with icon */}
      <Button variant="primary" leftIcon={PlusIcon}>
        Add Task
      </Button>
      
      {/* Danger button */}
      <Button variant="danger" size="sm" rightIcon={TrashIcon}>
        Delete
      </Button>
      
      {/* Loading state */}
      <Button isLoading>
        Saving...
      </Button>
      
      {/* Ghost button */}
      <Button variant="ghost">
        Cancel
      </Button>
    </div>
  )
}
```

---

### Checkbox

Accessible checkbox component with custom styling.

```typescript
interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: string
  description?: string
  onChange?: (checked: boolean) => void
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `checked` | `boolean` | ❌ | `false` | Checked state |
| `indeterminate` | `boolean` | ❌ | `false` | Indeterminate state |
| `disabled` | `boolean` | ❌ | `false` | Disabled state |
| `label` | `string` | ❌ | - | Checkbox label |
| `description` | `string` | ❌ | - | Additional description |
| `onChange` | `(checked: boolean) => void` | ❌ | - | Change handler |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { Checkbox } from '@/components/ui/Checkbox'

function CheckboxExample() {
  const [checked, setChecked] = useState(false)
  
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label="Mark as complete"
      description="This will mark the task as completed"
    />
  )
}
```

---

### Select

Dropdown select component built with Headless UI Listbox.

```typescript
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ComponentType<any>
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  onChange?: (value: string) => void
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `SelectOption[]` | ✅ | - | Available options |
| `value` | `string` | ❌ | - | Selected value |
| `placeholder` | `string` | ❌ | `"Select..."` | Placeholder text |
| `disabled` | `boolean` | ❌ | `false` | Disabled state |
| `error` | `string` | ❌ | - | Error message |
| `label` | `string` | ❌ | - | Field label |
| `onChange` | `(value: string) => void` | ❌ | - | Change handler |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { Select } from '@/components/ui/Select'
import { TASK_CATEGORIES } from '@/constants/categories'

function CategorySelect() {
  const [category, setCategory] = useState('')
  
  const categoryOptions = TASK_CATEGORIES.map(cat => ({
    value: cat.id,
    label: cat.label,
    icon: cat.icon,
  }))
  
  return (
    <Select
      label="Category"
      options={categoryOptions}
      value={category}
      onChange={setCategory}
      placeholder="Select a category"
    />
  )
}
```

---

## 🔧 Filter Components

### FilterBar

Component for displaying and managing task filters.

```typescript
interface FilterBarProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  taskCounts: Record<FilterType, number>
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `activeFilter` | `FilterType` | ✅ | - | Currently active filter |
| `onFilterChange` | `(filter: FilterType) => void` | ✅ | - | Filter change callback |
| `searchTerm` | `string` | ✅ | - | Current search term |
| `onSearchChange` | `(term: string) => void` | ✅ | - | Search change callback |
| `taskCounts` | `Record<FilterType, number>` | ✅ | - | Task counts for each filter |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { FilterBar } from '@/components/FilterBar'

function TaskPage() {
  const { filters, updateFilter } = useFilters()
  const { tasks } = useTasks()
  
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    work: tasks.filter(t => t.category === 'work').length,
    personal: tasks.filter(t => t.category === 'personal').length,
  }), [tasks])
  
  return (
    <FilterBar
      activeFilter={filters.status}
      onFilterChange={updateFilter}
      searchTerm={filters.searchTerm}
      onSearchChange={(term) => updateFilter({ searchTerm: term })}
      taskCounts={taskCounts}
    />
  )
}
```

---

### SearchInput

Search input component with debouncing and clear functionality.

```typescript
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | ✅ | - | Search value |
| `onChange` | `(value: string) => void` | ✅ | - | Change callback |
| `placeholder` | `string` | ❌ | `"Search..."` | Placeholder text |
| `debounceMs` | `number` | ❌ | `300` | Debounce delay in ms |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { SearchInput } from '@/components/ui/SearchInput'

function SearchExample() {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <SearchInput
      value={searchTerm}
      onChange={setSearchTerm}
      placeholder="Search tasks..."
      debounceMs={300}
    />
  )
}
```

---

## 📱 Layout Components

### Header

Application header with navigation and actions.

```typescript
interface HeaderProps {
  title?: string
  showAddButton?: boolean
  onAddTask?: () => void
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ❌ | `"Todo App"` | Application title |
| `showAddButton` | `boolean` | ❌ | `true` | Whether to show add button |
| `onAddTask` | `() => void` | ❌ | - | Add task callback |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { Header } from '@/components/layout/Header'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  return (
    <>
      <Header
        title="My Todo App"
        showAddButton
        onAddTask={() => setIsFormOpen(true)}
      />
      {/* Rest of app */}
    </>
  )
}
```

---

### EmptyState

Component for displaying empty states with illustrations and actions.

```typescript
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<any>
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Empty state title |
| `description` | `string` | ❌ | - | Additional description |
| `icon` | `React.ComponentType` | ❌ | - | Icon component |
| `action` | `{ label: string, onClick: () => void }` | ❌ | - | Optional action button |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

#### Usage

```tsx
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

function TaskEmptyState() {
  return (
    <EmptyState
      title="No tasks yet"
      description="Create your first task to get started with organizing your work."
      icon={ClipboardDocumentListIcon}
      action={{
        label: "Add your first task",
        onClick: () => setIsFormOpen(true)
      }}
    />
  )
}
```

---

## 🚨 Feedback Components

### Toast

Toast notification component for user feedback.

```typescript
interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  onDismiss: (id: string) => void
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | ✅ | - | Unique toast ID |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | ✅ | - | Toast type |
| `title` | `string` | ✅ | - | Toast title |
| `description` | `string` | ❌ | - | Additional description |
| `duration` | `number` | ❌ | `5000` | Auto-dismiss duration |
| `onDismiss` | `(id: string) => void` | ✅ | - | Dismiss callback |

#### Usage

```tsx
import { Toast } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

function ToastExample() {
  const { toasts, dismissToast } = useToast()
  
  return (
    <div className="fixed top-4 right-4 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  )
}
```

---

### ConfirmDialog

Confirmation dialog for destructive actions.

```typescript
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | ✅ | - | Whether dialog is open |
| `onClose` | `() => void` | ✅ | - | Close callback |
| `onConfirm` | `() => void` | ✅ | - | Confirm callback |
| `title` | `string` | ✅ | - | Dialog title |
| `description` | `string` | ❌ | - | Dialog description |
| `confirmText` | `string` | ❌ | `"Confirm"` | Confirm button text |
| `cancelText` | `string` | ❌ | `"Cancel"` | Cancel button text |
| `type` | `'danger' \| 'warning' \| 'info'` | ❌ | `'info'` | Dialog type |

#### Usage

```tsx
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

function DeleteTaskButton({ task }: { task: Task }) {
  const [showConfirm, setShowConfirm] = useState(false)
  
  return (
    <>
      <Button
        variant="danger"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>
      
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          deleteTask(task.id)
          setShowConfirm(false)
        }}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  )
}
```

---

## 🎨 Styling and Theming

### Theme Provider

Context provider for theme management.

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}
```

#### Usage

```tsx
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </Button>
  )
}
```

---

## 🔍 Common Patterns

### Component Composition

Many components support composition through render props or children:

```tsx
// Render prop pattern
<TaskList
  tasks={tasks}
  renderEmpty={() => (
    <EmptyState
      title="No tasks found"
      description="Try adjusting your filters"
    />
  )}
  renderTask={(task) => (
    <CustomTaskItem task={task} />
  )}
/>

// Children pattern
<Dialog>
  <Dialog.Panel>
    <Dialog.Title>Confirm Action</Dialog.Title>
    <Dialog.Description>
      Are you sure you want to continue?
    </Dialog.Description>
    <div className="flex space-x-2">
      <Button variant="primary">Confirm</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  </Dialog.Panel>
</Dialog>
```

### Error Handling

All components include error handling:

```tsx
<TaskForm
  onSave={handleSave}
  onError={(error) => {
    console.error('Save failed:', error)
    showToast({
      type: 'error',
      title: 'Save Failed',
      description: error.message,
    })
  }}
/>
```

---

## 📚 Next Steps

- **[Hook Reference](hooks.md)** - Learn about custom hooks
- **[Type Definitions](types.md)** - Explore TypeScript types
- **[Utility Functions](utilities.md)** - Discover helper functions
- **[Testing Guide](../developer-guide/testing.md)** - Learn how to test components

For more detailed examples and advanced usage patterns, refer to the component source code in the `src/components` directory.
