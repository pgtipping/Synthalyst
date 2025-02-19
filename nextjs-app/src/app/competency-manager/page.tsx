"use client";

import { useState } from "react";

interface CompetencyLevel {
  level: string;
  description: string;
  behaviors: string[];
  requirements: string[];
}

interface CompetencyDefinition {
  id: string;
  name: string;
  description: string;
  industry: string;
  category: string;
  levels: CompetencyLevel[];
}

interface FormData {
  competencyName: string;
  industry: string;
  category: string;
  description: string;
  numLevels: string;
  additionalContext: string;
}

export default function CompetencyManager() {
  const [formData, setFormData] = useState<FormData>({
    competencyName: "",
    industry: "",
    category: "",
    description: "",
    numLevels: "5",
    additionalContext: "",
  });
  const [competencyDefinition, setCompetencyDefinition] =
    useState<CompetencyDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDefinitions, setSavedDefinitions] = useState<
    CompetencyDefinition[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const templates = [
    { id: "leadership", name: "Leadership Competencies" },
    { id: "technical", name: "Technical Skills" },
    { id: "soft-skills", name: "Soft Skills" },
    { id: "project-management", name: "Project Management" },
    { id: "custom", name: "Custom Template" },
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Education",
    "Retail",
    "Consulting",
    "Other",
  ];

  const categories = [
    "Technical Skills",
    "Leadership",
    "Communication",
    "Problem Solving",
    "Project Management",
    "Interpersonal Skills",
    "Domain Knowledge",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/competency-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate competency definition");
      }

      const data = await response.json();
      setCompetencyDefinition(data.competencyDefinition);
      setSavedDefinitions((prev) => [...prev, data.competencyDefinition]);
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

  const exportToJSON = () => {
    if (!competencyDefinition) return;

    const dataStr = JSON.stringify(competencyDefinition, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${competencyDefinition.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-competency.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Competency Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="template"
                className="block text-sm font-medium text-gray-700"
              >
                Template
              </label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="competencyName"
                className="block text-sm font-medium text-gray-700"
              >
                Competency Name
              </label>
              <input
                type="text"
                id="competencyName"
                name="competencyName"
                value={formData.competencyName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Software Development, Team Leadership"
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700"
              >
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the competency and its importance..."
              />
            </div>

            <div>
              <label
                htmlFor="numLevels"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Levels
              </label>
              <select
                id="numLevels"
                name="numLevels"
                value={formData.numLevels}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="3">3 Levels</option>
                <option value="4">4 Levels</option>
                <option value="5">5 Levels</option>
                <option value="6">6 Levels</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="additionalContext"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Context
              </label>
              <textarea
                id="additionalContext"
                name="additionalContext"
                value={formData.additionalContext}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Any specific requirements or context for this competency..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate Competency Definition"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {competencyDefinition && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {competencyDefinition.name}
                  <button
                    onClick={exportToJSON}
                    className="ml-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Export JSON
                  </button>
                </h2>
                <p className="text-gray-600 mb-4">
                  {competencyDefinition.description}
                </p>

                <div className="mt-6 space-y-6">
                  {competencyDefinition.levels.map((level, index) => (
                    <div key={index} className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {level.level}
                      </h3>
                      <p className="text-gray-600 mb-3">{level.description}</p>

                      <h4 className="font-medium mb-2">Expected Behaviors:</h4>
                      <ul className="list-disc pl-5 mb-3">
                        {level.behaviors.map((behavior, idx) => (
                          <li key={idx} className="text-gray-600">
                            {behavior}
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc pl-5">
                        {level.requirements.map((requirement, idx) => (
                          <li key={idx} className="text-gray-600">
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {savedDefinitions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Saved Definitions</h3>
              <div className="space-y-4">
                {savedDefinitions.map((def) => (
                  <div
                    key={def.id}
                    className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => setCompetencyDefinition(def)}
                  >
                    <h4 className="font-medium">{def.name}</h4>
                    <p className="text-sm text-gray-600">
                      {def.industry} • {def.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
