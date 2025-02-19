"use client";

import { useState } from "react";
import { fetchJobQuery, generateJobDescriptionPrompt } from "./queries";

interface FormData {
  jobTitle: string;
  responsibilities: string;
  requiredSkills: string;
}

export default function JDDeveloperForm() {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    responsibilities: "",
    requiredSkills: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setJobDescription(null);
    try {
      const jobDescription = await generateJobDescription(formData);
      setJobDescription(jobDescription);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const generateJobDescription = async (formData: FormData) => {
    try {
      const groqQuery = fetchJobQuery(formData.jobTitle);
      const groqResponse = await fetch(`/api/groq?query=${groqQuery}`);
      if (!groqResponse.ok) {
        throw new Error(
          `Groq API request failed with status ${groqResponse.status}`
        );
      }
      const prompt = generateJobDescriptionPrompt({
        jobTitle: formData.jobTitle,
        responsibilities: formData.responsibilities,
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(",")
          : [],
      });
      const llamaResponse = await fetch("/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      if (!llamaResponse.ok) {
        throw new Error(
          `Llama API request failed with status ${llamaResponse.status}`
        );
      }
      const jobDescription = await llamaResponse.text();
      return jobDescription;
    } catch (error) {
      console.error("Error generating job description:", error);
      throw error;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          htmlFor="jobTitle"
          className="block text-gray-700 font-bold mb-2"
        >
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="responsibilities"
          className="block text-gray-700 font-bold mb-2"
        >
          Responsibilities
        </label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="requiredSkills"
          className="block text-gray-700 font-bold mb-2"
        >
          Required Skills
        </label>
        <input
          type="text"
          id="requiredSkills"
          name="requiredSkills"
          value={formData.requiredSkills}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Job Description"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {jobDescription && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Job Description</h2>
          <pre className="bg-gray-100 p-4 rounded w-full">{jobDescription}</pre>
        </div>
      )}
    </form>
  );
}
