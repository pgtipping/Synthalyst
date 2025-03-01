# System Patterns - 2024-03-01

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
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── about/          # About page directory
│   │   │   └── page.tsx    # About page component
│   │   ├── services/       # Services page directory
│   │   │   └── page.tsx    # Services page component
│   │   ├── contact/        # Contact page directory
│   │   │   └── page.tsx    # Contact page component
│   │   ├── blog/           # Blog feature directory
│   │   │   ├── page.tsx    # Blog listing page
│   │   │   ├── [slug]/     # Dynamic blog post route
│   │   │   │   └── page.tsx # Individual blog post page
│   │   │   └── new/        # New blog post page
│   │   ├── api/            # API routes
│   │   │   └── [feature]/  # Feature-specific API routes
│   │   └── [feature]/      # Feature-specific directories
│   │       ├── components/ # Feature-specific components
│   │       ├── lib/        # Feature-specific utilities
│   │       └── page.tsx    # Page component
│   ├── components/         # Shared components
│   │   ├── ui/            # Basic UI components
│   │   ├── layout/        # Layout components
│   │   └── shared/        # Other shared components
│   ├── lib/               # Utility functions and services
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── middleware.ts      # Global middleware
```

### Next.js App Router Conventions

- Each route requires its own directory (e.g., `/about`, `/services`, `/contact`)
- The actual page component must be named `page.tsx` inside that directory
- Layouts can be defined using `layout.tsx` files in the appropriate directories
- Route groups can be created using parentheses in directory names: `(auth)/login`
- Dynamic routes use square brackets: `[slug]/page.tsx`
- Catch-all routes use triple dots: `[...slug]/page.tsx`
- Optional catch-all routes use double square brackets: `[[...slug]]/page.tsx`
- Do not use flat files like `about.tsx` directly in the app directory

### Client vs Server Components

- All components are Server Components by default
- Add "use client" directive at the top of the file to make it a Client Component
- Client Components are needed for:
  - Interactive features (forms, buttons, etc.)
  - Browser APIs (localStorage, navigator, etc.)
  - React hooks (useState, useEffect, etc.)
- Server Components are better for:
  - Fetching data
  - Accessing backend resources directly
  - Keeping sensitive information on the server
  - Reducing client-side JavaScript

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

### Navigation Pattern

- Use Next.js Link component for client-side navigation
- Avoid using anchor tags directly for internal links
- Prefetching happens automatically with Link component
- For programmatic navigation, use the useRouter hook from next/navigation
- Consistent navigation structure with Header component
- Mobile-responsive navigation with dropdown menus

### Data Filtering Pattern

- Two-layer filtering approach for complex data:
  1. Database query filtering (first pass)
  2. In-memory filtering after parsing (second pass)
- JSON content stored in database with metadata flags
- Parse and validate content before returning to client
- Handle parsing errors gracefully with try/catch
- Filter out invalid entries with `.filter(Boolean)`
- Log errors for debugging purposes

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

## Testing Patterns

### API Testing Pattern

- Jest for test framework
- Mock external dependencies
- Test success and error cases
- Validate response structure
- Test pagination and filtering

### Database Testing Pattern

- Mock Prisma client for database tests
- In-memory storage for mock data
- Mock implementation of database methods
- Proper error handling for database operations
- Test transaction support
- Clean database state between tests

### Mock Implementation Pattern

- Create mock storage for test data
- Implement mock methods for database operations
- Add proper error handling for database errors
- Support filtering, pagination, and relationships
- Reset mock storage between tests
- Implement transaction support

### Component Testing Pattern

- React Testing Library for component tests
- Test rendering and user interactions
- Test form validation and submission
- Test loading states and error handling
- Test accessibility

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
