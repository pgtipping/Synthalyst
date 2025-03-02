# Tech Context

## Technologies Used

1. Frontend:

   - Next.js 13 (App Router)
   - React 18
   - TypeScript
   - Tailwind CSS
   - Radix UI

2. Backend & Authentication:

   - NextAuth.js for authentication
   - Google OAuth for social login
   - Prisma ORM for database access
   - PostgreSQL database

3. Development Tools:

   - VS Code
   - Git
   - ESLint
   - Prettier

4. UI Components:

   - Button
   - Header
   - Card
   - Dialog
   - Input
   - Label

5. Analytics & Monitoring:
   - Vercel Analytics for user behavior tracking
   - Vercel Speed Insights for performance monitoring
   - Web Vitals tracking

## Development Setup

1. Directory Structure:

   ```
   nextjs-app/
   ├── src/
   │   ├── app/
   │   │   ├── components/
   │   │   │   ├── ui/
   │   │   │   └── Header.tsx
   │   │   └── lib/
   │   │   └── utils.ts
   │   └── lib/
   ├── public/
   ├── package.json
   └── tsconfig.json
   ```

2. Configuration Files:

   - tsconfig.json: TypeScript configuration with path aliases
   - package.json: Project dependencies and scripts
   - tailwind.config.ts: Tailwind CSS configuration
   - next.config.ts: Next.js configuration

3. Required Dependencies:
   ```json
   {
     "dependencies": {
       "@radix-ui/react-slot": "latest",
       "class-variance-authority": "latest",
       "clsx": "latest",
       "next": "13.x",
       "react": "18.x",
       "react-dom": "18.x",
       "tailwind-merge": "latest",
       "tailwindcss": "latest"
     }
   }
   ```

## Technical Constraints

1. Development Environment:

   - Node.js 16+
   - npm or yarn
   - Git version control

2. Browser Support:

   - Modern browsers
   - ES6+ features
   - CSS Grid and Flexbox

3. Performance Requirements:
   - Fast component rendering
   - Optimized bundle size
   - Efficient styling system

## Dependencies

1. Core Dependencies:

   - Next.js for framework
   - React for UI
   - TypeScript for type safety
   - Tailwind CSS for styling
   - Radix UI for accessible components
   - NextAuth.js for authentication
   - Prisma for database access
   - @vercel/analytics for user behavior tracking (import from '@vercel/analytics/react')
   - @vercel/speed-insights for performance monitoring (import from '@vercel/speed-insights/react')

2. UI Dependencies:

   - class-variance-authority
   - clsx for class names
   - tailwind-merge

3. Development Dependencies:
   - ESLint
   - Prettier
   - TypeScript compiler
   - PostCSS

## Security Considerations

1. Code Security:

   - Type safety
   - Input validation
   - XSS prevention

2. Development Security:
   - Dependency scanning
   - Code review process
   - Security best practices

## Performance Optimization

1. Component Level:

   - Efficient rendering
   - Proper prop types
   - Memoization when needed

2. Styling:

   - Tailwind CSS purge
   - CSS optimization
   - Minimal custom CSS

3. Build Process:
   - Code splitting
   - Tree shaking
   - Bundle optimization

## Development Workflow

1. Component Development:

   - TypeScript first
   - Proper type definitions
   - Component documentation
   - Accessibility focus

2. Styling Approach:

   - Utility-first CSS
   - Component variants
   - Theme consistency
   - Responsive design

3. Code Quality:
   - ESLint rules
   - Prettier formatting
   - Type checking
   - Code reviews

# Technical Context - 2024-02-27

## Development Environment

### Core Technologies

- Next.js 15.1.7
- React 19.0.0
- TypeScript 5.7.3
- Node.js 18+
- PostgreSQL with Prisma 6.4.1

### Development Tools

- VS Code / Cursor IDE
- Git for version control
- npm for package management
- Vercel for deployment
- Jest 29.7.0 for testing

### Key Dependencies

#### UI Framework & Components

```json
{
  "@radix-ui/*": "^1.x - ^2.x",
  "@shadcn/ui": "^0.0.4",
  "tailwindcss": "^3.4.1",
  "class-variance-authority": "^0.7.1",
  "lucide-react": "^0.475.0"
}
```

#### Authentication & Security

```json
{
  "next-auth": "^4.24.11",
  "bcryptjs": "^3.0.1",
  "zod": "^3.24.2"
}
```

#### AI & LLM Integration

```json
{
  "@botpress/client": "0.2.0",
  "@botpress/sdk": "0.4.0",
  "groq-sdk": "^0.15.0",
  "openai": "^4.85.1",
  "@xenova/transformers": "^2.17.2"
}
```

#### Form Handling & Validation

```json
{
  "react-hook-form": "^7.54.2",
  "@hookform/resolvers": "^4.1.0",
  "zod": "^3.24.2"
}
```

#### Testing Tools

```json
{
  "jest": "^29.7.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@swc/jest": "^0.2.37",
  "ts-jest": "^29.2.5"
}
```

