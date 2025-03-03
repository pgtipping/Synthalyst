"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanForm from "./components/PlanForm";
import PlanList from "./components/PlanList";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  // Get the current tab from search params or default to "saved"
  const defaultTab = searchParams.get("tab") || "saved";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Update URL with tab parameter without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState({}, "", url);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Training Plans</h1>
      <p className="text-gray-600 mb-8">
        Create and manage your training plans for various learning objectives.
      </p>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-8">
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          <TabsTrigger value="create">Create New Plan</TabsTrigger>
        </TabsList>

        <p className="text-sm text-gray-500 mb-6">Current tab: {activeTab}</p>

        <TabsContent value="saved">
          <PlanList />
        </TabsContent>

        <TabsContent value="create">
          <PlanForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
