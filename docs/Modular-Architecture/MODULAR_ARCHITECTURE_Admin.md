# Synthalyst Modular Architecture

This document describes the modular architecture implementation for the Synthalyst application, using Next.js route groups to organize the codebase by feature/module.

## Overview

The application is being migrated to a modular architecture to address several challenges:

1. **CSS Isolation**: Ensuring styles are properly scoped to avoid conflicts
2. **Code Organization**: Grouping related components, pages, and utilities by feature
3. **Deployment Efficiency**: Optimizing the build process and reducing bundle size
4. **Maintainability**: Making the codebase easier to maintain and extend

## Route Groups Structure

We're using Next.js route groups to organize the application, with the following structure:

```
src/
  app/
    (admin)/             # Admin module route group
      components/        # Admin-specific components
        blog/            # Blog management components
      lib/               # Admin-specific utilities
      styles/            # Admin-specific styles
      layout.tsx         # Admin-specific layout
      page.tsx           # Admin dashboard page
      users/             # User management pages
      blog/              # Blog management pages
      ...
    (auth)/              # Authentication module
      ...
    (marketing)/         # Marketing pages
      ...
```

Route groups (indicated by parentheses) are transparent in the URL structure. For example, a page inside the `(admin)` group will still be accessible at `/admin`.

## Migration Approach

We're taking an incremental approach to migration:

1. **Phase 1**: Create the admin module
   - Move admin components to `app/(admin)/components/`
   - Create module-specific styles in `app/(admin)/styles/`
   - Set up module-specific routes
2. **Phase 2**: Update imports
   - Update all imports referencing the old paths
   - Ensure proper module-specific imports using new aliases
3. **Phase 3**: Add other modules
   - Create additional module structures as needed
   - Move components to appropriate modules

## Import Aliases

We've defined import aliases to make module-specific imports easier:

```js
// next.config.js
{
  '@/admin/components': path.resolve(__dirname, 'src/app/(admin)/components'),
  '@/admin/lib': path.resolve(__dirname, 'src/app/(admin)/lib'),
  '@/admin/styles': path.resolve(__dirname, 'src/app/(admin)/styles'),
  // Other module aliases will be added here
}
```

## CSS Approach

We've adopted the following approach for CSS:

1. **Module-specific styles**: Located in each module's `styles` directory
2. **Component-level styles**: Using CSS Modules for better isolation
3. **Global styles**: Still maintained for shared styling needs

## Redirects Handling

The application maintains support for existing URLs through:

1. **Route transparency**: Next.js route groups maintain the same URL structure
2. **Middleware redirects**: For any URL changes, handled in `src/redirects.ts`

## Testing the Migration

To verify that the migration is successful:

1. Test all admin routes (`/admin`, `/admin/users`, etc.)
2. Confirm that styling is applied correctly
3. Verify authentication/authorization still works
4. Check for console errors and broken functionality

## Future Enhancements

1. Add more modules (auth, marketing, etc.)
2. Implement code splitting between modules
3. Add module-specific state management
4. Create module-specific test suites

## Migration Tracking

Track the progress of the migration in the [Migration Issue](https://github.com/yourusername/synthalyst/issues/123) (replace with actual issue link).
