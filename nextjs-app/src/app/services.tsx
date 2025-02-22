import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services", active: true },
          ]}
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Free Services</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          We offer a range of free services to help you get started with your HR
          needs. These include access to free HR documents, templates, and
          tools.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Free HR Documents</li>
          <li>Templates</li>
          <li>Tools</li>
        </ul>
      </div>
    </div>
  );
}
