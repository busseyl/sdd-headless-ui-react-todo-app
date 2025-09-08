# GitHub Pages Deployment

This guide shows you how to deploy the Headless UI Todo App documentation to GitHub Pages, making it accessible to users and contributors.

## 🚀 Quick Setup

### Prerequisites

- GitHub repository with the project
- GitHub account with Pages enabled
- Documentation built with MkDocs

### 1. Repository Configuration

First, ensure your repository has the correct structure:

```
your-repo/
├── docs/                  # MkDocs documentation source
├── mkdocs.yml            # MkDocs configuration
├── todo-app/             # Application source code
└── .github/
    └── workflows/
        └── docs.yml      # GitHub Actions workflow
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. This will allow custom workflows to deploy to Pages

### 3. Create GitHub Actions Workflow

Create `.github/workflows/docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'mkdocs.yml'
      - '.github/workflows/docs.yml'
  pull_request:
    branches: [main]
    paths:
      - 'docs/**'
      - 'mkdocs.yml'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install mkdocs-material
          pip install mkdocs-minify-plugin
          pip install pymdown-extensions

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Build documentation
        run: mkdocs build --clean

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: site/

  deploy:
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## 📝 MkDocs Configuration for GitHub Pages

Update your `mkdocs.yml` for GitHub Pages deployment:

```yaml
site_name: Headless UI Todo App
site_url: https://busseyl.github.io/sdd-headless-ui-react-todo-app/
site_description: A comprehensive React Todo Application built with Headless UI components
site_author: Lucas Bussey

repo_url: https://github.com/busseyl/sdd-headless-ui-react-todo-app/
repo_name: busseyl/sdd-headless-ui-react-todo-app
edit_uri: blob/main/docs/

theme:
  name: material
  palette:
    # Palette toggle for automatic mode
    - media: "(prefers-color-scheme)"
      toggle:
        icon: material/brightness-auto
        name: Switch to light mode

    # Palette toggle for light mode
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode

    # Palette toggle for dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to system preference

  features:
    - navigation.tabs
    - navigation.sections
    - navigation.expand
    - navigation.path
    - navigation.top
    - search.highlight
    - search.share
    - content.code.copy
    - content.code.annotate
    - content.action.edit
    - content.action.view

  icon:
    repo: fontawesome/brands/github
    edit: material/pencil
    view: material/eye

extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/busseyl
    - icon: fontawesome/brands/linkedin
      link: https://www.linkedin.com/in/lbussey

  version:
    provider: mike
    default: latest

plugins:
  - search:
      separator: '[\s\-,:!=\[\]()"`/]+|\.(?!\d)|&[lg]t;|(?!\b)(?=[A-Z][a-z])'
  - minify:
      minify_html: true
  - git-revision-date-localized:
      enable_creation_date: true
  - git-committers:
      repository: busseyl/sdd-headless-ui-react-todo-app
      branch: main

markdown_extensions:
  - abbr
  - admonition
  - attr_list
  - def_list
  - footnotes
  - md_in_html
  - toc:
      permalink: true
  - pymdownx.arithmatex:
      generic: true
  - pymdownx.betterem:
      smart_enable: all
  - pymdownx.caret
  - pymdownx.details
  - pymdownx.emoji:
      emoji_index: !!python/name:materialx.emoji.twemoji
      emoji_generator: !!python/name:materialx.emoji.to_svg
  - pymdownx.highlight:
      anchor_linenums: true
      line_spans: __span
      pygments_lang_class: true
  - pymdownx.inlinehilite
  - pymdownx.keys
  - pymdownx.magiclink:
      repo_url_shorthand: true
      user: busseyl
      repo: sdd-headless-ui-react-todo-app
  - pymdownx.mark
  - pymdownx.smartsymbols
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.tasklist:
      custom_checkbox: true
  - pymdownx.tilde
```

## 🔧 Advanced Configuration

### Custom Domain Setup

If you want to use a custom domain:

1. **Create CNAME file** in your `docs/` directory:
   ```
   # docs/CNAME
   your-custom-domain.com
   ```

2. **Update site_url** in `mkdocs.yml`:
   ```yaml
   site_url: https://your-custom-domain.com/
   ```

3. **Configure DNS** with your domain provider:
   - Add a CNAME record pointing to `busseyl.github.io`
   - Or add A records pointing to GitHub Pages IPs

### Environment-Specific Builds

Create different configurations for different environments:

```yaml
# mkdocs.yml (production)
site_url: https://busseyl.github.io/sdd-headless-ui-react-todo-app/
google_analytics:
  - G-XXXXXXXXXX
  - auto

extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

```yaml
# mkdocs.dev.yml (development)
site_url: http://localhost:8000/
dev_addr: '127.0.0.1:8000'

extra:
  analytics: false
```

### Multi-Version Documentation

For multiple versions of documentation:

```yaml
# .github/workflows/docs.yml
- name: Deploy to GitHub Pages
  run: |
    git config user.name github-actions
    git config user.email github-actions@github.com
    mike deploy --push --update-aliases ${{ github.ref_name }} latest
    mike set-default --push latest
```

## 📁 File Structure for GitHub Pages

Ensure your repository structure supports GitHub Pages:

```
your-repo/
├── .github/
│   └── workflows/
│       └── docs.yml              # GitHub Actions workflow
├── docs/                         # Documentation source
│   ├── index.md                  # Homepage
│   ├── getting-started/
│   ├── user-guide/
│   ├── developer-guide/
│   ├── api/
│   ├── deployment/
│   ├── about/
│   ├── assets/                   # Images, CSS, JS
│   │   ├── images/
│   │   ├── stylesheets/
│   │   └── javascripts/
│   └── CNAME                     # Custom domain (optional)
├── mkdocs.yml                    # MkDocs configuration
├── requirements.txt              # Python dependencies (optional)
└── README.md                     # Repository README
```

## 🎨 Customizing for GitHub Pages

### Custom CSS and JavaScript

Add custom styling and behavior:

```css
/* docs/assets/stylesheets/extra.css */
:root {
  --md-primary-fg-color: #6366f1;
  --md-primary-fg-color--light: #8b5cf6;
  --md-primary-fg-color--dark: #4f46e5;
}

.md-header {
  background: linear-gradient(135deg, var(--md-primary-fg-color), var(--md-primary-fg-color--light));
}

.md-tabs {
  background: var(--md-primary-fg-color--dark);
}

/* Custom task demo styles */
.task-demo {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  background: #f9fafb;
}

.task-demo--completed {
  opacity: 0.7;
  text-decoration: line-through;
}

/* Code block enhancements */
.highlight .filename {
  background: var(--md-primary-fg-color);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.85em;
  font-weight: 500;
  border-radius: 4px 4px 0 0;
  margin-bottom: 0;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .md-nav__title {
    font-size: 0.9rem;
  }
  
  .md-typeset h1 {
    font-size: 1.8rem;
  }
}
```

```javascript
// docs/assets/javascripts/extra.js
document.addEventListener('DOMContentLoaded', function() {
  // Add copy button to code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.onclick = () => {
      navigator.clipboard.writeText(block.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 2000);
    };
    block.parentElement.appendChild(button);
  });

  // Interactive demo elements
  const taskDemos = document.querySelectorAll('.task-demo');
  taskDemos.forEach(demo => {
    const checkbox = demo.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        demo.classList.toggle('task-demo--completed', checkbox.checked);
      });
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Analytics (if enabled)
if (typeof gtag !== 'undefined') {
  // Track documentation usage
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
  
  // Track link clicks
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'click', {
        event_category: 'external_link',
        event_label: link.href
      });
    });
  });
}
```

### Interactive Components

Add interactive examples to your documentation:

```html
<!-- docs/user-guide/features.md -->
## Interactive Task Demo

<div class="task-demo">
  <label class="flex items-center space-x-3">
    <input type="checkbox" class="rounded border-gray-300">
    <span>Try checking this interactive task!</span>
  </label>
  <p class="text-sm text-gray-600 mt-2">
    This demonstrates how tasks work in the application
  </p>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const demos = document.querySelectorAll('.task-demo');
  demos.forEach(demo => {
    const checkbox = demo.querySelector('input[type="checkbox"]');
    const text = demo.querySelector('span');
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        text.style.textDecoration = 'line-through';
        text.style.opacity = '0.7';
        demo.style.background = '#f0f9ff';
      } else {
        text.style.textDecoration = 'none';
        text.style.opacity = '1';
        demo.style.background = '#f9fafb';
      }
    });
  });
});
</script>
```

## 🔍 Testing Your Deployment

### Local Testing

