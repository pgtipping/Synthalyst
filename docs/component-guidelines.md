# Synthalyst Component Guidelines

This document outlines the guidelines for component development and styling in the Synthalyst project.

## Table of Contents

1. [Component Library](#component-library)
2. [Adding New Components](#adding-new-components)
3. [Styling Guidelines](#styling-guidelines)
4. [Toast Notifications](#toast-notifications)
5. [Common Patterns](#common-patterns)
6. [Component Variants](#component-variants)
7. [Accessibility](#accessibility)
8. [Custom Components](#custom-components)
9. [Migration Plan](#migration-plan)

## Component Library

Synthalyst uses [shadcn/ui](https://ui.shadcn.com/) as its primary component library. shadcn/ui provides a set of accessible, reusable, and customizable components that follow best practices.

### Key Principles

- **Consistency**: Use shadcn/ui components whenever possible to maintain a consistent look and feel.
- **Customization**: Customize components using the shadcn/ui theming system rather than direct Tailwind classes.
- **Accessibility**: All components should be accessible and follow WCAG guidelines.

## Adding New Components

When adding new components to the project, follow these steps:

1. **Check if a shadcn/ui component exists**: Before creating a custom component, check if shadcn/ui already provides a similar component.

2. **Use the shadcn CLI**: Add shadcn/ui components using the CLI:

   ```bash
   npx shadcn@latest add [component-name]
   ```

3. **Custom Components**: If you need to create a custom component:
   - Follow the shadcn/ui pattern of using Radix UI primitives when applicable
   - Use the `cn` utility from `@/lib/utils` for class merging
   - Create variants using `cva` for consistent styling

## Styling Guidelines

### Do's

- ✅ Use the shadcn/ui theming system for colors, spacing, and typography
- ✅ Use the `cn` utility for class merging
- ✅ Create variants for common styling patterns
- ✅ Use CSS variables for theme values

### Don'ts

- ❌ Avoid direct color values in Tailwind classes (e.g., `bg-blue-500`)
- ❌ Avoid custom CSS when Tailwind utilities can be used
- ❌ Avoid inline styles
- ❌ Avoid mixing different styling approaches

### Theme Customization

To customize the theme, modify the CSS variables in `globals.css` and the Tailwind configuration in `tailwind.config.ts`.

## Toast Notifications

For toast notifications, use the toast migration utility:

```typescript
import { toast } from "@/lib/toast-migration";

// Success toast
toast({
  title: "Success",
  description: "Operation completed successfully.",
});

// Error toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong.",
});
```

Do not import directly from "sonner" in components.

## Common Patterns

### Alert Components

Use the shadcn/ui Alert component for notifications and messages:

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

<Alert>
  <InfoIcon className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>This is an informational message.</AlertDescription>
</Alert>;
```

### Form Components

Use the shadcn/ui Form components for all forms:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Form schema and component implementation...
```

## Component Variants

Synthalyst extends shadcn/ui components with custom variants to maintain consistent styling across the application.

### Gradient Variant

The Card component has been extended with a gradient variant that provides consistent gradient styles:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Primary gradient (blue to indigo)
<Card variant="gradient" variantKey="primary">
  <CardHeader>
    <CardTitle className="text-white">Primary Gradient</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-white/90">Content with white text for contrast</p>
  </CardContent>
</Card>

// Secondary gradient (purple to pink)
<Card variant="gradient" variantKey="secondary">
  {/* Card content */}
</Card>

// Accent gradient (amber)
<Card variant="gradient" variantKey="accent">
  {/* Card content */}
</Card>

// Info gradient (subtle blue)
<Card variant="gradient" variantKey="info">
  {/* Card content */}
</Card>

// Default gradient (gray)
<Card variant="gradient">
  {/* Card content */}
</Card>
```

#### Available Gradient Keys

- `primary`: Blue to indigo gradient (white text recommended)
- `secondary`: Purple to pink gradient (white text recommended)
- `accent`: Amber gradient (white text recommended)
- `info`: Subtle blue gradient (default text color works well)
- `default`: Subtle gray gradient (default text color works well)

#### Example Page

An example page demonstrating all gradient variants is available at `/examples/gradient-card`.

### Creating New Variants

To create new variants for shadcn/ui components, use the create-variant.js script:

```bash
node scripts/create-variant.js [component-name] [variant-name]
```

Available variant templates:

- `gradient`: Gradient backgrounds
- `outline`: Colored outlines with matching text
- `glass`: Frosted glass effect with backdrop blur

## Accessibility

All components should be accessible and follow WCAG guidelines:

- Use semantic HTML elements
- Provide proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Support screen readers

## Custom Components

Synthalyst includes several custom components built on top of shadcn/ui. These components follow the same design principles and should be used when appropriate.

### ResourceCard

The ResourceCard component displays information about a resource, such as a book, video, or article. It includes support for premium resources.

```tsx
import { ResourceCard } from "@/app/training-plan/components/ResourceCard";

<ResourceCard
  resource={{
    id: "1",
    title: "Resource Title",
    type: "book",
    description: "Resource description",
    isPremium: true,
    author: "Author Name",
    url: "https://example.com",
  }}
/>;
```

### ResourceList

The ResourceList component displays a list of resources and handles premium resource visibility based on the user's subscription status.

```tsx
import { ResourceList } from "@/app/training-plan/components/ResourceList";

<ResourceList
  resources={[
    {
      id: "1",
      title: "Resource Title",
      type: "book",
      description: "Resource description",
      isPremium: true,
      author: "Author Name",
      url: "https://example.com",
    },
  ]}
  isPremiumUser={true}
/>;
```

## Migration Plan

We are gradually migrating custom components to shadcn/ui components. If you encounter a custom component that could be replaced with a shadcn/ui component, please follow these steps:

1. Add the shadcn/ui component using the CLI
2. Replace the custom component with the shadcn/ui component
3. Update any styling to use the shadcn/ui theming system
4. Test the component to ensure it works as expected
5. Update any documentation or references to the component

### Migration Tools

We have created two scripts to help with the migration process:

1. **Component Audit Script**: Identifies custom components and styling patterns that could be replaced with shadcn/ui components.

   ```bash
   node scripts/component-audit.js
   ```

2. **Component Migration Script**: Provides guidance on how to migrate a specific component to shadcn/ui.

   ```bash
   node scripts/migrate-components.js [component-name]
   ```
