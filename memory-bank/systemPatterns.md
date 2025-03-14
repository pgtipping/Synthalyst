# System Patterns - Updated on June 12, 2024

## System Architecture

The application follows a modern Next.js architecture with the following key components:

- **Frontend**: Next.js App Router with React components
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with shadcn/ui components

## Interview Prep Feature Architecture

The Interview Prep feature follows a modular architecture with clear separation of concerns:

### Data Models

1. **InterviewSession**:

   - Represents a mock interview session
   - Contains metadata about the job, company, and industry
   - Tracks session status and timing
   - Links to questions and responses

2. **InterviewQuestion**:

   - Represents a question in a mock interview
   - Contains question text, type, and order
   - Links to the session and response

3. **InterviewResponse**:

   - Represents a user's response to a question
   - Contains response text, feedback, and scoring
   - Links to the question and session

4. **QuestionLibrary**:

   - Represents a question in the library
   - Contains question text, job type, industry, difficulty, and category
   - Can be saved by users

5. **UserSavedQuestion**:
   - Represents a question saved by a user
   - Contains user notes
   - Links to the user and question

### API Structure

1. **Mock Interview API**:

   - `/api/interview-prep/mock-interview` (POST, PUT):
     - POST: Start a new session
     - PUT: Submit a response
   - `/api/interview-prep/mock-interview/[sessionId]` (GET, DELETE):
     - GET: Retrieve session details
     - DELETE: End a session and generate summary
   - `/api/interview-prep/mock-interview/evaluate` (POST):
     - Evaluate a response with detailed feedback

2. **Question Library API**:
   - `/api/interview-prep/questions` (GET, POST):
     - GET: Browse questions with filters
     - POST: Save a question
   - `/api/interview-prep/questions/[id]` (GET, PUT, DELETE):
     - GET: Get question details
     - PUT: Update notes
     - DELETE: Remove from saved questions

### UI Components

1. **Mock Interview**:

   - `interview-prep/mock-interview/page.tsx`: Main mock interview page
   - `interview-prep/mock-interview/summary/page.tsx`: Interview summary page

2. **Question Library**:

   - `interview-prep/questions/page.tsx`: Question browsing page
   - `interview-prep/questions/[id]/page.tsx`: Question detail page

3. **Main Entry Point**:
   - `interview-prep/page.tsx`: Main Interview Prep landing page

## Key Design Patterns

### State Management

- **Client-side State**: React useState and useEffect hooks for component-level state
- **Server State**: API routes with Prisma for database interactions
- **Persistence**: localStorage for session persistence between page refreshes

### Component Patterns

- **Layout Components**: FeedbackLayout for consistent page structure
- **Card-based UI**: Card components for displaying questions, feedback, and statistics
- **Responsive Design**: Mobile-first approach with responsive grid layouts

### API Patterns

- **RESTful API**: Standard HTTP methods (GET, POST, PUT, DELETE) for resource operations
- **Request Validation**: Zod schema validation for API request bodies
- **Error Handling**: Consistent error response format with appropriate status codes
- **Authentication Check**: Server-side session validation for protected routes

## Other Key Technical Patterns

- **Form Handling**: Controlled components with React state
- **Loading States**: Visual indicators for asynchronous operations
- **Error Handling**: Try-catch blocks with toast notifications for user feedback
- **Pagination**: Offset-based pagination for large data sets
- **Filtering**: Query parameter-based filtering for data retrieval

## System Architecture

### Next.js App Router Architecture

The application is built using Next.js with the App Router architecture, which provides several advantages:

- Server Components for improved performance and SEO
- Built-in API routes for backend functionality
- File-based routing for simplified navigation
- Metadata API for dynamic SEO optimization
- Server-side rendering capabilities for improved initial load times

### Module System

- **CommonJS Modules**: The application uses CommonJS module format (require/module.exports) for compatibility
- **Configuration Files**: All configuration files (tailwind.config.ts, postcss.config.ts) use module.exports syntax
- **Script Files**: Utility scripts use .cjs extension to ensure they are treated as CommonJS modules
- **Module Resolution**: Next.js is configured to handle CommonJS modules correctly

### Component Structure

