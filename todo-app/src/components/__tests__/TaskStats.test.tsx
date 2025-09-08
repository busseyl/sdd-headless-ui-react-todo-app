import { screen } from '@testing-library/react'
import { renderWithProviders, createMockTask } from '@/test/utils'
import { TaskStats } from '../TaskStats'

// Simple component test to validate the testing infrastructure
describe('TaskStats Component', () => {
  it('should render task statistics correctly', () => {
    const tasks = [
      createMockTask({ id: '1', completed: false, important: true }),
      createMockTask({ id: '2', completed: true, important: false }),
      createMockTask({ id: '3', completed: false, important: false }),
      createMockTask({ id: '4', completed: false, important: true }),
    ]

    renderWithProviders(
      <TaskStats 
        tasks={tasks}
        filteredTasks={tasks}
        currentFilter="all"
      />
    )

    // Should show total count
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    
    // Should show active count
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should calculate completed tasks correctly', () => {
    const tasks = [
      createMockTask({ id: '1', completed: true }),
      createMockTask({ id: '2', completed: true }),
      createMockTask({ id: '3', completed: false }),
    ]

    renderWithProviders(
      <TaskStats 
        tasks={tasks}
        filteredTasks={tasks}
        currentFilter="all"
      />
    )

    // Should show 2 completed tasks
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('should be accessible with proper semantic structure', () => {
    const tasks = [createMockTask()]

    renderWithProviders(
      <TaskStats 
        tasks={tasks}
        filteredTasks={tasks}
        currentFilter="all"
      />
    )

    // Should have proper semantic structure
    const statsContainer = screen.getByRole('region')
    expect(statsContainer).toBeInTheDocument()
  })
})
