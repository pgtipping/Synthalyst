"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanForm from "./components/PlanForm";
import SavedPlans from "./components/SavedPlans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "create"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL with tab parameter
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState({}, "", url);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Training Plan Creator</h1>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog/mastering-the-training-plan-creator">
            <HelpCircle className="mr-2 h-4 w-4" />
            Guide
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create New Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <PlanForm />
        </TabsContent>
        <TabsContent value="saved">
          <SavedPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
}
