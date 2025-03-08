"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  InfoIcon,
  Edit,
  Plus,
  Clock,
  FileText,
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  BarChart,
  Save,
  Bookmark,
  Search,
  Trash,
  Share,
  Printer,
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast-migration";
import {
  Switch,
  SwitchTrigger,
  SwitchThumb,
  SwitchDescription,
  SwitchLabel,
} from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompetencyFramework, IndustryCompetencySuggestion } from "./types";

// Import the new components
import ExportOptions from "./components/ExportOptions";
import PrintFriendlyView from "./components/PrintFriendlyView";
import SharingOptions from "./components/SharingOptions";
import FeedbackMechanism from "./components/FeedbackMechanism";
import PremiumFeatureTeasers from "./components/PremiumFeatureTeasers";
import FrameworkSearch from "./components/FrameworkSearch";
import FeedbackAnalytics from "./components/FeedbackAnalytics";
import CompetencyVisualization from "./components/CompetencyVisualization";

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
  const [formData, setFormData] = useState({
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

  // Add handleSaveFrameworkEdit function
  const handleSaveFrameworkEdit = () => {
    updateFrameworkDetails();
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

  const handleEditFramework = (id: string) => {
    // Find the framework with the given id
    const frameworkToEdit = savedFrameworks.find((fw) => fw.id === id);

    if (frameworkToEdit) {
      // Set the framework to edit
      setFramework(frameworkToEdit);

      // Set the editing values
      setFrameworkNameEdit(frameworkToEdit.name);
      setFrameworkDescriptionEdit(frameworkToEdit.description || "");
      setEditingFrameworkId(id);

      // Switch to the results tab to show the framework details
      setActiveTab("results");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Framework not found",
      });
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={updateFrameworkDetails}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelEditing}>
                  Cancel
                </Button>
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
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
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
                          <Save className="h-4 w-4 mr-2" />
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
                <BarChart className="h-4 w-4" />
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
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
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
                  <FileText className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  onClick={() => saveFramework()}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
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
      case "create":
        return (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Create Competency Framework
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="industry"
                  >
                    Industry
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Select the industry or domain for which you&apos;re
                          creating the competency framework. This helps tailor
                          competencies to industry-specific requirements.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                    aria-label="Select industry"
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="jobFunction"
                  >
                    Job Function
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Specify the job function or role for which you&apos;re
                          creating competencies. This ensures the framework
                          addresses the specific skills needed for the role.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <select
                    id="jobFunction"
                    name="jobFunction"
                    value={formData.jobFunction}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                    aria-label="Select job function"
                  >
                    <option value="">Select Job Function</option>
                    {jobFunctions.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="roleLevel"
                  >
                    Role Level
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Indicate the seniority or experience level for the
                          role. This helps calibrate the competency levels
                          appropriately.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <select
                    id="roleLevel"
                    name="roleLevel"
                    value={formData.roleLevel}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                    aria-label="Select role level"
                  >
                    <option value="">Select Role Level</option>
                    {roleLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="numberOfCompetencies"
                  >
                    Number of Competencies
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Choose how many competencies to include in your
                          framework. Best practice is 6-12 for most roles.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <input
                    id="numberOfCompetencies"
                    type="number"
                    name="numberOfCompetencies"
                    value={formData.numberOfCompetencies}
                    onChange={(e) => handleNumberInputChange(e, 3, 15)}
                    min="3"
                    max="15"
                    className="w-full p-2 border rounded"
                    required
                    aria-label="Number of competencies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Competency Types
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Select the types of competencies to include in your
                          framework. A balanced framework typically includes
                          both technical and behavioral competencies.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <div className="space-y-2 mt-2">
                    {competencyTypeOptions.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={type}
                          checked={formData.competencyTypes.includes(type)}
                          onChange={() => handleCompetencyTypeChange(type)}
                          className="mr-2"
                        />
                        <label htmlFor={type} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="numberOfLevels"
                  >
                    Number of Proficiency Levels
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Specify how many proficiency levels each competency
                          should have. Typically 3-5 levels work well.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <input
                    id="numberOfLevels"
                    type="number"
                    name="numberOfLevels"
                    value={formData.numberOfLevels}
                    onChange={(e) => handleNumberInputChange(e, 2, 6)}
                    min="2"
                    max="6"
                    className="w-full p-2 border rounded"
                    required
                    aria-label="Number of proficiency levels"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  {showOptionalFields ? (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Hide Optional Fields
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Show Optional Fields
                    </>
                  )}
                </button>

                {showOptionalFields && (
                  <div className="mt-4 space-y-6">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="specificRequirements"
                      >
                        Specific Requirements
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Include any specific skills, knowledge, or
                              requirements that are essential for this role.
                              This helps tailor the framework to your
                              organization&apos;s specific needs.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </label>
                      <textarea
                        id="specificRequirements"
                        name="specificRequirements"
                        value={formData.specificRequirements}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded h-24"
                        placeholder="Enter any specific requirements or skills needed for this role..."
                        aria-label="Specific requirements"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="organizationalValues"
                      >
                        Organizational Values
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Include your organization&apos;s core values to
                              ensure the competency framework aligns with your
                              culture. This helps create competencies that
                              reinforce your values.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </label>
                      <textarea
                        id="organizationalValues"
                        name="organizationalValues"
                        value={formData.organizationalValues}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded h-24"
                        placeholder="Enter your organization's core values..."
                        aria-label="Organizational values"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="existingCompetencies"
                      >
                        Existing Competencies
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              List any existing competencies you want to include
                              or build upon in this framework.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </label>
                      <textarea
                        id="existingCompetencies"
                        name="existingCompetencies"
                        value={formData.existingCompetencies}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded h-24"
                        placeholder="Enter any existing competencies you want to include..."
                        aria-label="Existing competencies"
                      />
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
        );
      case "search":
        return (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Search Competency Frameworks
            </h2>
            <FrameworkSearch onSearchResults={handleSearchResults} />
          </div>
        );
      case "recent":
        return (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Your Frameworks
            </h2>
            {isLoadingSaved ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : savedFrameworksError ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <p>{savedFrameworksError}</p>
              </div>
            ) : savedFrameworks.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">
                  You haven&apos;t created any frameworks yet.
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="flex items-center mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Framework
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedFrameworks.map((fw) => (
                    <div
                      key={fw.id}
                      className="border rounded-md p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg truncate pr-2">
                          {fw.name}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditFramework(fw.id!)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`Edit ${fw.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(fw.id!)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Delete ${fw.name}`}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">
                        {fw.description || "No description provided"}
                      </p>
                      <div className="flex flex-wrap text-xs text-gray-500 mt-2 gap-2">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {fw.industry}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {fw.jobFunction}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {fw.roleLevel}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {fw.competencies?.length || 0} competencies
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(fw.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "results":
        return (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">
                {framework?.name || "Competency Framework"}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("create")}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Framework
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("recent")}
                  className="flex items-center"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Your Frameworks
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-lg text-gray-700">{loadingMessage}</p>
                {countdown > 0 && (
                  <div className="mt-4 w-full max-w-md">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Generating...</span>
                      <span>{countdown}s</span>
                    </div>
                    <Progress value={(30 - countdown) * (100 / 30)} />
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 text-red-700 rounded-md">
                <h3 className="text-lg font-medium mb-2">Error</h3>
                <p>{error}</p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : framework ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 min-w-0">
                    {editingFrameworkId === framework.id ? (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="framework-name"
                            className="block text-sm font-medium mb-1"
                          >
                            Framework Name
                          </label>
                          <Input
                            id="framework-name"
                            value={frameworkNameEdit}
                            onChange={(e) =>
                              setFrameworkNameEdit(e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="framework-description"
                            className="block text-sm font-medium mb-1"
                          >
                            Description
                          </label>
                          <Textarea
                            id="framework-description"
                            value={frameworkDescriptionEdit}
                            onChange={(e) =>
                              setFrameworkDescriptionEdit(e.target.value)
                            }
                            className="w-full"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingFrameworkId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveFrameworkEdit}
                            disabled={!frameworkNameEdit.trim()}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">
                                {framework.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {framework.description ||
                                  "No description provided"}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFramework(framework.id!)}
                              className="flex items-center"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="font-medium">Industry:</span>{" "}
                              {framework.industry}
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="font-medium">Job Function:</span>{" "}
                              {framework.jobFunction}
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="font-medium">Role Level:</span>{" "}
                              {framework.roleLevel}
                            </div>
                          </div>
                        </div>

                        {/* Competencies Section - Moved Up */}
                        <div className="space-y-4">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">
                              Competencies
                            </h3>
                            <p className="text-sm text-gray-500">
                              This framework contains{" "}
                              {framework.competencies.length} competencies
                              across different areas.
                            </p>
                          </div>

                          {framework.competencies.map((competency) => (
                            <details
                              key={competency.id}
                              className="border rounded-lg overflow-hidden"
                            >
                              <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div>
                                  <h4 className="font-medium">
                                    {competency.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {competency.type}
                                  </p>
                                </div>
                                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {competency.levels.length} Levels
                                </div>
                              </summary>
                              <div className="p-4 space-y-4">
                                <p className="text-sm">
                                  {competency.description}
                                </p>
                                {competency.businessImpact && (
                                  <div>
                                    <h5 className="text-sm font-medium mb-1">
                                      Business Impact
                                    </h5>
                                    <p className="text-sm">
                                      {competency.businessImpact}
                                    </p>
                                  </div>
                                )}

                                <h5 className="text-sm font-medium mt-4 mb-2">
                                  Proficiency Levels
                                </h5>
                                <div className="space-y-4">
                                  {competency.levels
                                    .sort((a, b) => a.levelOrder - b.levelOrder)
                                    .map((level) => (
                                      <div
                                        key={level.id}
                                        className="bg-gray-50 p-3 rounded"
                                      >
                                        <h5 className="font-medium mb-1">
                                          {level.name}
                                        </h5>
                                        <p className="text-sm mb-2">
                                          {level.description}
                                        </p>

                                        {level.behavioralIndicators &&
                                          level.behavioralIndicators.length >
                                            0 && (
                                            <div className="mt-2">
                                              <h6 className="text-xs font-medium mb-1">
                                                Behavioral Indicators
                                              </h6>
                                              <ul className="text-xs list-disc pl-4 space-y-1">
                                                {level.behavioralIndicators.map(
                                                  (indicator, idx) => (
                                                    <li key={idx}>
                                                      {indicator}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}

                                        {level.developmentSuggestions &&
                                          level.developmentSuggestions.length >
                                            0 && (
                                            <div className="mt-2">
                                              <h6 className="text-xs font-medium mb-1">
                                                Development Suggestions
                                              </h6>
                                              <ul className="text-xs list-disc pl-4 space-y-1">
                                                {level.developmentSuggestions.map(
                                                  (suggestion, idx) => (
                                                    <li key={idx}>
                                                      {suggestion}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </details>
                          ))}
                        </div>

                        {showVisualization && (
                          <div className="border rounded-md p-4">
                            <CompetencyVisualization framework={framework} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="md:w-1/3 space-y-6">
                    {/* Print Button */}
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Print Framework</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          className="flex items-center print:hidden"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>

                    {/* Public/Private Toggle */}
                    <div className="border rounded-md p-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Framework Visibility
                        </h3>
                        <div className="flex items-center">
                          <Switch
                            id="public-framework-toggle"
                            checked={framework.isPublic}
                            onCheckedChange={updatePublicStatus}
                          />
                          <Label
                            htmlFor="public-framework-toggle"
                            className="ml-2 text-sm"
                          >
                            {framework.isPublic ? "Public" : "Private"}{" "}
                            Framework
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div className="border rounded-md p-4">
                      <ExportOptions framework={framework} />
                    </div>

                    {/* Sharing Options */}
                    <div className="border rounded-md p-4">
                      <SharingOptions
                        framework={framework}
                        onUpdatePublicStatus={updatePublicStatus}
                      />
                    </div>

                    {/* Feedback Mechanism */}
                    <div className="border rounded-md p-4">
                      <FeedbackMechanism framework={framework} />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Competency Manager
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Create, manage, and share competency frameworks for your
            organization. Define competencies, proficiency levels, and
            development paths tailored to your industry and roles.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b">
            <button
              className={`px-3 py-2 text-sm font-medium flex items-center ${
                activeTab === "create"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium flex items-center ${
                activeTab === "search"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("search")}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Search</span>
              <span className="sm:hidden">Find</span>
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium flex items-center ${
                activeTab === "recent"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("recent");
                loadSavedFrameworks();
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Your Frameworks</span>
              <span className="sm:hidden">Yours</span>
            </button>
            {framework && (
              <button
                className={`px-3 py-2 text-sm font-medium flex items-center ${
                  activeTab === "results"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("results")}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Current Framework</span>
                <span className="sm:hidden">Current</span>
              </button>
            )}
          </div>
        </div>

        {renderTabContent()}

        {/* Delete confirmation dialog */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete this framework? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmation(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteFramework(deleteConfirmation)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
