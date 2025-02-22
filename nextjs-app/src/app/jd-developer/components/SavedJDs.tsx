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
import { toast } from "@/hooks/use-toast";
import { Download, Copy } from "lucide-react";
import type { JobDescription } from "@/types/jobDescription";

interface SavedJDsProps {
  onUseAsTemplate: (jd: JobDescription) => void;
}

export default function SavedJDs({ onUseAsTemplate }: SavedJDsProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJDs, setSavedJDs] = useState<JobDescription[]>([]);
  const [expandedJD, setExpandedJD] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedJDs = async () => {
      if (!session?.user?.email) {
        setError("Please sign in to view saved job descriptions");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/jd-developer/saved");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch saved job descriptions"
          );
        }
        const data = await response.json();
        setSavedJDs(data.jobDescriptions);
      } catch (error) {
        console.error("Error fetching saved job descriptions:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch saved job descriptions"
        );
        if (
          error instanceof Error &&
          error.message === "Authentication required"
        ) {
          window.location.reload(); // Refresh the page to trigger re-authentication
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedJDs();
  }, [session]);

  const handleDelete = async (jdId: string) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/jd-developer/saved/${jdId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job description");
      }

      setSavedJDs((prevJDs) => prevJDs.filter((jd) => jd.id !== jdId));
      toast({
        title: "Success",
        description: "Job description deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting job description:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete job description",
        variant: "destructive",
      });
    }
  };

  const handleExport = (jd: JobDescription) => {
    const dataStr = JSON.stringify(jd, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${jd.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${jd.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleDuplicate = async (jd: JobDescription) => {
    try {
      const response = await fetch("/api/jd-developer/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: jd.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate job description");
      }

      const data = await response.json();
      setSavedJDs((prevJDs) => [data.jobDescription, ...prevJDs]);
      toast({
        title: "Success",
        description: "Job description duplicated successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to duplicate job description";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const toggleExpand = async (jdId: string) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view job descriptions.",
        variant: "destructive",
      });
      return;
    }

    try {
      setExpandedJD(expandedJD === jdId ? null : jdId);
    } catch (error) {
      console.error("Error toggling job description:", error);
      toast({
        title: "Error",
        description: "Failed to expand job description. Please try again.",
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

  if (savedJDs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No saved job descriptions found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {savedJDs.map((jd) => (
          <Card key={jd.id} className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{jd.title}</CardTitle>
                  <CardDescription>
                    {jd.department} • {jd.location} • {jd.employmentType}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{jd.metadata.industry}</Badge>
                  <Badge variant="outline">{jd.metadata.level}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {jd.description}
                  </p>
                  {jd.description.length > 150 && (
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2"
                      onClick={() => toggleExpand(jd.id)}
                    >
                      {expandedJD === jd.id ? "Show less" : "Show more"}
                    </Button>
                  )}
                </div>

                {expandedJD === jd.id && (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Responsibilities</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {jd.responsibilities.map((responsibility, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {jd.requirements.required.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {jd.requirements.preferred && (
                      <div>
                        <h4 className="font-medium mb-2">Preferred Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {jd.requirements.preferred.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {jd.qualifications.education && (
                      <div>
                        <h4 className="font-medium mb-2">Education</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {jd.qualifications.education.map((edu, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground"
                            >
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {jd.benefits && (
                      <div>
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {jd.benefits.map((benefit, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground"
                            >
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Created: {new Date(jd.metadata.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(jd)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(jd)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUseAsTemplate(jd)}
                >
                  Use as Template
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(jd.id)}
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
