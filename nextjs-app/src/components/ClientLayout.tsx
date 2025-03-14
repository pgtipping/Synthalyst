"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Load non-critical CSS
    const loadNonCriticalCSS = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/styles/non-critical.css";
      document.head.appendChild(link);
    };

    // Load CSS
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
