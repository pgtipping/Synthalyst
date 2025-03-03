"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanForm from "./PlanForm";
import SavedPlans from "./SavedPlans";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("create");

  // Set the active tab based on the URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "create" || tab === "saved")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
