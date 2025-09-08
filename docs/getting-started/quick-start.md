# Quick Start

Get the Headless UI Todo App up and running in under 5 minutes! This guide will walk you through the essential steps to have a fully functional development environment.

## 🚀 Prerequisites

Before getting started, ensure you have the following installed:

=== "Node.js 18+"
    ```bash
    # Check your Node.js version
    node --version
    # Should output v18.0.0 or higher
    ```

=== "npm or yarn"
    ```bash
    # Check npm version
    npm --version
    
    # Or if you prefer yarn
    yarn --version
    ```

=== "Git"
    ```bash
    # Check Git version
    git --version
    ```

!!! tip "Recommended Tools"
    - **VS Code** with the following extensions:
        - TypeScript and JavaScript Language Features
        - Tailwind CSS IntelliSense
        - ESLint
        - Prettier

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/busseyl/sdd-headless-ui-react-todo-app.git
cd headless-ui/todo-app
```

### 2. Install Dependencies

=== "npm"
    ```bash
    npm install
    ```

=== "yarn"
    ```bash
    yarn install
    ```

=== "pnpm"
    ```bash
    pnpm install
    ```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` 🎉

## ✅ Verify Installation

### 1. Check the Application

Open your browser and navigate to `http://localhost:5173`. You should see:

- ✅ Clean todo interface with "Add Task" button
- ✅ Empty state message: "No tasks yet. Create your first task!"
- ✅ Filter buttons (All, Active, Completed)
- ✅ Responsive design on mobile and desktop

### 2. Test Basic Functionality

Try these quick tests to ensure everything works:

1. **Create a Task**:
   - Click "Add Task" button
   - Fill in title: "Test Task"
   - Select category: "Work"
   - Click "Save"

2. **Mark as Complete**:
   - Click the checkbox next to your task
   - Task should show as completed with strikethrough

3. **Filter Tasks**:
   - Click "Completed" filter
   - Should show only completed tasks

4. **Delete Task**:
   - Click the delete button (trash icon)
   - Confirm deletion in the dialog

### 3. Test Accessibility

1. **Keyboard Navigation**:
   - Press `Tab` to navigate through elements
   - Press `Enter` to activate buttons
   - Press `Escape` to close dialogs

2. **Screen Reader** (if available):
   - Enable screen reader
   - Navigate the interface
   - Verify all elements are properly announced

## 🛠️ Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## 📱 PWA Features

### Test PWA Installation

1. Open the app in a PWA-capable browser (Chrome, Edge, Safari)
2. Look for the "Install" prompt in the address bar
3. Click to install the app
4. The app should open as a native application

### Test Offline Functionality

1. With the app open, go offline (disable internet)
2. The app should continue to work
3. Create, edit, and delete tasks
4. Changes should persist when you go back online

## 🎯 Quick Feature Tour

### Creating Your First Task

1. Click the **"Add Task"** button
2. Enter a title like "Learn Headless UI"
3. Add a description (optional)
4. Select a category from the dropdown
5. Click **"Save"**

### Using Filters

- **All**: Shows all tasks
- **Active**: Shows incomplete tasks only
- **Completed**: Shows completed tasks only
- **Category Buttons**: Filter by specific categories

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New task |
| `Ctrl/Cmd + D` | Clear completed |
| `Tab` | Navigate elements |
| `Enter` | Activate focused element |
| `Escape` | Close dialogs |

## 🚨 Troubleshooting

### Common Issues

!!! problem "Port Already in Use"
    If port 5173 is already in use:
    ```bash
    # Kill the process using the port
    lsof -ti:5173 | xargs kill -9
    
    # Or start on a different port
    npm run dev -- --port 3000
    ```

!!! problem "Dependencies Not Installing"
    Try clearing the cache:
    ```bash
    # For npm
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
    
    # For yarn
    yarn cache clean
    rm -rf node_modules yarn.lock
    yarn install
    ```

!!! problem "TypeScript Errors"
    Ensure you're using TypeScript 5+:
    ```bash
    npx tsc --version
    ```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting section](installation.md#troubleshooting) in the installation guide
2. Search [existing issues](https://github.com/busseyl/sdd-headless-ui-react-todo-app/issues) on GitHub
3. Create a [new issue](https://github.com/busseyl/sdd-headless-ui-react-todo-app/issues/new) with details

## 🎉 Success!

If everything is working correctly, you now have:

- ✅ A fully functional todo application
- ✅ Hot reload development environment
- ✅ PWA capabilities working
- ✅ All tests passing
- ✅ Accessibility features enabled

## 📚 Next Steps

Now that you have the app running:

1. **[Explore Features](../user-guide/features.md)** - Learn about all the functionality
2. **[Review Architecture](../developer-guide/architecture.md)** - Understand how it's built
3. **[Run Tests](../developer-guide/testing.md)** - Ensure quality with testing
4. **[Deploy](../deployment/overview.md)** - Deploy to production

---

**Congratulations!** 🎊 You now have a fully functional, accessible todo application. Start exploring the features and dive into the code to see how everything works together!
