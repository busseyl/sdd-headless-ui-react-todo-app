# Performance Guide

Comprehensive guide to performance optimizations and monitoring in the Todo App.

## 🚀 Performance Overview

The Todo App is optimized for high performance across all devices and network conditions, achieving significant improvements through modern optimization techniques.

### Performance Metrics

**Bundle Optimization Results:**
- **Main Bundle**: 228KB (70KB gzipped) - 38% reduction from 372KB
- **React Core**: 123KB (39KB gzipped) - Separated for better caching
- **UI Components**: 15KB (5KB gzipped) - Headless UI chunk
- **Utilities**: 8KB (3KB gzipped) - Helper functions and icons

**Runtime Performance:**
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3s
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Input Delay (FID)**: <100ms

## 🎯 Core Optimization Strategies

### 1. Code Splitting and Lazy Loading

**Component-Level Splitting:**
```typescript
// LazyComponents.tsx
import { lazy } from 'react';

// Lazy load non-critical components
export const LazyTaskForm = lazy(() => import('./TaskForm'));
export const LazyKeyboardShortcuts = lazy(() => import('./KeyboardShortcuts'));
export const LazyPWAInstallPrompt = lazy(() => import('./PWAInstallPrompt'));

// Route-level splitting for larger applications
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazySettings = lazy(() => import('../pages/Settings'));
```

**LazyWrapper with Error Boundaries:**
```typescript
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <ComponentSkeleton />,
  errorFallback: ErrorFallback = DefaultErrorFallback,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
```

**Loading Skeletons:**
```typescript
export const TaskFormSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="h-20 bg-gray-200 rounded"></div>
    <div className="flex space-x-2">
      <div className="h-10 bg-gray-200 rounded w-20"></div>
      <div className="h-10 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);
```

### 2. Bundle Optimization

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'headless-ui': ['@headlessui/react'],
          'icons': ['@heroicons/react'],
          'utilities': ['clsx', 'date-fns']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@headlessui/react']
  }
});
```

**Modern Browser Targeting:**
```json
// package.json
{
  "browserslist": [
    "defaults and supports es6-module",
    "maintained node versions"
  ]
}
```

### 3. Runtime Optimizations

**Virtualized Lists:**
```typescript
interface VirtualizedTaskListProps {
  tasks: Task[];
  itemHeight: number;
  containerHeight: number;
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  itemHeight,
  containerHeight
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    tasks.length
  );
  
  const visibleTasks = tasks.slice(visibleStart, visibleEnd);
  const totalHeight = tasks.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              style={{ height: itemHeight }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Optimistic Updates:**
```typescript
const useOptimisticTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, Partial<Task>>>(new Map());

  const updateTaskOptimistically = useCallback((id: string, updates: Partial<Task>) => {
    // Immediate UI update
    setOptimisticUpdates(prev => new Map(prev).set(id, updates));
    
    // Async server update
    updateTaskOnServer(id, updates)
      .then(() => {
        // Remove optimistic update on success
        setOptimisticUpdates(prev => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        // Update actual tasks
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ));
      })
      .catch(() => {
        // Revert optimistic update on error
        setOptimisticUpdates(prev => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      });
  }, []);

  // Merge actual tasks with optimistic updates
  const displayTasks = useMemo(() => 
    tasks.map(task => ({
      ...task,
      ...optimisticUpdates.get(task.id)
    })), [tasks, optimisticUpdates]
  );

  return { tasks: displayTasks, updateTaskOptimistically };
};
```

## 📊 Performance Monitoring

### Web Vitals Tracking

**Core Web Vitals Hook:**
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsMetrics {
  CLS?: number;
  FID?: number;
  FCP?: number;
  LCP?: number;
  TTFB?: number;
}

export const useWebVitals = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});

  useEffect(() => {
    getCLS((metric) => setMetrics(prev => ({ ...prev, CLS: metric.value })));
    getFID((metric) => setMetrics(prev => ({ ...prev, FID: metric.value })));
    getFCP((metric) => setMetrics(prev => ({ ...prev, FCP: metric.value })));
    getLCP((metric) => setMetrics(prev => ({ ...prev, LCP: metric.value })));
    getTTFB((metric) => setMetrics(prev => ({ ...prev, TTFB: metric.value })));
  }, []);

  return metrics;
};
```

**Performance Monitor Component:**
```typescript
export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  const metrics = useWebVitals();
  const renderCount = useRef(0);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    renderCount.current += 1;
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      setRenderTime(end - start);
    };
  });

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
      <div>CLS: {metrics.CLS?.toFixed(3)}</div>
      <div>FID: {metrics.FID?.toFixed(0)}ms</div>
      <div>FCP: {metrics.FCP?.toFixed(0)}ms</div>
      <div>LCP: {metrics.LCP?.toFixed(0)}ms</div>
      <div>Renders: {renderCount.current}</div>
      <div>Last Render: {renderTime.toFixed(2)}ms</div>
    </div>
  );
};
```

### Performance Budgets

**Budget Configuration:**
```typescript
// performance.config.ts
export const performanceBudgets = {
  // Bundle size budgets
  bundles: {
    main: { maxSize: 250 * 1024 }, // 250KB
    vendor: { maxSize: 150 * 1024 }, // 150KB
    total: { maxSize: 500 * 1024 } // 500KB
  },
  
  // Runtime performance budgets
  vitals: {
    FCP: 1500, // 1.5s
    LCP: 2500, // 2.5s
    FID: 100,  // 100ms
    CLS: 0.1,  // 0.1
    TTFB: 600  // 600ms
  }
};

