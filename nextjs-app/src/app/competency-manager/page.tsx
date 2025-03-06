"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface CompetencyLevel {
  name: string;
  description: string;
  levelOrder: number;
  behavioralIndicators: string[];
  developmentSuggestions: string[];
}

interface Competency {
  name: string;
  description: string;
  businessImpact: string;
  type: string;
  levels: CompetencyLevel[];
}

interface CompetencyFramework {
  name: string;
  description: string;
  industry: string;
  jobFunction: string;
  roleLevel: string;
  competencies: Competency[];
}

interface FormData {
  industry: string;
  customIndustry: string;
  jobFunction: string;
  customJobFunction: string;
  roleLevel: string;
  customRoleLevel: string;
  numberOfCompetencies: number;
  competencyTypes: string[];
  customCompetencyType: string;
  numberOfLevels: number;
  specificRequirements: string;
  organizationalValues: string;
  existingCompetencies: string;
}

export default function CompetencyManager() {
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    customIndustry: "",
    jobFunction: "",
    customJobFunction: "",
    roleLevel: "",
    customRoleLevel: "",
    numberOfCompetencies: 5,
    competencyTypes: [],
    customCompetencyType: "",
    numberOfLevels: 4,
    specificRequirements: "",
    organizationalValues: "",
    existingCompetencies: "",
  });

  const [framework, setFramework] = useState<CompetencyFramework | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFrameworks, setSavedFrameworks] = useState<CompetencyFramework[]>(
    []
  );
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [activeCompetencyIndex, setActiveCompetencyIndex] = useState(0);

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Government",
    "Non-profit",
    "Other",
  ];

  const jobFunctions = [
    "Leadership/Management",
    "Technical/Engineering",
    "Sales/Marketing",
    "Customer Service",
    "Administrative",
    "Operations",
    "Human Resources",
    "Finance/Accounting",
    "Other",
  ];

  const roleLevels = [
    "Entry Level",
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "Executive",
    "Other",
  ];

  const competencyTypeOptions = [
    "Technical Skills",
    "Soft Skills/Behavioral",
    "Leadership",
    "Core/Organizational",
    "Industry-Specific",
    "Role-Specific",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the request payload
      const payload = {
        industry:
          formData.industry === "Other"
            ? formData.customIndustry
            : formData.industry,
        jobFunction:
          formData.jobFunction === "Other"
            ? formData.customJobFunction
            : formData.jobFunction,
        roleLevel:
          formData.roleLevel === "Other"
            ? formData.customRoleLevel
            : formData.roleLevel,
        numberOfCompetencies: formData.numberOfCompetencies,
        competencyTypes: formData.competencyTypes.includes("Other")
          ? [
              ...formData.competencyTypes.filter((type) => type !== "Other"),
              formData.customCompetencyType,
            ]
          : formData.competencyTypes,
        numberOfLevels: formData.numberOfLevels,
        specificRequirements: formData.specificRequirements,
        organizationalValues: formData.organizationalValues,
        existingCompetencies: formData.existingCompetencies,
      };

      const response = await fetch("/api/competency-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate competency framework");
      }

      const data = await response.json();
      setFramework(data.framework);
      setActiveCompetencyIndex(0);
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

  const handleCompetencyTypeChange = (type: string) => {
    setFormData((prev) => {
      const currentTypes = [...prev.competencyTypes];

      if (currentTypes.includes(type)) {
        return {
          ...prev,
          competencyTypes: currentTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          competencyTypes: [...currentTypes, type],
        };
      }
    });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    min: number,
    max: number
  ) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  const saveFramework = async () => {
    if (!framework) return;

    try {
      const response = await fetch("/api/competency-manager", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ framework }),
      });

      if (!response.ok) {
        throw new Error("Failed to save competency framework");
      }

      const data = await response.json();
      setSavedFrameworks((prev) => [...prev, data.framework]);
      alert("Framework saved successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save framework"
      );
    }
  };

  const exportToJSON = () => {
    if (!framework) return;

    const dataStr = JSON.stringify(framework, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${framework.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-competency-framework.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const renderTooltip = (content: string) => (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <TooltipProvider>
        <div className="max-w-6xl mx-auto space-y-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              {
                label: "Competency Manager",
                href: "/competency-manager",
                active: true,
              },
            ]}
          />

          <h1 className="text-4xl font-bold">Competency Manager</h1>
          <p className="text-lg text-gray-600">
            Generate comprehensive competency frameworks for any role or
            industry using AI.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-lg shadow"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Generate Competency Framework
                </h2>

                {/* Mandatory Fields */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium">
                    Required Fields <span className="text-red-500">*</span>
                  </h3>

                  {/* Industry/Domain */}
                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      Industry/Domain{" "}
                      <span className="text-red-500 ml-1">*</span>
                      {renderTooltip(
                        "Select the industry that best matches your needs. Choose 'Other' to enter a custom industry."
                      )}
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select the industry or domain</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>

                    {formData.industry === "Other" && (
                      <input
                        type="text"
                        id="customIndustry"
                        name="customIndustry"
                        value={formData.customIndustry}
                        onChange={handleInputChange}
                        placeholder="Enter custom industry"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    )}
                  </div>

                  {/* Job Function */}
                  <div>
                    <label
                      htmlFor="jobFunction"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      Job Function <span className="text-red-500 ml-1">*</span>
                      {renderTooltip(
                        "Select the function that best describes the role. Choose 'Other' to enter a custom function."
                      )}
                    </label>
                    <select
                      id="jobFunction"
                      name="jobFunction"
                      value={formData.jobFunction}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select the primary job function</option>
                      {jobFunctions.map((jobFunction) => (
                        <option key={jobFunction} value={jobFunction}>
                          {jobFunction}
                        </option>
                      ))}
                    </select>

                    {formData.jobFunction === "Other" && (
                      <input
                        type="text"
                        id="customJobFunction"
                        name="customJobFunction"
                        value={formData.customJobFunction}
                        onChange={handleInputChange}
                        placeholder="Enter custom job function"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    )}
                  </div>

                  {/* Role Level */}
                  <div>
                    <label
                      htmlFor="roleLevel"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      Role Level <span className="text-red-500 ml-1">*</span>
                      {renderTooltip(
                        "Select the seniority level for the competencies. Choose 'Other' to enter a custom level."
                      )}
                    </label>
                    <select
                      id="roleLevel"
                      name="roleLevel"
                      value={formData.roleLevel}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select the role level</option>
                      {roleLevels.map((roleLevel) => (
                        <option key={roleLevel} value={roleLevel}>
                          {roleLevel}
                        </option>
                      ))}
                    </select>

                    {formData.roleLevel === "Other" && (
                      <input
                        type="text"
                        id="customRoleLevel"
                        name="customRoleLevel"
                        value={formData.customRoleLevel}
                        onChange={handleInputChange}
                        placeholder="Enter custom role level"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    )}
                  </div>

                  {/* Number of Competencies */}
                  <div>
                    <label
                      htmlFor="numberOfCompetencies"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      Number of Competencies{" "}
                      <span className="text-red-500 ml-1">*</span>
                      {renderTooltip(
                        "Select how many competencies you want to generate. 5-7 is recommended for most roles."
                      )}
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        type="range"
                        id="numberOfCompetencies"
                        name="numberOfCompetencies"
                        min="3"
                        max="10"
                        value={formData.numberOfCompetencies}
                        onChange={(e) => handleNumberInputChange(e, 3, 10)}
                        className="w-full mr-3"
                      />
                      <input
                        type="number"
                        value={formData.numberOfCompetencies}
                        onChange={(e) => handleNumberInputChange(e, 3, 10)}
                        min="3"
                        max="10"
                        aria-label="Number of competencies"
                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Fields Toggle */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    {showOptionalFields ? (
                      <>
                        <ChevronUpIcon className="h-5 w-5 mr-1" />
                        Hide Optional Fields
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="h-5 w-5 mr-1" />
                        Show Optional Fields
                      </>
                    )}
                  </button>
                </div>

                {/* Optional Fields */}
                {showOptionalFields && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-md font-medium">Optional Fields</h3>

                    {/* Competency Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        Competency Types
                        {renderTooltip(
                          "Select the types of competencies you want to include. Leave blank to generate a balanced mix."
                        )}
                      </label>
                      <div className="mt-2 space-y-2">
                        {competencyTypeOptions.map((type) => (
                          <div key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`type-${type}`}
                              checked={formData.competencyTypes.includes(type)}
                              onChange={() => handleCompetencyTypeChange(type)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`type-${type}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>

                      {formData.competencyTypes.includes("Other") && (
                        <input
                          type="text"
                          id="customCompetencyType"
                          name="customCompetencyType"
                          value={formData.customCompetencyType}
                          onChange={handleInputChange}
                          placeholder="Enter custom competency type"
                          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    {/* Number of Proficiency Levels */}
                    <div>
                      <label
                        htmlFor="numberOfLevels"
                        className="block text-sm font-medium text-gray-700 flex items-center"
                      >
                        Number of Proficiency Levels
                        {renderTooltip(
                          "Select how many proficiency levels each competency should have. 4 is standard (Basic, Intermediate, Advanced, Expert)."
                        )}
                      </label>
                      <select
                        id="numberOfLevels"
                        name="numberOfLevels"
                        value={formData.numberOfLevels}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="3">3 Levels</option>
                        <option value="4">4 Levels</option>
                        <option value="5">5 Levels</option>
                      </select>
                    </div>

                    {/* Specific Requirements */}
                    <div>
                      <label
                        htmlFor="specificRequirements"
                        className="block text-sm font-medium text-gray-700 flex items-center"
                      >
                        Specific Requirements
                        {renderTooltip(
                          "Provide any specific details about the role, required skills, or organizational context to make the competencies more relevant."
                        )}
                      </label>
                      <textarea
                        id="specificRequirements"
                        name="specificRequirements"
                        value={formData.specificRequirements}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="E.g., 'Focus on cloud architecture skills and team collaboration abilities for a DevOps engineer working in a financial services company'"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Organizational Values */}
                    <div>
                      <label
                        htmlFor="organizationalValues"
                        className="block text-sm font-medium text-gray-700 flex items-center"
                      >
                        Organizational Values
                        {renderTooltip(
                          "Enter your organization's core values to incorporate them into the competency framework."
                        )}
                      </label>
                      <textarea
                        id="organizationalValues"
                        name="organizationalValues"
                        value={formData.organizationalValues}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="E.g., 'Innovation, Integrity, Customer Focus, Excellence, Teamwork'"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Existing Competencies */}
                    <div>
                      <label
                        htmlFor="existingCompetencies"
                        className="block text-sm font-medium text-gray-700 flex items-center"
                      >
                        Existing Competencies
                        {renderTooltip(
                          "List any existing competencies you want to include or build upon in the new framework."
                        )}
                      </label>
                      <textarea
                        id="existingCompetencies"
                        name="existingCompetencies"
                        value={formData.existingCompetencies}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="E.g., 'Project Management, Stakeholder Communication, Technical Documentation'"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating Framework...
                    </div>
                  ) : (
                    "Generate Competency Framework"
                  )}
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
              {framework && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">{framework.name}</h2>
                      <div className="space-x-2">
                        <button
                          onClick={saveFramework}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={exportToJSON}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Export JSON
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                      {framework.description}
                    </p>

                    {/* Competency Navigation */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Competencies</h3>
                      <div className="flex flex-wrap gap-2">
                        {framework.competencies.map((comp, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveCompetencyIndex(index)}
                            className={`px-3 py-1 text-sm rounded ${
                              activeCompetencyIndex === index
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {comp.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Competency */}
                    {framework.competencies[activeCompetencyIndex] && (
                      <div className="border-t pt-4">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold">
                            {framework.competencies[activeCompetencyIndex].name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {framework.competencies[activeCompetencyIndex].type}
                          </span>
                          <p className="mt-2 text-gray-600">
                            {
                              framework.competencies[activeCompetencyIndex]
                                .description
                            }
                          </p>
                          <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded">
                            <h4 className="font-medium">Business Impact:</h4>
                            <p>
                              {
                                framework.competencies[activeCompetencyIndex]
                                  .businessImpact
                              }
                            </p>
                          </div>
                        </div>

                        <h4 className="font-medium text-lg mb-3">
                          Proficiency Levels
                        </h4>

                        <div className="space-y-6">
                          {framework.competencies[
                            activeCompetencyIndex
                          ].levels.map((level, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                              <h5 className="text-lg font-semibold mb-2">
                                {level.name}
                              </h5>
                              <p className="text-gray-600 mb-3">
                                {level.description}
                              </p>

                              <h6 className="font-medium mb-2">
                                Behavioral Indicators:
                              </h6>
                              <ul className="list-disc pl-5 mb-3">
                                {level.behavioralIndicators.map(
                                  (behavior, bidx) => (
                                    <li
                                      key={bidx}
                                      className="text-gray-600 mb-1"
                                    >
                                      {behavior}
                                    </li>
                                  )
                                )}
                              </ul>

                              <h6 className="font-medium mb-2">
                                Development Suggestions:
                              </h6>
                              <ul className="list-disc pl-5">
                                {level.developmentSuggestions.map(
                                  (suggestion, sidx) => (
                                    <li
                                      key={sidx}
                                      className="text-gray-600 mb-1"
                                    >
                                      {suggestion}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {savedFrameworks.length > 0 && (
                <div className="mt-8 bg-white shadow sm:rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Saved Frameworks
                  </h3>
                  <div className="space-y-3">
                    {savedFrameworks.map((fw, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setFramework(fw);
                          setActiveCompetencyIndex(0);
                        }}
                      >
                        <h4 className="font-medium">{fw.name}</h4>
                        <p className="text-sm text-gray-600">
                          {fw.industry} • {fw.jobFunction} • {fw.roleLevel}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {fw.competencies.length} competencies
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
