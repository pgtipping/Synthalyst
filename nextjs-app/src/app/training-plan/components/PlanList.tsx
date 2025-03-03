"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/lib/toast-migration";
import type { TrainingPlan } from "@/types/trainingPlan";
import { Sparkles, ChevronUp, ChevronDown } from "lucide-react";

interface PlanListProps {
  onUseAsTemplate: (plan: TrainingPlan) => void;
}

export default function PlanList({ onUseAsTemplate }: PlanListProps) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch("/api/training-plan/saved");
        if (!response.ok) {
          throw new Error("Failed to fetch saved plans");
        }
        const data = await response.json();
        setPlans(data.plans);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch saved plans";
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load saved plans. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [session?.user?.email]);

  const handleDelete = async (planId: string) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/training-plan/${planId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete training plan");
      }

      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
      toast({
        title: "Success",
        description: "Training plan deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete training plan",
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = (planId: string) => {
    if (expanded.includes(planId)) {
      setExpanded(expanded.filter((id) => id !== planId));
    } else {
      setExpanded([...expanded, planId]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.title}</span>
                <div className="flex items-center">
                  {plan.metadata?.premiumResources && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-indigo-100 text-indigo-800"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(plan.id)}
                    aria-label={
                      expanded.includes(plan.id) ? "Collapse" : "Expand"
                    }
                  >
                    {expanded.includes(plan.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {plan.description || `Training plan for ${plan.title}`}
              </CardDescription>
            </CardHeader>

            {expanded.includes(plan.id) && (
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Learning Objectives</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.objectives
                        .slice(0, expanded.includes(plan.id) ? undefined : 3)
                        .map((objective, index) => (
                          <li key={index} className="text-sm text-black">
                            {objective}
                          </li>
                        ))}
                    </ul>
                    {plan.objectives.length > 3 && (
                      <Button
                        variant="link"
                        className="p-0 h-auto mt-2"
                        onClick={() => toggleExpanded(plan.id)}
                      >
                        {expanded.includes(plan.id)
                          ? "Show less"
                          : `Show ${plan.objectives.length - 3} more`}
                      </Button>
                    )}
                  </div>

                  {plan.metadata?.premiumResources && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-md border border-indigo-200">
                      <h3 className="text-sm font-medium flex items-center text-indigo-800 mb-2">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Premium Resources
                      </h3>
                      <p className="text-sm text-indigo-700">
                        This plan includes AI-curated resources with up-to-date
                        publications, courses, and tools specifically selected
                        for your learning objectives.
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Learning Style</h4>
                    <p className="text-sm text-black">
                      Primary: {plan.learningStyle.primary}
                      {plan.learningStyle.ratio && (
                        <span className="ml-2">
                          (Theory: {plan.learningStyle.ratio.theory}%,
                          Practical: {plan.learningStyle.ratio.practical}%)
                        </span>
                      )}
                    </p>
                    <div className="mt-2">
                      <h5 className="text-sm font-medium">Methods:</h5>
                      <ul className="list-disc list-inside">
                        {plan.learningStyle.methods.map((method, index) => (
                          <li key={index} className="text-sm text-black">
                            {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {plan.materials && (
                    <div>
                      <h4 className="font-medium mb-2">Materials</h4>
                      {plan.materials.required.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium">Required:</h5>
                          <ul className="list-disc list-inside">
                            {plan.materials.required.map((material, index) => (
                              <li key={index} className="text-sm text-black">
                                {material}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {plan.certification && (
                    <div>
                      <h4 className="font-medium mb-2">Certification</h4>
                      <p className="text-sm text-black">
                        Type: {plan.certification.type}
                        {plan.certification.validityPeriod && (
                          <span className="ml-2">
                            (Valid for: {plan.certification.validityPeriod})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}

            <CardFooter className="flex justify-between">
              <div className="text-sm text-black">
                Created:{" "}
                {new Date(plan.metadata.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUseAsTemplate(plan)}
                >
                  Use as Template
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