export const checkPerformanceBudget = (metrics: WebVitalsMetrics) => {
  const violations = [];
  
  Object.entries(performanceBudgets.vitals).forEach(([metric, budget]) => {
    const value = metrics[metric as keyof WebVitalsMetrics];
    if (value && value > budget) {
      violations.push({ metric, value, budget });
    }
  });
  
  return violations;
};
```

**Build-time Budget Checking:**
```typescript
// scripts/check-bundle-size.js
import { stat } from 'fs/promises';
import { performanceBudgets } from '../src/performance.config.js';

const checkBundleSize = async () => {
  const distDir = './dist/assets';
  const files = await readdir(distDir);
  
  const mainBundle = files.find(f => f.startsWith('index-'));
  const vendorBundle = files.find(f => f.startsWith('vendor-'));
  
  if (mainBundle) {
    const stats = await stat(`${distDir}/${mainBundle}`);
    if (stats.size > performanceBudgets.bundles.main.maxSize) {
      console.error(`Main bundle exceeds budget: ${stats.size} > ${performanceBudgets.bundles.main.maxSize}`);
      process.exit(1);
    }
  }
};

checkBundleSize();
```

## 🎨 Rendering Optimizations

### React Optimization Patterns

**Memoization:**
```typescript
// Memoized component to prevent unnecessary re-renders
const TaskItem = React.memo<TaskItemProps>(({ task, onToggle, onEdit, onDelete }) => {
  const handleToggle = useCallback(() => onToggle(task.id), [task.id, onToggle]);
  const handleEdit = useCallback(() => onEdit(task.id), [task.id, onEdit]);
  const handleDelete = useCallback(() => onDelete(task.id), [task.id, onDelete]);

  return (
    <div className="task-item">
      {/* Component JSX */}
    </div>
  );
});

// Memoized selectors for expensive calculations
const useFilteredTasks = (tasks: Task[], filters: TaskFilters) => {
  return useMemo(() => {
    return tasks.filter(task => {
      if (filters.category && task.category !== filters.category) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.completed !== undefined && task.completed !== filters.completed) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filters]);
};
```

**Virtual Scrolling for Large Lists:**
```typescript
const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    setScrollTop
  };
};
```

### State Management Optimization

**Reducer Pattern for Complex State:**
```typescript
interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sortOption: SortOption;
  loading: boolean;
  error: string | null;
}

type TaskAction = 
  | { type: 'LOAD_TASKS_START' }
  | { type: 'LOAD_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'LOAD_TASKS_ERROR'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: TaskFilters }
  | { type: 'SET_SORT'; payload: SortOption };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'LOAD_TASKS_START':
      return { ...state, loading: true, error: null };
    
    case 'LOAD_TASKS_SUCCESS':
      return { ...state, tasks: action.payload, loading: false };
    
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload] 
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };
    
    default:
      return state;
  }
};
```

## 🔧 Development Performance

### Hot Module Replacement (HMR)

**Vite HMR Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@headlessui/react',
      '@heroicons/react'
    ]
  }
});
```

