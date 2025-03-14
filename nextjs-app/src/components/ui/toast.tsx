"use client";

import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { useEffect } from "react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const variantClasses = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div
      className={`rounded-lg border shadow-lg p-4 ${
        variantClasses[toast.variant || "default"]
      } animate-in slide-in-from-right-full`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{toast.title}</h3>
          {toast.description && (
            <p className="text-sm mt-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500"
          aria-label="Close"
          title="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
