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
- **participants**: User profiles with auth credentials, contact info, project interests, social links, avatar seeds, and team name
  - `teamName` (text, nullable): Indicates team membership - presence means user has a team
- **sessions**: Session management with secure token hashing and cascade deletion

### Authentication System
- Session-based auth using secure random tokens (24-char alphanumeric)
- SHA-256 password hashing with constant-time comparison
- HTTP-only cookies with 24-hour expiration
- Middleware-protected routes (/profile, /p/*)
- Auto-generated secure passwords during seeding

### Key Features
1. **Team-Grouped Homepage**: 
   - "Looking for Teammates" section (participants without team, auto-shuffling)
   - "Teams" section (grouped by team name, alphabetically sorted)
2. **Team Management** (Invitation-Based System): 
   - Users can create NEW teams via profile (unique names only)
   - Users CANNOT self-join existing teams (server validates uniqueness)
   - Team members can invite others from participant detail pages
   - Add participants to team (only if they have no team AND team size < 5)
   - Remove participants from team (only if on same team)
   - Maximum 5 members per team (enforced server-side)
   - Action-based API (`add`/`remove` actions, not client-controlled teamName)
3. **Profile Management**: Edit personal info, create/leave teams, randomize avatar, view-only email
4. **Participant Details**: Individual profile pages with full info, social links, and team invitation controls
5. **Authentication**: Login/logout with email and password
6. **Role Filtering**: Filter participants by Engineer/Designer/Product/Growth/Other
7. **Theme Support**: Light/dark mode toggle with next-themes
8. **Responsive Design**: Mobile-first with retro/pixel aesthetic

### File Structure
```
app/
  api/auth/           # Login/logout endpoints
  api/profile/        # Profile update endpoint (includes team name)
  api/team/           # Team management endpoint (add/remove members)
  login/              # Login page
  profile/            # Profile edit page (protected)
  p/[id]/             # Participant detail pages (protected, with team mgmt)
  page.tsx            # Home page with team grouping
components/
  ui/                 # Shadcn/Radix UI components
  participant-*.tsx   # Participant display components
  team-section.tsx    # Team grouping component
  shuffle-progress-bar.tsx  # Auto-shuffle timer (for non-team section)
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
- Team membership: Check `teamName` field (not null = has team)

## Team Management Rules

### Team Creation & Joining
- **Creating Teams**: Users can create NEW teams by entering a unique team name in profile
- **Joining Teams**: Users CANNOT self-join existing teams - team names are validated for uniqueness
- **Invitation Model**: To join existing teams, users must be invited by a team member from their participant detail page
- **Leaving Teams**: Users can leave their team by clearing the team name field in profile
- **Renaming Teams**: Users can rename their team if the new name is unique (not taken by another team)

### Team Member Management (via /api/team endpoint)
- **API Contract**: Uses `action: 'add' | 'remove'` (NOT client-provided teamName)
- **Server-Side Security**: Always uses authenticated user's `teamName` from session, never from request body
- **Add Member Requirements**: 
  - Current user MUST have a team name
  - Target participant MUST NOT have a team
  - Current team size MUST be < 5 members
  - Server assigns target to current user's team
- **Remove Member Requirements**:
  - Current user MUST have a team name
  - Target participant MUST be on the same team as current user
  - Server removes team assignment (sets teamName to null)
- **Maximum Team Size**: 5 members per team (enforced with SQL count query)
- **Protected Actions**: Users CANNOT add/remove participants from different teams

### Profile Endpoint Security (/api/profile)
- **Team Name Validation**: Checks if team name already exists (excluding current user) before allowing change
- **Error on Duplicate**: Returns error "This team name is already taken. To join this team, ask one of its members to add you from your participant page."
- **Allowed Operations**:
  - Create new team (unique name)
  - Leave team (set to null/empty)
  - Keep same team name (no change)
  - Rename team (if new name is unique)
- **Forbidden Operations**:
  - Setting team name to an existing team name (prevents self-joining)

### Data Structure
- Team name is nullable text field (max 50 chars, trimmed)
- Home page groups: "Looking for Teammates" (no team) at top, "Teams" (grouped alphabetically) below
- Team membership determined by `teamName` field presence (not null = has team)

## Animation Patterns
- Use `motion` from `motion/react` for animations
- AnimatePresence with `mode="popLayout"` for list animations
- Spring animations for smooth transitions (stiffness: 350, damping: 25)
- Hover effects with scale transforms and background transitions
