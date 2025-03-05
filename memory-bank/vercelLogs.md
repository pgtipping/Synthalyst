# Vercel Build Logs

## 2025-03-05

### Fix for Missing PlanForm Props in client-component.tsx

**Date:** 2025-03-05

**Fix Description:** Fixed a TypeScript error in the client-component.tsx file that was causing Vercel deployments to fail.

**Issue:** The error was:

```
Type '{}' is missing the following properties from type 'PlanFormProps': session, usageCount, setUsageCount
```

**Root Cause:** When implementing strategic authentication, we updated the PlanForm component to require new props (`session`, `usageCount`, and `setUsageCount`), but we missed updating the instance of PlanForm in client-component.tsx.

**Solution Steps:**

1. Added the useSession hook to client-component.tsx to get the session data
2. Added state for tracking usage count
3. Added localStorage integration for persisting usage count
4. Updated the PlanForm component with the required props
5. Committed the changes with message: "Fix PlanForm props in client-component.tsx to resolve Vercel build error"

**File Changed:** `nextjs-app/src/app/training-plan/client-component.tsx`

### Fix for Next.js 15 Type Error in Coming Soon Page

**Date:** 2025-03-05

**Fix Description:** Fixed a TypeScript error in the Coming Soon page that was causing Vercel deployments to fail.

**Issue:** The error was:

```
Type '{ searchParams: Promise<{ tool?: string | undefined; path?: string | undefined; }> | { tool?: string | undefined; path?: string | undefined; }; }' does not satisfy the constraint 'PageProps'.
Types of property 'searchParams' are incompatible.
Type 'Promise<{ tool?: string | undefined; path?: string | undefined; }> | { tool?: string | undefined; path?: string | undefined; }' is not assignable to type 'Promise<any> | undefined'.
Type '{ tool?: string | undefined; path?: string | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

**Root Cause:** Next.js 15 requires `searchParams` to be a Promise type, while our implementation was expecting it to be either a Promise or a plain object.

**Solution Steps:**

1. Updated the Coming Soon page component to be async
2. Modified the `searchParams` type to accept only Promise type
3. Updated the code to always await `searchParams` since it's now guaranteed to be a Promise
4. Committed the changes with message: "Fix Next.js 15 type error in Coming Soon page"

**File Changed:** `nextjs-app/src/app/coming-soon/page.tsx`

[22:22:57.446] Skipping linting
[22:22:57.446] Checking validity of types ...
[22:23:13.869] Failed to compile.
[22:23:13.869]
[22:23:13.869] ./src/app/training-plan/client-component.tsx:99:14
[22:23:13.869] Type error: Type '{}' is missing the following properties from type 'PlanFormProps': session, usageCount, setUsageCount
[22:23:13.869]
[22:23:13.869] [0m [90m 97 |[39m [33m<[39m[33m/[39m[33mTabsList[39m[33m>[39m[0m
[22:23:13.869] [0m [90m 98 |[39m [33m<[39m[33mTabsContent[39m value[33m=[39m[32m"create"[39m[33m>[39m[0m
[22:23:13.869] [0m[31m[1m>[22m[39m[90m 99 |[39m [33m<[39m[33mPlanForm[39m [33m/[39m[33m>[39m[0m
[22:23:13.869] [0m [90m |[39m [31m[1m^[22m[39m[0m
[22:23:13.869] [0m [90m 100 |[39m [33m<[39m[33m/[39m[33mTabsContent[39m[33m>[39m[0m
[22:23:13.870] [0m [90m 101 |[39m [33m<[39m[33mTabsContent[39m value[33m=[39m[32m"saved"[39m[33m>[39m[0m
[22:23:13.870] [0m [90m 102 |[39m [33m<[39m[33mSavedPlans[39m [33m/[39m[33m>[39m[0m
[22:23:13.931] Next.js build worker exited with code: 1 and signal: null
[22:23:13.978] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[22:23:14.338]
