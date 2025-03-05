"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, Trash2, PlusCircle } from "lucide-react";
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
import Link from "next/link";

interface SavedPlan {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function SavedPlans() {
  const router = useRouter();
  const { status } = useSession();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedPlans = async () => {
      // Don't fetch if not authenticated
      if (status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/training-plan/saved");

        if (!response.ok) {
          throw new Error("Failed to fetch saved plans");
        }

        const data = await response.json();
        setPlans(data.data || []);
      } catch (error) {
        console.error("Error fetching saved plans:", error);
        toast.error("Failed to load saved plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPlans();
  }, [status]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);

    try {
      const response = await fetch(`/api/training-plan/saved/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      // Remove the deleted plan from the state
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
      toast.success("Training plan deleted successfully");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete training plan");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/training-plan/view/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No saved training plans</h3>
        <p className="text-muted-foreground mb-6">
          Create a new training plan to get started.
        </p>
        <Link href="/training-plan">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Training Plan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Saved Plans</h2>
        <Link href="/training-plan">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2">{plan.title}</CardTitle>
              <CardDescription>
                Created {format(new Date(plan.createdAt), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Content preview could go here if needed */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(plan.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    {isDeleting === plan.id ? (
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
                      This action cannot be undone. This will permanently delete
                      the training plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(plan.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
