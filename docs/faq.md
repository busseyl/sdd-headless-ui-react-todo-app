# FAQ - Frequently Asked Questions

## General Questions

### What is the Headless UI Todo App?

The Headless UI Todo App is a modern, accessible React application built using Headless UI components. It demonstrates best practices for building inclusive web applications with proper keyboard navigation, screen reader support, and responsive design.

### What technologies are used?

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Headless UI (Unstyled, accessible components)
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library, Playwright
- **PWA**: Service Worker, Web App Manifest

### Is this production-ready?

Yes! The application includes:

- Comprehensive testing suite
- Accessibility compliance (WCAG 2.1)
- PWA capabilities
- Performance optimizations
- Error boundaries and proper error handling

## Installation & Setup

### What are the system requirements?

- **Node.js**: 16.0 or higher
- **npm**: 7.0 or higher (or yarn/pnpm equivalent)
- **Modern browser**: Chrome 88+, Firefox 85+, Safari 14+

### Why won't the app start after installation?

Common issues and solutions:

1. **Node version**: Ensure you're using Node 16+
   ```bash
   node --version
   ```

2. **Clear cache**: Remove node_modules and reinstall
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port conflicts**: Check if port 5173 is available
   ```bash
   npm run dev -- --port 3000
   ```

### How do I enable PWA features?

PWA features work automatically in production builds:

1. Build the app: `npm run build`
2. Serve it: `npm run preview`
3. Open in browser and look for "Install App" prompt

## Usage Questions

### How do I add keyboard shortcuts?

The app includes built-in keyboard shortcuts:

- **Ctrl/Cmd + Enter**: Add new task (when input is focused)
- **Enter**: Edit task in place
- **Space**: Toggle task completion
- **Delete**: Remove task (when focused)
- **Tab/Shift+Tab**: Navigate between elements

To add custom shortcuts, modify the `useKeyboardShortcuts` hook.

### Can I customize the appearance?

Yes! The app uses Tailwind CSS for styling:

1. **Colors**: Modify `tailwind.config.js`
2. **Components**: Edit component files in `src/components/`
3. **Theme**: Update CSS custom properties in `src/index.css`

### How do I export/import tasks?

Currently, tasks are stored in localStorage. To add export/import:

1. Add export functionality in `TaskContext`
2. Create import/export UI components
3. Implement JSON file handling

## Development Questions

### How do I add a new component?

1. Create the component file:
   ```bash
   # Create directory
   mkdir src/components/MyComponent
   
   # Create files
   touch src/components/MyComponent/MyComponent.tsx
   touch src/components/MyComponent/MyComponent.test.tsx
   touch src/components/MyComponent/index.ts
   ```

2. Follow the component template:
   ```typescript
   // MyComponent.tsx
   import { ComponentProps } from 'react';
   
   interface MyComponentProps extends ComponentProps<'div'> {
     // Your props here
   }
   
   export function MyComponent({ ...props }: MyComponentProps) {
     return <div {...props}>My Component</div>;
   }
   ```

### How do I add a new test?

1. Create test file next to component
2. Use React Testing Library patterns:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { MyComponent } from './MyComponent';
   
   describe('MyComponent', () => {
     it('should render correctly', () => {
       render(<MyComponent />);
       expect(screen.getByText('My Component')).toBeInTheDocument();
     });
   });
   ```

### Why are my tests failing?

Common test issues:

1. **Missing test setup**: Ensure `src/test/setup.ts` is configured
2. **Async operations**: Use `waitFor` for async updates
3. **Mock missing**: Add mocks for external dependencies
4. **Wrong queries**: Use appropriate testing library queries

## Accessibility Questions

### How do I test accessibility?

1. **Automated testing**:
   ```bash
   npm run test:a11y
   ```

2. **Manual testing**:
   - Navigate using only keyboard
   - Test with screen reader (NVDA, JAWS, VoiceOver)
   - Check color contrast with browser tools

3. **Browser extensions**:
   - axe DevTools
   - WAVE
   - Lighthouse

### What accessibility features are included?

- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper ARIA labels and descriptions
- **Focus management**: Logical focus order and visual indicators
- **Color contrast**: WCAG AA compliant colors
- **Responsive text**: Supports 200% zoom
- **Reduced motion**: Respects user motion preferences

### How do I add ARIA labels?

Use Headless UI's built-in accessibility or add manually:

```typescript
// Using Headless UI
<Dialog>
  <Dialog.Title>Edit Task</Dialog.Title>
  <Dialog.Description>
    Update your task details below.
  </Dialog.Description>
