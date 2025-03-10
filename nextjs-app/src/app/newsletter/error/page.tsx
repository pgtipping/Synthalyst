"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NewsletterError() {
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") ||
    "An error occurred with your newsletter subscription";

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Subscription Error</h1>

        <p className="text-lg text-gray-700 mb-6">{message}</p>

        <p className="text-md text-gray-600 mb-8">
          You can try subscribing again or contact us if you continue to
          experience issues.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/newsletter/subscribe">Try Again</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
