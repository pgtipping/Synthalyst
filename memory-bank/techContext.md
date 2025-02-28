# Tech Context

## Technologies Used

1. Frontend:

   - Next.js 13 (App Router)
   - React 18
   - TypeScript
   - Tailwind CSS
   - Radix UI

2. Development Tools:

   - VS Code
   - Git
   - ESLint
   - Prettier

3. UI Components:
   - Button
   - Header
   - Card
   - Dialog
   - Input
   - Label

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

2. UI Dependencies:

   - Radix UI primitives
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

### Test Framework

- Jest for test runner and assertions
- React Testing Library for component testing
- User Event for simulating user interactions
- MSW (Mock Service Worker) for API mocking

### Testing Patterns

1. Component Tests

   ```typescript
   // Example pattern for form component tests
   describe("FormComponent", () => {
     it("renders required fields", () => {
       render(<FormComponent />);
       // Check for presence of fields
     });

     it("shows validation errors", async () => {
       render(<FormComponent />);
       // Submit empty form
       // Check for error messages
     });

     it("handles successful submission", async () => {
       // Mock API response
       // Fill and submit form
       // Verify success state
     });

     it("handles API errors", async () => {
       // Mock API error
       // Verify error handling
     });
   });
   ```

2. Mock Components

   ```typescript
   // Pattern for mocking UI components
   jest.mock("@/components/ui/component", () => ({
     Component: ({ children, ...props }) => (
       <div data-testid="mocked-component" {...props}>
         {children}
       </div>
     ),
   }));
   ```

3. Accessibility Testing
   - Using proper ARIA attributes
   - Testing with screen reader considerations
   - Ensuring keyboard navigation
   - Following WAI-ARIA guidelines

### Current Test Coverage Goals

- Unit tests for all form components
- Integration tests for form submissions
- API interaction tests
- Error handling coverage
- Accessibility compliance

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
