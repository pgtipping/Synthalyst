import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about", active: true },
          ]}
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Synthalyst is a mobile-first web application designed to provide a
          suite of online tools and services for personal and business
          productivity enhancements. We cater to a global audience, with a focus
          on users in Nigeria. Our AI-powered assistance helps with tasks such
          as job description generation, task management, and learning content
          creation.
        </p>
      </div>
    </div>
  );
}
