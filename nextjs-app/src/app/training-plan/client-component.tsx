"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanForm from "./components/PlanForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  HelpCircle,
  FileText,
  FileX,
  Trash2,
  Download,
  Copy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, InfoIcon } from "lucide-react";

// Define the plan type
interface SavedPlan {
  id: string;
  title: string;
  createdAt: string;
  content: string;
  model: string;
  isPremiumUser: boolean;
  resourceCount: number;
}

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "create";
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Training Plan Creator
            </CardTitle>
            <CardDescription className="text-base">
              Create comprehensive, structured training plans for any subject or
              skill with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Structured Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Generate well-organized training plans with clear objectives,
                  modules, and assessments.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Resource Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Get curated books, courses, and tools that support your
                  training objectives.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Assessment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Include effective evaluation strategies to measure learning
                  progress and outcomes.
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/blog/training-plan-creator-guide">
                <HelpCircle className="mr-2 h-4 w-4" />
                Read the comprehensive guide
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create New Plan</TabsTrigger>
            <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <PlanForm />
          </TabsContent>
          <TabsContent value="saved">
            <SavedPlansTab setActiveTab={setActiveTab} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Define the props for the SavedPlansTab component
interface SavedPlansTabProps {
  setActiveTab: (tab: string) => void;
}

const SavedPlansTab = ({ setActiveTab }: SavedPlansTabProps) => {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);

  useEffect(() => {
    // Load saved plans from localStorage
    const loadSavedPlans = () => {
      try {
        const plans = JSON.parse(localStorage.getItem("savedPlans") || "[]");
        setSavedPlans(plans);
      } catch (error) {
        console.error("Error loading saved plans:", error);
        setSavedPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPlans();
  }, []);

  const deletePlan = (id: string) => {
    try {
      const updatedPlans = savedPlans.filter((plan) => plan.id !== id);
      localStorage.setItem("savedPlans", JSON.stringify(updatedPlans));
      setSavedPlans(updatedPlans);

      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }

      toast.success("The training plan has been deleted.");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete the training plan.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (savedPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FileX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No saved plans</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          You have not saved any training plans yet. Create a new plan to get
          started.
        </p>
        <Button
          variant="default"
          className="mt-4"
          onClick={() => setActiveTab("create")}
        >
          Create New Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Your Plans</h3>
          <Badge>{savedPlans.length}</Badge>
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {savedPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? "border-primary"
                  : "hover:border-muted-foreground/20"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {plan.title}
                  </CardTitle>
                  {plan.isPremiumUser && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-amber-500 to-amber-300 border-0 text-white text-xs"
                    >
                      Premium
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  Created on {new Date(plan.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlan(plan.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedPlan ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedPlan.title}</CardTitle>
                  <CardDescription>
                    Created on{" "}
                    {new Date(selectedPlan.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedPlan.model}</Badge>
                  {selectedPlan.isPremiumUser && (
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-amber-500 to-amber-300"
                    >
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPlan.isPremiumUser && selectedPlan.resourceCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 flex items-start">
                  <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Premium Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      This plan includes {selectedPlan.resourceCount} premium
                      AI-curated resources tailored to your objectives.
                    </p>
                  </div>
                </div>
              )}

              <div
                className="prose prose-sm max-w-none dark:prose-invert border rounded-md p-4 bg-white dark:bg-gray-950"
                dangerouslySetInnerHTML={{ __html: selectedPlan.content }}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([selectedPlan.content], {
                    type: "text/html",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${selectedPlan.title.replace(
                    /\s+/g,
                    "-"
                  )}.html`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(selectedPlan.content);
                  toast.success(
                    "The training plan has been copied to your clipboard."
                  );
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-dashed rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Select a plan</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Choose a training plan from the list to view its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
