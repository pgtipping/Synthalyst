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
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Copy, Trash } from "lucide-react";
import type { JobDescription } from "@/types/jobDescription";

interface SavedJDsProps {
  onUseAsTemplate: (jd: JobDescription) => void;
}

export default function SavedJDs({ onUseAsTemplate }: SavedJDsProps) {
  const { data: session } = useSession();
  const [savedJDs, setSavedJDs] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedJDs = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch("/api/jd-developer/saved");
        if (!response.ok) {
          throw new Error("Failed to fetch saved job descriptions");
        }
        const data = await response.json();
        setSavedJDs(data.jobDescriptions);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch saved job descriptions"
        );
        toast({
          title: "Error",
          description:
            "Failed to load saved job descriptions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedJDs();
  }, [session?.user?.email]);

  const handleDelete = async (jdId: string) => {
    try {
      const response = await fetch(`/api/jd-developer/${jdId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job description");
      }

      setSavedJDs((prevJds) => prevJds.filter((jd) => jd.id !== jdId));
      toast({
        title: "Success",
        description: "Job description deleted successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete job description";
      toast({
        title: "Error",
        description: errorMessage,
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
        body: JSON.stringify({ jdId: jd.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate job description");
      }

      const data = await response.json();
      setSavedJDs((prevJds) => [data.jd, ...prevJds]);
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

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please sign in to view your saved job descriptions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedJDs.map((jd) => (
        <Card key={jd.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{jd.title}</CardTitle>
                <CardDescription>
                  {jd.department} • {jd.location}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport(jd)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(jd)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(jd.id)}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{jd.metadata.industry}</Badge>
              <Badge variant="secondary">{jd.metadata.level}</Badge>
              <Badge variant="secondary">{jd.employmentType}</Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {jd.description}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Created {new Date(jd.metadata.createdAt).toLocaleDateString()}
            </div>
            <Button onClick={() => onUseAsTemplate(jd)}>Use as Template</Button>
          </CardFooter>
        </Card>
      ))}

      {savedJDs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No saved job descriptions found.</p>
        </div>
      )}
    </div>
  );
}
