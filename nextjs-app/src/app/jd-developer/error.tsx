"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JDDeveloperError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("JD Developer Error:", error);
  }, [error]);

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h1 className="text-3xl font-bold mb-4">JD Developer Error</h1>
        <p className="text-lg mb-2 text-center">
          We encountered an issue while loading the Job Description Developer.
        </p>
        <p className="text-sm mb-8 text-muted-foreground text-center">
          Error details: {error.message || "Unknown error"}
        </p>
        <div className="flex gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
