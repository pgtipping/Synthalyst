"use client";

// Inspired by react-hot-toast library
import * as React from "react";
import { toast as sonnerToast } from "sonner";

// Simplified type for toast props
type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

// Simplified implementation that uses sonner under the hood
function toast({ title, description, ...props }: Omit<ToasterToast, "id">) {
  return sonnerToast(title as string, {
    description,
    ...props,
  });
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
}

export { useToast, toast };