Before deploying, test your documentation locally:

```bash
# Install MkDocs and dependencies
pip install mkdocs-material
pip install mkdocs-minify-plugin
pip install pymdown-extensions

# Serve locally
mkdocs serve

# Build for production
mkdocs build

# Serve the built site
cd site && python -m http.server 8000
```

### Validation Checklist

Before going live, verify:

- ✅ All internal links work correctly
- ✅ Images load properly
- ✅ Code examples are properly formatted
- ✅ Navigation menu is complete
- ✅ Search functionality works
- ✅ Mobile responsiveness
- ✅ Dark/light mode switching
- ✅ Social media links are correct
- ✅ Analytics are configured (if used)

### Performance Testing

Check your documentation performance:

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --upload.target=temporary-public-storage
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```yaml
# Check GitHub Actions logs for these common issues:

# Missing dependencies
- name: Install dependencies
  run: |
    pip install -r requirements.txt
    # or
    pip install mkdocs-material mkdocs-minify-plugin

# Python version issues
- name: Setup Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.11'  # Use specific version

# Permissions issues
permissions:
  contents: read
  pages: write
  id-token: write
```

#### 404 Errors

- Check that `site_url` matches your GitHub Pages URL
- Verify all internal links use correct paths
- Ensure `edit_uri` points to the correct branch

#### Styling Issues

- Verify custom CSS files are in `docs/assets/stylesheets/`
- Check that file paths in `mkdocs.yml` are correct
- Test locally with `mkdocs serve` first

#### Search Not Working

```yaml
# Ensure search plugin is configured
plugins:
  - search:
      separator: '[\s\-,:!=\[\]()"`/]+|\.(?!\d)|&[lg]t;|(?!\b)(?=[A-Z][a-z])'
```

### Debug Mode

Enable debugging in your workflow:

```yaml
- name: Build documentation
  run: mkdocs build --clean --verbose
  env:
    MKDOCS_DEBUG: 1
```

## 🎯 Best Practices

### SEO Optimization

```yaml
# mkdocs.yml
site_description: A comprehensive React Todo Application built with Headless UI components
site_keywords: [react, headless-ui, todo, accessibility, typescript, pwa]

plugins:
  - meta
  - sitemap:
      change_frequency: daily
      priority: 0.8

extra:
  alternate:
    - name: English
      link: /
      lang: en
```

### Content Organization

- Use clear, descriptive headings
- Include a table of contents for long pages
- Add navigation breadcrumbs
- Cross-reference related content
- Keep paragraphs concise and scannable

### Accessibility

- Use semantic HTML in custom content
- Provide alt text for all images
- Ensure sufficient color contrast
- Test with keyboard navigation
- Include skip links where appropriate

## 📊 Analytics and Monitoring

### Google Analytics

```yaml
# mkdocs.yml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
    feedback:
      title: Was this page helpful?
      ratings:
        - icon: material/emoticon-happy-outline
          name: This page was helpful
          data: 1
          note: >-
            Thanks for your feedback!
        - icon: material/emoticon-sad-outline
          name: This page could be improved
          data: 0
          note: >-
            Thanks for your feedback! Help us improve this page by
            <a href="..." target="_blank" rel="noopener">telling us what you need</a>.
```

### Monitor Performance

- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Check loading times regularly
- Optimize images and assets
- Monitor broken links

## 🚀 Deployment Checklist

Before going live:

- [ ] Update all placeholder URLs and names
- [ ] Configure custom domain (if applicable)
- [ ] Set up analytics (if desired)
- [ ] Test all links and navigation
- [ ] Verify mobile responsiveness
- [ ] Check accessibility compliance
- [ ] Review content for accuracy
- [ ] Set up monitoring and alerts
- [ ] Create backup of configuration
- [ ] Document deployment process

## 📚 Next Steps

After successful deployment:

1. **Monitor Analytics** - Track usage and popular content
2. **Gather Feedback** - Use issue templates for documentation feedback
3. **Regular Updates** - Keep content current with code changes
4. **SEO Optimization** - Improve search engine visibility
5. **Community Engagement** - Encourage contributions and discussions

Your documentation is now live and accessible to users worldwide! 🎉

---

**Need Help?** Check out the [MkDocs documentation](https://www.mkdocs.org/) or [GitHub Pages documentation](https://docs.github.com/en/pages) for more advanced configuration options.
