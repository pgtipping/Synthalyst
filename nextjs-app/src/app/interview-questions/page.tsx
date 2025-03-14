import { Metadata } from "next";
import InterviewQuestionsForm from "./components/InterviewQuestionsForm";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Interview Questions Generator | Synthalyst",
  description:
    "Generate tailored interview questions based on job descriptions and competencies",
};

export default function InterviewQuestionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            {
              label: "Interview Questions Generator",
              href: "/interview-questions",
              active: true,
            },
          ]}
          className="mb-6"
        />

        <h1 className="text-3xl font-bold mb-6">
          Interview Questions Generator
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-6">
            Generate tailored interview questions based on industry, job level,
            role description, and core competencies. The more information you
            provide, the more specific and relevant the questions will be.
          </p>

          <InterviewQuestionsForm />
        </div>
      </div>
    </div>
  );
}
