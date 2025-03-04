import React, { Suspense, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type LoadingVariant = "default" | "minimal" | "fullscreen" | "skeleton";

export interface ClientComponentWrapperProps {
  children: ReactNode;
  loadingText?: string;
  variant?: LoadingVariant;
  className?: string;
}

/**
 * A wrapper component that provides a Suspense boundary for client components
 * that use navigation hooks like useSearchParams, usePathname, or useRouter.
 *
 * This component should be used in page components to wrap any client component
 * that uses these hooks to ensure proper server-side rendering and client-side
 * hydration in Next.js 15.2.0+.
 *
 * @example
 * ```tsx
 * // In a page.tsx file
 * import { ClientComponentWrapper } from '@/components/wrappers/ClientComponentWrapper';
 * import { MyClientComponent } from '@/components/MyClientComponent';
 *
 * export default function Page() {
 *   return (
 *     <ClientComponentWrapper loadingText="Loading page...">
 *       <MyClientComponent />
 *     </ClientComponentWrapper>
 *   );
 * }
 * ```
 */
export function ClientComponentWrapper({
  children,
  loadingText = "Loading...",
  variant = "default",
  className,
}: ClientComponentWrapperProps) {
  return (
    <Suspense
      fallback={
        <LoadingUI
          variant={variant}
          loadingText={loadingText}
          className={className}
        />
      }
    >
      {children}
    </Suspense>
  );
}

interface LoadingUIProps {
  variant: LoadingVariant;
  loadingText: string;
  className?: string;
}

/**
 * Loading UI component with different variants
 */
export function LoadingUI({ variant, loadingText, className }: LoadingUIProps) {
  switch (variant) {
    case "minimal":
      return (
        <div className={cn("flex items-center justify-center p-2", className)}>
          <Spinner className="h-4 w-4 mr-2" />
          <span className="text-xs text-muted-foreground">{loadingText}</span>
        </div>
      );

    case "fullscreen":
      return (
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center",
            className
          )}
        >
          <Spinner className="h-10 w-10 mb-4" />
          <p className="text-base font-medium">{loadingText}</p>
        </div>
      );

    case "skeleton":
      return (
        <div className={cn("w-full space-y-4", className)}>
          <div className="h-8 bg-muted rounded-md animate-pulse w-1/3"></div>
          <div className="h-24 bg-muted rounded-md animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded-md animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded-md animate-pulse w-5/6"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-8 bg-muted rounded-md animate-pulse w-1/4"></div>
            <div className="h-8 bg-muted rounded-md animate-pulse w-1/4"></div>
          </div>
        </div>
      );

    case "default":
    default:
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center min-h-[200px] p-4",
            className
          )}
        >
          <Spinner className="h-8 w-8 mb-2" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      );
  }
}
