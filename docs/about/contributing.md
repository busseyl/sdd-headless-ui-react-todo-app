# Contributing to Headless UI Todo App

We welcome contributions to the Headless UI Todo App! This guide will help you get started with contributing to the project, whether you're fixing bugs, adding features, improving documentation, or helping with testing.

## 🤝 How to Contribute

### Types of Contributions

We appreciate all kinds of contributions:

- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Suggest new functionality
- 📝 **Documentation** - Improve or add documentation
- 🧪 **Testing** - Add or improve tests
- 🎨 **Design** - UI/UX improvements
- ♿ **Accessibility** - Accessibility enhancements
- 🔧 **Code** - Bug fixes and new features

### Quick Start for Contributors

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/busseyl/sdd-headless-ui-react-todo-app.git
   cd headless-ui/todo-app
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   
   # Run tests
   npm test
   ```

3. **Create a Branch**
   ```bash
   # Create a descriptive branch name
   git checkout -b feature/add-task-templates
   git checkout -b fix/keyboard-navigation-bug
   git checkout -b docs/improve-api-reference
   ```

4. **Make Your Changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed

5. **Submit a Pull Request**
   - Push your branch to your fork
   - Create a pull request with a clear description

## 📋 Development Guidelines

### Code Standards

#### TypeScript Guidelines

```typescript
// ✅ Good: Use explicit types
interface TaskFormProps {
  task?: Partial<Task>
  onSave: (task: TaskData) => void
  onCancel: () => void
  isLoading?: boolean
}

// ✅ Good: Use meaningful names
const handleTaskSubmission = useCallback((taskData: TaskData) => {
  // Implementation
}, [dependencies])

// ❌ Avoid: Any types
const handleSubmit = (data: any) => {
  // Implementation
}

// ✅ Good: Document complex types
/**
 * Represents a task filter configuration
 * @example
 * const filter: TaskFilter = {
 *   status: 'active',
 *   category: 'work',
 *   searchTerm: 'meeting'
 * }
 */
interface TaskFilter {
  status: FilterStatus
  category?: TaskCategory
  searchTerm?: string
}
```

#### React Component Guidelines

```tsx
// ✅ Good: Use functional components with hooks
interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const handleToggle = useCallback(() => {
    onToggle(task.id)
  }, [task.id, onToggle])

  return (
    <div className="task-item">
      <Checkbox checked={task.completed} onChange={handleToggle} />
      <span className={task.completed ? 'line-through' : ''}>
        {task.title}
      </span>
    </div>
  )
}

