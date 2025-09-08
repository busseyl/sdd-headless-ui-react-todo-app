// Custom JavaScript for Headless UI Todo App documentation

document.addEventListener('DOMContentLoaded', function() {
  initializeCopyButtons();
  initializeTaskDemos();
  initializeComponentExamples();
  initializeSmoothScrolling();
  initializeAnalytics();
});

/**
 * Add copy buttons to code blocks
 */
function initializeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    // Skip if copy button already exists
    if (block.parentElement.querySelector('.copy-button')) return;
    
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    
    button.onclick = async () => {
      try {
        await navigator.clipboard.writeText(block.textContent);
        button.textContent = 'Copied!';
        button.style.background = 'rgba(16, 185, 129, 0.9)';
        
        setTimeout(() => {
          button.textContent = 'Copy';
          button.style.background = 'rgba(0, 0, 0, 0.7)';
        }, 2000);
        
        // Track copy action
        if (typeof gtag !== 'undefined') {
          gtag('event', 'code_copy', {
            event_category: 'engagement',
            event_label: 'documentation'
          });
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
        button.textContent = 'Failed';
        setTimeout(() => button.textContent = 'Copy', 2000);
      }
    };
    
    // Make the parent container relative for absolute positioning
    block.parentElement.style.position = 'relative';
    block.parentElement.appendChild(button);
  });
}

/**
 * Initialize interactive task demos
 */
function initializeTaskDemos() {
  const taskDemos = document.querySelectorAll('.task-demo');
  
  taskDemos.forEach(demo => {
    const checkbox = demo.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    
    // Add proper accessibility attributes
    const title = demo.querySelector('.task-demo__title');
    if (title) {
      const taskId = `task-demo-${Math.random().toString(36).substr(2, 9)}`;
      checkbox.id = taskId;
      checkbox.setAttribute('aria-describedby', `${taskId}-desc`);
      title.id = `${taskId}-desc`;
    }
    
    checkbox.addEventListener('change', () => {
      demo.classList.toggle('task-demo--completed', checkbox.checked);
      
      // Announce state change to screen readers
      const announcement = checkbox.checked ? 'Task marked as completed' : 'Task marked as active';
      announceToScreenReader(announcement);
      
      // Add visual feedback
      if (checkbox.checked) {
        demo.style.transform = 'scale(0.98)';
        setTimeout(() => {
          demo.style.transform = 'scale(1)';
        }, 150);
      }
    });
    
    // Add keyboard support for demo interaction
    demo.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
    
    // Make demo focusable
    demo.setAttribute('tabindex', '0');
    demo.setAttribute('role', 'button');
    demo.setAttribute('aria-label', `Interactive task demo: ${title?.textContent || 'Task'}`);
  });
}

/**
 * Initialize component examples with interactive features
 */
function initializeComponentExamples() {
  const examples = document.querySelectorAll('.component-example');
  
  examples.forEach(example => {
    // Add interactive behavior to buttons in examples
    const buttons = example.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.onclick) {
        button.onclick = () => {
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = 'scale(1)';
          }, 100);
          
          announceToScreenReader(`${button.textContent} button activated`);
        };
      }
    });
    
    // Add interactive behavior to form elements
    const inputs = example.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.outline = '2px solid #6366f1';
        input.style.outlineOffset = '2px';
      });
      
      input.addEventListener('blur', () => {
        input.style.outline = '';
        input.style.outlineOffset = '';
      });
    });
  });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without triggering scroll
        if (history.pushState) {
          history.pushState(null, null, this.getAttribute('href'));
        }
        
        // Focus the target for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  });
}

/**
 * Initialize analytics tracking
 */
function initializeAnalytics() {
  if (typeof gtag === 'undefined') return;
  
  // Track page view
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
  
  // Track external link clicks
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    // Skip if it's an internal link
    if (link.hostname === window.location.hostname) return;
    
    link.addEventListener('click', () => {
      gtag('event', 'click', {
        event_category: 'external_link',
        event_label: link.href,
        value: 1
      });
    });
  });
  
  // Track search usage
  const searchInput = document.querySelector('input[data-md-component="search-query"]');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (searchInput.value.length > 2) {
          gtag('event', 'search', {
            search_term: searchInput.value,
            event_category: 'engagement'
          });
        }
      }, 1000);
    });
  }
  
  // Track time on page
  let startTime = Date.now();
  let maxScroll = 0;
  
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    maxScroll = Math.max(maxScroll, scrollPercent);
  });
  
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    gtag('event', 'timing_complete', {
      name: 'time_on_page',
      value: timeOnPage
    });
    
    gtag('event', 'scroll', {
      event_category: 'engagement',
      value: maxScroll
    });
  });
}

/**
 * Utility function to announce messages to screen readers
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, 100);
}

/**
 * Handle keyboard navigation enhancements
 */
document.addEventListener('keydown', function(e) {
  // Handle escape key to close modals/overlays
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal.active, .overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      e.preventDefault();
    }
  }
  
  // Handle slash key to focus search
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const searchInput = document.querySelector('input[data-md-component="search-query"]');
    if (searchInput && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  }
});

/**
 * Add theme switching functionality
 */
function initializeThemeToggle() {
  const themeToggle = document.querySelector('[data-md-component="palette"]');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const isDark = document.body.getAttribute('data-md-color-scheme') === 'slate';
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
          event_category: 'engagement',
          event_label: isDark ? 'dark' : 'light'
        });
      }
    });
  }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
  initializeThemeToggle();
}

/**
 * Add print optimization
 */
window.addEventListener('beforeprint', () => {
  // Expand all collapsible sections for print
  document.querySelectorAll('details:not([open])').forEach(details => {
    details.setAttribute('open', '');
    details.dataset.wasClosedForPrint = 'true';
  });
});

window.addEventListener('afterprint', () => {
  // Restore collapsible sections state
  document.querySelectorAll('details[data-was-closed-for-print]').forEach(details => {
    details.removeAttribute('open');
    delete details.dataset.wasClosedForPrint;
  });
});

/**
 * Progressive enhancement for JavaScript-disabled users
 */
document.documentElement.classList.add('js-enabled');

// Export utilities for use in other scripts
window.TodoAppDocs = {
  announceToScreenReader,
  initializeCopyButtons,
  initializeTaskDemos
};
