"use client";

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
import type { TrainingPlan } from "@/types/trainingPlan";

interface TemplateListProps {
  templates: TrainingPlan[];
  onUseTemplate: (template: TrainingPlan) => void;
  isLoading: boolean;
  error: string | null;
}

export default function TemplateList({
  templates,
  onUseTemplate,
  isLoading,
  error,
}: TemplateListProps) {
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
        {templates.map((template) => (
          <Card key={template.id} className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {template.targetAudience.level}
                  </Badge>
                  <Badge variant="outline">{template.duration.total}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Learning Objectives</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {template.objectives.map((objective, index) => (
                      <li key={index} className="text-sm text-black">
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Learning Style</h4>
                  <p className="text-sm text-black">
                    Primary: {template.learningStyle.primary}
                    {template.learningStyle.ratio && (
                      <span className="ml-2">
                        (Theory: {template.learningStyle.ratio.theory}%,
                        Practical: {template.learningStyle.ratio.practical}%)
                      </span>
                    )}
                  </p>
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Methods:</h5>
                    <ul className="list-disc list-inside">
                      {template.learningStyle.methods.map((method, index) => (
                        <li key={index} className="text-sm text-black">
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {template.metadata.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => onUseTemplate(template)}>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
