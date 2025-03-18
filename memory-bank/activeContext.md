# Active Context

## Current Focus (March 18, 2025)

The current focus is on resolving persistent Vercel deployment issues, particularly related to UI component resolution and dependency management. We are addressing the challenges of Next.js 15 with Tailwind CSS v4 integration in a production environment, which is proving to be more complex than anticipated. The immediate goal is to achieve a successful production deployment while maintaining the integrity of the application's features and user experience.

After multiple approaches to fix the component resolution issues, we're now considering a modular architecture approach as a more sustainable solution. This approach would break the application into standalone modules that can be built and deployed independently, preventing issues in one area from affecting others.

### Recent Changes (March 18, 2025)

1. **Inbound Email Webhook Robustness Improvements** (March 18, 2025):

   - Fixed JSON parsing error in the inbound email webhook handler
   - Added support for multiple content types (JSON, form data, multipart, and plain text)
   - Implemented comprehensive error handling and detailed logging
   - Added payload format validation and early error detection
   - Enhanced the InboundEmail model with a rawPayload field for debugging
   - Created a migration to update the database schema
   - Fixed TypeScript linter errors with proper interface definitions
   - Added safeguards against malformed or unexpected email payloads
   - Improved recovery mechanisms for partial or incomplete data

2. **Preview Deployment with Tailwind CSS Issues** (March 18, 2025):

   - Successfully deployed a preview version of the application on Vercel
   - Resolved deployment configuration conflicts by removing redundant vercel.json files
   - Set up proper root directory configuration in Vercel settings to "nextjs-app"
   - Fixed vercel.json configuration by removing deprecated "name" property
   - Resolved configuration conflict between "functions" and "builds" properties
   - Preview deployment succeeded but encountered Tailwind CSS styling issues
   - UI components rendered with correct structure but missing styles (colors, backgrounds, borders)
   - Identified potential causes: PostCSS configuration, Tailwind CSS v4 integration, or CSS loading
   - Need to investigate Tailwind CSS processing during build to resolve missing styles
   - Looking into ensuring proper inclusion of @tailwindcss/postcss dependency during deployment
   - Considering modifying build commands to explicitly include Tailwind CSS processing step

3. **Modular Architecture Planning** (March 18, 2025):

   - Created a comprehensive modular architecture plan to address deployment issues
   - Designed a phased approach to breaking up the application using Next.js route groups
   - Planned a shared component system with versioning and clear module boundaries
   - Outlined module-specific deployment configurations for better build isolation
   - Developed migration strategy with focus on problematic admin module first
   - Created detailed action items with immediate, short-term, and long-term tasks
   - Documented example module structure and configuration for implementation

4. **Advanced Component Resolution Fixes** (March 18, 2025):

   - Implemented direct component exports in admin and contact-submissions directories
   - Created fallback components for crucial UI elements
   - Added direct import replacement for problematic files
   - Updated webpack configuration for explicit path aliases
   - Created a module resolution helper for mapping import paths
   - Ensured TypeScript path configurations match the import resolution strategy
   - Implemented multiple layers of resolution fallbacks for build resilience
   - Added direct path modification for problematic component imports

5. **Vercel Configuration Optimization** (March 18, 2025):

   - Identified conflicting vercel.json files in root and nextjs-app directories
   - Resolved configuration conflict by using only the root vercel.json
   - Backed up the nextjs-app vercel.json to prevent conflicts
   - Updated build process to use simple-build.js script for deployment
   - Fixed JSON syntax issues in vercel.json configuration
   - Ensured proper environment variable configuration for production deployment
   - Set correct output directory path for Next.js build artifacts

6. **Enhanced Dependency Management for Vercel Deployment** (March 18, 2025):

   - Implemented comprehensive dependency verification in build scripts
   - Added explicit version pinning for all critical dependencies to prevent compatibility issues
   - Created fallback installation mechanisms to handle missing dependencies during build
   - Added multiple verification points throughout the build process
   - Enhanced error handling to continue builds despite non-critical dependency issues
   - Added dependency checking before component resolution to ensure proper imports
   - Implemented reliable detection of installed packages with robust error handling
   - Updated vercel-build.sh to validate dependency installation success
   - Prevented cascading failures from single dependency issues

7. **Component Resolution Fixes for Vercel Deployment** (March 18, 2025):

   - Created a script to copy essential UI components directly to the build directory
   - Added explicit webpack alias configuration in next.config.js for UI components
   - Modified vercel-build.sh to execute the component copy script during build
   - Fixed path resolution issues for critical UI components (breadcrumb, button, card, tabs)
   - Created fallback mechanism to ensure component availability during build
   - Added verification checks to ensure all required dependencies are installed
   - Resolved "Module not found" errors that were causing build failures on Vercel

