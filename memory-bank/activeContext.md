# Active Context - 2025-03-15

## Current Focus

We are enhancing the LLM-powered educational features of the Synthalyst application, specifically:

1. **Knowledge GPT** - An AI-powered educational assistant that provides detailed answers to user questions
2. **Learning Content Creator** - A tool for generating tailored educational content based on user specifications

## Recent Changes

- Updated the Knowledge GPT page component with a modern UI using shadcn/ui components
- Implemented a tabbed interface for asking questions and viewing history
- Added functionality to fetch question history and filter by topics
- Fixed all linter errors and warnings in the Knowledge GPT component

- Enhanced the Learning Content Creator page with a complete UI redesign using shadcn/ui components
- Created a tabbed interface for content creation and viewing saved content
- Added form validation and improved user experience
- Implemented content download functionality
- Fixed all linter errors and warnings

- Connected both features to the OpenAI API using GPT-4o model
- Implemented proper prompting with clear instructions for output format
- Added topic extraction and tag generation
- Ensured the output is in plain text format (not markdown)
- Connected the APIs to the database using the KnowledgeEntry and LearningContentEntry models

## LLM Model Strategy

After analyzing available models, we've identified optimal choices for our educational features:

- **Knowledge GPT**: GPT-4o-Mini is recommended as the primary model due to its balance of cost-efficiency ($0.15/input, $0.6/output) and strong reasoning capabilities
- **Learning Content Creator**: Gemini 1.5 Flash offers a good balance of cost and capabilities for educational content generation

We're planning to implement a tiered approach that combines models based on task complexity:

1. **Tier 1 (Simple Queries)**: Llama 3.2 3B for basic questions and content
2. **Tier 2 (Medium Complexity)**: GPT-4o-Mini or Gemini 1.5 Flash for more complex needs
3. **Tier 3 (High Complexity)**: GPT-4o reserved for only the most complex educational queries

This strategy will optimize for both cost and quality, with cost being the primary consideration.

## Next Steps

1. Implement the multi-model strategy with a smart router to direct queries to the appropriate model
2. Develop a caching system for common educational queries to reduce API costs
3. Create a fallback mechanism that starts with lower-cost models and escalates only when necessary
4. Implement cost controls including token counting, budgeting, and usage monitoring
5. Add user feedback mechanisms to continuously improve the quality of responses
