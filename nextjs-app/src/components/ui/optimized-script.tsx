"use client";

import Script, { ScriptProps } from "next/script";

interface OptimizedScriptProps extends Omit<ScriptProps, "onLoad" | "onError"> {
  id: string;
  onLoaded?: () => void;
  onLoadError?: (error: Error) => void;
}

/**
 * OptimizedScript component with proper loading strategies and error handling
 */
export function OptimizedScript({
  id,
  src,
  strategy = "afterInteractive",
  onLoaded,
  onLoadError,
  ...props
}: OptimizedScriptProps) {
  // Handle script load
  const handleLoad = () => {
    if (onLoaded) {
      onLoaded();
    }
  };

  // Handle script error
  const handleError = (error: Error) => {
    console.error(`Error loading script ${id}:`, error);
    if (onLoadError) {
      onLoadError(error);
    }
  };

  return (
    <Script
      id={id}
      src={src}
      strategy={strategy}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}
