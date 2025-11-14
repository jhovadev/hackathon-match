# Agent Guidelines for hackathon-matcher

## Commands
- **Dev**: `bun dev`
- **Build**: `bun run build`
- **Start**: `bun start`
- **Lint**: `bun run lint`
- **DB Push**: `bun drizzle-kit push`
- **DB Studio**: `bun drizzle-kit studio`
- **Seed DB**: `bun tsx scripts/seed.ts`
- **No test suite configured**

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, Radix UI components, Lucide icons, Motion (Framer Motion)
- **Database**: PostgreSQL with Drizzle ORM, Neon serverless
- **Auth**: Custom session-based authentication with secure token hashing
- **Email**: Resend for transactional emails
- **Avatar**: DiceBear pixel-art avatars
- **Themes**: next-themes for dark/light mode
- **Runtime**: Bun
- **Analytics**: Vercel Analytics
- **Path alias**: `@/*` maps to root

## Architecture

### Database Schema
- **participants**: User profiles with auth credentials, contact info, project interests, social links, avatar seeds, and team status
- **sessions**: Session management with secure token hashing and cascade deletion

### Authentication System
- Session-based auth using secure random tokens (24-char alphanumeric)
- SHA-256 password hashing with constant-time comparison
- HTTP-only cookies with 24-hour expiration
- Middleware-protected routes (/profile, /p/*)
- Auto-generated secure passwords during seeding

### Key Features
1. **Public Participant Grid**: Auto-shuffling every 20s with progress bar, pixel-art avatars, animated cards
2. **Profile Management**: Edit personal info, randomize avatar, toggle team status, view-only email
3. **Participant Details**: Individual profile pages with full info and social links
4. **Authentication**: Login/logout with email and password
5. **Theme Support**: Light/dark mode toggle with next-themes
6. **Responsive Design**: Mobile-first with retro/pixel aesthetic

### File Structure
```
app/
  api/auth/           # Login/logout endpoints
  api/profile/        # Profile update endpoint
  login/              # Login page
  profile/            # Profile edit page (protected)
  p/[id]/             # Participant detail pages (protected)
  page.tsx            # Home page with participant grid
components/
  ui/                 # Shadcn/Radix UI components
  participant-*.tsx   # Participant display components
  shuffle-progress-bar.tsx  # Auto-shuffle timer
  theme-toggle.tsx    # Dark/light mode switcher
db/
  schema.ts           # Drizzle schema definitions
  index.ts            # Database client
lib/
  auth.ts             # Password hashing and token generation
  session.ts          # Session management and validation
  avatar.ts           # Avatar URL generation
  utils.ts            # Tailwind utilities
scripts/
  seed.ts             # CSV import with auto-generated passwords
```

## Code Style
- **TypeScript**: Strict mode enabled, always use explicit types for exports
- **Imports**: Next.js built-ins first, then React, then components, then types with `import type`
- **Components**: Functional components with TypeScript, use `export default` for pages/layouts
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Formatting**: ESLint with Next.js config (core-web-vitals + TypeScript rules)
- **Styling**: Tailwind utility classes, prefer inline className over CSS modules. Use pixel/retro aesthetic with `border-2`, `rounded-sm`, uppercase text
- **Error handling**: Use try/catch for async operations, provide user-friendly error messages
- **Server/Client**: Use `"use client"` directive only when needed (forms, motion, state). Use server components by default
- **Security**: Never expose passwords or session tokens, always hash sensitive data, use httpOnly cookies

## Database Operations
- Use Drizzle ORM for all database queries
- Import db from `@/db` and schema from `@/db/schema`
- Use prepared statements with `.where(eq(...))` for queries
- Handle errors gracefully with try/catch
- Use `revalidate` for ISR caching on public pages

## Animation Patterns
- Use `motion` from `motion/react` for animations
- AnimatePresence with `mode="popLayout"` for list animations
- Spring animations for smooth transitions (stiffness: 350, damping: 25)
- Hover effects with scale transforms and background transitions
