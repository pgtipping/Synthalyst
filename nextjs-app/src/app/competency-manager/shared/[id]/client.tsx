"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

interface SharedFrameworkClientProps {
  id: string;
}

export default function SharedFrameworkClient({
  id,
}: SharedFrameworkClientProps) {
  const [framework, setFramework] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFramework() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/competency-manager/public-frameworks?id=${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Framework not found or not publicly shared");
          }
          throw new Error("Failed to load framework");
        }

        const data = await response.json();
        setFramework(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching framework:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchFramework();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    return notFound();
  }

  // Format date
  const createdAt = new Date(framework.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/competency-manager">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Competency Manager
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{framework.name}</h1>
          <p className="text-blue-100 mb-4">{framework.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              Industry: {framework.industry}
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              Job Function: {framework.jobFunction}
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              Role Level: {framework.roleLevel}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              <p>Shared by: {framework.user?.name || "Anonymous"}</p>
              <p>Created: {createdAt}</p>
            </div>

            {framework.averageRating && (
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                <span className="font-medium">
                  {framework.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  ({framework.feedbackCount}{" "}
                  {framework.feedbackCount === 1 ? "rating" : "ratings"})
                </span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-semibold border-b pb-2">
              Competencies
            </h2>

            {framework.competencies.map((competency: any) => (
              <div
                key={competency.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-4">
                  <h3 className="text-lg font-medium">{competency.name}</h3>
                  <p className="text-sm text-gray-500">{competency.type}</p>
                </div>

                <div className="p-4">
                  <p className="mb-4">{competency.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">
                      Business Impact
                    </h4>
                    <p className="text-gray-600">{competency.businessImpact}</p>
                  </div>

                  <h4 className="font-medium text-gray-700 mb-2">
                    Proficiency Levels
                  </h4>
                  <div className="space-y-4">
                    {competency.levels
                      .sort((a: any, b: any) => a.levelOrder - b.levelOrder)
                      .map((level: any) => (
                        <div key={level.id} className="bg-gray-50 p-3 rounded">
                          <h5 className="font-medium mb-1">{level.name}</h5>
                          <p className="text-sm mb-2">{level.description}</p>

                          <div className="mb-2">
                            <h6 className="text-sm font-medium text-gray-700">
                              Behavioral Indicators
                            </h6>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                              {level.behavioralIndicators.map(
                                (indicator: string, i: number) => (
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
                                (suggestion: string, i: number) => (
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
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Shared via Synthalyst Competency Manager
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/competency-manager">Create Your Own</Link>
              </Button>

              <Button size="sm" asChild>
                <Link href="/premium">Upgrade to Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
