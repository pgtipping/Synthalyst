import { Metadata } from "next";
import QuickReplyForm from "@/components/QuickReplyForm";

export const metadata: Metadata = {
  title: "Quick Contact | Synthalyst",
  description: "Get in touch with us quickly using our quick contact form.",
};

export default function QuickContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Quick Contact</h1>
        <p className="text-gray-600 mb-8">
          Have a question or want to get in touch? Fill out the form below and
          we&apos;ll get back to you as soon as possible.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <QuickReplyForm
            endpoint="/api/contact/submit"
            buttonText="Send Message"
            successMessage="Thank you for your message! We'll get back to you soon."
            additionalFields={[
              {
                name: "subject",
                label: "Subject",
                type: "text",
                required: true,
                placeholder: "What is this regarding?",
              },
              {
                name: "phone",
                label: "Phone Number",
                type: "tel",
                required: false,
                placeholder: "Optional",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
