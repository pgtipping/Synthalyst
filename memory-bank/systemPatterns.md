# System Patterns - 2024-02-27

## Architecture Overview

### Frontend Architecture

- Next.js 15.1.7 with App Router
- React 19 with Server Components
- TypeScript 5.7.3 for type safety
- Tailwind CSS 3.4.1 for styling
- Radix UI components for accessible UI
- Shadcn UI for component library

### Backend Architecture

- Next.js API Routes
- Prisma 6.4.1 ORM
- Multiple LLM integrations:
  - Groq SDK
  - OpenAI
  - Botpress
  - Xenova Transformers
- Authentication with NextAuth.js

### Directory Structure

```
nextjs-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   └── [feature]/      # Feature-specific directories
│   │       ├── components/ # Feature-specific components
│   │       ├── lib/       # Feature-specific utilities
│   │       └── page.tsx   # Page component
│   ├── components/         # Shared components
│   │   ├── ui/           # Basic UI components
│   │   ├── layout/       # Layout components
│   │   └── shared/       # Other shared components
│   ├── lib/               # Utility functions and services
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── middleware.ts      # Global middleware
```

### Component Organization Pattern

- **Feature-specific Components**: Located in `src/app/[feature]/components/`

  - Components that are only used within a specific feature
  - Example: `InterviewQuestionsForm.tsx` in `interview-questions/components/`
  - Example: Template management components in `jd-developer/components/templates/`
    - Components for managing versions, categories, and search of templates
    - Kept for potential future use based on user requirements
    - Isolated to feature-specific directory to maintain clean architecture

- **Shared Components**: Located in `src/components/`

  - `ui/`: Basic UI components (buttons, inputs, etc.)
  - `layout/`: Layout components (Header, Footer, etc.)
  - `shared/`: Other shared components used across features

- **Import Pattern**:
  - Use `@/` path alias for imports from src directory
  - Example: `import { Button } from "@/components/ui/button"`
  - Feature-specific imports use relative paths

## Design Patterns

### Component Patterns

- Radix UI primitives for accessibility
- Shadcn UI components for consistency
- Custom hooks for reusable logic
- Form handling with react-hook-form

### State Management

- React hooks for local state
- Context API for global state
- Zod for schema validation
- Server components for improved performance

### Authentication Pattern

- NextAuth.js for authentication flow
- Session-based authentication
- Role-based access control
- Bcrypt for password hashing

### Form Management Pattern

- React Hook Form for form state
- Zod for schema validation
- Custom form components
- Radix UI Form primitives

### API Integration Pattern

- RESTful API endpoints
- Multiple LLM service integrations
- Error handling middleware
- Type-safe API routes

## Technical Decisions

### Framework Choice

- Next.js for full-stack capabilities
- App Router for improved routing
- React 19 for latest features
- TypeScript for type safety

### UI Components

- Radix UI for accessibility
- Shadcn UI for design system
- Tailwind CSS for styling
- Lucide React for icons

### Database

- Prisma as ORM
- PostgreSQL for primary database
- Migration management
- Connection pooling

### Testing

- Jest with SWC for fast testing
- React Testing Library
- Custom test scripts
- API endpoint testing

### Form Handling

- React Hook Form for performance
- Zod for validation
- Custom form components
- Type-safe forms

## Security Patterns

- NextAuth.js authentication
- CSRF protection
- Rate limiting
- Input validation with Zod
- Environment variable protection

## Performance Patterns

- Server components
- SWC compilation
- Image optimization
- Static generation
- API route caching
