# Development Setup

This document outlines the development tools and configuration for the Seller Console project.

## Prettier & ESLint Configuration

### ESLint
- **Configuration**: `eslint.config.js` (ESLint 9+ flat config)
- **Features**:
  - TypeScript support with strict rules
  - React Hooks linting
  - React Refresh integration
  - Code quality rules (no-console warnings, no-debugger errors)
  - Unused variables with underscore prefix are allowed
  - Integration with Prettier to avoid conflicts

### Prettier
- **Configuration**: `.prettierrc.json`
- **Settings**:
  - Single quotes
  - No semicolons
  - 100 character line width
  - 2 spaces for indentation
  - Trailing commas (ES5)
  - Arrow function parens avoided when possible

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run typecheck    # Run TypeScript type checking

# Build
npm run build        # Build for production
npm run preview      # Preview production build
```

## VS Code Integration

The project includes VS Code configuration in `.vscode/`:

### Settings (`.vscode/settings.json`)
- Format on save enabled
- ESLint auto-fix on save
- Prettier as default formatter
- TypeScript preferences
- Tailwind CSS support

### Recommended Extensions (`.vscode/extensions.json`)
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Pre-commit Workflow

Recommended workflow for development:

1. **Before committing**:
   ```bash
   npm run format      # Format all files
   npm run lint        # Check for linting issues
   npm run typecheck   # Verify TypeScript types
   ```

2. **Auto-formatting**: VS Code will auto-format on save if you have the recommended extensions installed.

## File Organization

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── data/          # Static data files
└── ...
```

## Development Guidelines

1. **Code Style**: Follow Prettier formatting rules
2. **Type Safety**: All code should pass TypeScript checks
3. **Linting**: Fix all ESLint errors before committing
4. **Components**: Use functional components with hooks
5. **Error Handling**: Use underscore prefix for unused error variables in catch blocks