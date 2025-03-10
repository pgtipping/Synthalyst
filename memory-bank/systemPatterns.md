# System Patterns - 2025-03-08

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

## Navigation Structure

### Main Navigation

- **Header Component**: Contains primary navigation links and tools dropdown
- **Primary Links**: Home, About, Services, Tools, Blog, Contact
- **Tools Dropdown**: Contains links to productivity and business process tools
- **Focus**: End-user productivity tools and business process enhancements
- **Removed**: Developer-focused tools like Model Comparison that don't align with platform purpose

### Tools Organization

- Tools are defined in the Header component's `tools` array
- Each tool has an icon, title, and href
- Tools are displayed in both desktop dropdown and mobile menu
- "View All Tools" link directs to comprehensive tools page

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

# System Patterns (2024-03-02)

## Component Architecture (2024-03-02)

The application uses a component-based architecture with shadcn UI components as the foundation. Recent updates include:

- **Toast System Migration (COMPLETED)**:

  - ✅ Successfully migrated all components from the old UI toast system to the new sonner toast system
  - Created a comprehensive toast migration utility at `@/lib/toast-migration.ts` that provides backward compatibility
  - The utility properly handles all use cases including destructive variants
  - Direct imports from sonner are used in the layout.tsx file for the Toaster component
  - All components now import toast from `@/lib/toast-migration` instead of `@/hooks/use-toast`
  - Verified through code review that no instances of the old toast system remain
  - This migration is now complete and won't cause issues in future development

- **UI Component Organization**:
  - All shadcn UI components are located in `@/components/ui/`
  - Successfully added 16 new components to enhance the UI capabilities
  - Components follow a consistent pattern with proper TypeScript typing
  - Tailwind animations and keyframes are centralized in the tailwind.config.ts file with no duplications
  - Fixed and verified that there are no duplicate keyframe definitions in tailwind.config.ts

## Interview Questions Generator UI Pattern (2024-03-02)

The Interview Questions Generator implements a consistent UI pattern across all its tabs:

1. **Card-Based Layout**:

   - Each item (question, tip, or scoring level) is displayed in its own card
   - Cards have a consistent structure with a header and content section
   - Cards use subtle hover effects (shadow and slight upward movement)
   - All cards have rounded corners and a clean white background for content

2. **Color Scheme**:

   - Questions tab: Indigo color scheme
   - Evaluation Tips tab: Blue color scheme
   - Scoring Rubric tab: Indigo color scheme (matching Questions tab)
   - Professional appearance with consistent colors throughout

3. **Header Design**:

   - Headers have a colored background (indigo-50 or blue-50)
   - Headers include a title on the left and a badge on the right
   - Headers use a 2px colored bottom border (indigo-400 or blue-400)
   - Text is semibold with appropriate color contrast

4. **Content Design**:

   - Clean white background for all content sections
   - Consistent text styling with proper spacing
   - Numbered items have the number as semibold with appropriate spacing
   - Text is gray-800 for good readability

5. **Tab Navigation**:

   - Tabs use a rounded container with a light gray background
   - Active tab has a white background with subtle shadow
   - Each tab includes an icon, label, and count badge when appropriate
   - Tab icons use colors that match their respective content (indigo, blue)

6. **Responsive Design**:
   - All elements adapt properly to different screen sizes
   - On mobile, headers may switch to a column layout
   - Proper spacing is maintained across all device sizes

This pattern ensures a consistent, professional appearance across the entire Interview Questions Generator feature and serves as a model for other features in the application.

## Toast Migration Pattern (2024-03-02)

The application uses a migration utility pattern to handle the transition from the old UI toast system to the new sonner toast system:

