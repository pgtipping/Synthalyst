# TypeScript Type Checking Plan for Synthalyst

This document outlines our phased approach to implementing TypeScript type checking in the Synthalyst application.

## Current Status

The application currently has 132 type errors across 27 files. These errors are primarily in:

1. Test files (60+ errors)
2. API route parameter handling (15+ errors)
3. Prisma schema mismatches (20+ errors)
4. Component prop type errors (10+ errors)
5. Missing type declarations (5+ errors)

## Phased Implementation Plan

### Phase 1: Infrastructure Setup (Completed)

- [x] Created `tsconfig.typecheck.json` with relaxed settings
- [x] Added custom type declarations for missing libraries
- [x] Added `typecheck` script to package.json
- [x] Updated Next.js configuration to use the custom TypeScript config

### Phase 2: Fix Critical Production Code (In Progress)

- [ ] Fix API route parameter issues
- [ ] Fix Prisma schema mismatches
- [ ] Fix component prop type errors
- [ ] Fix missing type declarations

### Phase 3: Fix Test Files

- [ ] Update test mocks
- [ ] Fix test assertions
- [ ] Update test utilities

### Phase 4: Enable Strict Type Checking

- [ ] Enable `noImplicitAny`
- [ ] Enable `strictNullChecks`
- [ ] Enable `strictFunctionTypes`
- [ ] Re-enable type checking during builds

## How to Use This System

### Running Type Checks

```bash
# Run type checking with the current configuration
npm run typecheck

# Run type checking for a specific file or directory
npx tsc --project tsconfig.typecheck.json --noEmit --files src/app/api/blog/generate/route.ts
```

### Fixing Common Type Errors

#### 1. Next.js 15 Route Parameters

```typescript
// Before
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ...
}

// After
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

#### 2. Prisma Schema Mismatches

```typescript
// Before - Using properties that don't exist in the schema
prisma.user.create({
  data: {
    name: "John Doe",
    nonExistentField: "value", // Error
  },
});

// After - Using only properties defined in the schema
prisma.user.create({
  data: {
    name: "John Doe",
    // Remove nonExistentField
  },
});
```

#### 3. Component Prop Type Errors

```typescript
// Before - Passing props that don't exist
<MyComponent invalidProp="value" />

// After - Using only defined props
<MyComponent validProp="value" />

// Or update the component's type definition
interface MyComponentProps {
  validProp: string;
  invalidProp?: string; // Add the missing prop
}
```

## Timeline

1. Phase 1: Infrastructure Setup - Completed
2. Phase 2: Fix Critical Production Code - 1-2 days
3. Phase 3: Fix Test Files - 2-3 days
4. Phase 4: Enable Strict Type Checking - 1 day

## Conclusion

By following this phased approach, we can gradually improve the type safety of the Synthalyst application without disrupting the development workflow. The goal is to eventually enable full type checking during builds to prevent type-related bugs from reaching production.
