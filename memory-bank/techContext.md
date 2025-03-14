# Technical Context - Updated on March 14, 2025

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
