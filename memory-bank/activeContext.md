# Active Context

## Current Focus (March 17, 2025)

The current focus is on optimizing the application's backend services, particularly email handling, feedback processing, and admin monitoring capabilities. We're enhancing the admin dashboard with robust monitoring features and fixing critical errors in the API endpoints, Redis monitoring functionality, user role management, and newsletter subscription system. These optimizations aim to improve performance, reliability, and maintainability of the platform.

### Recent Changes

1. **Admin Dashboard Navigation Improvements** (March 17, 2025):

   - Fixed the main Synthalyst app navbar overlapping with the admin sidebar
   - Created a ConditionalHeader component to hide the main site header on admin pages
   - Removed the scroll behavior from the admin navbar for better usability
   - Simplified the admin navigation by removing the top navbar on desktop
   - Kept only the sidebar for navigation on desktop for a cleaner interface
   - Added a mobile-only top bar with menu toggle and logout button
   - Ensured proper z-index values to prevent overlapping elements
   - Updated the root layout to conditionally render the header based on the current path
   - Improved the overall admin navigation experience with a more focused interface

2. **Admin Dashboard API Fixes** (March 17, 2025):

   - Fixed API endpoints in the admin dashboard that were causing 500 Internal Server Error
   - Replaced raw SQL queries with standard Prisma query methods in contact-submissions API endpoint
   - Fixed the update-status API endpoint for contact submissions to use standard Prisma methods
   - Fixed the newsletter replies API endpoint to properly handle data transformation
   - Ensured all admin API endpoints are using proper error handling and type safety
   - Verified that all admin dashboard functionality is working correctly with no console errors
   - Successfully built the application with all the fixes in place
   - Ensured the communications page properly displays contact submissions, newsletter replies, and inbound emails

3. **Email Service Optimization**:

   - Created a unified email service in `nextjs-app/src/lib/email.ts`
   - Implemented a standardized approach for all email sending functionality
   - Added email logging to track all email activities
   - Created an `EmailLog` model in the Prisma schema
   - Implemented fallback mechanisms between SendGrid and Nodemailer

4. **Feedback API Improvements**:

   - Simplified the feedback API implementation
   - Removed file-based storage logic in favor of database-only storage
   - Implemented rate limiting using LRU cache
   - Enhanced error handling for feedback submissions
   - Updated the `FeedbackButton` component to use the new API

5. **Admin Dashboard Enhancements**:

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

6. **Admin Monitoring Fixes** (March 16, 2025):

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

7. **Admin User Management Fixes** (March 16, 2025):

   - Fixed NextJS dynamic route parameter issue in the user role update API
   - Updated the API route to properly await params object in Next.js 15
   - Changed params type to `Promise<{ id: string }>` to reflect Next.js 15 changes
   - Properly extracted and used the ID parameter after awaiting params
   - Ensured consistent error handling across all admin API routes
   - Fixed TypeScript errors in the admin user management components

8. **Newsletter Subscription System Fixes** (March 16, 2025):

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

9. **Model Information Removal from UI**: Removed model information from the UI to simplify the user experience and focus on functionality rather than technical details.

10. **Language Selector Fix**: Fixed issues with the language selector component to properly handle language changes and ensure they're passed to the API.

