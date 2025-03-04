"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-lg mb-8 text-center">
            We apologize for the inconvenience. Please try again later.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
