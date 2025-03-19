# Technical Context - Updated on March 18, 2025

## Technologies Used

### Frontend

- **Next.js 15.2.3**: React framework with App Router
- **React 18.2.0**: UI library
- **TypeScript 5.8.2**: Type-safe JavaScript
- **Tailwind CSS 4.0.14**: Utility-first CSS framework with PostCSS integration
- **@tailwindcss/postcss**: Tailwind CSS PostCSS plugin (separated in v4)
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

### Build System

- **Component Resolution System**: Custom system for reliable UI component resolution
  - **verify-ui-components.js**: Script to verify existence of critical components
  - **copy-ui-components-to-build.js**: Script to copy essential components to build directory
  - **webpack aliases**: Explicit path mapping for component imports
- **vercel-build.sh**: Custom build script for Vercel deployments
- **PostCSS**: Advanced CSS processing (configured in postcss.config.js)
- **Webpack**: Module bundling (configured in next.config.js)
- **Babel**: JavaScript transpilation (configured for Next.js)

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

## CSS Architecture (Updated March 18, 2024)

The CSS architecture has been completely restructured to resolve styling issues and ensure proper cascade order:

### CSS Files

- **critical.css**:

  - Contains only CSS variables/custom properties
  - Defines theme colors, spacing, and typography variables
  - No Tailwind directives
  - No direct styling rules
  - Used for global theme configuration

- **globals.css**:

  - Contains Tailwind directives (@tailwind base, components, utilities)
  - Organizes custom styles into Tailwind layers
  - Uses @layer to properly integrate with Tailwind's cascade
  - Contains styling rules that reference CSS variables from critical.css
  - Primary styling file for the application

- **non-critical.css**:
  - Loaded asynchronously as a separate stylesheet
  - Contains styles for components that are not critical for initial rendering
  - Located in public/styles/ directory
  - Loaded via <link> tag in layout.tsx

### Loading Strategy

1. `globals.css` is loaded first to ensure Tailwind directives are processed
2. `critical.css` is loaded second to define CSS variables
3. `non-critical.css` is loaded asynchronously for non-critical styles

### PostCSS Configuration

The PostCSS configuration has been updated to use standard Tailwind plugins:

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    "tailwindcss/nesting": {}, // For CSS nesting support
    tailwindcss: {
      // Standard Tailwind CSS plugin
      content: ["./src/**/*.{js,ts,jsx,tsx}"],
      // Additional configuration...
    },
    autoprefixer: {
      // Browser compatibility settings...
    },
  },
};
```

### Tailwind Integration

- CSS variables are used via the `hsl()` function
- Tailwind classes reference variables using the `bg-[hsl(var(--variable))]` syntax
- Component-specific styles are defined in the `@layer components` section
- Base HTML element styles are defined in the `@layer base` section

This architecture ensures proper CSS cascade and prevents style conflicts while maintaining the benefits of CSS variables and Tailwind utility classes.
