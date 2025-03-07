"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import {
  CompetencyFramework,
  CompetencyLevel,
  Competency,
  FormData,
  IndustryCompetencySuggestion,
} from "./types";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamically import the visualization component to avoid SSR issues with SVG
const CompetencyVisualization = dynamic(
  () => import("./components/CompetencyVisualization"),
  { ssr: false }
);

// Dynamically import the new components
const ExportOptions = dynamic(() => import("./components/ExportOptions"), {
  ssr: false,
});

const SharingOptions = dynamic(() => import("./components/SharingOptions"), {
  ssr: false,
});

const PremiumFeatureTeasers = dynamic(
  () => import("./components/PremiumFeatureTeasers"),
  { ssr: false }
);

// Dynamically import the feedback components
const FeedbackMechanism = dynamic(
  () => import("./components/FeedbackMechanism"),
  { ssr: false }
);

const FeedbackAnalytics = dynamic(
  () => import("./components/FeedbackAnalytics"),
  { ssr: false }
);

// Dynamically import the top AI frameworks component
const TopAIFrameworks = dynamic(() => import("./components/TopAIFrameworks"), {
  ssr: false,
});

// Dynamically import the new components
const PrintFriendlyView = dynamic(
  () => import("./components/PrintFriendlyView"),
  {
    ssr: false,
  }
);