11. **Model Router Updates**:

    - Added a new `generateContentV2` function with improved parameter handling
    - Updated the API route to use the new function
    - Standardized language support across models
    - Fixed Gemini API integration to properly handle system messages (Gemini doesn't support system role)

12. **UI Simplification**: Streamlined both Knowledge GPT and Learning Content Creator pages for better user experience.

13. **Knowledge GPT Web Search Integration**:

    - Added web search capability to provide up-to-date information
    - Implemented Google Custom Search API integration
    - Updated system prompts to include current information
    - Enhanced UI to inform users about web search capability

14. **Knowledge GPT Improvements** (March 16, 2025):

    - Updated loading animation to use three dots instead of spinning icon
    - Enhanced system prompt to instruct LLM to use proper formatting without asterisks
    - Added client-side formatting to properly render bold text and lists
    - Added web search toggle button to let users control when web search is used
    - Updated UI to clearly indicate when web search is enabled or disabled
    - Modified API to respect user preference for web search
    - Simplified web search logic by removing automatic detection in favor of explicit user control
    - Moved loading animation to appear in chat window instead of on send button

15. **Language Selector Improvements** (March 16, 2025):

    - Added "Auto Detect" option instead of showing "(Browser Default)" next to languages
    - Included English in the dropdown list
    - Made the dropdown scrollable with max height
    - Sorted languages alphabetically for easier navigation
    - Added local storage to remember user language preferences
    - Improved browser language detection and handling

16. **Medical Knowledge Integration** (March 16, 2025):

    - Added PubMed API integration for evidence-based medical information
    - Implemented evidence grading system based on study types
    - Created domain selection in Knowledge GPT for specialized knowledge areas
    - Added citation formatting and source attribution for medical responses
    - Integrated medical knowledge as a domain within Knowledge GPT rather than a separate tool
    - Enhanced UI to display evidence levels and citations for medical responses
    - Fixed UI alignment issues with language and domain selectors
    - Added PUBMED_API_KEY to environment variables
    - Updated tips section to inform users that conversational phrases like "thank you" will be treated as new queries

17. **Admin Pages Error Handling Improvements** (March 16, 2025):

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

18. **Admin Page Database Checks** (March 16, 2025):

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

19. **Tailwind CSS Configuration Fixes** (March 17, 2025):
    - Created a separate branch `fix-tailwind-postcss` for testing Tailwind CSS fixes
    - Identified and fixed error related to Tailwind CSS's PostCSS plugin moving to a separate package
    - Installed `@tailwindcss/postcss` package to replace direct usage of `tailwindcss` in PostCSS config
    - Updated `postcss.config.cjs` to use `@tailwindcss/postcss` instead of `tailwindcss` directly
    - Fixed CSS classes in `globals.css` that were using Tailwind's utility classes directly
    - Updated classes like `border-border`, `bg-background`, `text-foreground`, etc. to use proper syntax
    - Added Tailwind imports to `critical.css` to ensure it can use Tailwind's features
    - Fixed font-medium class by using font-[500] instead
    - Ensured all color classes use the proper bracket notation (e.g., `text-[#000000]` instead of `text-black`)
    - Standardized on a single PostCSS configuration file to avoid conflicts

### Next Steps

1. **Email Webhook Configuration**: Set up SendGrid Inbound Parse to properly forward emails to the application's webhook endpoint.
2. **MX Records Setup**: Ensure proper MX records are set up for the domain to receive emails.
3. **Webhook Testing**: Test the email processing workflow from external sources to verify it's working correctly.
4. **Prisma Migration**: Complete the Prisma migration to add the new `EmailLog` model.
5. **Email Service Testing**: Comprehensive testing of the unified email service.
6. **Admin Dashboard Enhancements**: Add more filtering options and detailed analytics for email logs.
7. **Feedback System Improvements**: Enhance the feedback system with more detailed analytics and user segmentation.
8. **Backend Model Routing Logic**: Implement sophisticated model routing logic based on task complexity, content length, and language.
9. **Cost Optimization Features**: Add features to track and optimize model usage costs.
10. **Enhanced Error Handling**: Improve error handling for API calls and model responses.
11. **User Preference Settings**: Implement user preference settings for language selection.
12. **Analytics Implementation**: Add analytics to track model usage and performance.
13. **Web Search Enhancements**: Improve web search integration with better result filtering and source attribution.
14. **Additional Specialized Domains**: Expand Knowledge GPT with more specialized domains (legal, financial, etc.).
15. **Medical Knowledge Enhancements**: Add more medical data sources and improve evidence grading.
16. **Conversational Context**: Improve the Medical Knowledge Assistant to maintain conversational context between queries.
17. **Systematic Error Handling**: Implement a more proactive approach to error detection and resolution across all admin pages.
18. **Tailwind CSS Deployment**: Deploy the Tailwind CSS fixes to production after verifying they work correctly in the preview deployment.

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

14. **Tailwind CSS Configuration** (March 17, 2025):

- Using `@tailwindcss/postcss` instead of direct `tailwindcss` usage in PostCSS config
- Using explicit color values with bracket notation instead of named colors
- Adding Tailwind imports to all CSS files that use Tailwind features
- Standardizing on a single PostCSS configuration file
- Testing changes in a separate branch before merging to main
