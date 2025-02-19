"use client";

import { useState } from "react";

interface FormData {
  topic: string;
  learningObjectives: string;
  targetAudience: string;
  duration: string;
  preferredLearningStyle: string;
}

export default function TrainingPlan() {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    learningObjectives: "",
    targetAudience: "",
    duration: "",
    preferredLearningStyle: "",
  });
  const [plan, setPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/training-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate training plan");
      }

      const data = await response.json();
      setPlan(data.plan);
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
      <h1 className="text-3xl font-bold mb-8">
        Training Plan & Curriculum Creator
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700"
          >
            Learning Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Project Management, Data Science, Leadership"
          />
        </div>

        <div>
          <label
            htmlFor="learningObjectives"
            className="block text-sm font-medium text-gray-700"
          >
            Learning Objectives
          </label>
          <textarea
            id="learningObjectives"
            name="learningObjectives"
            value={formData.learningObjectives}
            onChange={handleInputChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="What should learners be able to do after completing this training?"
          />
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
            placeholder="e.g., Beginners, Experienced Professionals, Team Leaders"
          />
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Desired Duration
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select duration</option>
            <option value="1-day">1 Day</option>
            <option value="1-week">1 Week</option>
            <option value="2-weeks">2 Weeks</option>
            <option value="1-month">1 Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="preferredLearningStyle"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Learning Style
          </label>
          <select
            id="preferredLearningStyle"
            name="preferredLearningStyle"
            value={formData.preferredLearningStyle}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select learning style</option>
            <option value="visual">Visual</option>
            <option value="auditory">Auditory</option>
            <option value="reading-writing">Reading/Writing</option>
            <option value="kinesthetic">Kinesthetic (Hands-on)</option>
            <option value="mixed">Mixed/Blended</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Generating Plan..." : "Generate Training Plan"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {plan && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Training Plan</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 prose max-w-none">
              <pre className="whitespace-pre-wrap">{plan}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
