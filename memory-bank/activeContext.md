# Active Development Context - 2024-02-28

## Current Focus: Interview Questions Generator Test Improvements

### Interview Questions Generator

#### Recent Changes

- Set up basic test infrastructure
- Implemented form validation
- Added accessibility attributes to form components
- Added error handling for API failures
- Fixed tests for the InterviewQuestionsForm component
  - Implemented proper Button mock with data-disabled attribute
  - Created helper functions to simulate loading states
  - Added proper toast notification testing
  - Fixed useState mock implementation
  - Added tests for clearing generated questions
- Fixed the NextResponse.json mock implementation in jest.setup.js to properly handle its usage in route handlers
- Resolved "Response.json is not a function" error in API tests
- Set up proper mocking for NextResponse in the test environment
- Implemented Training Plan API tests that now pass successfully
- Improved test infrastructure for API route testing

#### Current Issues

- Other API tests still failing with "Request is not defined" error
- Some Prisma-related test failures in the test environment ("PrismaClient is unable to run in this browser environment")
- Need to improve error handling in API routes

### JD Developer

#### Recent Changes

- Added optional salary fields to the form
- Implemented salary field reset functionality
- Fixed issue with LLM returning null for salary data
- Added form validation for salary fields
- Added tests for salary field functionality
- Enhanced salary field functionality
- Added toast notifications for feedback

#### Current Issues

- Need to improve error handling for LLM salary data
- Need to add loading states for salary field generation
- Need to complete test coverage for salary-related features
- Salary field needs additional validation
- Form submission needs better error handling
- Need to add more comprehensive tests

## Active Decisions

### Testing Strategy

- Decided to implement comprehensive test coverage before new feature development
- Using Jest and React Testing Library for component testing
- Focus on accessibility in test implementation
- Balance between unit tests and integration tests
- Using helper functions to manually simulate component states in tests
- Using data attributes for testing component states
- Use proper mocking for Next.js components and functions
- Implement comprehensive API tests
- Focus on testing business logic rather than UI interactions
- Ensure proper error handling in tests

### Form Component Architecture

- Using Shadcn UI components with custom wrappers
- Implementing proper accessibility attributes
- Standardizing error handling across forms
- Using react-hook-form for form management
- Use React Hook Form with Zod validation
- Implement consistent error handling
- Use toast notifications for feedback
- Ensure accessibility compliance

## Next Steps

### Immediate Tasks

1. Fix API tests with "Request is not defined" error

   - Investigate NextRequest import issue
   - Update test setup for API routes
   - Fix mock implementation for NextRequest

2. JD Developer Enhancements

   - Add tests for salary field edge cases
   - Implement better error handling for LLM salary data
   - Add loading states for salary field generation
   - Complete test coverage

3. Shared Components

   - Extract common form components
   - Standardize test mocks
   - Create reusable test utilities

4. Address Prisma-related test failures

5. Enhance JD Developer form validation

6. Standardize shared components across features

7. Improve error handling in API routes

### Technical Considerations

- Need to maintain consistent error handling patterns
- Need to ensure accessibility across all form components
- Need to optimize test setup for faster execution
- Need to implement proper loading states for all async operations
- Consider using data attributes for testing component states
- Ensure proper mocking of Next.js components and functions
- Address JSDOM limitations in tests
- Implement consistent error handling across the application
- Ensure proper type safety with TypeScript