**Fast Refresh Optimization:**
```typescript
// Ensure components are Fast Refresh compatible
const TaskForm = () => {
  // Use consistent hook order
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Memoize callbacks
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    // Handle submission
  }, [title, description]);

  return <form onSubmit={handleSubmit}>{/* Form JSX */}</form>;
};

export default TaskForm;
```

### Build Performance

**Parallel Processing:**
```bash
# Use multiple CPU cores for builds
npm run build -- --mode=production --parallel=true

# TypeScript compilation in parallel
tsc --build --parallel
```

**Cache Optimization:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  optimizeDeps: {
    entries: ['src/main.tsx']
  }
});
```

## 📱 Mobile Performance

### Touch Optimization

```typescript
const useTouchOptimization = () => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    return { isLeftSwipe, isRightSwipe };
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
```

### Image Optimization

```typescript
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
}> = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div className="relative">
      <img
        ref={imgRef}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
```

## 🎯 Performance Testing

### Lighthouse Automation

```typescript
// scripts/lighthouse.js
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

const runLighthouse = async (url: string) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  
  await chrome.kill();
  
  const { score } = runnerResult.lhr.categories.performance;
  
  if (score < 0.9) {
    console.error(`Performance score ${score} is below threshold 0.9`);
    process.exit(1);
  }
  
  return runnerResult;
};
```

### Bundle Analysis

```bash
# Analyze bundle composition
npx vite-bundle-analyzer dist

# Check for duplicate dependencies
npx duplicate-package-checker

# Visualize bundle tree
npx webpack-bundle-analyzer dist/stats.json
```

## 📊 Monitoring and Alerting

### Real User Monitoring (RUM)

```typescript
const useRealUserMonitoring = () => {
  const sendMetric = useCallback((metric: string, value: number) => {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: value,
        custom_map: { metric: 'performance' }
      });
    }
  }, []);

  useEffect(() => {
    // Report Web Vitals
    getCLS(metric => sendMetric('CLS', metric.value));
    getFID(metric => sendMetric('FID', metric.value));
    getFCP(metric => sendMetric('FCP', metric.value));
    getLCP(metric => sendMetric('LCP', metric.value));
    getTTFB(metric => sendMetric('TTFB', metric.value));
  }, [sendMetric]);
};
```

### Performance Alerts

```typescript
const usePerformanceAlerts = () => {
  const [alerts, setAlerts] = useState<string[]>([]);

  const checkPerformance = useCallback((metrics: WebVitalsMetrics) => {
    const newAlerts = [];
    
    if (metrics.LCP && metrics.LCP > 2500) {
      newAlerts.push('LCP is above 2.5s threshold');
    }
    
    if (metrics.FID && metrics.FID > 100) {
      newAlerts.push('FID is above 100ms threshold');
    }
    
    if (metrics.CLS && metrics.CLS > 0.1) {
      newAlerts.push('CLS is above 0.1 threshold');
    }

    setAlerts(newAlerts);
  }, []);

  return { alerts, checkPerformance };
};
```

## 🚀 Deployment Optimizations

### CDN Configuration

```typescript
// Static asset optimization
const optimizeAssets = {
  images: {
    formats: ['webp', 'avif', 'jpg'],
    sizes: [320, 640, 1024, 1280],
    quality: 80
  },
  
  fonts: {
    preload: ['Inter-Regular.woff2', 'Inter-Medium.woff2'],
    display: 'swap'
  },
  
  scripts: {
    defer: true,
    preload: ['critical.js'],
    prefetch: ['non-critical.js']
  }
};
```

### Service Worker Optimization

```typescript
// sw.js - Service Worker optimization
const CACHE_NAME = 'todo-app-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/static/fonts/inter.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

For implementation details and advanced optimization techniques, see the [Component API Documentation](./COMPONENTS.md) and [Testing Guide](./TESTING.md).
