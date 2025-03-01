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
      <div className="bg-card rounded-lg border p-6 text-center py-8 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 text-primary">
              Welcome to the JD Developer!
            </h3>
            <p className="text-muted-foreground">
              You don&apos;t have any templates yet. Here&apos;s how to get
              started:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-5 border shadow-sm">
              <h4 className="font-semibold text-lg mb-3 flex items-center text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Your First Template
              </h4>
              <ol className="list-decimal pl-5 space-y-3 text-left">
                <li>
                  Go to the <strong>Create</strong> tab
                </li>
                <li>
                  Fill out the <strong>required fields</strong>:
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li>
                      <strong>Job Title</strong> (mandatory)
                    </li>
                    <li>
                      <strong>Employment Type</strong> (mandatory)
                    </li>
                    <li>
                      <strong>Position Level</strong> (mandatory)
                    </li>
                    <li>
                      <strong>Industry</strong> (mandatory)
                    </li>
                    <li>Department (optional)</li>
                    <li>Location (optional)</li>
                  </ul>
                </li>
                <li>
                  Click{" "}
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                    Generate Job Description
                  </span>{" "}
                  to create a JD
                </li>
                <li>
                  Review the generated content and make any necessary edits
                </li>
                <li>
                  Click{" "}
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                    Save as Template
                  </span>{" "}
                  to save it for future use
                </li>
              </ol>
            </div>

            <div className="space-y-5 text-left">
              <div className="bg-background rounded-lg p-5 border shadow-sm">
                <h4 className="font-semibold text-lg mb-3 flex items-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Benefits of Templates
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Save time by reusing job descriptions for similar
                      positions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Maintain consistency across your job postings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Quickly adapt existing templates for new roles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Organize your job descriptions by department or job level
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 rounded-lg p-5 border border-primary/20 shadow-sm">
                <h4 className="font-semibold text-lg mb-2 flex items-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pro Tips
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 mt-0.5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Create templates for different departments to build a
                    comprehensive library
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 mt-0.5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Add detailed responsibilities to make your templates more
                    valuable
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 mt-0.5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Once you save a template, it will appear in this list for
                    future use
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
