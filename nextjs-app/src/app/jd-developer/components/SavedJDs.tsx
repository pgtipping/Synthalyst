"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Trash2,
  FileText,
  Copy,
  Pencil,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/lib/toast-migration";
import type { JobDescription } from "@/types/jobDescription";
import JobDescriptionPDF from "@/components/JobDescriptionPDF";
import PDFRenderer from "@/components/PDFRenderer";

interface SavedJDsProps {
  onUseAsTemplate: (jd: JobDescription) => void;
}

export default function SavedJDs({ onUseAsTemplate }: SavedJDsProps) {
  const router = useRouter();
  const [savedJDs, setSavedJDs] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  const fetchSavedJDs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/jd-developer/saved");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch saved job descriptions: ${response.status} ${response.statusText}`
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
      toast({
        title: "Error",
        description: "Failed to fetch saved job descriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJDs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      const response = await fetch(`/api/jd-developer/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete job description: ${response.status} ${response.statusText}`
        );
      }

      // Remove the deleted JD from the state
      setSavedJDs((prevJDs) => prevJDs.filter((jd) => jd.id !== id));

      toast({
        title: "Success",
        description: "Job description deleted successfully",
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
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDuplicate = async (jd: JobDescription) => {
    try {
      setIsDuplicating(jd.id);
      const response = await fetch(`/api/jd-developer/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: jd.id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to duplicate job description: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Add the duplicated JD to the state
      setSavedJDs((prevJDs) => [data.jobDescription, ...prevJDs]);

      toast({
        title: "Success",
        description: "Job description duplicated successfully",
      });
    } catch (error) {
      console.error("Error duplicating job description:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to duplicate job description",
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(null);
    }
  };

  const handleEdit = (jd: JobDescription) => {
    // Navigate to the edit page
    router.push(`/jd-developer/edit/${jd.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading saved job descriptions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground mb-4 text-center max-w-md">
          {error}
        </p>
        <Button onClick={fetchSavedJDs}>Try Again</Button>
      </div>
    );
  }

  if (savedJDs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          No Saved Job Descriptions
        </h3>
        <p className="text-muted-foreground mb-6">
          You haven&apos;t saved any job descriptions yet. Create and save a job
          description to see it here.
        </p>
        <Button
          onClick={() => {
            const tabSwitchEvent = new CustomEvent("switchTab", {
              detail: "form",
            });
            window.dispatchEvent(tabSwitchEvent);
          }}
        >
          Create Job Description
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Your Saved Job Descriptions
      </h2>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedJDs.map((jd) => (
                <TableRow key={jd.id}>
                  <TableCell className="font-medium">{jd.title}</TableCell>
                  <TableCell>{jd.department || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(jd.metadata.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUseAsTemplate(jd)}
                      title="Use as Template"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <PDFRenderer
                      document={<JobDescriptionPDF jd={jd} />}
                      fileName={`${jd.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}-${jd.id}.pdf`}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        title="Export as PDF"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </PDFRenderer>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDuplicate(jd)}
                      disabled={isDuplicating === jd.id}
                      title="Duplicate"
                    >
                      {isDuplicating === jd.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(jd)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(jd.id)}
                      disabled={isDeleting === jd.id}
                      title="Delete"
                    >
                      {isDeleting === jd.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
