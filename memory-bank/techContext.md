# Technical Context - Synthalyst Web Application

## Technologies Used

### Frontend

- **Next.js**: Version 15.2.1 with App Router for server components and improved routing
- **React**: Version 19 for UI components and state management
- **TypeScript**: Version 5.7.3 for type safety and improved developer experience
- **Tailwind CSS**: Version 3.4.1 for utility-first styling
- **Shadcn UI**: Component library built on Radix UI for accessible components
- **Lucide React**: Icon library for consistent iconography

### Backend

- **Next.js API Routes**: For backend functionality
- **Prisma**: Version 6.4.1 as ORM for database interactions
- **NextAuth.js**: For authentication and session management
- **LLM Integrations**:
  - Gemini SDK for AI-powered features
  - OpenAI for content generation
  - Botpress for conversational interfaces

### Database

- **PostgreSQL**: Primary database for data storage
- **Redis**: For caching and rate limiting

## Development Setup

### Local Development

- Development server runs on port 3001
- Environment variables configured in `.env.local`
- Database connection configured through Prisma
- Authentication configured through NextAuth.js

### Project Structure

```
nextjs-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── api/            # API routes
│   │   └── [feature]/      # Feature-specific directories
│   ├── components/         # Shared components
│   │   ├── ui/            # Basic UI components
│   │   ├── layout/        # Layout components
│   │   └── shared/        # Other shared components
│   ├── lib/               # Utility functions and services
│   ├── types/             # TypeScript type definitions
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── prisma/                # Prisma schema and migrations
└── package.json          # Dependencies and scripts
```

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linting
- `npm run test`: Run tests

## Technical Constraints

### Performance Requirements

- Core Web Vitals compliance:
  - Largest Contentful Paint (LCP): < 2.5s
  - First Input Delay (FID): < 100ms
  - Cumulative Layout Shift (CLS): < 0.1
- SEO score of 90+ on Lighthouse
- Accessibility score of 90+ on Lighthouse

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- No IE11 support required

### Deployment

- Deployed on Vercel
- CI/CD pipeline for automated testing and deployment
- Environment variables configured in Vercel dashboard

### Security

- Authentication through NextAuth.js
- CSRF protection
- Input validation with Zod
- Content Security Policy (CSP)
- Rate limiting for API routes

## Dependencies

### Core Dependencies

- `next`: Next.js framework
- `react`: React library
- `react-dom`: React DOM
- `typescript`: TypeScript language

### UI Dependencies

- `tailwindcss`: Utility-first CSS framework
- `@radix-ui/*`: UI primitives
- `lucide-react`: Icon library
- `class-variance-authority`: For component variants
- `clsx`: For conditional class names
- `tailwind-merge`: For merging Tailwind classes

### Data Management

- `@prisma/client`: Prisma client for database access
- `next-auth`: Authentication library
- `zod`: Schema validation

### AI/LLM Dependencies

- `@google/generative-ai`: Gemini SDK
- `openai`: OpenAI SDK
- `@botpress/sdk`: Botpress SDK

### Development Dependencies

- `eslint`: Linting
- `prettier`: Code formatting
- `jest`: Testing
- `@testing-library/react`: React testing utilities
- `prisma`: Prisma CLI

## API Integrations

### Authentication

- Google OAuth for social login
- Email/password for traditional login
- JWT for session management

### External Services

- SendGrid for email
- Upstash for Redis
- Vercel Analytics for usage tracking

## Technical Decisions

### Next.js App Router

- Server Components for improved performance
- Built-in API routes for backend functionality
- File-based routing for simplified navigation
- Metadata API for dynamic SEO optimization

### TypeScript

- Type safety for improved developer experience
- Interface definitions for API contracts
- Type checking for component props
- Reduced runtime errors

### Tailwind CSS

- Utility-first approach for rapid development
- Consistent design system
- Reduced CSS bundle size
- Improved maintainability

### Prisma

- Type-safe database access
- Simplified database migrations
- Improved developer experience
- Support for multiple databases
