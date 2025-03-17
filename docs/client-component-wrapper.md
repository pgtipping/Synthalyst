# ClientComponentWrapper Pattern

## Overview

The `ClientComponentWrapper` is a reusable component that provides a consistent Suspense boundary for client components that use Next.js navigation hooks like `useSearchParams()`, `usePathname()`, or `useRouter()`. This pattern ensures compliance with Next.js 15.2.0+ requirements and prevents Vercel build errors.

## Why It's Needed

In Next.js 15.2.0+, client-side navigation hooks must be wrapped in a Suspense boundary to ensure proper server-side rendering and client-side hydration. Failure to do so results in build errors like:

```
useSearchParams() should be wrapped in a suspense boundary at page "/path".
Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
```

## Implementation

The `ClientComponentWrapper` component is located at `nextjs-app/src/components/wrappers/ClientComponentWrapper.tsx` and provides:

1. A consistent Suspense boundary for client components
2. A standardized loading UI with spinner and customizable text
3. A simple API for wrapping client components
4. Multiple loading UI variants for different contexts

## Usage

### Basic Usage

```tsx
// In a page.tsx file
import { ClientComponentWrapper } from "@/components/wrappers/ClientComponentWrapper";
import { MyClientComponent } from "@/components/MyClientComponent";

export default function Page() {
  return (
    <ClientComponentWrapper loadingText="Loading page...">
      <MyClientComponent />
    </ClientComponentWrapper>
  );
}
```

### With Different Loading Variants

The component supports multiple loading UI variants:

```tsx
// Default variant (centered spinner with text)
<ClientComponentWrapper loadingText="Loading...">
  <MyComponent />
</ClientComponentWrapper>

// Minimal variant (inline spinner with small text)
<ClientComponentWrapper loadingText="Loading..." variant="minimal">
  <MyComponent />
</ClientComponentWrapper>

// Fullscreen variant (overlay with backdrop blur)
<ClientComponentWrapper loadingText="Loading..." variant="fullscreen">
  <MyComponent />
</ClientComponentWrapper>

// Skeleton variant (content placeholder)
<ClientComponentWrapper loadingText="Loading..." variant="skeleton">
  <MyComponent />
</ClientComponentWrapper>
```

### Using the Higher-Order Component

For a more functional approach, you can use the HOC version:

```tsx
import { withClientComponent } from "@/components/wrappers/withClientComponent";

// Define your client component
function MyClientComponent(props) {
  const searchParams = useSearchParams();
  // ...
}

// Wrap it with the HOC
const WrappedComponent = withClientComponent(MyClientComponent, {
  loadingText: "Loading component...",
  variant: "minimal",
});

// Use the wrapped component in your page
export default function Page() {
  return <WrappedComponent />;
}
```

### Composing Multiple HOCs

You can compose multiple HOCs together using the `compose` utility:

```tsx
import {
  withClientComponent,
  compose,
} from "@/components/wrappers/withClientComponent";

const EnhancedComponent = compose(
  withAnalytics,
  withErrorBoundary,
  withClientComponent
)(BaseComponent);
```

## When to Use

Use this wrapper for any client component that uses:

- `useSearchParams()`
- `usePathname()`
- `useRouter()`

## Examples in the Codebase

The pattern is used in several places throughout the application:

1. Training Plan page:

   ```tsx
   // nextjs-app/src/app/training-plan/page.tsx
   export default function TrainingPlanPage() {
     return (
       <ClientComponentWrapper loadingText="Loading Training Plan Creator...">
         <TrainingPlanClient />
       </ClientComponentWrapper>
     );
   }
   ```

2. Auth pages (signin, signup, error):

   ```tsx
   // nextjs-app/src/app/auth/signin/page.tsx
   export default function SignInPage() {
     return (
       <ClientComponentWrapper loadingText="Loading sign in page...">
         <SignInForm />
       </ClientComponentWrapper>
     );
   }
   ```

3. JD Developer page:

   ```tsx
   // nextjs-app/src/app/jd-developer/page.tsx
   export default function JDDeveloperPage() {
     return (
       <ClientComponentWrapper loadingText="Loading JD Developer...">
         <JDDeveloperContent />
       </ClientComponentWrapper>
     );
   }
   ```

4. Test Example:
   ```tsx
   // nextjs-app/src/app/examples/client-wrapper-test/page.tsx
   export default function ClientWrapperTestPage() {
     return (
       <ClientComponentWrapper loadingText="Loading test component...">
         <TestComponent />
       </ClientComponentWrapper>
     );
   }
   ```

## Benefits

1. Consistent loading UI across the application
2. Simplified implementation of Suspense boundaries
3. Prevents Vercel build errors related to missing Suspense boundaries
4. Improves user experience during loading states
5. Multiple loading UI variants for different contexts
6. Functional programming approach with HOC and compose utilities
7. Comprehensive test coverage for reliability

## Available Loading Variants

1. **Default**: Centered spinner with text below, suitable for most content areas
2. **Minimal**: Inline spinner with small text, good for smaller UI elements
3. **Fullscreen**: Full-screen overlay with backdrop blur, ideal for initial page loads
4. **Skeleton**: Content placeholder with pulse animation, best for content-heavy sections

## Testing

The components are thoroughly tested:

- Unit tests for the `ClientComponentWrapper` component
- Unit tests for the `LoadingUI` component with all variants
- Unit tests for the `withClientComponent` HOC
- Tests for prop preservation and display name handling

Run the tests with:

```bash
cd nextjs-app
npm test -- -t "ClientComponentWrapper"
```
