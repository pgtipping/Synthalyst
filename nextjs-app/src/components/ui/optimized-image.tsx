"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
  loadingClassName?: string;
  isAboveTheFold?: boolean;
}

/**
 * OptimizedImage component with lazy loading, blur-up effect, and error handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = "https://placehold.co/800x400?text=Synthalyst",
  className,
  containerClassName,
  loadingClassName,
  isAboveTheFold = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [isInView, setIsInView] = useState(isAboveTheFold);

  // Handle image load error
  const handleError = () => {
    setImgSrc(fallbackSrc);
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (isAboveTheFold) {
      return; // Skip for above-the-fold images
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" } // Start loading when image is 200px from viewport
    );

    const currentRef = document.getElementById(
      `image-container-${alt?.replace(/\s+/g, "-")}`
    );
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [alt, isAboveTheFold]);

  return (
    <div
      id={`image-container-${alt?.replace(/\s+/g, "-")}`}
      className={cn("relative overflow-hidden", containerClassName)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {(isAboveTheFold || isInView) && (
        <>
          {isLoading && (
            <div
              className={cn(
                "absolute inset-0 bg-gray-200 animate-pulse",
                loadingClassName
              )}
            />
          )}
          <Image
            src={imgSrc}
            alt={alt || ""}
            width={typeof width === "number" ? width : 0}
            height={typeof height === "number" ? height : 0}
            className={cn(
              "transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={isAboveTheFold ? "eager" : "lazy"}
            priority={isAboveTheFold}
            {...props}
          />
        </>
      )}
    </div>
  );
}