// ✅ Good: Export with display name for debugging
TaskItem.displayName = 'TaskItem'
```

#### Accessibility Guidelines

```tsx
// ✅ Good: Proper ARIA labels and keyboard support
function TaskActions({ task, onEdit, onDelete }: TaskActionsProps) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="action-button"
        aria-label={`Actions for task: ${task.title}`}
      >
        <MoreVerticalIcon className="w-4 h-4" />
      </Menu.Button>
      
      <Menu.Items className="menu-items">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onEdit(task.id)}
              className={classNames(
                'menu-item',
                active && 'menu-item--active'
              )}
            >
              <PencilIcon className="w-4 h-4" />
              Edit Task
            </button>
          )}
        </Menu.Item>
        
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onDelete(task.id)}
              className={classNames(
                'menu-item menu-item--danger',
                active && 'menu-item--active'
              )}
            >
              <TrashIcon className="w-4 h-4" />
              Delete Task
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
```

### Testing Standards

#### Unit Test Guidelines

```typescript
// ✅ Good: Comprehensive test structure
describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    completed: false,
    category: 'work',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  }

  const defaultProps = {
    task: mockTask,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('displays task title correctly', () => {
      render(<TaskItem {...defaultProps} />)
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    test('shows completion status', () => {
      render(<TaskItem {...defaultProps} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Interactions', () => {
    test('calls onToggle when checkbox is clicked', async () => {
      const user = userEvent.setup()
      render(<TaskItem {...defaultProps} />)
      
      await user.click(screen.getByRole('checkbox'))
      
      expect(defaultProps.onToggle).toHaveBeenCalledWith('1')
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<TaskItem {...defaultProps} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAccessibleName('Mark Test Task as complete')
    })

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<TaskItem {...defaultProps} />)
      
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      
      await user.keyboard(' ')
      
      expect(defaultProps.onToggle).toHaveBeenCalledWith('1')
    })
  })
})
```

#### E2E Test Guidelines

```typescript
// ✅ Good: User-focused E2E tests
test('complete task workflow', async ({ page }) => {
  await page.goto('/')
  
  // Add a new task
  await page.getByRole('button', { name: 'Add Task' }).click()
  await page.getByLabel('Task title').fill('Buy groceries')
  await page.getByLabel('Category').selectOption('personal')
  await page.getByRole('button', { name: 'Save' }).click()
  
  // Verify task appears in list
  const taskItem = page.getByText('Buy groceries')
  await expect(taskItem).toBeVisible()
  
  // Mark task as complete
  await page.getByRole('checkbox', { name: /Buy groceries/ }).check()
  
  // Verify completion
  await expect(taskItem).toHaveClass(/completed/)
  
  // Filter to completed tasks
  await page.getByRole('button', { name: 'Completed' }).click()
  await expect(taskItem).toBeVisible()
  
  // Filter to active tasks
  await page.getByRole('button', { name: 'Active' }).click()
  await expect(taskItem).not.toBeVisible()
})
```

## 🐛 Bug Reports

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Update to the latest version** and test again
3. **Clear your browser cache** and try to reproduce
4. **Test in different browsers** if possible

### Bug Report Template

```markdown
## Bug Report

### Description
A clear and concise description of what the bug is.

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior
A clear and concise description of what you expected to happen.

### Actual Behavior
A clear and concise description of what actually happened.

### Screenshots
If applicable, add screenshots to help explain your problem.

### Environment
- Browser: [e.g. Chrome 118, Firefox 119]
- OS: [e.g. macOS 14, Windows 11, Ubuntu 22.04]
- Device: [e.g. Desktop, iPhone 12, Samsung Galaxy]
- Screen size: [e.g. 1920x1080, Mobile]

### Additional Context
Add any other context about the problem here.

### Possible Solution
If you have ideas on how to fix the issue, please describe them here.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Request

### Is your feature request related to a problem?
A clear and concise description of what the problem is.
Ex. I'm always frustrated when [...]

### Describe the solution you'd like
A clear and concise description of what you want to happen.

### Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.

### Additional context
Add any other context or screenshots about the feature request here.

### Implementation Ideas
If you have ideas on how this could be implemented, please describe them here.

### Priority
- [ ] Low - Nice to have
- [ ] Medium - Would improve user experience
- [ ] High - Critical for usability
- [ ] Critical - Blocking basic functionality
```

## 📝 Documentation Contributions

### Documentation Standards

- **Clear and Concise**: Write in simple, direct language
- **Complete Examples**: Include working code examples
- **Accessibility Focus**: Always mention accessibility considerations
- **Up-to-date**: Ensure examples work with current code
- **Well-structured**: Use proper headings and navigation

### Documentation Checklist

- [ ] Spell check and grammar check completed
- [ ] Code examples tested and working
- [ ] Links verified and functional
- [ ] Images have proper alt text
- [ ] Accessibility considerations mentioned
- [ ] Mobile-friendly formatting
- [ ] Consistent with existing style

## 🧪 Testing Contributions

### Adding Tests

When adding new features or fixing bugs:

1. **Add Unit Tests** for individual functions and components
2. **Add Integration Tests** for component interactions
3. **Add E2E Tests** for complete user workflows
4. **Update Existing Tests** if behavior changes

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Run specific test file
npm test TaskItem.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="keyboard navigation"
```

### Test Coverage Requirements

- **Minimum Coverage**: 90% for all new code
- **Critical Paths**: 100% coverage for core functionality
- **Accessibility**: All interactive elements must have accessibility tests
- **Edge Cases**: Include tests for error conditions and edge cases

