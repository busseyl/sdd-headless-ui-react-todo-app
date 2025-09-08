import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from '../TaskItem'
import { createMockTask, renderWithProviders } from '@/test/utils'
import { TaskCategory } from '@/types'

describe('TaskItem', () => {
  const mockProps = {
    onToggle: jest.fn(),
    onToggleImportant: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onUpdateTitle: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render task with all basic information', () => {
      const task = createMockTask({
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.WORK,
        important: true,
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      expect(screen.getByText('Test Task')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should render completed task with proper styling', () => {
      const task = createMockTask({
        title: 'Completed Task',
        completed: true,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      
      const title = screen.getByText('Completed Task')
      expect(title).toHaveClass('line-through')
    })

    it('should show important task indicator', () => {
      const task = createMockTask({
        title: 'Important Task',
        important: true,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const importantIcon = screen.getByTestId('important-icon')
      expect(importantIcon).toBeInTheDocument()
      expect(importantIcon).toHaveClass('text-yellow-500')
    })

    it('should display category badge with correct color', () => {
      const task = createMockTask({
        title: 'Work Task',
        category: TaskCategory.WORK,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const categoryBadge = screen.getByText('work')
      expect(categoryBadge).toBeInTheDocument()
      expect(categoryBadge).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('should render without description when not provided', () => {
      const task = createMockTask({
        title: 'Task Without Description',
        description: '',
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      expect(screen.getByText('Task Without Description')).toBeInTheDocument()
      expect(screen.queryByTestId('task-description')).not.toBeInTheDocument()
    })
  })

  describe('Task Interactions', () => {
    it('should call onToggle when checkbox is clicked', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-1' })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(mockProps.onToggle).toHaveBeenCalledWith('task-1')
    })

    it('should call onToggleImportant when star icon is clicked', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-1', important: false })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const starButton = screen.getByRole('button', { name: /mark as important/i })
      await user.click(starButton)

      expect(mockProps.onToggleImportant).toHaveBeenCalledWith('task-1')
    })

    it('should show action menu on hover or focus', async () => {
      const user = userEvent.setup()
      const task = createMockTask()

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const taskItem = screen.getByTestId('task-item')
      await user.hover(taskItem)

      expect(screen.getByRole('button', { name: /task actions/i })).toBeVisible()
    })

    it('should call onEdit when edit action is selected', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-1' })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /task actions/i })
      await user.click(menuButton)

      // Click edit
      const editButton = screen.getByRole('menuitem', { name: /edit task/i })
      await user.click(editButton)

      expect(mockProps.onEdit).toHaveBeenCalledWith(task)
    })

    it('should call onDelete when delete action is selected', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-1' })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /task actions/i })
      await user.click(menuButton)

      // Click delete
      const deleteButton = screen.getByRole('menuitem', { name: /delete task/i })
      await user.click(deleteButton)

      expect(mockProps.onDelete).toHaveBeenCalledWith('task-1')
    })
  })

  describe('Inline Title Editing', () => {
    it('should enter edit mode when title is double-clicked', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        title: 'Original Title',
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const title = screen.getByText('Original Title')
      await user.dblClick(title)

      expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Original Title')).toHaveFocus()
    })

    it('should not allow editing for completed tasks', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        title: 'Completed Task',
        completed: true,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const title = screen.getByText('Completed Task')
      await user.dblClick(title)

      expect(screen.queryByDisplayValue('Completed Task')).not.toBeInTheDocument()
    })

    it('should save title when Enter is pressed', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        id: 'task-1',
        title: 'Original Title',
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Enter edit mode
      const title = screen.getByText('Original Title')
      await user.dblClick(title)

      // Edit title
      const input = screen.getByDisplayValue('Original Title')
      await user.clear(input)
      await user.type(input, 'Updated Title')
      await user.keyboard('{Enter}')

      expect(mockProps.onUpdateTitle).toHaveBeenCalledWith('task-1', 'Updated Title')
    })

    it('should cancel editing when Escape is pressed', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        title: 'Original Title',
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Enter edit mode
      const title = screen.getByText('Original Title')
      await user.dblClick(title)

      // Edit title but cancel
      const input = screen.getByDisplayValue('Original Title')
      await user.clear(input)
      await user.type(input, 'Changed Title')
      await user.keyboard('{Escape}')

      expect(mockProps.onUpdateTitle).not.toHaveBeenCalled()
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })

    it('should save title when input loses focus', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        id: 'task-1',
        title: 'Original Title',
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Enter edit mode
      const title = screen.getByText('Original Title')
      await user.dblClick(title)

      // Edit title and blur
      const input = screen.getByDisplayValue('Original Title')
      await user.clear(input)
      await user.type(input, 'Updated Title')
      fireEvent.blur(input)

      expect(mockProps.onUpdateTitle).toHaveBeenCalledWith('task-1', 'Updated Title')
    })

    it('should not save empty or whitespace-only titles', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        title: 'Original Title',
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Enter edit mode
      const title = screen.getByText('Original Title')
      await user.dblClick(title)

      // Clear title and try to save
      const input = screen.getByDisplayValue('Original Title')
      await user.clear(input)
      await user.keyboard('{Enter}')

      expect(mockProps.onUpdateTitle).not.toHaveBeenCalled()
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })

    it('should not save if title is unchanged', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        title: 'Original Title',
        completed: false,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Enter edit mode and save without changes
      const title = screen.getByText('Original Title')
      await user.dblClick(title)
      await user.keyboard('{Enter}')

      expect(mockProps.onUpdateTitle).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      const task = createMockTask({
        title: 'Accessible Task',
        description: 'Task description',
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAccessibleName('Mark task as complete')

      const starButton = screen.getByRole('button', { name: /mark as important/i })
      expect(starButton).toBeInTheDocument()

      const menuButton = screen.getByRole('button', { name: /task actions/i })
      expect(menuButton).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      const task = createMockTask()

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      // Tab through interactive elements
      await user.tab()
      expect(screen.getByRole('checkbox')).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /mark as important/i })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /task actions/i })).toHaveFocus()
    })

    it('should announce state changes to screen readers', () => {
      const task = createMockTask({
        title: 'Task for screen reader',
        completed: true,
        important: true,
      })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-checked', 'true')

      const importantIcon = screen.getByTestId('important-icon')
      expect(importantIcon).toHaveAttribute('aria-label', 'Important task')
    })
  })

  describe('Category Display', () => {
    it.each([
      [TaskCategory.WORK, 'bg-blue-100 text-blue-800'],
      [TaskCategory.PERSONAL, 'bg-green-100 text-green-800'],
      [TaskCategory.SHOPPING, 'bg-purple-100 text-purple-800'],
      [TaskCategory.HEALTH, 'bg-red-100 text-red-800'],
      [TaskCategory.OTHER, 'bg-gray-100 text-gray-800'],
    ])('should display %s category with correct styling', (category, expectedClasses) => {
      const task = createMockTask({ category })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const categoryBadge = screen.getByText(category)
      expect(categoryBadge).toHaveClass(...expectedClasses.split(' '))
    })
  })

  describe('Error Handling', () => {
    it('should handle missing onUpdateTitle prop gracefully', async () => {
      const user = userEvent.setup()
      const task = createMockTask({
        title: 'Test Task',
        completed: false,
      })
      
      const propsWithoutUpdate = {
        ...mockProps,
        onUpdateTitle: undefined,
      }

      renderWithProviders(<TaskItem task={task} {...propsWithoutUpdate} />)

      // Should not enter edit mode without onUpdateTitle
      const title = screen.getByText('Test Task')
      await user.dblClick(title)

      expect(screen.queryByDisplayValue('Test Task')).not.toBeInTheDocument()
    })

    it('should handle rapid interactions gracefully', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-1' })

      renderWithProviders(<TaskItem task={task} {...mockProps} />)

      const checkbox = screen.getByRole('checkbox')
      
      // Multiple rapid clicks
      await user.click(checkbox)
      await user.click(checkbox)
      await user.click(checkbox)

      // Should still work correctly
      expect(mockProps.onToggle).toHaveBeenCalledTimes(3)
      expect(mockProps.onToggle).toHaveBeenCalledWith('task-1')
    })
  })
})
