/**
 * This utility helps migrate from the old shadcn toast to the new sonner toast
 * It provides a compatibility layer so existing code can continue to work
 * while we gradually migrate to the new API
 */

import { toast as sonnerToast } from "sonner";

// Types to match the old toast API
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export type ToastActionElement = React.ReactElement;

// Compatibility function that maps old toast API to sonner
export function toast(props: ToastProps) {
  const { title, description, variant, action } = props;

  // Map variant to sonner's type
  if (variant === "destructive") {
    // If there's a title and description, use the more complex API
    if (title && description) {
      return sonnerToast.error(title, {
        description,
        action: action ? { label: "Action", onClick: () => {} } : undefined,
      });
    }

    // If there's just a title, use the simpler API
    return sonnerToast.error(title || description || "");
  }

  // Default variant
  // If there's a title and description, use the more complex API
  if (title && description) {
    return sonnerToast(title, {
      description,
      action: action ? { label: "Action", onClick: () => {} } : undefined,
    });
  }

  // If there's just a title, use the simpler API
  return sonnerToast(title || description || "");
}

// Compatibility hook that returns the same API shape as the old useToast
export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}
