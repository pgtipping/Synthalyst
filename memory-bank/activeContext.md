# Active Context

## Current Focus (March 16, 2025)

The current focus is on optimizing LLM model usage for the Synthalyst platform, particularly for the Knowledge GPT and Learning Creator features. The goal is to achieve cost efficiency while providing excellent multilingual experiences and up-to-date information. We're also expanding Knowledge GPT with specialized domains, starting with medical knowledge.

### Recent Changes

1. **Model Information Removal from UI**: Removed model information from the UI to simplify the user experience and focus on functionality rather than technical details.
2. **Language Selector Fix**: Fixed issues with the language selector component to properly handle language changes and ensure they're passed to the API.
3. **Model Router Updates**:
   - Added a new `generateContentV2` function with improved parameter handling
   - Updated the API route to use the new function
   - Standardized language support across models
   - Fixed Gemini API integration to properly handle system messages (Gemini doesn't support system role)
4. **UI Simplification**: Streamlined both Knowledge GPT and Learning Content Creator pages for better user experience.
5. **Knowledge GPT Web Search Integration**:
   - Added web search capability to provide up-to-date information
   - Implemented Google Custom Search API integration
   - Updated system prompts to include current information
   - Enhanced UI to inform users about web search capability
6. **Knowledge GPT Improvements** (March 16, 2025):
   - Updated loading animation to use three dots instead of spinning icon
   - Enhanced system prompt to instruct LLM to use proper formatting without asterisks
   - Added client-side formatting to properly render bold text and lists
   - Added web search toggle button to let users control when web search is used
   - Updated UI to clearly indicate when web search is enabled or disabled
   - Modified API to respect user preference for web search
   - Simplified web search logic by removing automatic detection in favor of explicit user control
   - Moved loading animation to appear in chat window instead of on send button
7. **Language Selector Improvements** (March 16, 2025):
   - Added "Auto Detect" option instead of showing "(Browser Default)" next to languages
   - Included English in the dropdown list
   - Made the dropdown scrollable with max height
   - Sorted languages alphabetically for easier navigation
   - Added local storage to remember user language preferences
   - Improved browser language detection and handling
8. **Medical Knowledge Integration** (March 16, 2025):
   - Added PubMed API integration for evidence-based medical information
   - Implemented evidence grading system based on study types
   - Created domain selection in Knowledge GPT for specialized knowledge areas
   - Added citation formatting and source attribution for medical responses
   - Integrated medical knowledge as a domain within Knowledge GPT rather than a separate tool
   - Enhanced UI to display evidence levels and citations for medical responses
   - Fixed UI alignment issues with language and domain selectors
   - Added PUBMED_API_KEY to environment variables
   - Updated tips section to inform users that conversational phrases like "thank you" will be treated as new queries

### Next Steps

1. **Backend Model Routing Logic**: Implement sophisticated model routing logic based on task complexity, content length, and language.
2. **Cost Optimization Features**: Add features to track and optimize model usage costs.
3. **Enhanced Error Handling**: Improve error handling for API calls and model responses.
4. **User Preference Settings**: Implement user preference settings for language selection.
5. **Analytics Implementation**: Add analytics to track model usage and performance.
6. **Web Search Enhancements**: Improve web search integration with better result filtering and source attribution.
7. **Additional Specialized Domains**: Expand Knowledge GPT with more specialized domains (legal, financial, etc.).
8. **Medical Knowledge Enhancements**: Add more medical data sources and improve evidence grading.
9. **Conversational Context**: Improve the Medical Knowledge Assistant to maintain conversational context between queries.

### Active Decisions

1. **Model Selection**:
   - Using **Gemini 1.5 Flash-8B** for Knowledge GPT
   - Using **GPT-4o-Mini** for Learning Creator
2. **Tiered Approach**: Implementing a tiered approach for model selection based on:
   - Task complexity
   - Content length
   - Language support
   - Cost priority
3. **Language Support**:
   - Standardized language support across the application
   - Improved language detection and handling
   - Enhanced multilingual prompts
4. **User Experience**:
   - Focus on functionality rather than exposing model details
   - Simplified UI with clear language options
   - Consistent experience across different tools
   - Domain selection for specialized knowledge
5. **API Integration**:
   - Adapted to model-specific requirements (e.g., Gemini's lack of system role support)
   - Standardized API response format
   - Improved error handling
   - Added PubMed API integration for medical knowledge
6. **Web Search Integration**:
   - Using Google Custom Search API for up-to-date information
   - Combining web search results with model knowledge
   - Ensuring accurate information for current events and facts
7. **Knowledge Domain Strategy**:
   - Integrating specialized domains within Knowledge GPT rather than creating separate tools
   - Starting with medical knowledge as the first specialized domain
   - Using a unified interface with domain selection
   - Adapting the UI based on the selected domain
8. **UI Improvements**:
   - Consistent button heights and alignment for better mobile experience
   - Clear visual distinction between different knowledge domains
   - Informative tips for users about how to interact with each domain