const FrameworkSearch = dynamic(() => import("./components/FrameworkSearch"), {
  ssr: false,
});

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
  const [industrySuggestions, setIndustrySuggestions] = useState<
    IndustryCompetencySuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFrameworkId, setEditingFrameworkId] = useState<string | null>(
    null
  );
  const [frameworkNameEdit, setFrameworkNameEdit] = useState("");
  const [frameworkDescriptionEdit, setFrameworkDescriptionEdit] = useState("");
  const [activeTab, setActiveTab] = useState<
    "generator" | "saved" | "feedback"
  >("generator");
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [filteredFrameworks, setFilteredFrameworks] = useState<
    CompetencyFramework[]
  >([]);

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

  // Industry-specific competency suggestions
  const industryCompetencySuggestions: IndustryCompetencySuggestion[] = [
    {
      industry: "Technology",
      suggestions: [
        {
          name: "Technical Problem Solving",
          type: "Technical Skills",
          description:
            "Ability to analyze complex technical problems and develop effective solutions",
        },
        {
          name: "Software Development Lifecycle",
          type: "Technical Skills",
          description:
            "Knowledge and application of software development methodologies and practices",
        },
        {
          name: "Technical Innovation",
          type: "Technical Skills",
          description:
            "Ability to identify and implement innovative technical solutions",
        },
        {
          name: "Digital Collaboration",
          type: "Soft Skills/Behavioral",
          description:
            "Effectively working with distributed teams using digital tools",
        },
      ],
    },
    {
      industry: "Healthcare",
      suggestions: [
        {
          name: "Patient-Centered Care",
          type: "Industry-Specific",
          description:
            "Ability to provide care that is respectful of and responsive to individual patient preferences, needs, and values",
        },
        {
          name: "Healthcare Regulations Compliance",
          type: "Industry-Specific",
          description:
            "Knowledge and application of healthcare laws, regulations, and standards",
        },
        {
          name: "Medical Ethics",
          type: "Core/Organizational",
          description:
            "Understanding and application of ethical principles in healthcare decision-making",
        },
        {
          name: "Interdisciplinary Collaboration",
          type: "Soft Skills/Behavioral",
          description:
            "Ability to work effectively with professionals from different healthcare disciplines",
        },
      ],
    },
    {
      industry: "Finance",
      suggestions: [
        {
          name: "Financial Analysis",
          type: "Technical Skills",
          description:
            "Ability to analyze financial data and make informed recommendations",
        },
        {
          name: "Risk Management",
          type: "Industry-Specific",
          description:
            "Identifying, assessing, and prioritizing financial risks and opportunities",
        },
        {
          name: "Regulatory Compliance",
          type: "Industry-Specific",
          description:
            "Knowledge and application of financial regulations and compliance requirements",
        },
        {
          name: "Financial Integrity",
          type: "Core/Organizational",
          description:
            "Maintaining high ethical standards in financial operations and reporting",
        },
      ],
    },
  ];

  useEffect(() => {
    setIndustrySuggestions(industryCompetencySuggestions);
  }, []);

  // Function to get suggestions for the selected industry
  const getIndustrySuggestions = () => {
    const selectedIndustry =
      formData.industry === "Other"
        ? formData.customIndustry
        : formData.industry;
    return (
      industrySuggestions.find((item) => item.industry === selectedIndustry)
        ?.suggestions || []
    );
  };

  // Function to add a suggested competency to the existing competencies field
  const addSuggestedCompetency = (suggestion: {
    name: string;
    type: string;
    description: string;
  }) => {
    const currentText = formData.existingCompetencies;
    const newText = currentText
      ? `${currentText}, ${suggestion.name}`
      : suggestion.name;
    setFormData((prev) => ({ ...prev, existingCompetencies: newText }));

    // Add the competency type if not already selected
    if (!formData.competencyTypes.includes(suggestion.type)) {
      setFormData((prev) => ({
        ...prev,
        competencyTypes: [...prev.competencyTypes, suggestion.type],
      }));
    }
  };

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

      setSavedFrameworks((prev) => {
        const exists = prev.some((f) => f.id === data.framework.id);
        if (exists) {
          return prev.map((f) =>
            f.id === data.framework.id ? data.framework : f
          );
        } else {
          return [...prev, data.framework];
        }
      });

      setActiveTab("saved");

      alert("Framework saved successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save framework"
      );
    }
  };

  const deleteFramework = async (id: string) => {
    if (!id || id !== deleteConfirmation) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/competency-manager/frameworks?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete competency framework");
      }

      setSavedFrameworks((prev) => prev.filter((f) => f.id !== id));
      setDeleteConfirmation(null);

      if (framework?.id === id) {
        setFramework(null);
      }

      alert("Framework deleted successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete framework"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const updateFrameworkDetails = async () => {
    if (!framework || !editingFrameworkId) return;

    try {
      const updatedFramework = {
        ...framework,
        name: frameworkNameEdit,
        description: frameworkDescriptionEdit,
      };

      const response = await fetch(
        `/api/competency-manager/frameworks/${editingFrameworkId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: frameworkNameEdit,
            description: frameworkDescriptionEdit,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update framework details");
      }

      setFramework(updatedFramework);

      setSavedFrameworks((prev) =>
        prev.map((f) =>
          f.id === editingFrameworkId
            ? {
                ...f,
                name: frameworkNameEdit,
                description: frameworkDescriptionEdit,
              }
            : f
        )
      );

      setIsEditing(false);
      setEditingFrameworkId(null);

      alert("Framework updated successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update framework"
      );
    }
  };

  const startEditing = () => {
    if (!framework) return;

    setFrameworkNameEdit(framework.name);
    setFrameworkDescriptionEdit(framework.description || "");
    setIsEditing(true);
    setEditingFrameworkId(framework.id || null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingFrameworkId(null);
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

  // Load saved frameworks on component mount
  useEffect(() => {
    const loadSavedFrameworks = async () => {
      try {
        const response = await fetch("/api/competency-manager/frameworks", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setSavedFrameworks(data.frameworks || []);
        }
      } catch (error) {
        console.error("Failed to load saved frameworks:", error);
      }
    };

    loadSavedFrameworks();
  }, []);

  const renderFrameworkDetails = () => {
    if (!framework) return null;

    return (
      <div className="mt-6 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Framework" : framework.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {!isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowVisualization(!showVisualization)}
                >
                  {showVisualization
                    ? "Hide Visualization"
                    : "Show Visualization"}
                </Button>

                {/* Create a dedicated section for export and sharing options */}
                <div className="w-full mt-4 p-4 border rounded-lg bg-background">
                  <h3 className="text-lg font-medium mb-3">
                    Framework Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium mb-3">Print</h4>
                      <PrintFriendlyView framework={framework} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Export</h4>
                      <ExportOptions framework={framework} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Share</h4>
                      <SharingOptions
                        framework={framework}
                        onUpdatePublicStatus={updatePublicStatus}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Premium Features</h4>
                      <PremiumFeatureTeasers />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rest of the framework details */}
        {/* ... existing code ... */}
      </div>
    );
  };

  // Render different tab content based on activeTab
  const renderTabContent = () => {
    if (activeTab === "generator") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Framework Generator</h2>
          </div>

          {framework ? (
            // If a framework has been generated, show the framework details
            renderFrameworkDetails()
          ) : (
            // Otherwise, show the generator form
            <div className="border rounded-lg p-6 bg-background">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="industry" className="block font-medium">
                        Industry/Domain <span className="text-red-500">*</span>
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Select the industry or domain for which you're
                              creating the competency framework. This helps
                              tailor competencies to industry-specific
                              requirements.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {formData.industry === "Other" && (
                      <input
                        type="text"
                        name="customIndustry"
                        value={formData.customIndustry}
                        onChange={handleInputChange}
                        placeholder="Specify industry"
                        className="w-full p-2 border rounded-md mt-2"
                        required
                      />
                    )}
                  </div>

                  {/* Job Function */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="jobFunction"
                        className="block font-medium"
                      >
                        Job Function <span className="text-red-500">*</span>
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              The general category of work this role performs
                              (e.g., Technical/Engineering,
                              Leadership/Management). This determines the core
                              competencies needed.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <select
                      id="jobFunction"
                      name="jobFunction"
                      value={formData.jobFunction}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select Job Function</option>
                      {jobFunctions.map((jobFunction) => (
                        <option key={jobFunction} value={jobFunction}>
                          {jobFunction}
                        </option>
                      ))}
                    </select>
                    {formData.jobFunction === "Other" && (
                      <input
                        type="text"
                        name="customJobFunction"
                        value={formData.customJobFunction}
                        onChange={handleInputChange}
                        placeholder="Specify job function"
                        className="w-full p-2 border rounded-md mt-2"
                        required
                      />
                    )}
                  </div>

                  {/* Role Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="roleLevel" className="block font-medium">
                        Role Level <span className="text-red-500">*</span>
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              The seniority or experience level of the role
                              (e.g., Entry Level, Senior, Manager). This affects
                              the depth and complexity of competencies.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <select
                      id="roleLevel"
                      name="roleLevel"
                      value={formData.roleLevel}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select Role Level</option>
                      {roleLevels.map((roleLevel) => (
                        <option key={roleLevel} value={roleLevel}>
                          {roleLevel}
                        </option>
                      ))}
                    </select>
                    {formData.roleLevel === "Other" && (
                      <input
                        type="text"
                        name="customRoleLevel"
                        value={formData.customRoleLevel}
                        onChange={handleInputChange}
                        placeholder="Specify role level"
                        className="w-full p-2 border rounded-md mt-2"
                        required
                      />
                    )}
                  </div>

                  {/* Number of Competencies */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="numberOfCompetencies"
                        className="block font-medium"
                      >
                        Number of Competencies{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Recommended range: 5-10 competencies for most
                              roles. Too many can be overwhelming, too few may
                              not cover all necessary skills.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <input
                      type="number"
                      id="numberOfCompetencies"
                      name="numberOfCompetencies"
                      value={formData.numberOfCompetencies}
                      onChange={(e) => handleNumberInputChange(e, 3, 15)}
                      min="3"
                      max="15"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  {/* Toggle for optional fields - Progressive Disclosure */}
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setShowOptionalFields(!showOptionalFields)
                        }
                        className="w-full"
                      >
                        {showOptionalFields
                          ? "Hide Optional Fields"
                          : "Show Optional Fields"}
                        {showOptionalFields ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-2 h-4 w-4"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-2 h-4 w-4"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Optional fields help create more tailored and specific
                      competency frameworks.
                    </p>
                  </div>

                  {/* Optional Fields Section - Only shown when toggled */}
                  {showOptionalFields && (
                    <div className="col-span-1 md:col-span-2 border-l-4 border-blue-200 pl-4 py-2 space-y-6">
                      <h3 className="text-lg font-medium mb-4">
                        Optional Fields
                      </h3>

                      {/* Competency Types */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block font-medium">
                            Competency Types
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Select the types of competencies to include in
                                  your framework. A balanced framework typically
                                  includes both technical and behavioral
                                  competencies.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {competencyTypeOptions.map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`type-${type}`}
                                checked={formData.competencyTypes.includes(
                                  type
                                )}
                                onChange={() =>
                                  handleCompetencyTypeChange(type)
                                }
                                className="rounded"
                              />
                              <label htmlFor={`type-${type}`}>{type}</label>
                            </div>
                          ))}
                        </div>
                        {formData.competencyTypes.includes("Other") && (
                          <input
                            type="text"
                            name="customCompetencyType"
                            value={formData.customCompetencyType}
                            onChange={handleInputChange}
                            placeholder="Specify competency type"
                            className="w-full p-2 border rounded-md mt-2"
                          />
                        )}
                      </div>

                      {/* Number of Proficiency Levels */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="numberOfLevels"
                            className="block font-medium"
                          >
                            Number of Proficiency Levels
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Common scales: 3 levels (Basic, Intermediate,
                                  Advanced), 4 levels (adds Expert), or 5 levels
                                  (adds Mastery). More levels allow for finer
                                  progression tracking.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <input
                          type="number"
                          id="numberOfLevels"
                          name="numberOfLevels"
                          value={formData.numberOfLevels}
                          onChange={(e) => handleNumberInputChange(e, 2, 6)}
                          min="2"
                          max="6"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>

                      {/* Specific Requirements */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="specificRequirements"
                            className="block font-medium"
                          >
                            Specific Requirements
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Add any specific skills, knowledge areas, or
                                  requirements that are essential for this role.
                                  This helps tailor the framework to your
                                  organization's specific needs.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <textarea
                          id="specificRequirements"
                          name="specificRequirements"
                          value={formData.specificRequirements}
                          onChange={handleInputChange}
                          placeholder="Enter any specific requirements or focus areas for this role..."
                          className="w-full p-2 border rounded-md h-24"
                        ></textarea>
                      </div>

                      {/* Organizational Values */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="organizationalValues"
                            className="block font-medium"
                          >
                            Organizational Values
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Include your organization's core values to
                                  ensure the competency framework aligns with
                                  your culture. This helps create competencies
                                  that reinforce your values.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <textarea
                          id="organizationalValues"
                          name="organizationalValues"
                          value={formData.organizationalValues}
                          onChange={handleInputChange}
                          placeholder="Enter your organization's values to incorporate them into the competencies..."
                          className="w-full p-2 border rounded-md h-24"
                        ></textarea>
                      </div>

                      {/* Existing Competencies */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="existingCompetencies"
                            className="block font-medium"
                          >
                            Existing Competencies
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  List any existing competencies you want to
                                  include or build upon. This ensures continuity
                                  with your current competency model.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <textarea
                          id="existingCompetencies"
                          name="existingCompetencies"
                          value={formData.existingCompetencies}
                          onChange={handleInputChange}
                          placeholder="Enter any existing competencies you want to include..."
                          className="w-full p-2 border rounded-md h-24"
                        ></textarea>
                        {formData.industry &&
                          industrySuggestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-2">
                                Industry-Specific Suggestions:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {getIndustrySuggestions().map(
                                  (suggestion, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        addSuggestedCompetency(suggestion)
                                      }
                                      className="text-xs"
                                    >
                                      {suggestion.name}
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Framework"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "saved") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Saved Frameworks</h2>
            <div className="flex gap-2">
              {/* Remove the conditional button for showing/hiding search */}
            </div>
          </div>

          {/* Always show the search component */}
          <FrameworkSearch
            frameworks={savedFrameworks}
            onSearchResults={handleSearchResults}
          />

          {(filteredFrameworks.length > 0
            ? filteredFrameworks
            : savedFrameworks
          ).length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">
                {filteredFrameworks.length > 0
                  ? "No frameworks match your search criteria."
                  : "You haven't saved any frameworks yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredFrameworks.length > 0
                ? filteredFrameworks
                : savedFrameworks
              ).map((fw) => (
                <div
                  key={fw.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">{fw.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {fw.description}
                  </p>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>
                      <span className="font-medium">Industry:</span>{" "}
                      {fw.industry}
                    </p>
                    <p>
                      <span className="font-medium">Job Function:</span>{" "}
                      {fw.jobFunction}
                    </p>
                    <p>
                      <span className="font-medium">Role Level:</span>{" "}
                      {fw.roleLevel}
                    </p>
                    <p>
                      <span className="font-medium">Competencies:</span>{" "}
                      {fw.competencies.length}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setFramework(fw);
                        setActiveCompetencyIndex(0);
                        setActiveTab("generator");
                        setShowVisualization(false);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFramework(fw);
                        setFrameworkNameEdit(fw.name);
                        setFrameworkDescriptionEdit(fw.description);
                        setEditingFrameworkId(fw.id || null);
                        setIsEditing(true);
                        setActiveTab("generator");
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteConfirmation(fw.id || null)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Feedback tab
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          AI Framework Ratings & Feedback
        </h2>
        <p className="text-gray-600 mb-6">
          Discover top-rated AI-generated competency frameworks and provide
          feedback to help improve our AI
        </p>

        <div className="space-y-8">
          {/* Top AI Frameworks Section */}
          <div className="border-b pb-8">
            <TopAIFrameworks />
          </div>

          {/* Your Frameworks Feedback Section */}
          {savedFrameworks.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Your Framework Ratings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedFrameworks.map((framework) => (
                  <div key={framework.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {framework.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {framework.industry} | {framework.jobFunction} |{" "}
                      {framework.roleLevel}
                    </p>
                    <FeedbackAnalytics frameworkId={framework.id || ""} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add this function to handle search results
  const handleSearchResults = (results: CompetencyFramework[]) => {
    setFilteredFrameworks(results);
  };

  const updatePublicStatus = async (isPublic: boolean) => {
    if (!framework?.id) return;

    try {
      const response = await fetch(
        `/api/competency-manager/frameworks/${framework.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublic,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update framework public status");
      }

      // Update local state
      setFramework((prev) => (prev ? { ...prev, isPublic } : null));

      // Update in saved frameworks list
      setSavedFrameworks((prev) =>
        prev.map((f) =>
          f.id === framework.id
            ? {
                ...f,
                isPublic,
              }
            : f
        )
      );

      return Promise.resolve();
    } catch (error) {
      console.error("Error updating public status:", error);
      return Promise.reject(error);
    }
  };

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

          {/* Tabs for Generator, Saved Frameworks, and Feedback */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("generator")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "generator"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Framework Generator
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "saved"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Saved Frameworks{" "}
                {savedFrameworks.length > 0 && `(${savedFrameworks.length})`}
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "feedback"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                AI Framework Ratings
              </button>
            </nav>
          </div>

          {/* Render the active tab content */}
          {renderTabContent()}
        </div>
      </TooltipProvider>
    </div>
  );
}
