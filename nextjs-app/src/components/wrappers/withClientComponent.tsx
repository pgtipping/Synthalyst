import React, { ComponentType } from "react";
import {
  ClientComponentWrapper,
  LoadingVariant,
} from "./ClientComponentWrapper";

export interface WithClientComponentOptions {
  loadingText?: string;
  variant?: LoadingVariant;
  className?: string;
}

/**
 * Higher-order component that wraps a component with ClientComponentWrapper.
 * This is useful for components that use navigation hooks like useSearchParams,
 * usePathname, or useRouter.
 *
 * @example
 * ```tsx
 * // Define your client component
 * function MyClientComponent(props) {
 *   const searchParams = useSearchParams();
 *   // ...
 * }
 *
 * // Wrap it with the HOC
 * const WrappedComponent = withClientComponent(MyClientComponent, {
 *   loadingText: "Loading component...",
 *   variant: "minimal"
 * });
 *
 * // Use the wrapped component in your page
 * export default function Page() {
 *   return <WrappedComponent />;
 * }
 * ```
 *
 * @param Component The component to wrap
 * @param options Options for the ClientComponentWrapper
 * @returns A wrapped component with a Suspense boundary
 */
export function withClientComponent<P extends object>(
  Component: ComponentType<P>,
  options: WithClientComponentOptions = {}
): ComponentType<P> {
  const { loadingText, variant, className } = options;

  // Create a wrapped component that preserves the original component's props
  const WrappedComponent = (props: P) => {
    return (
      <ClientComponentWrapper
        loadingText={loadingText}
        variant={variant}
        className={className}
      >
        <Component {...props} />
      </ClientComponentWrapper>
    );
  };

  // Set display name for better debugging
  const displayName = Component.displayName || Component.name || "Component";
  WrappedComponent.displayName = `withClientComponent(${displayName})`;

  return WrappedComponent;
}

/**
 * Utility function to compose multiple HOCs together
 *
 * @example
 * ```tsx
 * const EnhancedComponent = compose(
 *   withClientComponent,
 *   withErrorBoundary,
 *   withAnalytics
 * )(BaseComponent);
 * ```
 */
export function compose<T extends ComponentType<unknown>>(
  ...hocs: Array<(component: T) => T>
): (component: T) => T {
  return (BaseComponent: T) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), BaseComponent);
  };
}
