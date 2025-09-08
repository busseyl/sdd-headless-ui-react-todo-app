# Installation

This guide provides detailed installation instructions for setting up the Headless UI Todo App development environment on different operating systems.

## 📋 System Requirements

### Minimum Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| **Node.js** | 18.0.0 | 20.0.0+ |
| **npm** | 8.0.0 | 10.0.0+ |
| **Git** | 2.20.0 | Latest |
| **Memory** | 4GB RAM | 8GB+ RAM |
| **Storage** | 1GB free | 2GB+ free |

### Operating System Support

- ✅ **Windows** 10/11
- ✅ **macOS** 10.15+
- ✅ **Linux** Ubuntu 18.04+, CentOS 7+, or equivalent

## 🛠️ Step-by-Step Installation

### 1. Install Node.js

Choose your operating system:

=== "Windows"
    **Option A: Official Installer**
    1. Download from [nodejs.org](https://nodejs.org/)
    2. Run the installer
    3. Follow the installation wizard
    4. Restart your terminal
    
    **Option B: Using Chocolatey**
    ```powershell
    # Install Chocolatey first, then:
    choco install nodejs
    ```
    
    **Option C: Using Winget**
    ```powershell
    winget install OpenJS.NodeJS
    ```

=== "macOS"
    **Option A: Official Installer**
    1. Download from [nodejs.org](https://nodejs.org/)
    2. Run the .pkg installer
    3. Follow the installation wizard
    
    **Option B: Using Homebrew**
    ```bash
    # Install Homebrew first, then:
    brew install node
    ```
    
    **Option C: Using MacPorts**
    ```bash
    sudo port install nodejs18
    ```

=== "Linux"
    **Ubuntu/Debian:**
    ```bash
    # Update package index
    sudo apt update
    
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
    
    **CentOS/RHEL/Fedora:**
    ```bash
    # Using NodeSource repository
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install nodejs npm
    ```
    
    **Arch Linux:**
    ```bash
    sudo pacman -S nodejs npm
    ```

### 2. Verify Node.js Installation

```bash
# Check Node.js version
node --version
# Expected output: v18.0.0 or higher

# Check npm version
npm --version
# Expected output: 8.0.0 or higher
```

### 3. Install Git

=== "Windows"
    1. Download Git from [git-scm.com](https://git-scm.com/)
    2. Run the installer with default settings
    3. Verify installation:
    ```bash
    git --version
    ```

=== "macOS"
    Git is usually pre-installed. If not:
    ```bash
    # Using Homebrew
    brew install git
    
    # Using Xcode Command Line Tools
    xcode-select --install
    ```

=== "Linux"
    ```bash
    # Ubuntu/Debian
    sudo apt install git
    
    # CentOS/RHEL/Fedora
    sudo dnf install git
    
    # Arch Linux
    sudo pacman -S git
    ```

### 4. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/busseyl/sdd-headless-ui-react-todo-app.git

# Navigate to the project directory
cd headless-ui/todo-app

# Verify the directory structure
ls -la
```

Expected output:
```
drwxr-xr-x  - user  docs/
drwxr-xr-x  - user  public/
drwxr-xr-x  - user  src/
-rw-r--r--  - user  package.json
-rw-r--r--  - user  README.md
-rw-r--r--  - user  vite.config.ts
```

### 5. Install Project Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - React and related packages
# - Headless UI components
# - Tailwind CSS
# - TypeScript
# - Vite
# - Testing libraries
# - And more...
```

!!! info "Installation Time"
    The initial installation may take 2-5 minutes depending on your internet connection and system performance.

### 6. Verify Installation

```bash
# Run the development server
npm run dev
```

If successful, you should see:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 🔧 Development Environment Setup

### VS Code Setup (Recommended)

1. **Install VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/)

2. **Install Recommended Extensions**:
   ```bash
   # Open VS Code in the project directory
   code .
   
   # VS Code will prompt to install recommended extensions
   # Or install manually from the Extensions view
   ```

   **Essential Extensions:**
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier - Code formatter
   - Auto Rename Tag
   - Bracket Pair Colorizer

3. **Configure Settings**:
   Create `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.preferences.importModuleSpecifier": "relative"
   }
   ```

### Alternative Editors

=== "WebStorm/IntelliJ"
    1. Open the project directory
    2. Enable TypeScript support
    3. Install Tailwind CSS plugin
    4. Configure Prettier and ESLint

=== "Vim/Neovim"
    **Recommended plugins:**
    - `neoclide/coc.nvim` for TypeScript support
    - `leafgarland/typescript-vim` for syntax highlighting
    - `prettier/vim-prettier` for formatting

=== "Sublime Text"
    **Required packages:**
    - TypeScript package
    - LSP package for language server support
    - Prettier package for formatting

## 🧪 Test Installation

### Run All Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Lint code
npm run lint

# Type check
npm run type-check
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

If all commands complete successfully, your installation is correct! ✅

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Node.js Version Issues

!!! problem "Node.js too old"
    ```bash
    # Error: This package requires Node.js version >= 18.0.0
    
    # Solution: Update Node.js
    # Using nvm (recommended)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install node
    nvm use node
    ```

#### Permission Issues

!!! problem "EACCES permission errors"
    ```bash
    # On macOS/Linux
    sudo chown -R $(whoami) ~/.npm
    
    # Or use a Node version manager like nvm
    ```

#### Network/Proxy Issues

!!! problem "Can't install packages"
    ```bash
    # Configure npm proxy
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    
    # Or use yarn instead
    npm install -g yarn
    yarn install
    ```

#### Windows-Specific Issues

!!! problem "Git line ending issues"
    ```bash
    git config --global core.autocrlf true
    git config --global core.eol lf
    ```

!!! problem "PowerShell execution policy"
    ```powershell
    # Run as Administrator
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

#### Port Already in Use

!!! problem "Port 5173 already in use"
    ```bash
    # Find and kill the process
    # Windows
    netstat -ano | findstr :5173
    taskkill /PID <PID> /F
    
    # macOS/Linux
    lsof -ti:5173 | xargs kill -9
    
    # Or use a different port
    npm run dev -- --port 3000
    ```

### Performance Optimization

#### Slow Installation

```bash
# Use faster package manager
npm install -g pnpm
pnpm install

# Or configure npm for faster installs
npm config set registry https://registry.npmmirror.com/
```

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 🔍 Verify Your Setup

Run this comprehensive check to ensure everything is working:

```bash
# Create a test script
cat > verify-setup.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Verifying Headless UI Todo App Setup\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js: ${nodeVersion}`);

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm: v${npmVersion}`);
} catch (error) {
  console.log('❌ npm not found');
}

// Check Git
try {
  const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
  console.log(`✅ ${gitVersion}`);
} catch (error) {
  console.log('❌ Git not found');
}

// Check project files
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tailwind.config.js',
  'src/main.tsx'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const critical = ['react', '@headlessui/react', 'vite', 'typescript'];
  critical.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`❌ ${dep} missing`);
    }
  });
} catch (error) {
  console.log('❌ Could not verify dependencies');
}

console.log('\n🎉 Setup verification complete!');
EOF

# Run the verification
node verify-setup.js

# Clean up
rm verify-setup.js
```

## 🎯 Next Steps

Once installation is complete:

1. **[Quick Start](quick-start.md)** - Get the app running
2. **[Configuration](configuration.md)** - Customize the setup
3. **[User Guide](../user-guide/features.md)** - Learn the features
4. **[Developer Guide](../developer-guide/architecture.md)** - Dive into the code

---

**Need Help?** If you encounter any issues not covered here, please [create an issue](https://github.com/busseyl/sdd-headless-ui-react-todo-app/issues) on GitHub with your system details and error messages.
