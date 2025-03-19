# Modular Architecture Implementation Guide

This document describes how the modular architecture using Next.js route groups has been implemented in the Synthalyst application.

## Overview

The application has been restructured using Next.js route groups to organize code by feature/module. This approach provides several benefits:

1. **Isolated Builds**: Each module can be built independently
2. **Better Code Organization**: Related code is grouped together
3. **Improved CSS Isolation**: Module-specific styles prevent conflicts
4. **Easier Maintenance**: Clear boundaries between different parts of the app
5. **Focused Development**: Teams can work on specific modules

## Current Structure

The application is organized into route groups, with the following structure:

```
src/
  app/
    (admin)/                # Admin module route group
      components/           # Admin-specific components
        blog/               # Blog management components
        Breadcrumb.tsx
        AdminLayout.tsx
        AdminDashboardWrapper.tsx
        RedisMonitoring.tsx
        index.ts
      lib/                  # Admin-specific utilities
        admin-api.ts
        admin-utils.ts
        permissions.ts
        index.ts
      styles/               # Admin-specific styles
        admin.css
      layout.tsx            # Admin-specific layout
      page.tsx              # Admin dashboard page
      users/                # User management pages
      email-logs/           # Email logs pages
      ...
    (auth)/                 # Authentication module (planned)
    (public)/               # Public website module (planned)
```

## Implementation Details

### Route Groups

Next.js route groups (indicated by parentheses) allow us to organize pages without affecting the URL structure. For example:

- `/admin` routes are in the `(admin)` route group
- The URL remains `/admin` (parentheses don't affect the URL)

### Module-Specific Components

Each module has its own components directory for module-specific components:

- `src/app/(admin)/components/` contains admin-specific components
- Components are exported through an index.ts file for easy imports

### Module-Specific Utilities

Each module has a lib directory for module-specific utilities:

- `src/app/(admin)/lib/` contains admin-specific utility functions
- Includes specialized functions for that module's needs

### CSS Isolation

Module-specific CSS files ensure styles don't conflict:

- `src/app/(admin)/styles/admin.css` contains admin-specific styles
- The CSS is imported in the module's layout.tsx file

### Build Process

A specialized build script enables module-specific builds:

- `scripts/build-admin.js` builds just the admin module
- Cleans caches and verifies dependencies before building
- Sets environment variables for module-specific configuration

## Usage Guidelines

### Importing Components

When importing components from within a module, use relative imports:

```tsx
// Good - using relative imports within a module
import { AdminLayout } from "../components";

// Bad - using global imports for module-specific components
import { AdminLayout } from "@/components/admin/AdminLayout";
```

For truly shared components, use the global imports:

```tsx
// Shared components use the global import path
import { Button } from "@/components/ui/button";
```

### Module-Specific Utilities

Use the module-specific utilities when working within that module:

```tsx
// Use admin-specific utilities within admin module
import { formatDate, truncateText } from "../lib/admin-utils";
```

### Module Wrapper Components

Each module has a wrapper component that handles authentication and layout:

```tsx
// Use the module wrapper in page components
export default function AdminPage() {
  return <AdminDashboardWrapper>{/* Page content */}</AdminDashboardWrapper>;
}
```

## Migration Path

The migration to modular architecture is following this sequence:

1. **Admin Module**: First to be migrated (completed)
2. **Auth Module**: Authentication system (planned)
3. **Public Module**: Public-facing website (planned)
4. **Knowledge Module**: Knowledge GPT and related tools (planned)
5. **Applications Module**: Application tools like ApplyRight (planned)

## Benefits Realized

The modular architecture has already provided several benefits:

1. **Improved Build Reliability**: Isolated admin module builds are more reliable
2. **Better Code Organization**: Related code is grouped together
3. **Clearer Boundaries**: Explicit module interfaces improve code quality
4. **CSS Isolation**: Module-specific styles prevent conflicts
5. **Simplified Maintenance**: Easier to understand and maintain code

## Next Steps

1. Continue migrating remaining modules
2. Implement module-specific API contracts
3. Set up module-specific testing
4. Create comprehensive documentation for each module
5. Implement module-specific deployment pipelines

## Conclusion

The modular architecture using Next.js route groups provides a powerful way to organize and scale the application. By clearly separating concerns and creating explicit boundaries between modules, we've created a more maintainable and reliable codebase.
