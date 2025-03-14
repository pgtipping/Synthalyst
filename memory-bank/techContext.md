# Technical Context - Updated on June 12, 2024

## Technologies Used

### Frontend

- **Next.js 15.2.1**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Lucide React**: Icon library
- **Zod**: Schema validation

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database ORM
- **PostgreSQL**: Relational database
- **NextAuth.js**: Authentication
- **Zod**: Request validation

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **npm**: Package management

## Interview Prep Feature Technologies

### Frontend Components

- **React Hooks**: useState, useEffect, useRouter, useSearchParams, useParams
- **Form Components**: Input, Textarea, Select, Button
- **Layout Components**: Card, Alert, Badge, Tabs
- **Feedback Components**: Toast notifications
- **Icons**: Lucide React icons for visual cues

### API Integration

- **Fetch API**: For making HTTP requests to the backend
- **JSON**: For data serialization
- **localStorage**: For client-side session persistence

### State Management

- **React State**: For component-level state
- **URL Query Parameters**: For filtering and pagination
- **localStorage**: For persisting session IDs between page refreshes

### Error Handling

- **Try-Catch Blocks**: For handling API request errors
- **Toast Notifications**: For user feedback
- **Error States**: For displaying error messages in the UI

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: URL for NextAuth.js

### Development Workflow

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the development server with `npm run dev`
5. Access the application at `http://localhost:3001`

## Technical Constraints

### Performance

- Optimize API calls to minimize loading times
- Implement pagination for large data sets
- Use client-side caching where appropriate

### Security

- Validate all user inputs with Zod
- Implement proper authentication checks for protected routes
- Sanitize data before displaying it to users

### Accessibility

- Ensure all components are keyboard accessible
- Provide proper ARIA attributes for screen readers
- Maintain sufficient color contrast for readability

### Mobile Responsiveness

- Design with a mobile-first approach
- Use responsive grid layouts
- Test on various screen sizes

## Dependencies

### Core Dependencies

- `next`: 15.2.1
- `react`: 18.2.0
- `react-dom`: 18.2.0
- `typescript`: 5.3.3
- `tailwindcss`: 3.4.1
- `prisma`: 5.10.2
- `@prisma/client`: 5.10.2
- `next-auth`: 4.24.5

### UI Dependencies

- `@radix-ui/react-*`: Various UI primitives
- `class-variance-authority`: For component variants
- `clsx`: For conditional class names
- `lucide-react`: For icons
- `tailwind-merge`: For merging Tailwind classes

### Utility Dependencies

- `zod`: For schema validation
- `date-fns`: For date formatting
- `react-hook-form`: For form handling

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
