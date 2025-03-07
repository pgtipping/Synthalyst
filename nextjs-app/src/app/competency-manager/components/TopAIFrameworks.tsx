"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, SparklesIcon, BrainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetencyFramework } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

interface TopFramework extends CompetencyFramework {
  averageRating: number;
  feedbackCount: number;
}

export default function TopAIFrameworks() {
  const [topFrameworks, setTopFrameworks] = useState<TopFramework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopFrameworks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/competency-manager/top-frameworks");

        if (!response.ok) {
          throw new Error("Failed to fetch top frameworks");
        }

        const data = await response.json();
        setTopFrameworks(data.frameworks);
      } catch (error) {
        console.error("Error fetching top frameworks:", error);
        setError("Failed to load top AI-generated frameworks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopFrameworks();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">
            Top AI-Generated Frameworks
          </h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-full mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (topFrameworks.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No rated frameworks available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <SparklesIcon className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-semibold">Top AI-Generated Frameworks</h2>
      </div>

      <p className="text-gray-600 mb-4">
        Discover the highest-rated competency frameworks created by our AI
      </p>

      <div className="grid grid-cols-1 gap-4">
        {topFrameworks.map((framework) => (
          <Card key={framework.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {framework.industry} • {framework.jobFunction} •{" "}
                    {framework.roleLevel}
                  </CardDescription>
                </div>
                <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                  <BrainIcon className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-xs font-medium text-blue-700">
                    AI-Generated
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {framework.description || "No description provided."}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium mr-1">
                    {framework.averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(framework.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({framework.feedbackCount})
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `/competency-manager/shared/${framework.id}`,
                        "_blank"
                      )
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `/competency-manager?clone=${framework.id}`,
                        "_self"
                      )
                    }
                  >
                    Use as Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
