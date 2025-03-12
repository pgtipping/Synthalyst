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

   ```tree
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

## Technical Context - 2024-02-27

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
  "@xenova/transformers": "^2.17.2",
  "@google/generative-ai": "^0.2.0"
}
```

#### LLM API Integration Details (2024-03-08)

1. **Google Gemini API**:

   - Used for: Premium resource recommendations in the Training Plan Creator
   - Model: "gemini-2.0-flash" (default in `getGeminiModel()`)
   - Package: `@google/generative-ai`
   - Environment variable: `GEMINI_API_KEY` (server-side only)
   - Implementation: Direct API integration with Google's official SDK
   - Location: `nextjs-app/src/lib/gemini.ts`

2. **OpenRouter API**:

   - Used for: Llama 3.2 3b model access in the Training Plan Creator
   - Model: "meta-llama/llama-3.2-3b-instruct"
   - Package: Uses OpenAI SDK with custom baseURL
   - Environment variable: `OPENROUTER_API_KEY`
   - Implementation: OpenAI-compatible API with custom headers
   - Location: `nextjs-app/src/lib/openrouter.ts`, `nextjs-app/src/lib/llama.ts`

3. **Groq API**:
   - Used for: Interview Questions Generator and other features
   - Package: `groq-sdk`
   - Environment variable: `GROQ_API_KEY`
   - Implementation: Direct API integration with Groq's official SDK
   - Location: Various API route handlers

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

# Technical Context (Updated 2024-03-05)

## Frontend Technologies

### Component Library

The project uses [shadcn/ui](https://ui.shadcn.com/) as its primary component library. This is a collection of reusable components built using Radix UI and Tailwind CSS. The components are designed to be customizable and accessible.

Key features of shadcn/ui:

- Built on top of Radix UI primitives
- Styled with Tailwind CSS
- Fully accessible and follows WAI-ARIA guidelines
- Customizable through a theming system
- Components are copied into the project rather than installed as a dependency

The project has a comprehensive component guidelines document at `docs/component-guidelines.md` that outlines best practices for using shadcn/ui components.

### Component Customization

The project extends shadcn/ui components with custom variants to provide consistent styling options across the application. This is done using the `cva` (class variance authority) utility from the `class-variance-authority` package.

For example, the Card component has been extended with a gradient variant:

```tsx
// In card.tsx
const getCardVariantStyles = (variantKey: string = "default") => {
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
    secondary: "bg-gradient-to-br from-purple-500 to-pink-600 text-white",
    accent: "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
    info: "bg-gradient-to-br from-blue-50 to-blue-100",
    default: "bg-gradient-to-br from-gray-50 to-gray-100",
  };

  return variants[variantKey] || variants.default;
};

// Usage
<Card variant="gradient" variantKey="primary">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>;
```

### Utility Scripts

The project includes several utility scripts to help with component standardization:

#### Component Audit Script

The component audit script (`scripts/component-audit.js`) identifies custom components and styling patterns that could be replaced with shadcn/ui components.

```bash
node scripts/component-audit.js
```

This script scans the codebase for custom components and logs any missing shadcn/ui components.

#### Component Migration Script

The component migration script (`scripts/migrate-components.js`) helps migrate custom components to shadcn/ui.

```bash
node scripts/migrate-components.js [component-name]
```

This script provides a template for migrating a custom component to a shadcn/ui component.

#### Create Variant Script

The create variant script (`scripts/create-variant.js`) adds new variants to shadcn/ui components.

```bash
node scripts/create-variant.js [component-name] [variant-name]
```

This script modifies a shadcn/ui component to add a new variant.

### Toast System

The project has migrated from the old toast system to the new sonner toast system. A toast migration utility has been created at `@/lib/toast-migration.ts`

```

# Technical Context - Updated on June 14, 2023

## Technologies Used

### Core Technologies

- **Next.js**: The main framework for building the application
- **React**: For building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **Shadcn UI**: For UI components
- **NextAuth.js**: For authentication
- **Prisma**: For database access
- **PostgreSQL**: As the database
- **Vercel**: For deployment

### AI and API Integrations

- **Google Gemini API**: For generating blog posts, improving content, and transforming resumes in the ApplyRight feature
- **OpenAI API**: For various AI-powered features
- **OpenRouter API**: For accessing Llama 3.2 3b model
- **SendGrid**: For email functionality

### Document Processing (ApplyRight Feature) - June 14, 2023

- **mammoth**: For parsing Word documents (DOC, DOCX)
- **PDF.js**: For parsing PDF documents (temporarily disabled)

## Development Setup

### Environment Variables

The application requires several environment variables to be set up:

- **Authentication**: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Database**: `DATABASE_URL`
- **API Keys**: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`
- **Email**: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `REPLY_TO_EMAIL`
- **API Configuration**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`
- **Rate Limiting**: `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_SIZE`
- **Caching**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### Running the Application

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Run the development server: `npm run dev`
4. Build the application: `npm run build`
5. Start the production server: `npm start`

## Technical Constraints

### ApplyRight Feature - June 14, 2023

1. **PDF Parsing**: PDF.js integration is currently problematic, leading to build errors. PDF support is temporarily disabled.
2. **Document Size**: File uploads are limited to 5MB to prevent performance issues.
3. **API Rate Limiting**: The Gemini API has rate limits that need to be considered.
4. **Export Formats**: Currently limited to plain text exports. DOCX and PDF exports are planned for future implementation.

### General Constraints

1. **API Rate Limits**: Various external APIs have rate limits that need to be managed.
2. **Database Performance**: Complex queries should be optimized to prevent performance issues.
3. **Authentication**: The application uses NextAuth.js, which has specific requirements for session management.
4. **Deployment**: The application is deployed on Vercel, which has specific limitations and requirements.

## Dependencies

### ApplyRight Feature - June 14, 2023

- **mammoth**: For parsing Word documents
- **pdfjs-dist**: For parsing PDF documents (temporarily disabled)
- **sonner**: For toast notifications
- **lucide-react**: For icons
- **next/navigation**: For navigation
- **next-auth/react**: For authentication
- **@/components/ui**: For UI components from Shadcn UI

### Core Dependencies

- **next**: The Next.js framework
- **react**: The React library
- **typescript**: For type-safe code
- **tailwindcss**: For styling
- **prisma**: For database access
- **next-auth**: For authentication
- **zod**: For schema validation
- **axios**: For HTTP requests
- **date-fns**: For date manipulation
- **react-hook-form**: For form handling
```
