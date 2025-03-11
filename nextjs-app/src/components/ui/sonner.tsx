"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-gray-800 group-[.toaster]:text-gray-900 dark:group-[.toaster]:text-gray-100 group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-4 group-[.toaster]:border-2",
          description:
            "group-[.toast]:text-gray-700 dark:group-[.toast]:text-gray-300 group-[.toast]:mt-1 group-[.toast]:text-base",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:font-medium",
          title:
            "group-[.toast]:font-semibold group-[.toast]:text-lg group-[.toast]:text-gray-900 dark:group-[.toast]:text-gray-100",
          error:
            "group-[.toast]:border-red-500 group-[.toast]:bg-red-50 group-[.toast]:text-red-900 dark:group-[.toast]:bg-red-900/20 dark:group-[.toast]:text-red-200 dark:group-[.toast]:border-red-800",
          success:
            "group-[.toast]:border-green-500 group-[.toast]:bg-green-50 group-[.toast]:text-green-900 dark:group-[.toast]:bg-green-900/20 dark:group-[.toast]:text-green-200 dark:group-[.toast]:border-green-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
