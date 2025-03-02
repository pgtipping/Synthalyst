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
import { Download, Copy, Trash2 } from "lucide-react";
import type { JobDescription } from "@/types/jobDescription";
import JobDescriptionView from "./JobDescriptionView";
import { pdf } from "@react-pdf/renderer";
import JobDescriptionPDF from "@/components/JobDescriptionPDF";

interface SavedJDsProps {
  onUseAsTemplate: (jd: JobDescription) => void;
}

export default function SavedJDs({ onUseAsTemplate }: SavedJDsProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJDs, setSavedJDs] = useState<JobDescription[]>([]);
  const [selectedJD, setSelectedJD] = useState<JobDescription | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      // Find the job description to get its title
      const jobToDelete = savedJDs.find((jd) => jd.id === id);
      if (!jobToDelete) return;

      const response = await fetch(`/api/jd-developer/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job description");
      }

      // Remove the deleted JD from the state
      setSavedJDs((prevJDs) => prevJDs.filter((jd) => jd.id !== id));
      setSelectedJD(null);

      toast({
        title: "Job Description Deleted",
        description: `"${jobToDelete.title}" has been deleted successfully.`,
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

  const handleExport = async (jd: JobDescription) => {
    try {
      // Generate PDF blob
      const blob = await pdf(<JobDescriptionPDF jd={jd} />).toBlob();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create filename
      const exportFileDefaultName = `${jd.title
        .toLowerCase()
        .replace(/\s+/g, "-")}-${jd.id}.pdf`;

      // Create and click download link
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", url);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export job description as PDF",
        variant: "destructive",
      });
    }
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

  const handleEdit = (jd: JobDescription) => {
    // TODO: Implement edit functionality
    console.log("Editing job description:", jd.id);
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon.",
    });
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
    <>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {savedJDs.map((jd) => (
            <Card key={jd.id} className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{jd.title}</CardTitle>
                    <CardDescription>
                      {jd.department && `${jd.department} • `}
                      {jd.location && `${jd.location} • `}
                      {jd.employmentType}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {jd.metadata.industry && (
                      <Badge variant="outline">{jd.metadata.industry}</Badge>
                    )}
                    {jd.metadata.level && (
                      <Badge variant="outline">{jd.metadata.level}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {jd.description}
                </p>
                {jd.description.length > 150 && (
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2"
                    onClick={() => setSelectedJD(jd)}
                  >
                    View Details
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(jd)}
                  className="flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(jd)}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(jd.id)}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUseAsTemplate(jd)}
                >
                  Use as Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedJD && (
        <JobDescriptionView
          jd={selectedJD}
          isOpen={!!selectedJD}
          onClose={() => setSelectedJD(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExport}
          onDuplicate={handleDuplicate}
        />
      )}
    </>
  );
}
