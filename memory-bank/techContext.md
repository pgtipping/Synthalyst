# Technical Context - Updated on ${new Date().toLocaleDateString()}

## Technologies Used

### Frontend

- **Next.js 15.2.1**: React framework with App Router
- **React 18.2.0**: UI library
- **TypeScript 5.8.2**: Type-safe JavaScript
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **shadcn/ui 2.4.0**: Component library based on Radix UI
- **Lucide React 0.475.0**: Icon library
- **React Hook Form 7.54.2**: Form handling
- **Zod 3.24.2**: Schema validation
- **Sonner 2.0.1**: Toast notifications
- **@react-pdf/renderer 4.3.0**: PDF generation
- **file-saver 2.0.5**: File download utility

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma 6.4.1**: ORM for database access
- **PostgreSQL**: Database
- **NextAuth.js 4.24.11**: Authentication
- **Google Generative AI SDK 0.22.0**: Gemini API integration
- **Groq SDK 0.15.0**: Groq API integration
- **OpenAI SDK 4.86.1**: OpenAI API integration

### Development Tools

- **ESLint 9**: Code linting
- **Jest 29.7.0**: Testing framework
- **Prisma Studio**: Database management
- **Git**: Version control

## Interview Prep Feature Technical Implementation

### PDF Generation

The Interview Prep Plan feature includes PDF export functionality implemented with:

- **@react-pdf/renderer**: For creating PDF documents with React components
- **file-saver**: For downloading the generated PDFs
- **crypto-polyfill.js**: Custom polyfill for crypto functionality needed by the PDF library
- **pdf-utils.js**: Utility functions for PDF generation and download

### Interview Prep Plan Generation

The Interview Prep Plan generation system includes:

- **API Route**: `/api/interview-prep/generate-plan` for handling plan generation requests
- **Gemini API Integration**: Using the Google Generative AI SDK to generate personalized plans
- **Fallback Mechanism**: Structured fallback content when the AI service fails
- **Error Handling**: Comprehensive error handling and logging
- **Environment Variable Management**: Verification of API keys and configuration

### Error Handling and Logging

The system includes robust error handling and logging:

- **Client-Side Logging**: Detailed logs for API requests and responses
- **Server-Side Logging**: Comprehensive logging in API endpoints
- **Error Capturing**: Detailed error information for debugging
- **Fallback Content**: Structured fallback plans and questions when services fail
- **User Feedback**: Clear error messages for users

### Premium Feature Testing

For testing purposes, all authenticated users are treated as premium users:

```typescript
// In nextjs-app/src/app/interview-prep/plan/page.tsx
const checkPremiumStatus = () => {
  if (status === "authenticated" && session?.user) {
    // For testing purposes, all authenticated users are treated as premium
    return true;
  }
  return false;
};
```

This allows for comprehensive testing of premium features before implementing actual subscription checks.

### User Flow Implementation

The Interview Prep feature is designed with a logical user flow, placing the Interview Prep Plan as the first activity:

```tsx
// In nextjs-app/src/app/interview-prep/page.tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Interview Prep Plan Card (First) */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        Interview Prep Plan
      </CardTitle>
      {/* ... */}
    </CardHeader>
    {/* ... */}
  </Card>

  {/* Mock Interview Card (Second) */}
  <Card className="relative overflow-hidden">{/* ... */}</Card>

  {/* Question Library Card (Third) */}
  <Card>{/* ... */}</Card>
</div>
```

This ordering establishes a clear progression: Plan → Mock Interview → Question Library.

## Technical Constraints

- **Mobile Responsiveness**: All components must be fully responsive
- **Accessibility**: Must meet WCAG 2.1 AA standards
- **Performance**: Initial load time under 3 seconds
- **Browser Compatibility**: Support for latest versions of Chrome, Firefox, Safari, and Edge

## Dependencies

### Critical Dependencies

- **@react-pdf/renderer**: For PDF generation
- **file-saver**: For downloading files
- **next-auth**: For authentication
- **prisma**: For database access
- **@google/generative-ai**: For Gemini API integration

### Development Dependencies

- **typescript**: For type checking
- **eslint**: For code linting
- **jest**: For testing
- **@types/file-saver**: TypeScript definitions for file-saver

## Environment Setup

- **Development Server**: localhost:3001
- **Database**: PostgreSQL (local for development, managed service for production)
- **API Keys**: Required for Gemini, OpenAI, and other services
- **Environment Variables**: Stored in .env.local (development) and Vercel (production)

## Audio Recording Technologies

### Browser APIs

- **MediaRecorder API**: Used for capturing audio from the user's microphone
- **Web Audio API**: Used for audio processing and visualization
- **Blob API**: Used for handling audio data as binary large objects
- **URL.createObjectURL**: Used for creating temporary URLs for audio playback

### Storage Solutions

- **Local Filesystem**: Used in development for storing audio files in the `/public/uploads` directory
- **AWS S3**: Used in production for scalable and reliable storage of audio files
- **Signed URLs**: Used for secure, time-limited access to audio files in S3

### Database Integration

- **Prisma ORM**: Used for database operations and schema management
- **PostgreSQL**: Used as the primary database for storing audio recording metadata
- **Database Models**: AudioRecording model for tracking recordings

### Libraries and Dependencies