8. **Tailwind CSS v4 Deployment Fixes** (March 18, 2025):

   - Identified and resolved complex PostCSS plugin configuration issues with Tailwind CSS v4
   - Created specialized build scripts to handle Vercel-specific deployment requirements
   - Implemented a comprehensive debug system for tracking build issues
   - Created fallback mechanisms for CSS configuration to ensure compatibility
   - Added automatic verification of critical dependencies during build
   - Resolved Babel configuration conflicts with Next.js 15
   - Created a temporary Babel configuration bypass for Vercel builds
   - Added node_modules cache clearing to prevent stale dependency issues
   - Enhanced error logging and debugging capabilities for build process
   - Improved script execution permissions handling for Unix environments

9. **Admin Dashboard Navigation Improvements** (March 17, 2025):

   - Fixed the main Synthalyst app navbar overlapping with the admin sidebar
   - Created a ConditionalHeader component to hide the main site header on admin pages
   - Removed the scroll behavior from the admin navbar for better usability
   - Simplified the admin navigation by removing the top navbar on desktop
   - Kept only the sidebar for navigation on desktop for a cleaner interface
   - Added a mobile-only top bar with menu toggle and logout button
   - Ensured proper z-index values to prevent overlapping elements
   - Updated the root layout to conditionally render the header based on the current path
   - Improved the overall admin navigation experience with a more focused interface

10. **Admin Dashboard API Fixes** (March 17, 2025):

    - Fixed API endpoints in the admin dashboard that were causing 500 Internal Server Error
    - Replaced raw SQL queries with standard Prisma query methods in contact-submissions API endpoint
    - Fixed the update-status API endpoint for contact submissions to use standard Prisma methods
    - Fixed the newsletter replies API endpoint to properly handle data transformation
    - Ensured all admin API endpoints are using proper error handling and type safety
    - Verified that all admin dashboard functionality is working correctly with no console errors
    - Successfully built the application with all the fixes in place
    - Ensured the communications page properly displays contact submissions, newsletter replies, and inbound emails

11. **Email Service Optimization**:

    - Created a unified email service in `nextjs-app/src/lib/email.ts`
    - Implemented a standardized approach for all email sending functionality
    - Added email logging to track all email activities
    - Created an `EmailLog` model in the Prisma schema
    - Implemented fallback mechanisms between SendGrid and Nodemailer

12. **Feedback API Improvements**:

    - Simplified the feedback API implementation
    - Removed file-based storage logic in favor of database-only storage
    - Implemented rate limiting using LRU cache
    - Enhanced error handling for feedback submissions
    - Updated the `FeedbackButton` component to use the new API

13. **Admin Dashboard Enhancements**:

    - Created an email logs admin dashboard UI
    - Implemented filtering by status and category
    - Added statistics for email status distribution
    - Added pagination for email logs
    - Created a dedicated section for failed emails
    - Added functionality to delete older logs
    - Updated admin navigation to include the Email Logs page
    - Created a responsive `AdminLayout` component with mobile support
    - Fixed layout issues with the admin sidebar and main content (March 16, 2025)
    - Improved mobile responsiveness with proper sidebar toggle controls
    - Restructured the admin layout to use a flex-based approach for better content positioning
    - Added a close button to the sidebar for better mobile usability
    - Made the top navigation bar sticky for better navigation on long pages
    - Ensured consistent spacing and alignment across all admin pages

14. **Admin Monitoring Fixes** (March 16, 2025):

    - Fixed Redis monitoring functionality in the admin dashboard
    - Resolved JSON parsing errors in the Redis monitor by adding type checking
    - Fixed rate limiting errors by using the correct string format for duration
    - Added better error handling for Redis connection issues
    - Made authorization optional for development environment
    - Improved error responses to return 200 status with error details instead of 500
    - Enhanced the RedisMonitoring component to handle null values properly
    - Added a reset metrics button to the monitoring UI
    - Fixed TypeScript errors in the rate-limit library
    - Added proper type definitions for LRU cache

15. **Admin User Management Fixes** (March 16, 2025):

    - Fixed NextJS dynamic route parameter issue in the user role update API
    - Updated the API route to properly await params object in Next.js 15
    - Changed params type to `Promise<{ id: string }>` to reflect Next.js 15 changes
    - Properly extracted and used the ID parameter after awaiting params
    - Ensured consistent error handling across all admin API routes
    - Fixed TypeScript errors in the admin user management components

16. **Newsletter Subscription System Fixes** (March 16, 2025):

    - Fixed model name in API routes from `newsletter` to `newsletterSubscriber` to match Prisma schema
    - Added functionality to create real subscribers in the database when in development mode
    - Implemented proper handling of both subscription and confirmation processes
    - Added code to create pending subscribers during subscription process
    - Added code to update subscribers to confirmed status during confirmation process
    - Ensured subscribers appear correctly in the admin dashboard
    - Fixed issue where mock subscribers weren't being stored in the database
    - Added proper error handling for database operations
    - Enhanced logging for subscription and confirmation processes
    - Fixed "Cannot read properties of undefined (reading 'totalPages')" error in the newsletter admin page
    - Added conditional rendering for pagination controls to prevent errors when data is loading
    - Updated API response structure to match frontend expectations by wrapping pagination properties in a pagination object

