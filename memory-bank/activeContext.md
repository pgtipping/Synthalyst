# Active Context

## Current Focus (March 16, 2025)

The current focus is on optimizing the application's backend services, particularly email handling and feedback processing. We're also enhancing the admin dashboard with new monitoring capabilities for email logs. These optimizations aim to improve performance, reliability, and maintainability of the platform.

### Recent Changes

1. **Email Service Optimization**:

   - Created a unified email service in `nextjs-app/src/lib/email.ts`
   - Implemented a standardized approach for all email sending functionality
   - Added email logging to track all email activities
   - Created an `EmailLog` model in the Prisma schema
   - Implemented fallback mechanisms between SendGrid and Nodemailer

2. **Feedback API Improvements**:

   - Simplified the feedback API implementation
   - Removed file-based storage logic in favor of database-only storage
   - Implemented rate limiting using LRU cache
   - Enhanced error handling for feedback submissions
   - Updated the `FeedbackButton` component to use the new API

3. **Admin Dashboard Enhancements**:

   - Created an email logs admin dashboard UI
   - Implemented filtering by status and category
   - Added statistics for email status distribution
   - Added pagination for email logs
   - Created a dedicated section for failed emails
   - Added functionality to delete older logs
   - Updated admin navigation to include the Email Logs page
   - Created a responsive `AdminLayout` component with mobile support

4. **Model Information Removal from UI**: Removed model information from the UI to simplify the user experience and focus on functionality rather than technical details.

5. **Language Selector Fix**: Fixed issues with the language selector component to properly handle language changes and ensure they're passed to the API.

