"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanForm from "./components/PlanForm";
import PlanList from "./components/PlanList";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "saved";
  const { data: session } = useSession();
  const [usageCount, setUsageCount] = useState(0);

  // Load usage count from localStorage on component mount
  useEffect(() => {
    const storedCount = localStorage.getItem("trainingPlanUsageCount");
    if (storedCount) {
      setUsageCount(parseInt(storedCount, 10));
    }
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Training Plans</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your training plans for various learning objectives.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          <TabsTrigger value="create">Create New Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-6">
          <PlanList />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <PlanForm
            session={session}
            usageCount={usageCount}
            setUsageCount={(count: number) => {
              setUsageCount(count);
              localStorage.setItem("trainingPlanUsageCount", count.toString());
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
