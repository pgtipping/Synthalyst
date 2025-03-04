"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TrainingPlan {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    email: string;
  };
}

interface TrainingPlanViewProps {
  plan: TrainingPlan;
}

export default function TrainingPlanView({ plan }: TrainingPlanViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Parse the content if it's a JSON string
  let parsedContent = plan.content;
  try {
    const contentObj = JSON.parse(plan.content);
    if (contentObj.content) {
      parsedContent = contentObj.content;
    }
  } catch {
    // If parsing fails, use the original content
    console.log("Content is not in JSON format, using as is");
  }

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/training-plan/saved/${plan.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      toast.success("Training plan deleted successfully");
      router.push("/training-plan?tab=saved");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete training plan");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    try {
      // Create a blob with the content
      const blob = new Blob([parsedContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Create a link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${plan.title.replace(/\s+/g, "-").toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Training plan downloaded successfully");
    } catch (error) {
      console.error("Error downloading plan:", error);
      toast.error("Failed to download training plan");
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/training-plan?tab=saved")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Saved Plans
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {isDeleting ? (
                  <Spinner className="h-4 w-4 mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  training plan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{plan.title}</h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(plan.createdAt), "PPP")}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-lg max-w-none dark:prose-invert
                          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 
                          prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4 prose-h2:text-indigo-700 dark:prose-h2:text-indigo-400
                          prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-3 prose-h3:text-indigo-600 dark:prose-h3:text-indigo-500
                          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:my-3 prose-p:leading-relaxed
                          prose-ul:my-3 prose-li:my-1 prose-li:text-gray-700 dark:prose-li:text-gray-300
                          prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100"
            >
              <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
