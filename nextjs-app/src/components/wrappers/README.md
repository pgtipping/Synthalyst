# Wrapper Components

This directory contains reusable wrapper components that provide common functionality across the application.

## Available Wrappers

### ClientComponentWrapper

A wrapper component that provides a Suspense boundary for client components that use Next.js navigation hooks like `useSearchParams()`, `usePathname()`, or `useRouter()`.

**Documentation:** See `nextjs-app/docs/client-component-wrapper.md` for detailed usage instructions.

**Purpose:**

- Ensures compliance with Next.js 15.2.0+ requirements
- Provides consistent loading UI across the application
- Prevents Vercel build errors related to missing Suspense boundaries

**Features:**

- Multiple loading UI variants (default, minimal, fullscreen, skeleton)
- Customizable loading text
- Support for custom CSS classes

**Usage:**

```tsx
import { ClientComponentWrapper } from "@/components/wrappers/ClientComponentWrapper";

export default function Page() {
  return (
    <ClientComponentWrapper loadingText="Loading..." variant="default">
      <MyClientComponent />
    </ClientComponentWrapper>
  );
}
```

### withClientComponent HOC

A higher-order component version of the ClientComponentWrapper for a more functional approach.

**Purpose:**

- Provides a functional programming approach to wrapping components
- Reduces boilerplate in page components
- Allows for composition with other HOCs

**Usage:**

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

## Adding New Wrappers

When adding new wrapper components to this directory:

1. Follow the naming convention: `[Purpose]Wrapper.tsx`
2. Include comprehensive JSDoc comments
3. Create a documentation file in `nextjs-app/docs/`
4. Update this README with a brief description of the new wrapper
5. Ensure the wrapper has a consistent API with existing wrappers
6. Add thorough tests in the `__tests__` directory
