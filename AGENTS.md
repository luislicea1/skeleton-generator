# Agent Guidelines for skeleton-generator

This is a Next.js 16 (App Router) React 19 TypeScript project using Tailwind CSS v4 and Bun.

## Build Commands

```bash
# Development server (runs on port 4000)
bun dev

# Production build
bun run build

# Start production server
bun start
```

Note: This project uses Bun as the package manager. Use `bun` instead of `npm`/`yarn`/`pnpm`.

## Testing

No test framework is currently configured. If adding tests:

```bash
# Run all tests
bun test

# Run a single test file
bun test <test-file-path>

# Run tests in watch mode
bun test --watch
```

## Linting & Type Checking

No ESLint or Prettier is configured. Type checking is done via TypeScript's `tsc`.

```bash
# Type check
bunx tsc --noEmit

# Or with Next.js
bunx next lint
```

## Code Style Guidelines

### Project Structure

- Use App Router (`app/` directory) for new pages
- Keep components in `app/` or `modules/` directories
- Use `@/*` path alias for imports (e.g., `@/components/Button`)

### TypeScript

- **Always use TypeScript** - no plain JavaScript files
- Enable `strict: true` in tsconfig (already set)
- Define proper types for props, return values, and function parameters
- Avoid `any` - use `unknown` when type is truly unknown
- Use interface for object shapes, type for unions/primitives

### Naming Conventions

- **Files**: kebab-case (e.g., `my-component.tsx`)
- **Components**: PascalCase (e.g., `Button.tsx`)
- **Functions/variables**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Interfaces**: PascalCase, prefix with `I` only when needed for disambiguation

### React Patterns

- Use functional components with arrow functions or `function` keyword
- Use `use client` directive for client-side components
- Prefer composition over inheritance
- Use `memo`, `useMemo`, `useCallback` judiciously for performance
- Keep component files focused (one component per file when reasonable)

### Imports

```typescript
// External libraries
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Path alias (recommended)
import { Button } from '@/components/Button'

// Relative (use sparingly)
import { utils } from '@/lib/utils'
```

Order imports: External → Path alias → Relative

### Error Handling

- Use try/catch with async/await
- Always handle errors in async functions
- Create custom error types/classes for domain-specific errors
- Log errors appropriately (console.error for dev, proper logging in production)

### CSS & Styling

- Use Tailwind CSS utility classes
- Keep custom CSS minimal - leverage Tailwind's configuration
- Use CSS variables for theme colors in `app/globals.css`
- Avoid inline styles except for dynamic values

### Async/Await

- Always handle promise rejections
- Use `await` consistently, avoid mixing with `.then()`
- Consider loading states for async operations in UI

### General Patterns

- Use early returns to reduce nesting
- Keep functions small and focused (single responsibility)
- Extract complex logic into separate utilities
- Document complex business logic with comments
- Use meaningful variable and function names

## Cursor/Copilot Rules

No existing Cursor or Copilot rules found in this project.
