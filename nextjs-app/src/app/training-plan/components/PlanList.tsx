"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, FileEdit, Trash, Copy } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the TrainingPlan type
interface TrainingPlan {
  id: string;
  title: string;
  description?: string;
  content: string | Record<string, unknown>;
  updatedAt: string;
  createdAt: string;
}

export default function PlanList() {
  const router = useRouter();
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/training-plan/saved");
        if (!response.ok) {
          throw new Error("Failed to fetch training plans");
        }
        const data = await response.json();
        setPlans(data.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch training plans"
        );
        toast.error("Failed to load training plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/training-plan/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/training-plan/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete training plan");
      }

      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
      toast.success("Training plan deleted successfully");
    } catch (err) {
      toast.error("Failed to delete training plan");
      console.error(err);
    } finally {
      setPlanToDelete(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/training-plan/${id}/duplicate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate training plan");
      }

      const data = await response.json();
      setPlans((prevPlans) => [data.plan, ...prevPlans]);
      toast.success("Training plan duplicated successfully");
    } catch (err) {
      toast.error("Failed to duplicate training plan");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">Loading your training plans...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No Training Plans</h2>
        <p className="text-gray-500 mb-4">
          You haven&apos;t created any training plans yet.
        </p>
        <Button onClick={() => router.push("/training-plan?tab=create")}>
          Create Your First Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const content =
            typeof plan.content === "string"
              ? JSON.parse(plan.content)
              : plan.content;

          const isDraft = content?.metadata?.isDraft || false;

          return (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{plan.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {formatDistanceToNow(new Date(plan.updatedAt), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(plan.id)}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(plan.id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setPlanToDelete(plan.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm line-clamp-2">
                    {plan.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {isDraft && (
                      <Badge variant="outline" className="bg-yellow-50">
                        Draft
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {content?.targetAudience?.level || "All Levels"}
                    </Badge>
                    <Badge variant="outline">
                      {content?.duration?.total || "Flexible"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleEdit(plan.id)}
                >
                  {isDraft ? "Continue Editing" : "View & Edit"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={!!planToDelete}
        onOpenChange={(open) => !open && setPlanToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this training plan. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => planToDelete && handleDelete(planToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
