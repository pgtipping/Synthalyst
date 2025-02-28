"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobDescription } from "@/types/jobDescription";
import { TemplateVersionHistory } from "./templates/TemplateVersionHistory";
import { TemplateVersionComparison } from "./templates/TemplateVersionComparison";

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface ExtendedJobDescription extends JobDescription {
  categories?: Category[];
  versions?: JobDescription[];
}

interface TemplateListProps {
  templates: ExtendedJobDescription[];
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
  const [selectedTemplate, setSelectedTemplate] =
    useState<ExtendedJobDescription | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<JobDescription | null>(
    null
  );
  const [comparisonVersions, setComparisonVersions] = useState<{
    oldVersion: JobDescription;
    newVersion: JobDescription;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-2">Error loading templates</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/jd-developer/templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      toast({
        title: "Success",
        description: "Template deleted successfully.",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompareVersions = (v1: JobDescription, v2: JobDescription) => {
    setComparisonVersions({ oldVersion: v2, newVersion: v1 });
    setSelectedVersion(null);
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No templates available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{template.title}</h3>
                <p className="text-muted-foreground mt-1">
                  {template.department} • {template.location}
                  {template.employmentType &&
                    ` • ${template.employmentType.toLowerCase()}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{template.metadata.industry}</Badge>
                <Badge variant="outline">{template.metadata.level}</Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(template.metadata.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onUseTemplate(template)}
                >
                  Use as Template
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Details Dialog */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTemplate(null);
            setSelectedVersion(null);
            setComparisonVersions(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
            <DialogDescription>
              Version {selectedTemplate?.metadata.version}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Version History</TabsTrigger>
              {comparisonVersions && (
                <TabsTrigger value="comparison">Version Comparison</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="mt-4">
              {selectedVersion || selectedTemplate ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {(selectedVersion || selectedTemplate)?.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Responsibilities
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {(
                        selectedVersion || selectedTemplate
                      )?.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Required Skills
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {(
                        selectedVersion || selectedTemplate
                      )?.requirements.required.map((skill, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {skill.name} - {skill.level} - {skill.description}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(() => {
                    const preferredSkills = (
                      selectedVersion || selectedTemplate
                    )?.requirements?.preferred;
                    return preferredSkills &&
                      Array.isArray(preferredSkills) &&
                      preferredSkills.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Preferred Skills
                        </h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {preferredSkills.map((skill, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground"
                            >
                              {skill.name} - {skill.level} - {skill.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Metadata</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        v
                        {
                          (selectedVersion || selectedTemplate)?.metadata
                            .version
                        }
                      </Badge>
                      {(selectedVersion || selectedTemplate)?.metadata
                        .isLatest && <Badge variant="secondary">Latest</Badge>}
                      <Badge variant="secondary">
                        {
                          (selectedVersion || selectedTemplate)?.metadata
                            .industry
                        }
                      </Badge>
                      <Badge variant="secondary">
                        {(selectedVersion || selectedTemplate)?.metadata.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a version to view details
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {selectedTemplate?.versions && (
                <TemplateVersionHistory
                  versions={selectedTemplate.versions}
                  onSelectVersion={setSelectedVersion}
                  onCompareVersions={handleCompareVersions}
                  currentVersionId={selectedVersion?.id}
                />
              )}
            </TabsContent>

            <TabsContent value="comparison" className="mt-4">
              {comparisonVersions && (
                <TemplateVersionComparison
                  oldVersion={comparisonVersions.oldVersion}
                  newVersion={comparisonVersions.newVersion}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
