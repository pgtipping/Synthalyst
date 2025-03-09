import NewsletterSignup from "@/components/NewsletterSignup";
import { Mail } from "lucide-react";

export default function NewsletterSubscribe() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Stay updated with the latest features, tips, and insights from
            Synthalyst. We'll send you valuable content to help you maximize
            your productivity.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <NewsletterSignup
            source="newsletter-page"
            buttonText="Subscribe Now"
            placeholder="Your email address"
          />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>We respect your privacy. You can unsubscribe at any time.</p>
          <p className="mt-2">
            We'll never share your email with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