1. **Migration Utility**:

   - Located at `@/lib/toast-migration.ts`
   - Provides the same API shape as the old toast system
   - Maps old toast API calls to the new sonner toast API
   - Handles variant mapping (e.g., "destructive" to sonner's error type)
   - Supports both simple and complex toast notifications

2. **Import Pattern**:

   - Components import from the migration utility: `import { toast } from "@/lib/toast-migration"`
   - Components using the hook pattern: `import { useToast } from "@/lib/toast-migration"`
   - Root layout imports Toaster directly: `import { Toaster } from "@/components/ui/sonner"`

3. **Usage Pattern**:
   - Simple toast: `toast({ title: "Success", description: "Operation completed" })`
   - Error toast: `toast({ title: "Error", description: "Failed", variant: "destructive" })`
   - Using the hook: `const { toast } = useToast(); toast({ title: "Success" })`

This pattern ensures backward compatibility while allowing gradual migration to the new sonner API as needed.

# System Patterns (2024-03-05)

## Component Architecture (Updated 2024-03-05)

### Component Library

The project uses [shadcn/ui](https://ui.shadcn.com/) as its primary component library. This is a collection of reusable components built using Radix UI and Tailwind CSS. The components are designed to be customizable and accessible.

Key principles for component usage:

- Use shadcn/ui components whenever possible to maintain a consistent look and feel
- Customize components using the shadcn/ui theming system rather than direct Tailwind classes
- Use the `cn` utility from `@/lib/utils` for class merging
- Create variants using `cva` for consistent styling
- All components should be accessible and follow WCAG guidelines

A comprehensive component guidelines document has been created at `docs/component-guidelines.md` that outlines best practices for using shadcn/ui components.

### Component Variants

The project extends shadcn/ui components with custom variants to provide consistent styling options across the application. For example, the Card component has been extended with a gradient variant:

```tsx
<Card variant="gradient" variantKey="primary">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

Available gradient keys for the Card component:

- `primary`: Blue to indigo gradient
- `secondary`: Purple to pink gradient
- `accent`: Amber gradient
- `info`: Subtle blue gradient
- `default`: Subtle gray gradient

An example page demonstrating all gradient variants is available at `/examples/gradient-card`.

### Custom Components

The project includes several custom components built on top of shadcn/ui:

#### ResourceCard and ResourceList

These components are used in the Training Plan Creator to display resources such as books, videos, and articles. They include support for premium resources and filtering.

```tsx
<ResourceCard
  resource={{
    id: "1",
    title: "Resource Title",
    type: "book",
    description: "Resource description",
    isPremium: true,
    author: "Author Name",
    url: "https://example.com",
  }}
/>

<ResourceList
  resources={[/* array of resources */]}
  isPremiumUser={true}
/>
```

### Component Standardization Tools

The project includes several utility scripts to help with component standardization:

#### Component Audit Script

The component audit script (`scripts/component-audit.js`) identifies custom components and styling patterns that could be replaced with shadcn/ui components.

```bash
node scripts/component-audit.js
```

#### Component Migration Script

The component migration script (`scripts/migrate-components.js`) helps migrate custom components to shadcn/ui.

```bash
node scripts/migrate-components.js [component-name]
```

#### Create Variant Script

The create variant script (`scripts/create-variant.js`) adds new variants to shadcn/ui components.

```bash
node scripts/create-variant.js [component-name] [variant-name]
```

Available variant templates:

- `gradient`: Gradient backgrounds
- `outline`: Colored outlines with matching text
- `glass`: Frosted glass effect with backdrop blur

## Toast System

The project has migrated from the old toast system to the new sonner toast system. A toast migration utility has been created at `@/lib/toast-migration.ts` that provides backward compatibility.

All components should import toast from `@/lib/toast-migration` instead of `@/hooks/use-toast`.

```typescript
import { toast } from "@/lib/toast-migration";

// Success toast
toast({
  title: "Success",
  description: "Operation completed successfully.",
});

// Error toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong.",
});
```

# System Patterns (2024-03-08)

## LLM Integration Pattern (2024-03-08)

- **Two-Stage LLM Approach for Training Plan Creator**:

  - Stage 1: Gemini 2.0 Flash for premium resource recommendations
    - Direct integration with Google's Generative AI API
    - Uses the official `@google/generative-ai` package
    - Environment variable: `GEMINI_API_KEY`
    - Implementation in `nextjs-app/src/lib/gemini.ts`
  - Stage 2: Llama 3.2 3b for plan generation
    - Integration via OpenRouter API
    - Uses OpenAI SDK with custom baseURL
    - Environment variable: `OPENROUTER_API_KEY`
    - Implementation in `nextjs-app/src/lib/openrouter.ts` and `nextjs-app/src/lib/llama.ts`

- **Centralized Model Access**:

  - Utility functions for accessing models:
    - `getGeminiModel()` for Gemini models (defaults to "gemini-2.0-flash")
    - `openRouter` instance for Llama models
  - Consistent error handling and response processing
  - Type-safe interfaces for LLM responses

- **Prompt Engineering Patterns**:

  - Structured prompts with clear sections
  - JSON output formatting for structured data
  - HTML output formatting for rich content
  - Fallback mechanisms for handling unexpected responses

- **Resource Generation Pattern**:
  - Premium users: AI-curated resources from Gemini
  - Free users: Enhanced prompt for better resource recommendations
  - Zod schema validation for consistent resource structure
  - JSON extraction and parsing with error handling

### API Integration Pattern

- RESTful API endpoints
- Multiple LLM service integrations
- Error handling middleware
- Type-safe API routes

## AI Excellence Patterns - 2024-03-08

### AI Quality Assurance Architecture

- **Prompt Engineering Layer**

  - System prompts establish context and expectations
  - User prompts are enhanced with additional context
  - Chain-of-thought prompting for complex reasoning
  - Few-shot examples for consistent formatting

- **Model Selection Framework**

  - Model routing based on task complexity
  - Fallback mechanisms for API failures
  - Model-specific prompt optimization
  - Performance monitoring and logging

- **Output Processing Pipeline**

  - Content structuring and formatting
  - Error detection and correction
  - Quality assurance checks
  - Personalization based on user context

- **Feedback Integration System**
  - User feedback collection
  - Output quality metrics
  - Continuous prompt refinement
  - A/B testing of prompt variations

### AI Component Design Patterns

- **Intelligent UI Pattern**

  - Loading states that indicate AI "thinking"
  - Progressive revelation of AI-generated content
  - Highlighting key insights in AI outputs
  - Interactive elements that showcase AI capabilities

- **Context Preservation Pattern**

  - Session-based context management
  - User preference integration
  - Conversation history utilization
  - Cross-tool context sharing

- **Output Refinement Pattern**
  - Multi-stage generation process
  - Post-processing for formatting consistency
  - Content enhancement with additional information
  - Quality validation before presentation

### Feedback Collection Patterns - 2024-03-08

- **Integrated Feedback System**

  - Every AI-powered tool includes feedback mechanisms
  - Feedback is collected at the point of AI output delivery
  - Multiple feedback types are supported (ratings, comments, specific aspects)
  - Feedback data is stored with the associated AI output for analysis

- **Feedback UI Components**

  - Simple rating components (stars, thumbs up/down)
  - Expandable detailed feedback forms
  - Contextual feedback prompts based on user interaction
  - Confirmation and thank you messages after feedback submission

- **Feedback Data Flow**

  - Client-side feedback collection
  - Server-side storage in feedback database
  - Aggregation for analytics and reporting
  - Integration with prompt refinement process

- **Feedback Analysis System**
  - Quantitative metrics tracking (average ratings, trends)
  - Qualitative feedback categorization
  - Pattern identification in negative feedback
  - Automated alerts for significant feedback issues

### Business Solution CTA Patterns - 2024-03-08

- **Strategic CTA Placement**

  - Hero section for primary business solution CTA
  - After AI capability demonstrations
  - Adjacent to testimonials and case studies
  - In persistent UI elements (header, footer)
  - At completion of tool usage flows

- **CTA Design System**

  - Primary CTAs: High-contrast buttons with business-focused icons
  - Secondary CTAs: Text links with directional arrows
  - Tertiary CTAs: Information cards with contact options
  - Consistent styling across the application

- **CTA Content Strategy**

  - Value-focused messaging highlighting business benefits
  - Problem-solution framing for specific pain points
  - Personalization emphasis for custom solutions
  - Clear next steps and expectations

- **CTA Interaction Patterns**
  - Hover effects to increase engagement
  - Click tracking for optimization
  - A/B testing of messaging and placement
  - Progressive disclosure of additional information

# System Patterns - [2025-03-05T07:00:00Z]

## LLM Integration Patterns

### Model Selection and Fallback

- Primary: Llama 3.2 3B model via OpenRouter
- Secondary: Gemini 2.0 Flash
- Fallback chain: Llama -> Gemini -> Default Template
- Model selection based on task complexity and user tier

### Authentication Patterns

- Authentication required for:
  - Saving generated content
  - Accessing premium features
  - User-specific customizations
- Authentication optional for:
  - Basic content generation
  - Enhanced plan generation
  - Public API endpoints

### Error Handling

- Graceful fallback between models
- Clear error messages for API failures
- Maintain service availability through fallbacks

## Authentication and Authorization - [2025-03-07 20:30:00]

### Role-Based Access Control

The application implements role-based access control (RBAC) to manage access to different parts of the system:

1. **User Roles**:

   - `user`: Default role assigned to all new users
   - `ADMIN`: Administrative role with access to admin dashboard and management features

2. **Role Assignment**:

   - Roles are stored in the `User` model in the database
   - Admin users can assign roles to other users through the user management interface
   - The admin role can only be assigned by existing admin users

3. **Access Control Implementation**:

   - Admin pages check for the `ADMIN` role in the user's session
   - API routes that perform administrative actions verify the user's role
   - Navigation elements (like admin links) are conditionally rendered based on the user's role
   - Both client-side and server-side checks are implemented for complete security

4. **User Management**:
   - Admin users can view all users in the system
   - Admin users can change the role of any user
   - The user management interface is accessible only to users with the `ADMIN` role

# System Patterns - 2025-03-09

## UI Animation Patterns (2025-03-09)

### Logo Animation Pattern

- **Stable ID Generation**:

  - Use React's `useId()` hook to generate stable IDs for SVG elements
  - Replace random ID generation with deterministic IDs to prevent hydration errors
  - Format IDs by removing colons from useId() output for SVG compatibility

- **Color Rotation Animation**:

  - Define a set of color patterns to rotate through
  - Use setTimeout with requestAnimationFrame for smooth transitions
  - Implement proper cleanup with useRef and useEffect
  - Track component mounted state to prevent memory leaks

- **Professional Animation Timing**:

  - Use longer intervals (3+ seconds) for subtle, non-distracting animations
  - Implement gradual transitions rather than abrupt changes
  - Choose color schemes that align with brand identity

- **SVG Gradient Animation**:
  - Use linearGradient with multiple color stops
  - Animate by changing the stopColor values
  - Maintain consistent gradient structure while changing colors

### Client-Side Animation Best Practices

- **"use client" Directive**:

  - Mark components with animations as client components
  - Keep animations isolated to prevent unnecessary client-side rendering

- **Performance Optimization**:

  - Use setTimeout instead of setInterval to prevent timing issues
  - Implement throttling for resource-intensive animations
  - Use refs to store animation state instead of state updates when possible

- **Accessibility Considerations**:
  - Add aria-label to animated elements
  - Ensure animations don't interfere with screen readers
  - Keep animations subtle to avoid distracting users with cognitive disabilities

# System Architecture and Patterns - 2024-03-10 16:46

## Authentication and Authorization

### Role-Based Access Control

- Three-tier role system:
  - Superadmin (pgtipping1@gmail.com)
  - Admin
  - User
- Role hierarchy enforced through multiple layers:
  - API route authorization
  - Client-side component protection
  - Server-side session validation

### Access Control Implementation

- Session-based authentication using NextAuth.js
- Role checks in API routes with proper error handling
- Protected routes with client-side redirects
- Real-time role updates with optimistic UI

### Role Management

- Exclusive superadmin privileges for role modification
- Protected superadmin account from role changes
- Role update API with proper validation
- Real-time UI feedback for role changes

## API Architecture

### RESTful Endpoints

- User management: `/api/admin/users/*`
- Role management: `/api/admin/users/[id]/update-role`
- Superadmin setup: `/api/admin/users/set-superadmin`

### Error Handling

- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging
- Client-side error handling with toast notifications

## Database Schema

### User Model

- Core fields: id, name, email, role
- Role field with enum values: "user", "ADMIN"
- Proper indexing on email and role fields
- Timestamps for auditing

## UI Components

### Admin Dashboard

- Role-aware navigation
- Protected routes based on user role
- Real-time role indicators
- Loading states for async operations

### User Management Interface

- Role selection dropdown
- Real-time role updates
- Visual indicators for user roles
- Protected actions based on user role

## Security Patterns

### Authorization Checks

- Multiple layers of role verification
- Protected superadmin operations
- Session validation on all protected routes
- API route protection with proper middleware

### Data Protection

- Input validation with Zod schemas
- Protected role modification endpoints
- Secure session handling
- Error message sanitization
