# Interview Prep Feature Implementation Plan

_Created: March 14, 2025_

## Overview

This document outlines the comprehensive implementation plan for enhancing the Interview Prep feature in the Synthalyst application. The plan covers all missing functionalities identified in the project brief and provides detailed specifications for implementation across multiple development sessions.

## Table of Contents

1. [Current Status](#current-status)
2. [Missing Functionalities](#missing-functionalities)
3. [Implementation Details](#implementation-details)
   - [Mock Interview Functionality](#1-mock-interview-functionality-paid-service)
   - [Question Library](#2-question-library-paid-service)
   - [Premium Tier Implementation](#3-premium-tier-implementation)
   - [Bundle Integration with ApplyRight](#4-bundle-integration-with-applyright)
   - [Mobile Responsiveness Enhancements](#5-mobile-responsiveness-enhancements)
   - [Analytics and Tracking](#6-analytics-and-tracking)
4. [Mobile-First Implementation Requirements](#mobile-first-implementation-requirements)
5. [Technical Specifications](#technical-specifications)
6. [Implementation Timeline](#implementation-timeline)
7. [Testing Strategy](#testing-strategy)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Performance Optimization](#performance-optimization)

## Current Status

The Interview Prep feature currently includes:

- ✅ Basic job details form for collecting information about the target position
- ✅ API integration with Gemini for generating interview preparation plans
- ✅ Practice questions generation based on job details
- ✅ PDF export functionality for the interview plan
- ✅ Proper formatting for special sections (TIMELINE, PHASE, OVERARCHING GOAL)
- ✅ Basic premium user detection (but not full premium features)

## Missing Functionalities

Based on the project brief, the following functionalities are missing:

1. ❌ Mock Interview Functionality (Paid Service)

   - Interactive mock interviews with LLM
   - Multiple interaction modes (text/voice)
   - Performance feedback

2. ❌ Question Library (Paid Service)

   - Comprehensive library of interview questions and answers
   - Organization by job type and industry

3. ⚠️ Premium Tier Implementation

   - Proper subscription management
   - Premium feature gating
   - Enhanced content for premium users

4. ❌ Bundle Integration with ApplyRight

   - Unified dashboard
   - Data sharing between features
   - Bundle subscription management

5. ⚠️ Mobile Responsiveness Enhancements

   - Optimized mobile interview experience
   - Progressive Web App features

6. ❌ Analytics and Tracking
   - Usage analytics
   - User progress tracking

## Implementation Details

### 1. Mock Interview Functionality (Paid Service)

#### 1.1. Mock Interview API Routes

**File:** `nextjs-app/src/app/api/interview-prep/mock-interview/route.ts`

```typescript
// API route for starting a new mock interview session
export async function POST(request: Request) {
  // Validate premium user status
  // Initialize interview session with questions based on job details
  // Return session ID and first question
}

// API route for submitting a response and getting feedback
export async function PUT(request: Request) {
  // Process user response (text or audio)
  // Generate LLM feedback
  // Return feedback and next question
}
```

**File:** `nextjs-app/src/app/api/interview-prep/mock-interview/[sessionId]/route.ts`

```typescript
// API route for retrieving session details
export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  // Retrieve session details
  // Return session state, questions, and responses
}

// API route for ending a session and generating summary
export async function DELETE(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  // End session
  // Generate performance summary
  // Return summary data
}
```

#### 1.2. Mock Interview Database Schema

**File:** `nextjs-app/prisma/schema.prisma`

```prisma
model InterviewSession {
  id            String    @id @default(cuid())
  userId        String
  jobTitle      String
  company       String?
  industry      String?
  startedAt     DateTime  @default(now())
  endedAt       DateTime?
  status        String    @default("in_progress") // in_progress, completed, abandoned
  questions     InterviewQuestion[]
  responses     InterviewResponse[]
  summary       Json?
  user          User      @relation(fields: [userId], references: [id])
}

model InterviewQuestion {
  id            String    @id @default(cuid())
  sessionId     String
  questionText  String
  questionOrder Int
  questionType  String    // behavioral, technical, situational
  session       InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  response      InterviewResponse?
}

model InterviewResponse {
  id            String    @id @default(cuid())
  questionId    String    @unique
  sessionId     String
  responseText  String
  audioUrl      String?
  feedback      String
  score         Int?      // 1-10 rating
  strengths     String[]
  improvements  String[]
  submittedAt   DateTime  @default(now())
  question      InterviewQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  session       InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}
```

#### 1.3. Mock Interview UI Components

**File:** `nextjs-app/src/app/interview-prep/mock-interview/page.tsx`

- Main page for the mock interview feature
- Premium feature gate check
- Session initialization
- Interview session management

**File:** `nextjs-app/src/components/interview-prep/MockInterviewSession.tsx`

- Interview session UI
- Question display
- Response input (text and voice)
- Feedback display
- Session progress tracking

**File:** `nextjs-app/src/components/interview-prep/InterviewFeedback.tsx`

- Feedback display component
- Strength/improvement highlighting
- Score visualization
- Next steps suggestions

**File:** `nextjs-app/src/components/interview-prep/AudioRecorder.tsx`

- Voice recording component
- Recording controls
- Audio visualization
- Playback functionality
- Mobile-optimized interface

**File:** `nextjs-app/src/components/interview-prep/SessionSummary.tsx`

- Overall performance summary
- Question-by-question review
- Downloadable report
- Improvement suggestions

#### 1.4. Voice Processing Utilities

**File:** `nextjs-app/src/lib/audio/recorder.ts`

```typescript
// Audio recording functionality
export class AudioRecorder {
  // Initialize recorder with browser audio API
  // Handle recording start/stop
  // Process audio chunks
  // Manage permissions
  // Implement noise reduction
  // Handle mobile device audio constraints
}
```

**File:** `nextjs-app/src/lib/audio/speech-to-text.ts`

```typescript
// Speech recognition functionality
export class SpeechRecognition {
  // Initialize with Web Speech API
  // Fallback to Google Cloud Speech API if needed
  // Handle continuous recognition
  // Process interim results
  // Manage language settings
  // Optimize for mobile devices (battery, performance)
}
```

**File:** `nextjs-app/src/lib/audio/text-to-speech.ts`

```typescript
// Text-to-speech functionality
export class TextToSpeech {
  // Initialize with Web Speech API
  // Premium option with Google Cloud TTS
  // Voice selection
  // Rate and pitch adjustment
  // Mobile-optimized playback
}
```

**File:** `nextjs-app/src/lib/audio/analysis.ts`

```typescript
// Audio analysis utilities
export class AudioAnalysis {
  // Speech pace detection
  // Filler word detection
  // Tone analysis
  // Confidence assessment
  // Speaking time measurement
  // Optimize processing for mobile devices
}
```

#### 1.5. Mock Interview Prompts

**File:** `nextjs-app/src/lib/prompts/mock-interview.ts`

```typescript
// LLM prompts for mock interview functionality
export const mockInterviewPrompts = {
  // Generate interview questions based on job details
  // Evaluate user responses
  // Provide constructive feedback
  // Generate performance summary
  // Tailor to different job levels and industries
};
```

### 2. Question Library (Paid Service)

#### 2.1. Question Library Database Schema

**File:** `nextjs-app/prisma/schema.prisma` (additions)

```prisma
model QuestionLibrary {
  id          String   @id @default(cuid())
  question    String
  answer      String?
  jobType     String
  industry    String
  difficulty  String   @default("medium") // easy, medium, hard
  category    String   // behavioral, technical, situational
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userSaves   UserSavedQuestion[]
}

model UserSavedQuestion {
  id          String   @id @default(cuid())
  userId      String
  questionId  String
  notes       String?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  question    QuestionLibrary @relation(fields: [questionId], references: [id])

  @@unique([userId, questionId])
}
```

#### 2.2. Question Library API Routes

**File:** `nextjs-app/src/app/api/interview-prep/questions/route.ts`

```typescript
// API route for fetching questions with filters
export async function GET(request: Request) {
  // Parse query parameters (jobType, industry, difficulty, category)
  // Check premium user status
  // Return filtered questions
}

// API route for saving a user question
export async function POST(request: Request) {
  // Validate premium user status
  // Save question to user's saved questions
  // Return success/failure
}
```

**File:** `nextjs-app/src/app/api/interview-prep/questions/[id]/route.ts`

```typescript
// API route for fetching a specific question
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check premium user status
  // Return question details with suggested answer
}

// API route for updating user notes on a saved question
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Validate premium user status
  // Update user notes
  // Return success/failure
}

// API route for removing a question from saved questions
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Validate premium user status
  // Remove question from user's saved questions
  // Return success/failure
}
```

#### 2.3. Question Library UI Components

**File:** `nextjs-app/src/app/interview-prep/question-library/page.tsx`

- Main page for the question library
- Premium feature gate check
- Search and filter interface
- Question browsing

**File:** `nextjs-app/src/components/interview-prep/QuestionLibrary.tsx`

- Question library main component
- Category navigation
- Filter controls
- Search functionality
- Mobile-optimized layout

**File:** `nextjs-app/src/components/interview-prep/QuestionCard.tsx`

- Individual question display
- Answer reveal functionality
- Save/unsave controls
- Note-taking interface
- Touch-friendly interactions

**File:** `nextjs-app/src/components/interview-prep/SavedQuestions.tsx`

- User's saved questions display
- Organization tools
- Note management
- Practice mode integration

#### 2.4. Question Generation System

**File:** `nextjs-app/scripts/generate-questions.cjs`

```javascript
// Script for generating questions with LLM
// Run periodically to expand the question library
// Generate questions for different job types and industries
// Create suggested answers
// Store in database
```

**File:** `nextjs-app/src/app/admin/question-library/page.tsx`

- Admin interface for the question library
- Question review and approval
- Editing capabilities
- Bulk operations
- Generation triggers

### 3. Premium Tier Implementation

#### 3.1. Subscription Management

**File:** `nextjs-app/src/lib/subscription.ts`

```typescript
// Subscription management utilities
export const subscriptionUtils = {
  // Check user subscription status
  // Verify feature access
  // Handle subscription expiration
  // Process subscription changes
};
```

**File:** `nextjs-app/src/app/api/subscription/route.ts`

```typescript
// API route for subscription management
export async function GET(request: Request) {
  // Return user subscription details
}

export async function POST(request: Request) {
  // Process subscription changes
  // Return updated subscription status
}
```

#### 3.2. Premium Feature UI Components

**File:** `nextjs-app/src/components/premium/PremiumFeatureGate.tsx`

- Component for gating premium features
- Upgrade prompts
- Feature preview
- Mobile-optimized upgrade flow

**File:** `nextjs-app/src/components/premium/UpgradePrompt.tsx`

- Upgrade call-to-action component
- Feature comparison
- Pricing display
- Mobile-friendly design

**File:** `nextjs-app/src/components/premium/SubscriptionBanner.tsx`

- Banner for subscription status
- Expiration warnings
- Renewal prompts
- Touch-friendly controls

#### 3.3. Premium Content Generation

**File:** `nextjs-app/src/lib/prompts/premium-interview-prep.ts`

```typescript
// Enhanced prompts for premium users
export const premiumPrompts = {
  // Industry-specific preparation plans
  // Advanced question generation
  // Personalized coaching suggestions
  // Detailed feedback generation
};
```

### 4. Bundle Integration with ApplyRight

#### 4.1. Unified Dashboard

**File:** `nextjs-app/src/app/career-bundle/page.tsx`

- Main dashboard for the ApplyRight + Interview Prep bundle
- Feature overview
- Quick access to both tools
- Progress tracking
- Mobile-optimized layout

**File:** `nextjs-app/src/components/career-bundle/BundleDashboard.tsx`

- Dashboard component
- Status cards
- Recent activity
- Next steps suggestions
- Touch-friendly navigation

#### 4.2. Data Sharing Implementation

**File:** `nextjs-app/src/lib/career-bundle/data-sharing.ts`

```typescript
// Data sharing utilities between ApplyRight and Interview Prep
export const bundleDataUtils = {
  // Share resume data with interview prep
  // Share job descriptions between tools
  // Synchronize user preferences
  // Handle data consistency
};
```

**File:** `nextjs-app/src/app/api/career-bundle/user-data/route.ts`

```typescript
// API route for shared user data
export async function GET(request: Request) {
  // Return user's shared data across tools
}

export async function PUT(request: Request) {
  // Update shared user data
  // Synchronize across tools
  // Return updated data
}
```

#### 4.3. Bundle Subscription Management

**File:** `nextjs-app/src/lib/career-bundle/subscription.ts`

```typescript
// Bundle subscription utilities
export const bundleSubscriptionUtils = {
  // Check bundle subscription status
  // Handle upgrades/downgrades
  // Process tier changes
  // Calculate pricing
};
```

**File:** `nextjs-app/src/app/api/career-bundle/subscription/route.ts`

```typescript
// API route for bundle subscription management
export async function GET(request: Request) {
  // Return bundle subscription details
}

export async function POST(request: Request) {
  // Process bundle subscription changes
  // Return updated subscription status
}
```

### 5. Mobile Responsiveness Enhancements

#### 5.1. Mobile-Optimized Components

**File:** `nextjs-app/src/components/interview-prep/MobileJobDetailsForm.tsx`

- Mobile-optimized version of the job details form
- Touch-friendly inputs
- Step-by-step flow
- Simplified layout

**File:** `nextjs-app/src/components/interview-prep/MobilePrepPlan.tsx`

- Mobile-optimized display of the interview prep plan
- Collapsible sections
- Touch-friendly navigation
- Readable typography

**File:** `nextjs-app/src/components/interview-prep/MobileMockInterview.tsx`

- Mobile-optimized mock interview interface
- Full-screen mode
- Touch controls for audio
- Battery-efficient processing

#### 5.2. Progressive Web App Implementation

**File:** `nextjs-app/src/app/manifest.ts`

```typescript
// PWA manifest configuration
export default function manifest() {
  return {
    name: "Synthalyst Interview Prep",
    short_name: "Interview Prep",
    description: "Prepare for your interviews with AI assistance",
    start_url: "/interview-prep",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      // Various icon sizes
    ],
  };
}
```

**File:** `nextjs-app/src/lib/pwa/offline-storage.ts`

```typescript
// Offline storage utilities
export const offlineStorage = {
  // Store interview plans offline
  // Cache question library
  // Sync when online
  // Manage storage limits
};
```

**File:** `nextjs-app/src/service-worker.ts`

```typescript
// Service worker for offline functionality
// Cache interview prep resources
// Handle offline access to saved plans
// Manage background sync
```

#### 5.3. Mobile-Specific Optimizations

**File:** `nextjs-app/src/styles/mobile-optimizations.css`

```css
/* Mobile-specific CSS optimizations */
@media (max-width: 640px) {
  /* Touch target size adjustments */
  /* Font size optimizations */
  /* Spacing adjustments */
  /* Form control enhancements */
}
```

**File:** `nextjs-app/src/lib/mobile/device-detection.ts`

```typescript
// Mobile device detection and optimization
export const mobileUtils = {
  // Detect device capabilities
  // Optimize for different screen sizes
  // Handle touch vs. mouse interactions
  // Manage battery usage
};
```

### 6. Analytics and Tracking

#### 6.1. Analytics Implementation

**File:** `nextjs-app/src/lib/analytics/interview-prep.ts`

```typescript
// Analytics for Interview Prep feature
export const interviewPrepAnalytics = {
  // Track feature usage
  // Measure engagement
  // Monitor conversion rates
  // Analyze user behavior
  // Privacy-compliant tracking
};
```

**File:** `nextjs-app/src/app/api/analytics/interview-prep/route.ts`

```typescript
// API route for analytics data
export async function POST(request: Request) {
  // Process analytics events
  // Store in database
  // Return success/failure
}

export async function GET(request: Request) {
  // Return analytics data for admin dashboard
  // Filter by date range, event type, etc.
}
```

#### 6.2. User Progress Tracking

**File:** `nextjs-app/src/lib/progress/interview-prep.ts`

```typescript
// Progress tracking for Interview Prep
export const progressTracking = {
  // Track preparation completion
  // Monitor practice sessions
  // Measure improvement over time
  // Generate progress reports
};
```

**File:** `nextjs-app/src/components/interview-prep/ProgressDashboard.tsx`

- User progress dashboard
- Completion metrics
- Improvement visualization
- Next steps recommendations
- Mobile-friendly data visualization

## Mobile-First Implementation Requirements

### Device Compatibility

- **Target Devices:**

  - iOS (iPhone 11 and newer)
  - Android (Android 10 and newer)
  - Tablets (iPad, Samsung Galaxy Tab, etc.)
  - All modern mobile browsers (Safari, Chrome, Firefox, Edge, Opera, etc.)

- **Screen Sizes:**
  - Small phones (320px - 375px width)
  - Standard phones (376px - 428px width)
  - Large phones (429px - 767px width)
  - Tablets (768px - 1024px width)

### Touch Optimization

- **Minimum Touch Target Size:**

  - 44px × 44px for all interactive elements
  - 12px minimum spacing between touch targets

- **Gesture Support:**
  - Swipe navigation between sections
  - Pinch-to-zoom for PDF viewing
  - Tap-to-expand for collapsible sections
  - Long-press for additional options

### Mobile Performance

- **Data Efficiency:**

  - Lazy loading for non-critical content
  - Optimized image loading
  - Minimal network requests

- **Battery Optimization:**

  - Efficient audio processing
  - Background processing limitations
  - Reduced animation when battery is low

- **Offline Capabilities:**
  - Save interview plans for offline access
  - Cache frequently used resources
  - Background sync when connection is restored

### Mobile-Specific Features

- **Device Integration:**

  - Microphone access for voice recording
  - Camera access for optional video interviews
  - Calendar integration for interview scheduling
  - Share functionality for interview plans

- **Mobile UI Patterns:**
  - Bottom navigation for primary actions
  - Pull-to-refresh for content updates
  - Floating action buttons for primary actions
  - Modal sheets instead of traditional modals

## Technical Specifications

### Frontend Technologies

- **Framework:** Next.js with App Router
- **State Management:** React Context API + SWR for data fetching
- **Styling:** Tailwind CSS with custom mobile-first utilities
- **Components:** Shadcn UI with mobile optimizations
- **Audio Processing:** Web Audio API, MediaRecorder API
- **Speech Recognition:** Web Speech API with Google Cloud Speech-to-Text fallback
- **PDF Generation:** React-PDF with mobile-optimized layouts

### Backend Technologies

- **API Routes:** Next.js API routes with proper rate limiting
- **Database:** Prisma ORM with PostgreSQL
- **Authentication:** NextAuth.js with session management
- **File Storage:** Vercel Blob Storage for audio recordings
- **AI Integration:** Google Generative AI (Gemini API)
- **Caching:** Vercel KV for performance optimization

### Security Considerations

- **Data Protection:**

  - Encryption for stored audio recordings
  - Automatic deletion policy for sensitive data
  - User consent management for data collection

- **API Security:**

  - Rate limiting to prevent abuse
  - Input validation for all API endpoints
  - Authentication checks for premium features

- **Privacy Compliance:**
  - GDPR-compliant data handling
  - Clear privacy policy for voice recording
  - User control over data retention

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)

- Set up database schema extensions
- Implement subscription management system
- Create mobile-optimized UI components
- Establish analytics framework

### Phase 2: Question Library (Weeks 3-4)

- Develop question library database and API
- Create question library UI components
- Implement question generation system
- Build saved questions functionality

### Phase 3: Mock Interview (Weeks 5-8)

- Develop audio recording and processing utilities
- Create mock interview session management
- Implement speech-to-text and text-to-speech
- Build feedback generation system
- Develop performance scoring algorithm

### Phase 4: Bundle Integration (Weeks 9-10)

- Create unified dashboard
- Implement data sharing between features
- Develop bundle subscription management
- Build cross-feature navigation

### Phase 5: Mobile Optimization (Weeks 11-12)

- Implement PWA functionality
- Optimize for various mobile devices
- Add offline capabilities
- Enhance touch interactions

### Phase 6: Testing and Refinement (Weeks 13-14)

- Conduct comprehensive testing
- Optimize performance
- Address accessibility issues
- Refine mobile experience

## Testing Strategy

### Unit Testing

- Component tests for all UI elements
- Utility function tests for core functionality
- API route tests for data validation

### Integration Testing

- End-to-end tests for critical user flows
- API integration tests for external services
- Cross-feature integration tests

### Mobile Testing

- Device-specific testing on various phones and tablets
- Touch interaction testing
- Performance testing on lower-end devices
- Battery usage monitoring

### Accessibility Testing

- Screen reader compatibility testing
- Keyboard navigation testing
- Color contrast verification
- Touch target size validation

### User Testing

- Usability testing with representative users
- A/B testing for critical features
- Performance monitoring in production

## Accessibility Requirements

- **WCAG 2.1 AA Compliance:**

  - Proper heading structure
  - Sufficient color contrast
  - Keyboard navigability
  - Screen reader compatibility

- **Mobile Accessibility:**

  - Touch target size compliance
  - Gesture alternatives
  - Orientation support
  - Magnification support

- **Audio/Voice Accessibility:**
  - Transcripts for audio content
  - Visual indicators for audio recording
  - Alternative input methods
  - Text alternatives for voice interactions

## Performance Optimization

- **Core Web Vitals Targets:**

  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

- **Mobile Optimization:**

  - Reduced JavaScript bundle size
  - Optimized image loading
  - Efficient API calls
  - Battery-friendly processing

- **Rendering Strategy:**
  - Server components for static content
  - Client components for interactive elements
  - Streaming for large data sets
  - Suspense for loading states

## Interview Response Scoring System

### 1. Scoring Framework

#### 1.1. Scoring Components

**File:** `nextjs-app/src/lib/scoring/interview-scoring.ts`

```typescript
// Core scoring system implementation
export interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-10 weighting factor
  scoreFunction: (response: string, context: ScoringContext) => number; // 1-10 score
}

export interface ScoringContext {
  jobTitle: string;
  jobLevel: string;
  industry: string;
  requiredSkills: string[];
  questionType: string; // behavioral, technical, situational
  questionText: string;
  expectedKeypoints?: string[];
}

export class InterviewScorer {
  // Initialize with job-specific scoring criteria
  // Calculate weighted scores across multiple dimensions
  // Generate detailed feedback based on scores
  // Identify strengths and improvement areas
  // Provide personalized recommendations
}
```

#### 1.2. Job-Specific Scoring Criteria

**File:** `nextjs-app/src/lib/scoring/criteria-generators.ts`

```typescript
// Generate job-specific scoring criteria
export function generateScoringCriteria(
  context: ScoringContext
): ScoringCriteria[] {
  // Generate relevant criteria based on job details
  // Adjust weights based on job level and industry
  // Return array of scoring criteria
}

// Pre-defined scoring criteria by question type
export const behavioralCriteria: Partial<ScoringCriteria>[] = [
  {
    id: "structure",
    name: "Response Structure",
    description: "Use of STAR method (Situation, Task, Action, Result)",
    weight: 8,
  },
  {
    id: "relevance",
    name: "Relevance to Question",
    description: "How directly the response addresses the question asked",
    weight: 9,
  },
  // Additional criteria...
];

export const technicalCriteria: Partial<ScoringCriteria>[] = [
  {
    id: "accuracy",
    name: "Technical Accuracy",
    description: "Correctness of technical information provided",
    weight: 10,
  },
  {
    id: "depth",
    name: "Depth of Knowledge",
    description:
      "Demonstration of deep understanding vs. surface-level knowledge",
    weight: 8,
  },
  // Additional criteria...
];

export const situationalCriteria: Partial<ScoringCriteria>[] = [
  {
    id: "problemSolving",
    name: "Problem-Solving Approach",
    description: "Logical and effective approach to the situation",
    weight: 9,
  },
  {
    id: "adaptability",
    name: "Adaptability",
    description: "Flexibility in approach and consideration of alternatives",
    weight: 7,
  },
  // Additional criteria...
];
```

### 2. Scoring Algorithm Implementation

#### 2.1. Content Analysis

**File:** `nextjs-app/src/lib/scoring/content-analysis.ts`

```typescript
// Content analysis utilities for scoring
export const contentAnalysis = {
  // Analyze response for key points coverage
  analyzeKeyPointsCoverage(response: string, keyPoints: string[]): number {
    // Calculate percentage of key points covered
    // Return score from 1-10
  },

  // Analyze response structure (STAR method for behavioral questions)
  analyzeStructure(response: string, questionType: string): number {
    // Check for situation, task, action, result components
    // Return score from 1-10
  },

  // Analyze response relevance to question
  analyzeRelevance(
    response: string,
    question: string,
    jobContext: Partial<ScoringContext>
  ): number {
    // Calculate semantic similarity between response and question
    // Consider job-specific context
    // Return score from 1-10
  },

  // Analyze response clarity and conciseness
  analyzeClarityAndConciseness(response: string): number {
    // Evaluate sentence structure, length, and readability
    // Check for filler words and redundancies
    // Return score from 1-10
  },

  // Analyze technical accuracy (for technical questions)
  analyzeTechnicalAccuracy(
    response: string,
    context: Partial<ScoringContext>
  ): number {
    // Evaluate technical content against expected knowledge areas
    // Check for factual correctness
    // Return score from 1-10
  },
};
```

#### 2.2. Delivery Analysis

**File:** `nextjs-app/src/lib/scoring/delivery-analysis.ts`

```typescript
// Delivery analysis utilities for scoring (when audio is available)
export const deliveryAnalysis = {
  // Analyze speaking pace
  analyzeSpeakingPace(audioMetrics: AudioMetrics): number {
    // Evaluate words per minute against optimal range
    // Consider question type and context
    // Return score from 1-10
  },

  // Analyze filler word usage
  analyzeFillerWords(transcript: string, audioMetrics: AudioMetrics): number {
    // Calculate frequency of filler words (um, uh, like, you know)
    // Compare against benchmarks
    // Return score from 1-10
  },

  // Analyze tone and confidence
  analyzeToneAndConfidence(audioMetrics: AudioMetrics): number {
    // Evaluate vocal variety, pitch, and energy
    // Assess confidence markers
    // Return score from 1-10
  },

  // Analyze pauses and pacing
  analyzePausingAndPacing(audioMetrics: AudioMetrics): number {
    // Evaluate strategic pauses vs. hesitations
    // Assess overall pacing and rhythm
    // Return score from 1-10
  },
};

// Audio metrics interface
export interface AudioMetrics {
  wordsPerMinute: number;
  fillerWordCount: Record<string, number>; // e.g., {"um": 5, "uh": 3}
  pausePatterns: Array<{ duration: number; position: number }>;
  volumeVariation: number; // Standard deviation of volume
  pitchVariation: number; // Standard deviation of pitch
  // Additional metrics...
}
```

### 3. Feedback Generation

#### 3.1. Strength and Improvement Identification

**File:** `nextjs-app/src/lib/scoring/feedback-generator.ts`

```typescript
// Feedback generation based on scores
export interface ScoreBreakdown {
  overallScore: number; // 1-10
  criteriaScores: Array<{
    criteriaId: string;
    criteriaName: string;
    score: number;
    weight: number;
  }>;
  contentScore: number; // 1-10
  deliveryScore?: number; // 1-10, optional if audio available
}

export interface FeedbackResult {
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
  detailedFeedback: Record<string, string>; // Keyed by criteria ID
  nextStepsSuggestions: string[];
}

export function generateFeedback(
  scoreBreakdown: ScoreBreakdown,
  context: ScoringContext,
  responseText: string
): FeedbackResult {
  // Identify top strengths (highest scoring criteria)
  // Identify key improvement areas (lowest scoring criteria)
  // Generate personalized feedback for each
  // Provide actionable next steps
  // Return comprehensive feedback object
}
```

#### 3.2. LLM-Enhanced Feedback

**File:** `nextjs-app/src/lib/prompts/feedback-prompts.ts`

```typescript
// LLM prompts for enhancing automated feedback
export const feedbackPrompts = {
  // Generate personalized strengths feedback
  strengthsFeedbackPrompt(
    criteria: string,
    score: number,
    responseText: string,
    context: ScoringContext
  ): string {
    return `
      You are an expert interview coach providing feedback on a candidate's response.
      
      Question: "${context.questionText}"
      Response: "${responseText}"
      
      The candidate scored ${score}/10 on ${criteria}, which is one of their strengths.
      
      Provide specific, encouraging feedback about what they did well in this area.
      Focus on concrete examples from their response.
      Keep your feedback concise (2-3 sentences) but specific and actionable.
    `;
  },

  // Generate personalized improvement feedback
  improvementFeedbackPrompt(
    criteria: string,
    score: number,
    responseText: string,
    context: ScoringContext
  ): string {
    return `
      You are an expert interview coach providing feedback on a candidate's response.
      
      Question: "${context.questionText}"
      Response: "${responseText}"
      
      The candidate scored ${score}/10 on ${criteria}, which is an area for improvement.
      
      Provide specific, constructive feedback about how they could improve in this area.
      Include 1-2 concrete examples of how they could have responded better.
      Keep your feedback concise (2-3 sentences) but specific and actionable.
    `;
  },

  // Generate overall summary feedback
  overallFeedbackPrompt(
    scoreBreakdown: ScoreBreakdown,
    responseText: string,
    context: ScoringContext
  ): string {
    return `
      You are an expert interview coach providing feedback on a candidate's response.
      
      Question: "${context.questionText}"
      Response: "${responseText}"
      Overall Score: ${scoreBreakdown.overallScore}/10
      
      Provide a concise overall assessment (3-4 sentences) that:
      1. Acknowledges their strengths
      2. Tactfully addresses areas for improvement
      3. Ends with an encouraging note
      
      Make your feedback specific to this response and relevant to a ${context.jobTitle} position.
    `;
  },
};
```

### 4. Scoring System Integration

#### 4.1. API Integration

**File:** `nextjs-app/src/app/api/interview-prep/mock-interview/evaluate/route.ts`

```typescript
// API route for evaluating interview responses
export async function POST(request: Request) {
  // Extract response text, audio URL (if available), and context
  // Generate scoring criteria based on job details
  // Score the response using the InterviewScorer
  // Generate feedback using the FeedbackGenerator
  // Enhance feedback with LLM if needed
  // Return comprehensive evaluation results
}
```

#### 4.2. Database Schema Extensions

**File:** `nextjs-app/prisma/schema.prisma` (additions to InterviewResponse)

```prisma
model InterviewResponse {
  // Existing fields...

  // New scoring-related fields
  overallScore        Int?
  criteriaScores      Json?      // Serialized array of criteria scores
  contentScore        Int?
  deliveryScore       Int?
  strengths           String[]
  improvements        String[]
  detailedFeedback    Json?      // Serialized feedback by criteria
  audioMetrics        Json?      // Serialized audio analysis metrics
}
```

#### 4.3. Job-Specific Scoring Calibration

**File:** `nextjs-app/src/lib/scoring/calibration.ts`

```typescript
// Scoring calibration based on job type and level
export const scoringCalibration = {
  // Adjust criteria weights based on job level
  adjustWeightsByLevel(
    criteria: ScoringCriteria[],
    jobLevel: string
  ): ScoringCriteria[] {
    // Modify weights based on seniority level
    // Entry-level: Emphasize basics and structure
    // Mid-level: Balanced weights
    // Senior-level: Emphasize depth, leadership, and strategic thinking
    // Return adjusted criteria
  },

  // Adjust criteria weights based on industry
  adjustWeightsByIndustry(
    criteria: ScoringCriteria[],
    industry: string
  ): ScoringCriteria[] {
    // Modify weights based on industry norms
    // Technical industries: Emphasize accuracy and depth
    // Creative industries: Emphasize innovation and adaptability
    // Customer-facing industries: Emphasize communication and empathy
    // Return adjusted criteria
  },

  // Generate expected key points based on question and job details
  generateExpectedKeyPoints(
    question: string,
    context: ScoringContext
  ): string[] {
    // Analyze question to determine expected elements in a strong response
    // Consider job-specific requirements
    // Return array of key points that should be covered
  },
};
```

### 5. Mobile-Optimized Scoring UI

#### 5.1. Score Visualization Components

**File:** `nextjs-app/src/components/interview-prep/ScoreCard.tsx`

- Overall score display with visual indicator
- Strength and improvement highlights
- Expandable detailed feedback
- Touch-friendly interactions
- Responsive design for all screen sizes

**File:** `nextjs-app/src/components/interview-prep/ScoreBreakdown.tsx`

- Detailed score breakdown by criteria
- Visual representation of scores (bar charts, radar charts)
- Interactive elements for exploring feedback
- Optimized for mobile viewing

**File:** `nextjs-app/src/components/interview-prep/FeedbackDetail.tsx`

- In-depth feedback for each scoring criteria
- Example improvements with before/after comparisons
- Collapsible sections for easy navigation
- Touch-optimized UI controls

#### 5.2. Progress Tracking

**File:** `nextjs-app/src/components/interview-prep/ScoreProgress.tsx`

- Visualization of score improvements over time
- Trend analysis for different criteria
- Milestone celebrations for improvements
- Mobile-friendly data visualization

### 6. Performance Considerations

- **Scoring Computation:**

  - Perform intensive scoring calculations server-side
  - Cache scoring results for repeated viewing
  - Use progressive loading for detailed feedback

- **Mobile Optimization:**

  - Minimize client-side computation for scoring
  - Optimize score visualization for performance
  - Use efficient data structures for score representation

- **Battery Efficiency:**
  - Limit audio processing on mobile devices
  - Provide option to disable intensive analysis features
  - Implement battery-aware processing throttling

---

This implementation plan will be reviewed and updated throughout the development process to ensure all requirements are met and the feature is successfully delivered.
