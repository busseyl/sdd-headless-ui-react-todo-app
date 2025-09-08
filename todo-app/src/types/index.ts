/**
 * Core data types for the Todo Application
 * Based on the design specification requirements
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  important: boolean;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export const TaskCategory = {
  WORK: 'work',
  PERSONAL: 'personal', 
  SHOPPING: 'shopping',
  HEALTH: 'health',
  OTHER: 'other',
} as const;

export type TaskCategory = typeof TaskCategory[keyof typeof TaskCategory];

export type FilterType = 'all' | 'active' | 'completed' | TaskCategory;

export interface AppState {
  tasks: Task[];
  filter: FilterType;
  isAddingTask: boolean;
  editingTaskId: string | null;
}

// Hook return types
export interface UseTasksReturn {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  clearValue: () => void;
}

export interface UseKeyboardShortcutsProps {
  onNewTask: () => void;
  onToggleFilter: () => void;
  onClearCompleted: () => void;
}

// Component prop types
export interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialTask?: Task | null;
}

export interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
    work: number;
    personal: number;
    shopping: number;
    health: number;
    other: number;
  };
}

export interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
  onTaskToggle: (id: string) => void;
  filter: FilterType;
  searchQuery: string;
}

// Form data types
export interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
}

export interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
}

// Utility types
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

// Constants
export const TASK_CATEGORIES: { value: TaskCategory; label: string; icon: string }[] = [
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'shopping', label: 'Shopping', icon: '🛒' },
  { value: 'health', label: 'Health', icon: '⚕️' },
  { value: 'other', label: 'Other', icon: '📋' },
];

export const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

// Local storage keys
export const STORAGE_KEYS = {
  TASKS: 'todo-app-tasks',
  FILTER: 'todo-app-filter',
  SEARCH: 'todo-app-search',
} as const;