## 🎨 Design Contributions

### Design System

We follow a consistent design system:

- **Colors**: Defined in Tailwind config
- **Typography**: Inter font family with defined scales
- **Spacing**: 8px grid system
- **Components**: Consistent styling patterns
- **Accessibility**: WCAG 2.1 AA compliance

### Design Review Process

1. **Create Design Proposal** with mockups or prototypes
2. **Discuss in GitHub Issue** to gather feedback
3. **Implement Changes** following design guidelines
4. **Test Accessibility** with screen readers and keyboard
5. **Review with Team** before merging

## 🔧 Code Review Process

### Pull Request Guidelines

#### PR Title Format
```
type(scope): description

Examples:
feat(tasks): add task templates functionality
fix(a11y): improve keyboard navigation in task list
docs(api): update component documentation
test(e2e): add workflow tests for task management
```

#### PR Description Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Test improvements

## How Has This Been Tested?
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Screenshots (if applicable)
Include screenshots of UI changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Review Criteria

Reviewers will check for:

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean, readable, and maintainable?
- **Performance**: Are there any performance implications?
- **Accessibility**: Does it maintain or improve accessibility?
- **Testing**: Are there adequate tests?
- **Documentation**: Is documentation updated?
- **Security**: Are there any security concerns?

## 📊 Project Governance

### Decision Making

- **Minor Changes**: Can be made by any contributor with review
- **Major Changes**: Require discussion in issues before implementation
- **Breaking Changes**: Require RFC (Request for Comments) process
- **Architecture Changes**: Require team consensus

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, discussions
- **GitHub Discussions**: General questions and community interaction
- **Pull Requests**: Code review and technical discussions

## 🏆 Recognition

### Contributors

We recognize contributions in several ways:

- **Contributors List**: All contributors listed in README
- **Release Notes**: Significant contributions mentioned in releases
- **GitHub Recognition**: Using GitHub's built-in contribution tracking

### Becoming a Maintainer

Regular contributors who demonstrate:

- **Code Quality**: Consistent high-quality contributions
- **Community Engagement**: Helpful in discussions and reviews
- **Project Knowledge**: Deep understanding of the codebase
- **Commitment**: Regular, ongoing contributions

May be invited to become project maintainers with additional responsibilities.

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Schedule

- **Patch Releases**: As needed for bug fixes
- **Minor Releases**: Monthly for new features
- **Major Releases**: Quarterly or as needed for breaking changes

## 📚 Resources

### Learning Resources

- [React Documentation](https://react.dev/)
- [Headless UI Documentation](https://headlessui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library Documentation](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Development Tools

- **VS Code Extensions**: ESLint, Prettier, TypeScript
- **Browser Extensions**: React DevTools, axe DevTools
- **Testing Tools**: Jest, Playwright, Testing Library

## ❓ FAQ

### Q: How do I get started contributing?

A: Start by reading this guide, setting up the development environment, and looking for issues labeled "good first issue" or "help wanted".

### Q: What if I'm new to React/TypeScript?

A: That's okay! Start with documentation improvements or simple bug fixes. Our community is here to help you learn.

### Q: Can I contribute if I'm not a developer?

A: Absolutely! We need help with documentation, design, testing, accessibility auditing, and community support.

### Q: How long does it take for PRs to be reviewed?

A: We aim to review PRs within 48 hours. Complex changes may take longer for thorough review.

### Q: What if my PR is rejected?

A: Don't worry! We'll provide feedback on why and how to improve. Rejection is part of the learning process.

### Q: Can I work on multiple issues at once?

A: It's better to focus on one issue at a time, especially when starting out. This helps ensure quality and timely completion.

---

## 🎉 Thank You!

Thank you for considering contributing to the Headless UI Todo App! Every contribution, no matter how small, helps make this project better for everyone. 

**Questions?** Feel free to [open an issue](https://github.com/busseyl/sdd-headless-ui-react-todo-app/issues/new) or [start a discussion](https://github.com/busseyl/sdd-headless-ui-react-todo-app/discussions) - we're here to help! 🚀