- **uuid**: Used for generating unique identifiers for audio files
- **@aws-sdk/client-s3**: Used for S3 operations in production
- **@aws-sdk/s3-request-presigner**: Used for generating signed URLs for S3 objects

### Environment Configuration

- **AUDIO_STORAGE_TYPE**: Determines which storage implementation to use ("local" or "s3")
- **AWS_REGION**: AWS region for S3 operations
- **AWS_ACCESS_KEY_ID**: AWS access key for authentication
- **AWS_SECRET_ACCESS_KEY**: AWS secret key for authentication
- **AWS_S3_BUCKET**: S3 bucket name for storing audio files
- **AWS_S3_AUDIO_PATH**: Path within the S3 bucket for audio files
- **AWS_S3_URL_EXPIRATION**: Expiration time in seconds for signed URLs
- **MAX_AUDIO_FILE_SIZE**: Maximum allowed size for audio files
- **ALLOWED_AUDIO_MIME_TYPES**: Comma-separated list of allowed MIME types
- **GEMINI_API_KEY**: API key for Google's Gemini AI service

## Caching Infrastructure [2024-03-15]

### Redis Implementation

- **Version**: Redis 7.2
- **Connection**: Upstash Redis
- **Configuration**:
  - TLS enabled
  - Connection pooling
  - Automatic reconnection
  - Error retry mechanism

### Cache Operations

- **Set Operations**:

  - JSON serialization
  - TTL configuration
  - Atomic operations
  - Error handling

- **Get Operations**:
  - JSON deserialization
  - Cache miss handling
  - Error recovery
  - Performance logging

### Monitoring

- **Metrics**:

  - Cache hit rate
  - Response times
  - Error rates
  - Cache size
  - Memory usage

- **Logging**:
  - Operation timestamps
  - Error details
  - Performance data
  - Cache status

### Security

- **Access Control**:

  - TLS encryption
  - Token-based auth
  - IP restrictions
  - Rate limiting

- **Data Protection**:
  - Encryption at rest
  - Secure key generation
  - Data sanitization
  - TTL enforcement

## CSS and Styling Infrastructure [${new Date().toLocaleDateString()}]

### Tailwind CSS Configuration

- **Version**: Tailwind CSS 4.0.14
- **PostCSS Integration**: Using @tailwindcss/postcss 4.0.14 instead of direct tailwindcss usage
- **Configuration File**: postcss.config.cjs with standardized plugin setup
- **Configuration Changes**:
  - Migrated from direct `tailwindcss` plugin usage to `@tailwindcss/postcss` for compatibility with Tailwind v4
  - Updated PostCSS configuration to use the new plugin format
  - Verified build process works correctly with the new configuration
  - Fixed Vercel deployment errors related to PostCSS plugin changes
  - Removed Tailwind directives from critical.css to avoid duplication
  - Added clear comments in globals.css about the PostCSS plugin
  - Created vercel.json with explicit build commands for Vercel deployments
  - Disabled CSS optimization in next.config.js due to conflicts with Tailwind CSS v4
- **Deployment Fix (${new Date().toLocaleDateString()})**:
  - Created special `vercel-build.sh` script to handle build process reliably in Vercel environment
  - Added PostCSS configuration verification script that ensures correct setup
  - Temporarily moving Babel configuration files during build to prevent compiler conflicts
  - Enhanced error logging and debugging with detailed build steps
  - Added automatic package installation checks to ensure required dependencies are present
  - Implemented script to debug Babel configuration issues
  - Created fallback mechanism for globals.css to ensure Tailwind directives are properly included
  - Added node_modules/.cache clearing step to prevent stale cache issues
- **Additional Plugins**:
  - autoprefixer for vendor prefixing
  - tailwindcss-animate for animation utilities
  - @tailwindcss/typography for rich text styling

### Babel Configuration

- **Issue**: Next.js 15 with custom Babel configuration requires specific plugins for import attributes
- **Required Plugin**: @babel/plugin-syntax-import-attributes@7.26.0
- **Config Files**:
  - .babelrc with plugin and presets configuration
  - babel.config.js with size optimization settings
- **Deployment Fix**:
  - Temporary removal of custom Babel configuration during build process
  - Verification script to check and install required plugins
  - Detailed logging to debug configuration issues
  - Automatic restoration of config files after build completes

### CSS Organization

- **Global Styles**: src/app/globals.css with Tailwind imports
- **Critical CSS**: src/app/critical.css for above-the-fold styling
- **Non-Critical CSS**: public/styles/non-critical.css loaded asynchronously
- **Component Styles**: Component-specific CSS modules when needed
- **Theme Variables**: CSS variables in :root and .dark selectors

### CSS Best Practices

- **Color Usage**:

  - HSL variables for theme colors (--background, --foreground, etc.)
  - Explicit bracket notation for direct colors (bg-[#f3f4f6])
  - Consistent color scheme across light and dark modes

- **Utility Classes**:

  - Proper syntax for custom properties (border-[color:hsl(var(--border))])
  - Font weight using numeric values (font-[500] instead of font-medium)
  - Consistent spacing and sizing utilities

- **Responsive Design**:
  - Mobile-first approach
  - Breakpoint-specific classes
  - Fluid typography and spacing

### CSS Tooling

- **PostCSS**: For processing CSS with plugins
- **Autoprefixer**: For vendor prefixing
- **@tailwindcss/typography**: For rich text styling
- **tailwindcss-animate**: For animation utilities