6. **Model Router Updates**:

   - Added a new `generateContentV2` function with improved parameter handling
   - Updated the API route to use the new function
   - Standardized language support across models
   - Fixed Gemini API integration to properly handle system messages (Gemini doesn't support system role)

7. **UI Simplification**: Streamlined both Knowledge GPT and Learning Content Creator pages for better user experience.

8. **Knowledge GPT Web Search Integration**:

   - Added web search capability to provide up-to-date information
   - Implemented Google Custom Search API integration
   - Updated system prompts to include current information
   - Enhanced UI to inform users about web search capability

9. **Knowledge GPT Improvements** (March 16, 2025):

   - Updated loading animation to use three dots instead of spinning icon
   - Enhanced system prompt to instruct LLM to use proper formatting without asterisks
   - Added client-side formatting to properly render bold text and lists
   - Added web search toggle button to let users control when web search is used
   - Updated UI to clearly indicate when web search is enabled or disabled
   - Modified API to respect user preference for web search
   - Simplified web search logic by removing automatic detection in favor of explicit user control
   - Moved loading animation to appear in chat window instead of on send button

10. **Language Selector Improvements** (March 16, 2025):

    - Added "Auto Detect" option instead of showing "(Browser Default)" next to languages
    - Included English in the dropdown list
    - Made the dropdown scrollable with max height
    - Sorted languages alphabetically for easier navigation
    - Added local storage to remember user language preferences
    - Improved browser language detection and handling

11. **Medical Knowledge Integration** (March 16, 2025):

    - Added PubMed API integration for evidence-based medical information
    - Implemented evidence grading system based on study types
    - Created domain selection in Knowledge GPT for specialized knowledge areas
    - Added citation formatting and source attribution for medical responses
    - Integrated medical knowledge as a domain within Knowledge GPT rather than a separate tool
    - Enhanced UI to display evidence levels and citations for medical responses
    - Fixed UI alignment issues with language and domain selectors
    - Added PUBMED_API_KEY to environment variables
    - Updated tips section to inform users that conversational phrases like "thank you" will be treated as new queries

12. **Admin Pages Error Handling Improvements** (March 16, 2025):

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

13. **Admin Page Database Checks** (March 16, 2025):
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

### Next Steps

1. **Prisma Migration**: Complete the Prisma migration to add the new `EmailLog` model.
2. **Email Service Testing**: Comprehensive testing of the unified email service.
3. **Admin Dashboard Enhancements**: Add more filtering options and detailed analytics for email logs.
4. **Feedback System Improvements**: Enhance the feedback system with more detailed analytics and user segmentation.
5. **Backend Model Routing Logic**: Implement sophisticated model routing logic based on task complexity, content length, and language.
6. **Cost Optimization Features**: Add features to track and optimize model usage costs.
7. **Enhanced Error Handling**: Improve error handling for API calls and model responses.
8. **User Preference Settings**: Implement user preference settings for language selection.
9. **Analytics Implementation**: Add analytics to track model usage and performance.
10. **Web Search Enhancements**: Improve web search integration with better result filtering and source attribution.
11. **Additional Specialized Domains**: Expand Knowledge GPT with more specialized domains (legal, financial, etc.).
12. **Medical Knowledge Enhancements**: Add more medical data sources and improve evidence grading.
13. **Conversational Context**: Improve the Medical Knowledge Assistant to maintain conversational context between queries.
14. **Systematic Error Handling**: Implement a more proactive approach to error detection and resolution across all admin pages.
15. **Redis Monitoring Fix**: Resolve 500 errors in the Redis monitoring page.

### Active Decisions

1. **Email Service Architecture**:

   - Using a unified email service with SendGrid as primary provider and Nodemailer as fallback
   - Implementing comprehensive logging for all email activities
   - Standardizing email templates and categories

2. **Admin Dashboard Design**:

   - Creating a responsive admin layout with mobile support
   - Implementing a sidebar navigation for easy access to different admin sections
   - Using a card-based layout for statistics and data visualization
   - Ensuring robust error handling for all API calls

3. **Feedback System**:

   - Using database-only storage for feedback submissions
   - Implementing rate limiting to prevent abuse
   - Enhancing error handling for better user experience

4. **Model Selection**:

   - Using **Gemini 1.5 Flash-8B** for Knowledge GPT
   - Using **GPT-4o-Mini** for Learning Creator

5. **Tiered Approach**: Implementing a tiered approach for model selection based on:

   - Task complexity
   - Content length
   - Language support
   - Cost priority

6. **Language Support**:

   - Standardized language support across the application
   - Improved language detection and handling
   - Enhanced multilingual prompts

7. **User Experience**:

   - Focus on functionality rather than exposing model details
   - Simplified UI with clear language options
   - Consistent experience across different tools
   - Domain selection for specialized knowledge

8. **API Integration**:

   - Adapted to model-specific requirements (e.g., Gemini's lack of system role support)
   - Standardized API response format
   - Improved error handling with try-catch blocks for all API calls
   - Added PubMed API integration for medical knowledge
   - Implemented fallbacks for missing or undefined data

9. **Web Search Integration**:

   - Using Google Custom Search API for up-to-date information
   - Combining web search results with model knowledge
   - Ensuring accurate information for current events and facts

10. **Knowledge Domain Strategy**:

    - Integrating specialized domains within Knowledge GPT rather than creating separate tools
    - Starting with medical knowledge as the first specialized domain
    - Using a unified interface with domain selection
    - Adapting the UI based on the selected domain

11. **UI Improvements**:

    - Consistent button heights and alignment for better mobile experience
    - Clear visual distinction between different knowledge domains
    - Informative tips for users about how to interact with each domain
    - Robust error handling in UI components to prevent crashes

12. **Error Handling Strategy**:
    - Implementing try-catch blocks for all API calls
    - Providing fallback values when data is missing or undefined
    - Adding specific error messages for different failure scenarios
    - Using toast notifications to inform users of errors
    - Checking for the existence of database models before querying them
    - Ensuring non-empty values for required component props
    - Verifying table existence before executing database queries
    - Initializing default values for all data variables to prevent undefined errors
