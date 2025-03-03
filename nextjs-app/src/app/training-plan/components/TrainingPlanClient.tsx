"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PlanForm from "./PlanForm";
import SavedPlans from "./SavedPlans";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState("create");

  // Set the active tab based on the URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "create" || tab === "saved")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You must be logged in to use the Training Plan Creator");
      router.push("/auth/signin?callbackUrl=/training-plan");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="container py-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Training Plan Creator</h1>
        <p className="text-muted-foreground">
          Create and manage professional training plans with AI assistance
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="create">Create New Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <PlanForm />
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <SavedPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
}
