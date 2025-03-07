"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { InfoIcon, Edit } from "lucide-react";
import {
  CompetencyFramework,
  FormData,
  IndustryCompetencySuggestion,
} from "./types";
import { Progress } from "@/components/ui/progress";
import {
  Search as SearchIcon,
  Plus as PlusIcon,
  Clock as ClockIcon,
  FileText as FileTextIcon,
  Loader2 as Loader2Icon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  BarChart as BarChartIcon,
  Save as SaveIcon,
  Bookmark as BookmarkIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast-migration";

// Import the new components
import ExportOptions from "./components/ExportOptions";
import PrintFriendlyView from "./components/PrintFriendlyView";
import SharingOptions from "./components/SharingOptions";
import FeedbackMechanism from "./components/FeedbackMechanism";
import PremiumFeatureTeasers from "./components/PremiumFeatureTeasers";
import FrameworkSearch from "./components/FrameworkSearch";

// Lazy load the CompetencyVisualization component
const CompetencyVisualization = dynamic(
  () => import("./components/CompetencyVisualization"),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        Loading visualization...
      </div>
    ),
    ssr: false, // Disable server-side rendering for Chart.js components
  }
);

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
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [activeCompetencyIndex, setActiveCompetencyIndex] = useState<
    number | null
  >(0);
  const [industrySuggestions, setIndustrySuggestions] = useState<
    IndustryCompetencySuggestion[]
  >([]);
  const [editingFrameworkId, setEditingFrameworkId] = useState<string | null>(
    null
  );
  const [frameworkNameEdit, setFrameworkNameEdit] = useState("");
  const [frameworkDescriptionEdit, setFrameworkDescriptionEdit] = useState("");
  const [activeTab, setActiveTab] = useState<
    "search" | "create" | "recent" | "results"
  >("create");
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  );
  const [showVisualization, setShowVisualization] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Generating Framework"
  );

  const [savedFrameworks, setSavedFrameworks] = useState<CompetencyFramework[]>(
    []
  );
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [savedFrameworksError, setSavedFrameworksError] = useState<
    string | null
  >(null);

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

  // Load saved frameworks when the "saved" tab is selected
  useEffect(() => {
    if (activeTab === "search") {
      loadSavedFrameworks();
    }
  }, [activeTab]);

  // Function to load saved frameworks
  const loadSavedFrameworks = async () => {
    setIsLoadingSaved(true);
    setSavedFrameworksError(null);

    try {
      const response = await fetch("/api/competency-manager/frameworks");

      if (!response.ok) {
        throw new Error("Failed to load saved frameworks");
      }

      const data = await response.json();
      setSavedFrameworks(data.frameworks || []);
    } catch (error) {
      setSavedFrameworksError(
        error instanceof Error
          ? error.message
          : "Failed to load saved frameworks"
      );
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // Function to delete a framework
  const deleteFramework = async (id: string) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/competency-manager/frameworks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete framework");
      }

      // Remove the deleted framework from the state
      setSavedFrameworks((prev) => prev.filter((f) => f.id !== id));

      // If the currently viewed framework is the one being deleted, clear it
      if (framework?.id === id) {
        setFramework(null);
      }

      toast({
        title: "Success",
        description: "Framework deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete framework",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage("Generating Framework");
    setFramework(null);
    setError(null);

    // Start countdown timer
    let countdown = 30;
    setCountdown(countdown);

    const countdownInterval = setInterval(() => {
      countdown -= 1;
      setCountdown(countdown);

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        setLoadingMessage(
          "Still working... This may take a bit longer than expected"
        );
      }
    }, 1000);

    try {
      // Create a timeout promise that rejects after 45 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Request timed out"));
        }, 45000);
      });

      // Create the fetch promise
      const fetchPromise = fetch("/api/competency-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: formData.industry,
          jobFunction: formData.jobFunction,
          roleLevel: formData.roleLevel,
          numberOfCompetencies: formData.numberOfCompetencies,
          competencyTypes: formData.competencyTypes,
          numberOfLevels: formData.numberOfLevels,
          specificRequirements: formData.specificRequirements,
          organizationalValues: formData.organizationalValues,
          existingCompetencies: formData.existingCompetencies,
        }),
      });

      // Race the fetch against the timeout
      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate framework");
      }

      const data = await response.json();
      setFramework(data.framework);
      setActiveTab("results");

      // Save to recent frameworks
      const recentFrameworks = JSON.parse(
        localStorage.getItem("recentFrameworks") || "[]"
      );

      const newFramework = {
        id: Date.now().toString(),
        name: data.framework.name,
        industry: data.framework.industry,
        jobFunction: data.framework.jobFunction,
        timestamp: new Date().toISOString(),
        framework: data.framework,
      };

      localStorage.setItem(
        "recentFrameworks",
        JSON.stringify([newFramework, ...recentFrameworks].slice(0, 10))
      );
    } catch (error) {
      console.error("Error generating framework:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate framework. Please try again."
      );
    } finally {
      clearInterval(countdownInterval);
      setIsLoading(false);
      setCountdown(0);
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

      setFramework(data.framework);
      setActiveTab("results");

      toast({
        title: "Success",
        description: "Framework saved successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save framework",
      });
    }
  };

  const updateFrameworkDetails = async () => {
    if (!framework || !editingFrameworkId) return;

    try {
      // Create a copy of the framework with updated values
      const updatedFramework = {
        ...framework,
        name: frameworkNameEdit,
        description: frameworkDescriptionEdit,
      };

      // Make the API request
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

      // Parse the response data
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        data = { framework: updatedFramework };
      }

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(data.error || "Failed to update framework details");
      }

      // Update the framework in state with the response data or fallback to our local update
      setFramework(data.framework || updatedFramework);

      // Exit edit mode
      setEditingFrameworkId(null);

      // Show success toast
      toast({
        title: "Success",
        description: "Framework updated successfully!",
      });
    } catch (error) {
      console.error("Error updating framework:", error);

      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update framework",
      });

      // Don't exit edit mode on error so user can try again
    }
  };

  const startEditing = () => {
    if (!framework) return;

    setFrameworkNameEdit(framework.name);
    setFrameworkDescriptionEdit(framework.description || "");
    setEditingFrameworkId(framework.id || null);
  };

  const cancelEditing = () => {
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

  const renderFrameworkDetails = () => {
    if (!framework) return null;

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-blue-800">
              {framework.name}
            </h3>
            {framework.id && (
              <div className="flex space-x-2">
                {editingFrameworkId ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={updateFrameworkDetails}
                      className="flex items-center"
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startEditing}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
          {editingFrameworkId ? (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Framework Name
                </label>
                <Input
                  value={frameworkNameEdit}
                  onChange={(e) => setFrameworkNameEdit(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  value={frameworkDescriptionEdit}
                  onChange={(e) => setFrameworkDescriptionEdit(e.target.value)}
                  className="w-full"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-4">{framework.description}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Industry:</span>{" "}
              <span className="text-gray-600">{framework.industry}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Job Function:</span>{" "}
              <span className="text-gray-600">{framework.jobFunction}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Role Level:</span>{" "}
              <span className="text-gray-600">{framework.roleLevel}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Competencies</h3>
          {framework.competencies.map((competency, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCompetencyIndex(
                    index === activeCompetencyIndex ? null : index
                  );
                }}
              >
                <div>
                  <h4 className="font-medium text-lg">{competency.name}</h4>
                  <p className="text-sm text-gray-600">{competency.type}</p>
                </div>
                <div>
                  {index === activeCompetencyIndex ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {index === activeCompetencyIndex && (
                <div className="p-4 border-t">
                  <p className="mb-3">{competency.description}</p>
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-1">
                      Business Impact
                    </h5>
                    <p className="text-gray-600">{competency.businessImpact}</p>
                  </div>

                  <h5 className="font-medium text-gray-700 mb-2">
                    Proficiency Levels
                  </h5>
                  <div className="space-y-4">
                    {competency.levels
                      .sort((a, b) => a.levelOrder - b.levelOrder)
                      .map((level, levelIndex) => (
                        <div
                          key={levelIndex}
                          className="bg-gray-50 p-3 rounded"
                        >
                          <h6 className="font-medium mb-1">{level.name}</h6>
                          <p className="text-sm mb-2">{level.description}</p>

                          <div className="mb-2">
                            <h6 className="text-sm font-medium text-gray-700">
                              Behavioral Indicators
                            </h6>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                              {level.behavioralIndicators.map(
                                (indicator, i) => (
                                  <li key={i}>{indicator}</li>
                                )
                              )}
                            </ul>
                          </div>

                          <div>
                            <h6 className="text-sm font-medium text-gray-700">
                              Development Suggestions
                            </h6>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                              {level.developmentSuggestions.map(
                                (suggestion, i) => (
                                  <li key={i}>{suggestion}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Wrap the results tab content with TooltipProvider
  const renderResultsTab = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Generated Framework</h2>
        {framework ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  {framework.name}
                </h3>
                {framework.id && (
                  <div className="flex space-x-2">
                    {editingFrameworkId ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={updateFrameworkDetails}
                          className="flex items-center"
                        >
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startEditing}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {editingFrameworkId ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Framework Name
                    </label>
                    <Input
                      value={frameworkNameEdit}
                      onChange={(e) => setFrameworkNameEdit(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      value={frameworkDescriptionEdit}
                      onChange={(e) =>
                        setFrameworkDescriptionEdit(e.target.value)
                      }
                      className="w-full"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mb-4">{framework.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Industry:</span>{" "}
                  <span className="text-gray-600">{framework.industry}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Job Function:
                  </span>{" "}
                  <span className="text-gray-600">{framework.jobFunction}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Role Level:</span>{" "}
                  <span className="text-gray-600">{framework.roleLevel}</span>
                </div>
              </div>
            </div>

            {/* Visualization toggle button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVisualization(!showVisualization)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
              >
                <BarChartIcon className="h-4 w-4" />
                {showVisualization
                  ? "Hide Visualization"
                  : "Show Visualization"}
              </Button>
            </div>

            {/* Lazy-loaded visualization component */}
            {showVisualization && framework.competencies.length > 0 && (
              <div className="border rounded-lg p-4 bg-white">
                <CompetencyVisualization
                  competencies={framework.competencies}
                />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Competencies</h3>
              {framework.competencies.map((competency, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCompetencyIndex(
                        index === activeCompetencyIndex ? null : index
                      );
                    }}
                  >
                    <div>
                      <h4 className="font-medium text-lg">{competency.name}</h4>
                      <p className="text-sm text-gray-600">{competency.type}</p>
                    </div>
                    <div>
                      {index === activeCompetencyIndex ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {index === activeCompetencyIndex && (
                    <div className="p-4 border-t">
                      <p className="mb-3">{competency.description}</p>
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-1">
                          Business Impact
                        </h5>
                        <p className="text-gray-600">
                          {competency.businessImpact}
                        </p>
                      </div>

                      <h5 className="font-medium text-gray-700 mb-2">
                        Proficiency Levels
                      </h5>
                      <div className="space-y-4">
                        {competency.levels
                          .sort((a, b) => a.levelOrder - b.levelOrder)
                          .map((level, levelIndex) => (
                            <div
                              key={levelIndex}
                              className="bg-gray-50 p-3 rounded"
                            >
                              <h6 className="font-medium mb-1">{level.name}</h6>
                              <p className="text-sm mb-2">
                                {level.description}
                              </p>

                              <div className="mb-2">
                                <h6 className="text-sm font-medium text-gray-700">
                                  Behavioral Indicators
                                </h6>
                                <ul className="list-disc pl-5 text-sm text-gray-600">
                                  {level.behavioralIndicators.map(
                                    (indicator, i) => (
                                      <li key={i}>{indicator}</li>
                                    )
                                  )}
                                </ul>
                              </div>

                              <div>
                                <h6 className="text-sm font-medium text-gray-700">
                                  Development Suggestions
                                </h6>
                                <ul className="list-disc pl-5 text-sm text-gray-600">
                                  {level.developmentSuggestions.map(
                                    (suggestion, i) => (
                                      <li key={i}>{suggestion}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveTab("create")}>
                Back to Generator
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => exportToJSON()}
                  className="flex items-center"
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  onClick={() => saveFramework()}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Framework
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No framework generated yet. Use the Create tab to generate a
              framework.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Handle search results
  const handleSearchResults = (results: CompetencyFramework[]) => {
    setSavedFrameworks(results);
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

      toast({
        title: "Success",
        description: "Framework public status updated successfully!",
      });
    } catch (error) {
      console.error("Error updating public status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to update framework public status. Please try again later.",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Saved Frameworks</h2>

            {/* Search component */}
            <FrameworkSearch
              frameworks={savedFrameworks}
              onSearchResults={handleSearchResults}
            />

            {isLoadingSaved ? (
              <div className="flex justify-center items-center py-12">
                <Loader2Icon className="h-8 w-8 text-blue-600 animate-spin mr-2" />
                <span>Loading saved frameworks...</span>
              </div>
            ) : savedFrameworksError ? (
              <div className="text-center py-8">
                <p className="text-red-500">{savedFrameworksError}</p>
                <Button
                  variant="outline"
                  onClick={loadSavedFrameworks}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div>
                {savedFrameworks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No saved frameworks found.</p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("create")}
                      className="mt-4"
                    >
                      Create New Framework
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">
                      Frameworks ({savedFrameworks.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedFrameworks.map((fw) => (
                        <div
                          key={fw.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-blue-800">
                              {fw.name}
                            </h4>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setFramework(fw);
                                  setActiveTab("results");
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <FileTextIcon className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteFramework(fw.id || "")}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {fw.description || "No description provided."}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {fw.industry}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {fw.jobFunction}
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              {fw.roleLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "recent":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Recent Frameworks</h2>
            {/* Recent frameworks content */}
          </div>
        );
      case "results":
        return renderResultsTab();
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">
              Create Competency Framework
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form content */}
              {/* ... existing form fields ... */}
            </form>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-blue-800">
              Want faster, more customized frameworks?
            </h2>
            <p className="text-sm text-blue-600">
              Upgrade to get premium benefits
            </p>
          </div>
          <Link
            href="/premium"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            View Details
          </Link>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Competency Framework Manager</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab("search")}
                className={activeTab === "search" ? "bg-muted" : ""}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Saved
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("create")}
                className={activeTab === "create" ? "bg-muted" : ""}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("recent")}
                className={activeTab === "recent" ? "bg-muted" : ""}
              >
                <ClockIcon className="h-4 w-4 mr-2" />
                Recent
              </Button>
              {framework && (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("results")}
                  className={activeTab === "results" ? "bg-muted" : ""}
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Results
                </Button>
              )}
            </div>
          </div>

          {/* Main content area */}
          {renderTabContent()}

          {/* Loading overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center mb-4">
                  <Loader2Icon className="h-8 w-8 text-blue-600 animate-spin mr-2" />
                  <h3 className="text-xl font-semibold">{loadingMessage}</h3>
                </div>
                <Progress
                  value={(30 - countdown) * (100 / 30)}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500 text-center">
                  This may take up to {countdown} seconds...
                </p>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error generating framework
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