</Dialog>

// Manual ARIA
<button
  aria-label="Delete task: Buy groceries"
  aria-describedby="task-help"
>
  Delete
</button>
```

## Performance Questions

### Why is the app slow?

Performance optimization checklist:

1. **Check bundle size**:
   ```bash
   npm run build
   npm run analyze
   ```

2. **Optimize images**: Use WebP format, proper sizing
3. **Code splitting**: Implement lazy loading for routes
4. **Memoization**: Use React.memo, useMemo, useCallback

### How do I improve performance?

1. **React DevTools Profiler**: Identify slow renders
2. **Lighthouse**: Run performance audits
3. **Bundle analyzer**: Find large dependencies
4. **Service worker**: Cache resources effectively

## Deployment Questions

### How do I deploy to GitHub Pages?

1. **Enable GitHub Pages** in repository settings
2. **Set source** to "GitHub Actions"
3. **Push to main branch** - deployment is automatic
4. **Custom domain** (optional): Add CNAME file

### Why isn't my deployment working?

Common deployment issues:

1. **Build errors**: Check GitHub Actions logs
2. **Base URL**: Ensure correct `base` in `vite.config.ts`
3. **Permissions**: Verify GitHub Actions has write permissions
4. **Dependencies**: Check `requirements.txt` for docs

### Can I deploy elsewhere?

Yes! The app works on any static hosting:

- **Netlify**: Connect GitHub repository
- **Vercel**: Import project from GitHub
- **AWS S3**: Upload build folder
- **Firebase Hosting**: Use Firebase CLI

## Troubleshooting

### Common Error Messages

#### "Module not found"
```
Error: Cannot resolve module './Component'
```
**Solution**: Check import paths and file names

#### "Hooks can only be called inside function components"
```
Error: Invalid hook call
```
**Solution**: Ensure hooks are used only in components or custom hooks

#### "localStorage is not defined"
```
ReferenceError: localStorage is not defined
```
**Solution**: Add localStorage mock in test setup

### Getting Help

1. **Check documentation**: Review relevant sections
2. **Search issues**: Look for similar problems in GitHub
3. **Create issue**: Provide detailed error information
4. **Community**: Join discussions in repository

### Debugging Tips

1. **Browser DevTools**: Use React Developer Tools
2. **Console logging**: Add strategic console.log statements
3. **Error boundaries**: Implement to catch React errors
4. **Network tab**: Check for failed requests

## Best Practices

### Code Organization

- **Feature-based structure**: Group related files together
- **Consistent naming**: Use clear, descriptive names
- **Export patterns**: Use named exports for better tree-shaking
- **Type safety**: Leverage TypeScript fully

### Testing Strategy

- **Test behavior**: Focus on user interactions
- **Mock external dependencies**: Keep tests isolated
- **Accessibility tests**: Include a11y in test suite
- **Coverage goals**: Aim for 80%+ coverage

### Performance

- **Lazy loading**: Load components when needed
- **Image optimization**: Use appropriate formats and sizes
- **Bundle optimization**: Remove unused dependencies
- **Caching strategy**: Implement proper cache headers

## Resources

### Documentation Links

- [React Documentation](https://react.dev/)
- [Headless UI Documentation](https://headlessui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

### Learning Resources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Best Practices](https://web.dev/pwa-checklist/)

### Tools

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

*Still have questions? [Create an issue](https://github.com/busseyl/sdd-headless-ui-react-todo-app/issues/new) or check the [discussions](https://github.com/busseyl/sdd-headless-ui-react-todo-app/discussions).*
