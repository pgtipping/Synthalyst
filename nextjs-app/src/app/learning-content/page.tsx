"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface FormData {
  topic: string;
  contentType: string;
  targetAudience: string;
  learningLevel: string;
  contentFormat: string;
  specificRequirements: string;
}

export default function LearningContent() {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    contentType: "",
    targetAudience: "",
    learningLevel: "",
    contentFormat: "",
    specificRequirements: "",
  });
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/learning-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate learning content");
      }

      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            {
              label: "Learning Content",
              href: "/learning-content",
              active: true,
            },
          ]}
        />

        <h1 className="text-4xl font-bold">Learning Content Creator</h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700"
            >
              Topic
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Introduction to Machine Learning, Business Ethics"
            />
          </div>

          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-gray-700"
            >
              Content Type
            </label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select content type</option>
              <option value="lesson">Lesson</option>
              <option value="tutorial">Tutorial</option>
              <option value="exercise">Exercise</option>
              <option value="case-study">Case Study</option>
              <option value="quiz">Quiz</option>
              <option value="assessment">Assessment</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="targetAudience"
              className="block text-sm font-medium text-gray-700"
            >
              Target Audience
            </label>
            <input
              type="text"
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., College Students, Working Professionals, Beginners"
            />
          </div>

          <div>
            <label
              htmlFor="learningLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Learning Level
            </label>
            <select
              id="learningLevel"
              name="learningLevel"
              value={formData.learningLevel}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contentFormat"
              className="block text-sm font-medium text-gray-700"
            >
              Content Format
            </label>
            <select
              id="contentFormat"
              name="contentFormat"
              value={formData.contentFormat}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select format</option>
              <option value="text">Text Only</option>
              <option value="text-with-examples">Text with Examples</option>
              <option value="step-by-step">Step-by-Step Guide</option>
              <option value="interactive">Interactive Content</option>
              <option value="presentation">Presentation Style</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="specificRequirements"
              className="block text-sm font-medium text-gray-700"
            >
              Specific Requirements
            </label>
            <textarea
              id="specificRequirements"
              name="specificRequirements"
              value={formData.specificRequirements}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Any specific requirements or focus areas for the content..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Generating Content..." : "Generate Learning Content"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {content && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 prose max-w-none">
                <pre className="whitespace-pre-wrap">{content}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
