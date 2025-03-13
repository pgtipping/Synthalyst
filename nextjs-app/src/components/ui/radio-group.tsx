"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

// Define explicit styles as objects to ensure they're preserved in production
const radioGroupStyles = {
  display: "grid",
  gap: "0.5rem",
};

const radioItemStyles = {
  aspectRatio: "1/1",
  height: "1rem",
  width: "1rem",
  borderRadius: "9999px",
  border: "1px solid var(--primary)",
  color: "var(--primary)",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
};

const radioIndicatorStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const radioCircleStyles = {
  height: "0.875rem",
  width: "0.875rem",
  fill: "currentColor",
};

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      style={radioGroupStyles}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={radioItemStyles}
      {...props}
    >
      <RadioGroupPrimitive.Indicator style={radioIndicatorStyles}>
        <Circle style={radioCircleStyles} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
