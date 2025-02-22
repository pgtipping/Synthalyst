"use client";

import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import type { JobDescription } from "@/types/jobDescription";

interface TemplateListProps {
  templates: JobDescription[];
  onUseTemplate: (template: JobDescription) => void;
  isLoading: boolean;
  error: string | null;
}

export default function TemplateList({
  templates,
  onUseTemplate,
  isLoading,
  error,
}: TemplateListProps) {
  const [localTemplates, setLocalTemplates] = useState(templates);

  const handleDelete = async (templateId: string) => {
    try {
      const response = await fetch(
        `/api/jd-developer/templates/${templateId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      setLocalTemplates((prev) => prev.filter((t) => t.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete template",
        variant: "destructive",
      });
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
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {localTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
              <CardDescription>
                {template.department} • {template.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{template.metadata.industry}</Badge>
                <Badge variant="secondary">{template.metadata.level}</Badge>
                <Badge variant="secondary">{template.employmentType}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {template.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Created{" "}
                {new Date(template.metadata.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => onUseTemplate(template)}>
                  Use Template
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(template.id)}
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {localTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No templates available.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