- **Layout Components**: Define the overall structure of pages (header, footer, etc.)
- **Page Components**: Implement specific page functionality
- **UI Components**: Reusable interface elements
- **Feature Components**: Implement specific features like ApplyRight, Interview Prep, etc.

### Data Flow

- Server Components fetch data on the server
- Client Components handle user interactions
- API routes provide backend functionality
- Database interactions are handled through Prisma

### Feedback System Architecture

- **Dual Storage Strategy**:
  - Primary: Prisma database with AppFeedback model
  - Fallback: File-based JSON storage in feedback-data.json
- **Component Structure**:
  - FeedbackLayout: Wrapper component for pages with feedback functionality
  - FeedbackButton: Trigger for feedback modal
  - FeedbackForm: Form for collecting ratings and comments
- **API Routes**:
  - /api/feedback: For submitting feedback
  - /api/admin/feedback: For retrieving feedback (admin only)
  - /api/admin/feedback/export: For exporting feedback to CSV (admin only)
- **Error Handling**:
  - Graceful degradation from database to file storage
  - Comprehensive logging for troubleshooting
  - User-friendly error messages

## Key Technical Decisions

### SEO Implementation

- **Metadata API**: Using Next.js Metadata API for dynamic metadata generation
- **JSON-LD**: Implementing structured data using JSON-LD format
- **Dynamic Sitemap**: Generating sitemap.xml dynamically based on content
- **Dynamic Robots.txt**: Configuring robots.txt dynamically

### CSS Strategy

- **Critical CSS**: Inline critical CSS for above-the-fold content
- **Non-Critical CSS**: Load non-critical CSS asynchronously
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **CSS Variables**: Used for theming and consistent design

### JavaScript Optimization

- **Code Splitting**: Automatic code splitting by Next.js
- **Dynamic Imports**: Lazy loading components when needed
- **Script Optimization**: Using next/script for script loading strategies
- **Tree Shaking**: Removing unused code

### Image Optimization

- **next/image**: Using Next.js Image component for automatic optimization
- **Responsive Images**: Implementing srcset for different screen sizes
- **Lazy Loading**: Loading images only when they enter the viewport
- **WebP Format**: Using modern image formats when supported

## Design Patterns in Use

### Component Patterns

- **Compound Components**: For complex UI elements with multiple parts
- **Render Props**: For sharing code between components
- **Higher-Order Components**: For adding functionality to existing components
- **Custom Hooks**: For reusing stateful logic

### State Management

- **React Context**: For global state management
- **useState/useReducer**: For component-level state
- **Server State**: For data fetched from the server

### API Patterns

- **RESTful API**: For standard CRUD operations
- **API Routes**: Using Next.js API routes for backend functionality
- **Error Handling**: Consistent error handling across API calls

### Accessibility Patterns

- **Semantic HTML**: Using appropriate HTML elements
- **ARIA Attributes**: Adding ARIA attributes when needed
- **Keyboard Navigation**: Ensuring keyboard accessibility
- **Focus Management**: Proper focus handling for modals and dialogs

## Component Relationships

### Layout Structure

```
RootLayout
├── Header
│   ├── Navigation
│   └── AuthButtons
├── Main Content
│   └── Page-specific components
└── Footer
    ├── FooterLinks
    └── SocialLinks
```

### Feature Relationships

```
ApplyRight
├── FileUpload
├── JobDescription
├── ResumePreview
└── CoverLetterPreview

InterviewPrep
├── JobDetailsForm
├── InterviewPlan
├── PracticeQuestions
└── MockInterview (Premium)

Blog
├── BlogList
├── BlogPost
├── CategoryFilter
└── SearchBar
```

## Technical Constraints

- Next.js App Router architecture
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma for database interactions
- NextAuth for authentication
- Vercel for deployment

### CSS Conflict Resolution

- **Custom Prefixed Classes**: Using `synthalyst-` prefix for custom classes to avoid conflicts
- **CSS Specificity Management**: Using higher specificity selectors when needed
- **Important Flag Usage**: Strategic use of `!important` for critical styling
- **Media Queries**: Implementing responsive behavior with breakpoint-specific styles
- **Development vs. Production**: Strategies for handling CSS differences between environments
  - Identifying conflicting styles in production
  - Creating override classes with higher specificity
  - Testing in both environments to ensure consistency
