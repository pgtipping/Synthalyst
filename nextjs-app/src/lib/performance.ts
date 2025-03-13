/**
 * Performance optimization utilities
 */
import type { Metric, ReportHandler } from "web-vitals";

// Add type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: {
        event_category: string;
        event_label: string;
        value: number;
        non_interaction: boolean;
        [key: string]: string | number | boolean;
      }
    ) => void;

    // Web Vitals global object when loaded via CDN
    webVitals?: {
      getCLS: (onReport: ReportHandler) => void;
      getFID: (onReport: ReportHandler) => void;
      getLCP: (onReport: ReportHandler) => void;
      getTTFB: (onReport: ReportHandler) => void;
      getFCP: (onReport: ReportHandler) => void;
    };
  }
}

/**
 * Defers non-critical JavaScript execution
 * @param callback The function to defer
 * @param delay The delay in milliseconds (default: 0)
 */
export function deferExecution(callback: () => void, delay = 0): void {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    // Use requestIdleCallback if available
    window.requestIdleCallback(() => {
      setTimeout(callback, delay);
    });
  } else {
    // Fallback to setTimeout
    setTimeout(callback, delay);
  }
}

/**
 * Preloads critical resources
 * @param resources Array of resources to preload
 */
export function preloadResources(
  resources: Array<{ href: string; as: string; type?: string }>
): void {
  if (typeof window === "undefined") return;

  resources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
    }
    document.head.appendChild(link);
  });
}

/**
 * Prefetches pages for faster navigation
 * @param paths Array of paths to prefetch
 */
export function prefetchPages(paths: string[]): void {
  if (typeof window === "undefined") return;

  // Create a hidden iframe to prefetch pages
  const prefetchFrame = document.createElement("iframe");
  prefetchFrame.style.width = "0";
  prefetchFrame.style.height = "0";
  prefetchFrame.style.position = "absolute";
  prefetchFrame.style.top = "-9999px";
  prefetchFrame.style.border = "none";
  document.body.appendChild(prefetchFrame);

  // Prefetch each path
  let currentIndex = 0;

  const prefetchNext = () => {
    if (currentIndex >= paths.length) {
      document.body.removeChild(prefetchFrame);
      return;
    }

    const path = paths[currentIndex];
    prefetchFrame.src = path;
    currentIndex++;

    // Wait for the page to load before prefetching the next one
    prefetchFrame.onload = () => {
      setTimeout(prefetchNext, 300);
    };
  };

  // Start prefetching
  deferExecution(prefetchNext, 2000);
}

/**
 * Optimizes image loading by preloading critical images
 * @param imageSrcs Array of image sources to preload
 */
export function preloadCriticalImages(imageSrcs: string[]): void {
  if (typeof window === "undefined") return;

  imageSrcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * Measures and reports Core Web Vitals
 */
export function reportWebVitals(): void {
  if (typeof window === "undefined") return;

  // Only in production
  if (process.env.NODE_ENV !== "production") return;

  // Try to use the npm package first
  deferExecution(async () => {
    try {
      // Try to import the package
      const webVitals = await import("web-vitals");

      const reportVital: ReportHandler = (metric) => {
        // Send to analytics or monitoring service
        console.log(`Web Vital: ${metric.name}`, metric);

        // Example: Send to Google Analytics
        if (window.gtag) {
          window.gtag("event", metric.name, {
            event_category: "Web Vitals",
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          });
        }
      };

      // Use the imported functions
      webVitals.getCLS(reportVital);
      webVitals.getFID(reportVital);
      webVitals.getLCP(reportVital);
      webVitals.getTTFB(reportVital);
      webVitals.getFCP(reportVital);

      console.log("Web Vitals reporting initialized via npm package");
    } catch (error) {
      console.warn(
        "Failed to load web-vitals package, falling back to CDN:",
        error
      );

      // Fallback to CDN if package import fails
      const script = document.createElement("script");
      script.src = "https://unpkg.com/web-vitals/dist/web-vitals.iife.js";
      script.async = true;
      script.onload = () => {
        try {
          // Access the global webVitals object
          const webVitals = window.webVitals;

          if (!webVitals) {
            console.error("Web Vitals not available");
            return;
          }

          const reportVital: ReportHandler = (metric) => {
            // Send to analytics or monitoring service
            console.log(`Web Vital: ${metric.name}`, metric);

            // Example: Send to Google Analytics
            if (window.gtag) {
              window.gtag("event", metric.name, {
                event_category: "Web Vitals",
                event_label: metric.id,
                value: Math.round(metric.value),
                non_interaction: true,
              });
            }
          };

          // Call each function if it exists
          if (typeof webVitals.getCLS === "function")
            webVitals.getCLS(reportVital);
          if (typeof webVitals.getFID === "function")
            webVitals.getFID(reportVital);
          if (typeof webVitals.getLCP === "function")
            webVitals.getLCP(reportVital);
          if (typeof webVitals.getTTFB === "function")
            webVitals.getTTFB(reportVital);
          if (typeof webVitals.getFCP === "function")
            webVitals.getFCP(reportVital);

          console.log("Web Vitals reporting initialized via CDN");
        } catch (error) {
          console.error("Error using web-vitals:", error);
        }
      };

      script.onerror = () => {
        console.error("Failed to load web-vitals script from CDN");
      };

      document.head.appendChild(script);
    }
  }, 3000);
}
