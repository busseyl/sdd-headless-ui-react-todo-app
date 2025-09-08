# Headless UI Todo App Documentation

This directory contains the MkDocs documentation for the Headless UI Todo App, a modern React application demonstrating accessibility best practices with Headless UI components.

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start development server:**
   ```bash
   mkdocs serve
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Building Documentation

```bash
# Build static site
mkdocs build

# Build and serve
mkdocs serve
```

## 📁 Documentation Structure

```
docs/
├── index.md                 # Homepage
├── getting-started/         # Setup and installation guides
├── user-guide/             # End-user documentation
├── developer-guide/        # Technical documentation
├── api/                    # API reference
├── testing/                # Testing strategies and guides
├── deployment/             # Deployment instructions
├── about/                  # Project information
├── faq.md                  # Frequently asked questions
└── assets/                 # Static assets
    ├── stylesheets/        # Custom CSS
    └── javascripts/        # Custom JS
```

## 🎨 Customization

### Theme Configuration

The documentation uses the Material for MkDocs theme with custom styling:

- **Primary color:** Indigo
- **Dark/Light mode:** Toggle available
- **Navigation:** Tabbed with sections
- **Search:** Full-text search enabled

### Custom Styling

Custom styles are located in:
- `docs/assets/stylesheets/extra.css` - Additional styles and task demos
- `docs/assets/javascripts/extra.js` - Interactive functionality

### Adding Content

1. **Create new page:**
   ```bash
   touch docs/your-section/new-page.md
   ```

2. **Update navigation** in `mkdocs.yml`:
   ```yaml
   nav:
     - Your Section:
       - New Page: your-section/new-page.md
   ```

3. **Test locally:**
   ```bash
   mkdocs serve
   ```

## 🚀 Deployment

### GitHub Pages (Automatic)

Documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch via GitHub Actions.

**Setup:**
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch

### Manual Deployment

```bash
# Build and deploy to gh-pages branch
mkdocs gh-deploy
```

### Other Platforms

The documentation can be deployed to any static hosting platform:

- **Netlify:** Connect repository and set build command to `mkdocs build`
- **Vercel:** Import repository with build command `mkdocs build` and output directory `site`
- **AWS S3:** Upload contents of `site/` directory after `mkdocs build`

## 🔧 Configuration

### MkDocs Configuration

Key configuration options in `mkdocs.yml`:

```yaml
site_name: Headless UI Todo App
site_url: https://busseyl.github.io
theme:
  name: material
  palette:
    scheme: default
    primary: indigo
```

### Plugin Configuration

Enabled plugins:
- **search:** Full-text search
- **minify:** HTML/CSS/JS minification
- **git-revision-date-localized:** Last updated dates
- **git-committers:** Contributor information

### Markdown Extensions

Supported extensions:
- **admonition:** Call-out boxes
- **pymdownx.highlight:** Syntax highlighting
- **pymdownx.superfences:** Code blocks
- **attr_list:** HTML attributes
- **md_in_html:** Markdown in HTML

## 📊 Analytics and Monitoring

### Google Analytics

To enable analytics, add your tracking ID in `mkdocs.yml`:

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

### Performance Monitoring

The documentation includes:
- Lighthouse CI in GitHub Actions
- Core Web Vitals monitoring
- Accessibility testing

## 🤝 Contributing

### Documentation Guidelines

1. **Write clear, concise content**
2. **Use consistent formatting**
3. **Include code examples**
4. **Test all links**
5. **Follow accessibility best practices**

### Making Changes

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test locally with `mkdocs serve`**
5. **Submit a pull request**

### Style Guide

- Use sentence case for headings
- Include alt text for images
- Use relative links for internal pages
- Follow markdown best practices

## 🛠️ Development Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
mkdocs serve

# Build documentation
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy

# Validate configuration
mkdocs config

# Check for broken links
mkdocs serve --strict
```

## 📋 Maintenance

### Regular Tasks

- [ ] Update dependencies in `requirements.txt`
- [ ] Review and update outdated content
- [ ] Check for broken links
- [ ] Update screenshots and examples
- [ ] Monitor site performance

### Dependency Updates

```bash
# Check for outdated packages
pip list --outdated

# Update requirements
pip freeze > requirements.txt
```

## 🐛 Troubleshooting

### Common Issues

1. **Build fails:**
   - Check `mkdocs.yml` syntax
   - Verify all referenced files exist
   - Check Python dependencies

2. **Local server won't start:**
   - Ensure port 8000 is available
   - Check Python version compatibility
   - Verify working directory

3. **Styling issues:**
   - Clear browser cache
   - Check CSS syntax in `extra.css`
   - Verify asset paths

### Getting Help

- Check [MkDocs documentation](https://www.mkdocs.org/)
- Review [Material theme docs](https://squidfunk.github.io/mkdocs-material/)
- Search existing issues in the repository
- Create a new issue with detailed information

## 📄 License

This documentation is part of the Headless UI Todo App project and follows the same license terms.

---

*For more information about the main application, see the [main README](../README.md).*
