# Agent Guidelines for hackathon-matcher

## Commands
- **Dev**: `bun dev`
- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **No test suite configured**

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS v4, Bun runtime
- Path alias: `@/*` maps to root

## Code Style
- **TypeScript**: Strict mode enabled, always use explicit types for exports
- **Imports**: Next.js built-ins first, then React, then components, then types with `import type`
- **Components**: Functional components with TypeScript, use `export default` for pages/layouts
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Formatting**: ESLint with Next.js config (core-web-vitals + TypeScript rules)
- **Styling**: Tailwind utility classes, prefer inline className over CSS modules
- **Error handling**: Use try/catch for async operations, provide user-friendly error messages