17. **Model Information Removal from UI**: Removed model information from the UI to simplify the user experience and focus on functionality rather than technical details.

18. **Language Selector Fix**: Fixed issues with the language selector component to properly handle language changes and ensure they're passed to the API.

19. **Model Router Updates**:

    - Added a new `generateContentV2` function with improved parameter handling
    - Updated the API route to use the new function
    - Standardized language support across models
    - Fixed Gemini API integration to properly handle system messages (Gemini doesn't support system role)

20. **UI Simplification**: Streamlined both Knowledge GPT and Learning Content Creator pages for better user experience.

21. **Knowledge GPT Web Search Integration**:

    - Added web search capability to provide up-to-date information
    - Implemented Google Custom Search API integration
    - Updated system prompts to include current information
    - Enhanced UI to inform users about web search capability

22. **Knowledge GPT Improvements** (March 16, 2025):

    - Updated loading animation to use three dots instead of spinning icon
    - Enhanced system prompt to instruct LLM to use proper formatting without asterisks
    - Added client-side formatting to properly render bold text and lists
    - Added web search toggle button to let users control when web search is used
    - Updated UI to clearly indicate when web search is enabled or disabled
    - Modified API to respect user preference for web search
    - Simplified web search logic by removing automatic detection in favor of explicit user control
    - Moved loading animation to appear in chat window instead of on send button

23. **Language Selector Improvements** (March 16, 2025):

    - Added "Auto Detect" option instead of showing "(Browser Default)" next to languages
    - Included English in the dropdown list
    - Made the dropdown scrollable with max height
    - Sorted languages alphabetically for easier navigation
    - Added local storage to remember user language preferences
    - Improved browser language detection and handling

24. **Medical Knowledge Integration** (March 16, 2025):

    - Added PubMed API integration for evidence-based medical information
    - Implemented evidence grading system based on study types
    - Created domain selection in Knowledge GPT for specialized knowledge areas
    - Added citation formatting and source attribution for medical responses
    - Integrated medical knowledge as a domain within Knowledge GPT rather than a separate tool
    - Enhanced UI to display evidence levels and citations for medical responses
    - Fixed UI alignment issues with language and domain selectors
    - Added PUBMED_API_KEY to environment variables
    - Updated tips section to inform users that conversational phrases like "thank you" will be treated as new queries

25. **Admin Pages Error Handling Improvements** (March 16, 2025):

    - Fixed SelectItem components with empty values in email-logs page and TemplateSearch.tsx
    - Changed empty values to "all" in SelectItem components to prevent errors
    - Updated filter logic to handle the new "all" value correctly
    - Fixed TypeScript errors in PostList component by making initialPosts optional
    - Fixed blog analytics route by properly typing the \_count property
    - Updated user queries in email-logs route to include the email field
    - Enhanced error handling in API routes for more robust operation
    - Improved type safety throughout the codebase
    - Added error handling for cases where database models might not exist yet
    - Implemented fallback to empty arrays when data is missing or undefined
    - Added try-catch blocks for API calls to handle errors independently

26. **Admin Page Database Checks** (March 16, 2025):

    - Added SQL queries to check if tables exist before attempting to query them
    - Used `information_schema.tables` to verify table existence in the database
    - Implemented default values for all data variables to prevent undefined errors
    - Added comprehensive error handling for all database operations in the admin page
    - Enhanced authentication error handling in the admin layout
    - Added null checking for user properties to prevent undefined errors
    - Used optional chaining for user properties to handle potential null values
    - Fixed "Cannot read properties of undefined" errors in the admin page
    - Resolved chunk loading errors by properly handling database queries
    - Improved error logging for all database operations

27. **Tailwind CSS Configuration** (${new Date().toLocaleDateString()}):

    - Using `@tailwindcss/postcss` instead of direct `tailwindcss` usage in PostCSS config
    - Using explicit color values with bracket notation instead of named colors
    - Adding Tailwind imports to all CSS files that use Tailwind features
    - Standardizing on a single PostCSS configuration file
    - Maintaining separate CSS files for critical and non-critical content
    - Ensuring proper comments in CSS files about Tailwind directive usage
    - Disabling CSS optimization in next.config.js to avoid Tailwind conflicts
    - Testing changes in a separate branch before merging to main

### Next Steps

1. **Implement Modular Architecture**:

   - Begin implementing the modular architecture plan
   - Start with isolating the admin module as a separate route group
   - Create dedicated component directories for each module
   - Update build scripts to support module-specific builds

2. **Email Webhook Configuration**: Set up SendGrid Inbound Parse to properly forward emails to the application's webhook endpoint.

3. **MX Records Setup**: Ensure proper MX records are set up for the domain to receive emails.

### Active Decisions

1. **Admin Navigation Design** (March 17, 2025):

   - Using a sidebar-only navigation approach for desktop admin pages
   - Hiding the main Synthalyst header on admin pages for a cleaner interface
   - Using a mobile-only top bar with essential controls for smaller screens
   - Implementing a conditional header rendering based on the current path
   - Ensuring proper z-index values to prevent overlapping elements
   - Focusing on a clean, distraction-free admin experience

2. **Email Service Architecture**:

   - Using a unified email service with SendGrid as primary provider and Nodemailer as fallback
   - Implementing comprehensive logging for all email activities
   - Standardizing email templates and categories
   - Using SendGrid Inbound Parse for processing incoming emails
   - Storing incoming emails in the database for tracking and processing

3. **Admin Dashboard Design**:

   - Creating a responsive admin layout with mobile support
   - Implementing a sidebar navigation for easy access to different admin sections
   - Using a card-based layout for statistics and data visualization
   - Ensuring robust error handling for all API calls
   - Providing fallback UI states when data is missing or loading
   - Returning 200 status with error details instead of 500 errors for better client handling
   - Adding conditional rendering for UI elements that depend on asynchronously loaded data
   - Using null checks and default values to prevent "Cannot read properties of undefined" errors

4. **Feedback System**:

   - Using database-only storage for feedback submissions
   - Implementing rate limiting to prevent abuse
   - Enhancing error handling for better user experience

5. **Model Selection**:

   - Using **Gemini 1.5 Flash-8B** for Knowledge GPT
   - Using **GPT-4o-Mini** for Learning Creator

6. **Tiered Approach**: Implementing a tiered approach for model selection based on:

   - Task complexity
   - Content length
   - Language support
   - Cost priority

7. **Language Support**:

   - Standardized language support across the application
   - Improved language detection and handling
   - Enhanced multilingual prompts

8. **User Experience**:

   - Focus on functionality rather than exposing model details
   - Simplified UI with clear language options
   - Consistent experience across different tools
   - Domain selection for specialized knowledge

9. **API Integration**:

   - Adapted to model-specific requirements (e.g., Gemini's lack of system role support)
   - Standardized API response format
   - Improved error handling with try-catch blocks for all API calls
   - Added PubMed API integration for medical knowledge
   - Implemented fallbacks for missing or undefined data
   - Ensured API response structures match frontend expectations

10. **Web Search Integration**:

    - Using Google Custom Search API for up-to-date information
    - Combining web search results with model knowledge
    - Ensuring accurate information for current events and facts

11. **Knowledge Domain Strategy**:

    - Integrating specialized domains within Knowledge GPT rather than creating separate tools
    - Starting with medical knowledge as the first specialized domain
    - Using a unified interface with domain selection
    - Adapting the UI based on the selected domain

12. **UI Improvements**:

    - Consistent button heights and alignment for better mobile experience
    - Clear visual distinction between different knowledge domains
    - Informative tips for users about how to interact with each domain
    - Robust error handling in UI components to prevent crashes
    - Conditional rendering for UI elements that depend on asynchronously loaded data
    - Using null checks and default values to prevent "Cannot read properties of undefined" errors

13. **Error Handling Strategy**:

    - Implementing try-catch blocks for all API calls
    - Providing fallback values when data is missing or undefined
    - Adding specific error messages for different failure scenarios
    - Using toast notifications to inform users of errors
    - Checking for the existence of database models before querying them
    - Ensuring non-empty values for required component props
    - Verifying table existence before executing database queries
    - Initializing default values for all data variables to prevent undefined errors
    - Adding conditional rendering for UI elements that depend on asynchronously loaded data
    - Using optional chaining and nullish coalescing operators to handle potentially undefined values

14. **Deployment Strategy** (${new Date().toLocaleDateString()}):

    - Using custom build scripts to handle Vercel-specific deployment requirements
    - Temporarily bypassing custom Babel configuration during builds to avoid compiler conflicts
    - Implementing automatic dependency verification during build process
    - Using shell scripts with proper Unix permissions handling for build commands
    - Clearing node_modules cache before builds to prevent stale dependency issues
    - Adding enhanced debugging output during builds for easier troubleshooting
    - Implementing fallback mechanisms for critical configuration files
    - Using a two-stage approach: verify configuration first, then build
    - Ensuring PostCSS configuration is compatible with Tailwind CSS v4
    - Adding automatic checks for globals.css to ensure proper Tailwind directives
    - Keeping custom Babel configuration for development but bypassing it for production builds
