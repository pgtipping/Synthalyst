import React, { Suspense, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

interface ClientComponentWrapperProps {
  children: ReactNode;
  loadingText?: string;
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
}: ClientComponentWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
          <Spinner className="h-8 w-8 mb-2" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
