"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { CompetencyFramework } from "../../types";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Link from "next/link";

// Dynamically import the visualization component to avoid SSR issues with SVG
const CompetencyVisualization = dynamic(
  () => import("../../components/CompetencyVisualization"),
  { ssr: false }
);

export default function SharedFramework() {
  const params = useParams();
  const id = params.id as string;

  const [framework, setFramework] = useState<CompetencyFramework | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCompetencyIndex, setActiveCompetencyIndex] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    const fetchFramework = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/competency-manager/shared/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Framework not found or not publicly shared");
          } else {
            throw new Error("Failed to load framework");
          }
        }

        const data = await response.json();
        setFramework(data);
      } catch (error) {
        console.error("Error fetching shared framework:", error);
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFramework();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading framework...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/competency-manager">Return to Competency Manager</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-amber-50 p-6 rounded-lg shadow-md border border-amber-200">
          <h2 className="text-xl font-semibold text-amber-700 mb-2">
            Framework Not Available
          </h2>
          <p className="text-amber-600">
            This framework may not be publicly shared or may have been removed.
          </p>
          <Button asChild className="mt-4">
            <Link href="/competency-manager">Return to Competency Manager</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Competency Manager", href: "/competency-manager" },
          { label: "Shared Framework", href: "#" },
        ]}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{framework.name}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVisualization(!showVisualization)}
          >
            {showVisualization ? "Hide" : "Show"} Visualization
          </Button>
        </div>

        <p className="text-gray-600 mb-4">{framework.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <span className="text-sm font-medium text-gray-500">Industry</span>
            <p>{framework.industry}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Job Function
            </span>
            <p>{framework.jobFunction}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Role Level
            </span>
            <p>{framework.roleLevel}</p>
          </div>
        </div>

        {showVisualization && framework.competencies.length > 0 && (
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <CompetencyVisualization competencies={framework.competencies} />
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Competencies</h3>
          <div className="space-y-6">
            {framework.competencies.map((competency, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  index === activeCompetencyIndex
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() =>
                    setActiveCompetencyIndex(
                      index === activeCompetencyIndex ? -1 : index
                    )
                  }
                >
                  <div>
                    <h4 className="text-lg font-medium">{competency.name}</h4>
                    <div className="text-sm text-gray-500">
                      Type: {competency.type}
                    </div>
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
                  <div className="mt-4 space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        Description
                      </h5>
                      <p className="text-gray-700">{competency.description}</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        Business Impact
                      </h5>
                      <p className="text-gray-700">
                        {competency.businessImpact}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Proficiency Levels
                      </h5>
                      <div className="space-y-3">
                        {competency.levels
                          .sort((a, b) => a.levelOrder - b.levelOrder)
                          .map((level, levelIndex) => (
                            <div
                              key={levelIndex}
                              className="border-l-4 border-blue-500 pl-3 py-1"
                            >
                              <h6 className="font-medium">{level.name}</h6>
                              <p className="text-sm text-gray-600 mb-2">
                                {level.description}
                              </p>

                              <div className="mb-2">
                                <span className="text-xs font-medium text-gray-500">
                                  Behavioral Indicators
                                </span>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {level.behavioralIndicators.map(
                                    (indicator, i) => (
                                      <li key={i}>{indicator}</li>
                                    )
                                  )}
                                </ul>
                              </div>

                              <div>
                                <span className="text-xs font-medium text-gray-500">
                                  Development Suggestions
                                </span>
                                <ul className="list-disc list-inside text-sm text-gray-600">
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/competency-manager">Return to Competency Manager</Link>
          </Button>
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link href="/pricing">Upgrade to Premium</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
