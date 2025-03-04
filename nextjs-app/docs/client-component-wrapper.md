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

## Usage

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

## Benefits

1. Consistent loading UI across the application
2. Simplified implementation of Suspense boundaries
3. Prevents Vercel build errors related to missing Suspense boundaries
4. Improves user experience during loading states

## Future Enhancements

Potential future enhancements for the `ClientComponentWrapper` component:

1. Add support for different loading UI variants (minimal, full-screen, etc.)
2. Add support for error boundaries
3. Create a higher-order component (HOC) version for wrapping components programmatically
4. Add automated tests to verify proper Suspense boundary implementation