## Infrastructure

### Hosting

- Vercel for production deployment
- Automatic deployments from main branch
- Preview deployments for pull requests

### Database

- PostgreSQL with Prisma ORM
- Connection pooling enabled
- Migration scripts available

### APIs

- Next.js API routes
- Groq SDK for LLM integration
- OpenAI integration
- Botpress integration
- RESTful endpoints

## Development Workflow

### Scripts

- `npm run dev`: Development server
- `npm run build`: Production build with Prisma generation
- `npm test`: Run Jest tests
- `npm run deploy`: Custom deployment script
- Various database and API test scripts

### Testing Strategy

- Jest for unit testing
- React Testing Library for components
- Custom test scripts for:
  - Database connections
  - Signup flows
  - API endpoints
  - Production verification

### Code Quality

- ESLint 9.x
- TypeScript strict mode
- Prettier formatting
- SWC for fast compilation

## Security

### Authentication

- NextAuth.js for authentication
- Bcrypt for password hashing
- Zod for input validation
- JWT tokens

### Data Protection

- Environment variables
- Input validation with Zod
- CSRF protection
- Rate limiting

## Monitoring

### Analytics

- Vercel Analytics
- Custom logging scripts
- Error tracking
- Signup error monitoring

### Logging

- Structured logging
- Vercel logs integration
- Custom log checking scripts
- Error reporting

## Development Setup Guide

1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Generate Prisma client: `npx prisma generate`
5. Run development server: `npm run dev`
6. Access at http://localhost:3000

## Deployment Process

1. Push to feature branch
2. Run tests: `npm test`
3. Create pull request
4. Automatic preview deployment
5. Review and approve
6. Merge to main
7. Run deploy script: `npm run deploy`

## Testing Infrastructure

### Testing Framework

- Jest 29.7.0 for test runner
- React Testing Library for component testing
- SWC for fast compilation
- Custom test utilities

### API Testing

- Mock external dependencies
- Test success and error cases
- Validate response structure
- Test pagination and filtering
- Custom request and response mocks

### Database Testing

- Mock Prisma client for database tests
- In-memory storage for mock data
- Mock implementation of database methods
- Proper error handling for database operations
- Test transaction support
- Clean database state between tests

### Test Setup Files

- `jest.setup.js`: Global test setup
- `jest.config.js`: Jest configuration
- `src/lib/test/setup-prisma-mock.js`: Prisma mock setup
- `src/lib/test/prisma-mock.ts`: Mock Prisma client implementation
- `src/lib/test/setup.ts`: Test utilities and helpers

### Mock Implementations

- NextRequest and NextResponse mocks
- Prisma client mock
- External API client mocks (Groq, OpenAI, Botpress)
- Error handler mocks
- Form component mocks

## Form Architecture

### Component Structure

```typescript
// Base form pattern
const Form = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {...}
  });

  const onSubmit = async (data) => {
    try {
      // API call
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <Form {...form}>
      <FormField ... />
      <FormControl ... />
      // Other form elements
    </Form>
  );
};
```

### Validation Strategy

- Zod schemas for form validation
- Client-side validation first
- Server-side validation as backup
- Consistent error message format

### Error Handling

- Toast notifications for user feedback
- Error boundaries for component errors
- Consistent error message format
- Graceful degradation

### State Management

- React Hook Form for form state
- Local state for UI elements
- Context for shared state
- Redux for complex state (when needed)

## API Integration

### LLM Integration

- Using Groq for main LLM functionality
- OpenAI as fallback
- Proper error handling for API failures
- Rate limiting implementation

### Endpoints

- RESTful API design
- Proper error status codes
- Consistent response format
- Rate limiting headers

## Performance Considerations

### Loading States

- Skeleton loaders for content
- Disabled states during submission
- Progress indicators for long operations
- Optimistic updates where appropriate

### Optimization

- Code splitting
- Lazy loading of components
- Proper caching strategy
- Resource optimization

## Security Measures

### Form Security

- CSRF protection
- Input sanitization
- Rate limiting
- Proper validation

### API Security

- Authentication
- Authorization
- Input validation
- Rate limiting

## Development Workflow

### Code Quality

- ESLint configuration
- Prettier for formatting
- TypeScript strict mode
- Husky pre-commit hooks

### CI/CD

- GitHub Actions
- Automated testing
- Build verification
- Deployment checks

## Authentication System (2024-03-01)

The application uses NextAuth.js for authentication with the following features:

1. **Authentication Providers**:

   - Credentials provider (email/password)
   - Google OAuth provider

