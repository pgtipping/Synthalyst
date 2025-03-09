import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function NewsletterConfirmed() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Subscription Confirmed!</h1>

        <p className="text-lg text-gray-700 mb-6">
          Thank you for confirming your subscription to the Synthalyst
          newsletter. You&apos;ll now receive updates on our latest tools,
          features, and insights.
        </p>

        <p className="text-md text-gray-600 mb-8">
          We&apos;re excited to share valuable content with you and help you
          maximize your productivity with our tools.
        </p>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
