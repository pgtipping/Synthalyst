"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);
  const cssLoadAttempted = useRef<boolean>(false);
  const cssLoadTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load non-critical CSS with performance monitoring
    const loadNonCriticalCSS = () => {
      if (cssLoadAttempted.current) return; // Prevent duplicate attempts
      cssLoadAttempted.current = true;

      // Start timing the CSS load
      const startTime = performance.now();

      // Create link element
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/styles/non-critical.css";

      // Add event listeners to handle success/failure
      link.onload = () => {
        // Calculate load time for performance monitoring
        const loadTime = performance.now() - startTime;
        console.log(
          `Non-critical CSS loaded successfully in ${loadTime.toFixed(2)}ms`
        );

        // Clear fallback timer if it exists
        if (cssLoadTimer.current) {
          clearTimeout(cssLoadTimer.current);
          cssLoadTimer.current = null;
        }

        // Add a class to body indicating CSS is loaded
        document.body.classList.add("non-critical-css-loaded");
      };

      link.onerror = (e) => {
        console.error(
          "Failed to load non-critical CSS, retrying with cache-busting...",
          e
        );

        // Retry with cache-busting parameter
        setTimeout(() => {
          const retryLink = document.createElement("link");
          retryLink.rel = "stylesheet";
          retryLink.href = `/styles/non-critical.css?t=${new Date().getTime()}`;

          retryLink.onload = () => {
            console.log("Non-critical CSS loaded successfully via retry");
            document.body.classList.add("non-critical-css-loaded");

            if (cssLoadTimer.current) {
              clearTimeout(cssLoadTimer.current);
              cssLoadTimer.current = null;
            }
          };

          retryLink.onerror = () => {
            console.error("Failed to load non-critical CSS even after retry");
          };

          document.head.appendChild(retryLink);
        }, 500);
      };

      // Set a fallback timer to load CSS directly if it takes too long
      cssLoadTimer.current = setTimeout(() => {
        if (!document.body.classList.contains("non-critical-css-loaded")) {
          console.warn(
            "CSS load timeout reached, adding direct stylesheet link"
          );

          const fallbackLink = document.createElement("link");
          fallbackLink.rel = "stylesheet";
          fallbackLink.href = `/styles/non-critical.css?fallback=true`;
          document.head.appendChild(fallbackLink);
        }
      }, 3000); // 3 second timeout

      // Append the link to head
      document.head.appendChild(link);
    };

    // Load CSS asynchronously
    loadNonCriticalCSS();

    // Add event listener for unhandled errors
    const handleError = (event: ErrorEvent) => {
      // Check if it's a chunk loading error
      if (
        event.error &&
        event.error.name === "ChunkLoadError" &&
        event.error.message.includes("Loading chunk")
      ) {
        console.error("Chunk loading error detected:", event.error);

        // Prevent the default error handling
        event.preventDefault();

        // Set the error state
        setError(event.error);

        // Attempt to reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      // Clear any timers when component unmounts
      if (cssLoadTimer.current) {
        clearTimeout(cssLoadTimer.current);
      }
    };
  }, []);

  // If there's an error, show a user-friendly message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Loading Error
          </h2>
          <p className="mb-4">
            We encountered an issue while loading the application. Attempting to
            reload...
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload Now
          </button>
        </div>
      </div>
    );
  }

  return <SessionProvider>{children}</SessionProvider>;
}
