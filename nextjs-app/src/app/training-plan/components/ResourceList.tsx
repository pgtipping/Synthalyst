import React from "react";
import { ResourceCard, Resource } from "./ResourceCard";
import { Sparkles } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ResourceListProps {
  resources: Resource[];
  isPremiumUser: boolean;
}

export function ResourceList({ resources, isPremiumUser }: ResourceListProps) {
  // Filter resources based on premium status
  const visibleResources = isPremiumUser
    ? resources
    : resources.filter((resource) => !resource.isPremium);

  const premiumResourceCount = resources.filter(
    (resource) => resource.isPremium
  ).length;
  const hasHiddenResources = !isPremiumUser && premiumResourceCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommended Resources</h3>
        <div className="flex items-center space-x-2">
          {isPremiumUser && premiumResourceCount > 0 && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Sparkles className="h-4 w-4 text-amber-500 mr-1" />
              {premiumResourceCount} premium resources
            </div>
          )}
        </div>
      </div>

      {hasHiddenResources && (
        <Alert className="bg-amber-50 border-amber-200">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <AlertTitle>Premium Resources Available</AlertTitle>
          <AlertDescription>
            Upgrade to premium to access {premiumResourceCount} additional
            curated resources.
          </AlertDescription>
        </Alert>
      )}

      {visibleResources.length === 0 ? (
        <p className="text-muted-foreground text-sm">No resources available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visibleResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