2. **Configuration**:

   - NextAuth configuration in `nextjs-app/src/app/api/auth/[...nextauth]/auth.ts`
   - Environment variables in `.env` file:
     ```
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-secret-here
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

3. **Authentication Pages**:

   - Sign-in page: `nextjs-app/src/app/auth/signin/page.tsx`
   - Sign-up page: `nextjs-app/src/app/auth/signup/page.tsx`
   - Both pages support email/password and Google authentication

4. **Session Management**:

   - JWT strategy for session tokens
   - Session data stored in cookies
   - Session expiration configurable in NextAuth options

5. **Protected Routes**:

   - Client-side protection using NextAuth hooks
   - Server-side protection using NextAuth session

6. **Google OAuth Setup**:
   - Create project in Google Cloud Console
   - Configure OAuth consent screen
   - Create OAuth client ID
   - Set authorized JavaScript origins and redirect URIs

## Technical Approaches

### Template Filtering Approach

The JD Developer component uses a two-layer filtering approach to ensure templates and saved job descriptions are properly separated:

1. **Database Query Filtering**:

   ```typescript
   // For saved JDs (excluding templates)
   const savedJDs = await prisma.jobDescription.findMany({
     where: {
       userId: session.user.id,
       content: {
         not: {
           contains: '"isTemplate":true',
         },
       },
     },
     orderBy: {
       createdAt: "desc",
     },
   });

   // For templates (only templates)
   const templates = await prisma.jobDescription.findMany({
     where: {
       userId: session.user.id,
       content: {
         contains: '"isTemplate":true',
       },
     },
     orderBy: {
       createdAt: "desc",
     },
   });
   ```

2. **In-Memory Filtering After Parsing**:
   ```typescript
   // Parse the content JSON for each job description
   const parsedJDs = savedJDs
     .map((jd) => {
       try {
         const parsedContent = JSON.parse(jd.content);
         // Double-check that this is not a template
         if (parsedContent.metadata?.isTemplate === true) {
           return null; // Skip this item
         }
         return {
           id: jd.id,
           ...parsedContent,
         };
       } catch (error) {
         console.error(`Error parsing JD ${jd.id}:`, error);
         return null;
       }
     })
     .filter(Boolean); // Remove any null entries
   ```

This approach ensures that templates only appear in the templates list and saved job descriptions only appear in the saved JDs list, even if there are inconsistencies in the database.

# Technical Context (2024-03-02)

## Technologies Used (2024-03-02)

The project uses the following technologies:

- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**:
  - shadcn UI (updated with 16 new components)
  - sonner for toast notifications (replacing the old UI toast system)
- **Styling**: Tailwind CSS with custom animations and keyframes
- **State Management**: React Context API and React Query
- **API Integration**:
  - GROQ API for AI-powered features
  - Custom API routes for backend functionality
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM with PostgreSQL
- **Deployment**: Vercel

## Development Setup (2024-03-02)

To set up the development environment:

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with the required environment variables:
   - `GROQ_API_KEY` (with a fallback in the code for development)
   - Other environment variables as needed
4. Run the development server with `npm run dev`
   - The server runs on port 3001 by default
   - Make sure no other process is using port 3001 before starting

## Technical Constraints (2024-03-02)

- **Environment Variables**:
  - Must be properly configured in Vercel for production deployment
  - Local development can use fallbacks for some variables
- **UI Components**:
  - All shadcn UI components must follow the established patterns
  - Toast notifications must use the migration utility for consistency
- **Tailwind Configuration**:
  - Avoid duplicate keyframes and animation definitions
  - Test builds after adding new components with animations

## Toast System Implementation (2024-03-02)

The application has successfully migrated from the old shadcn UI toast system to the new sonner toast system:

1. **Migration Utility**:

   - File: `nextjs-app/src/lib/toast-migration.ts`
   - Purpose: Provides backward compatibility with the old toast API
   - Implementation: Maps old toast API calls to the new sonner toast API
   - Key functions:

     ```typescript
     // Maps old toast API to sonner
     export function toast(props: ToastProps) {
       const { title, description, variant, action } = props;
       if (variant === "destructive") {
         return sonnerToast.error(title || description || "");
       }
       return sonnerToast(title || description || "");
     }

     // Compatibility hook
     export function useToast() {
       return {
         toast,
         dismiss: sonnerToast.dismiss,
       };
     }
     ```

2. **Toaster Component**:

   - File: `nextjs-app/src/components/ui/sonner.tsx`
   - Purpose: Provides the Toaster component for rendering toast notifications
   - Implementation: Wraps the sonner Toaster component with theme support
   - Usage: Imported in the root layout.tsx file

3. **Import Patterns**:

   - For components: `import { toast } from "@/lib/toast-migration";`
   - For hooks: `import { useToast } from "@/lib/toast-migration";`
   - For layout: `import { Toaster } from "@/components/ui/sonner";`

4. **Verification**:

   - All components have been verified to use the correct imports
   - No instances of the old toast system remain in the codebase
   - The migration utility properly handles all use cases including destructive variants
   - This migration is now complete and won't cause issues in future development

5. **Tailwind Configuration**:
   - File: `nextjs-app/tailwind.config.ts`
   - Fixed: Removed duplicate keyframes and animation definitions
   - Verified: No duplicate properties in the configuration
   - This issue is now completely resolved and won't recur in future development
