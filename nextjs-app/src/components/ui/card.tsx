import * as React from "react";

import { cn } from "@/lib/utils";

// Define variant types
type CardVariant = "gradient";
type GradientVariantKey =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "default";

type VariantStyles = {
  [key in CardVariant]: {
    [subKey: string]: string;
  };
};

// Variant utility function for card
const getCardVariantStyles = (
  variant?: string,
  variantKey?: string
): string => {
  const variants: VariantStyles = {
    gradient: {
      primary:
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent",
      secondary:
        "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent",
      accent:
        "bg-gradient-to-r from-amber-500 to-amber-300 text-white border-transparent",
      info: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900",
      default:
        "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
    },
  };

  if (variant && variant in variants) {
    const variantObj = variants[variant as CardVariant];
    return variantKey && variantKey in variantObj
      ? variantObj[variantKey]
      : variantObj.default || "";
  }

  return "";
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant | string;
  variantKey?: GradientVariantKey | string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, variantKey, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        getCardVariantStyles(variant, variantKey),
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
