# Hackathon Matcher

A modern hackathon participant discovery platform built with Next.js 16, featuring real-time shuffling, profile management, and a retro pixel-art aesthetic.

## Features

- **🎲 Auto-Shuffling Grid**: Participant cards automatically shuffle every 20 seconds with smooth animations
- **👥 Team Management**: Create and manage teams, add/remove members, organize participants by team
- **👤 Profile Management**: Complete profile editing with customizable pixel-art avatars
- **🔐 Secure Authentication**: Session-based auth with SHA-256 password hashing
- **🎨 Theme Support**: Dark/light mode toggle with smooth transitions
- **📱 Responsive Design**: Mobile-first approach with retro/pixel aesthetic
- **⚡ Real-time Updates**: ISR caching for optimal performance
- **🔍 Participant Discovery**: Browse detailed profiles with social links and project interests
- **🎯 Smart Filtering**: Filter participants by role (Engineer, Designer, Product, Growth)

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, Radix UI, Lucide Icons, Motion (Framer Motion)
- **Database**: PostgreSQL with Drizzle ORM, Neon serverless
- **Auth**: Custom session tokens with HTTP-only cookies
- **Email**: Resend for transactional emails
- **Avatars**: DiceBear pixel-art API
- **Runtime**: Bun

## Getting Started

### Prerequisites

- Bun installed
- PostgreSQL database (Neon recommended)
- Resend API key (optional, for emails)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon-matcher
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your credentials:
```env
DATABASE_URL=your_postgres_connection_string
RESEND_API_KEY=your_resend_api_key
```

4. Push database schema:
```bash
bun drizzle-kit push
```

5. Seed the database (optional):
```bash
bun tsx scripts/seed.ts
```

6. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

### Participants
- Core fields: id, name, email, phone, hashed password
- Profile: wants to build, has built, profile type (Engineer/Designer/Product/Growth/Other)
- Social: website, LinkedIn, GitHub, X (Twitter)
- Teams: team name (nullable - indicates team membership)
- Metadata: organization, avatar seed

### Sessions
- Session-based auth with 24-hour expiration
- Secure token hashing with constant-time comparison
- Cascade deletion on user removal

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun drizzle-kit push` - Push schema to database
- `bun drizzle-kit studio` - Open Drizzle Studio
- `bun tsx scripts/seed.ts` - Seed database from CSV

## Project Structure

```
app/
├── api/
│   ├── auth/           # Login/logout endpoints
│   ├── profile/        # Profile update endpoint
│   └── team/           # Team management endpoint
├── login/              # Login page
├── profile/            # Profile management (protected)
├── p/[id]/             # Individual participant pages (protected)
└── page.tsx            # Home with team grouping

components/
├── ui/                 # Reusable UI components (Shadcn)
├── participant-*.tsx   # Participant display components
├── team-section.tsx    # Team grouping component
├── shuffle-progress-bar.tsx
└── theme-toggle.tsx

lib/
├── auth.ts             # Password hashing & token generation
├── session.ts          # Session management
├── avatar.ts           # Avatar utilities
└── utils.ts            # General utilities

db/
├── schema.ts           # Drizzle schema
└── index.ts            # Database client

scripts/
└── seed.ts             # CSV import script
```

## Key Workflows

### Authentication Flow
1. Users log in with email/password
2. Server validates credentials and creates session
3. Session token stored in HTTP-only cookie (24h expiration)
4. Protected routes validate session via middleware
5. Users can update profile and manage avatar
6. Logout deletes session and clears cookie

### Team Management Flow
1. Users can set their team name in profile settings
2. Home page displays participants grouped by:
   - "Looking for Teammates" (no team name)
   - "Teams" section (grouped by team name)
3. Users can add teammates:
   - Only if target participant has no team assigned
4. Users can remove teammates:
   - Only if participant is on their team
5. Team membership determined by `teamName` field presence

## Design Philosophy

The app features a retro pixel-art aesthetic with:
- Pixel-art avatars from DiceBear
- Bold borders (`border-2`)
- Sharp corners (`rounded-sm`)
- Uppercase text for headings
- Smooth animations with Motion
- High contrast color scheme
- Dark/light theme support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built for hackathon participant networking
- Inspired by retro gaming aesthetics
- Powered by modern web technologies
