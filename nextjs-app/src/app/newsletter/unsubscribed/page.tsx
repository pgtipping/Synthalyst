import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function NewsletterUnsubscribed() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Unsubscribed</h1>

        <p className="text-lg text-gray-700 mb-6">
          You have been successfully unsubscribed from the Synthalyst
          newsletter. You will no longer receive emails from us.
        </p>

        <p className="text-md text-gray-600 mb-8">
          We&apos;re sorry to see you go. If you changed your mind or
          unsubscribed by mistake, you can always subscribe again.
        </p>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/newsletter/subscribe">Subscribe Again</Link>
          </Button>

          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
