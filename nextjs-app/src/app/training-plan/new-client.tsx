"use client";

import { useSearchParams } from "next/navigation";

export default function NewTrainingPlanClient() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "saved";

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Training Plans</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your training plans for various learning objectives.
        </p>
      </div>
      <p>Current tab: {defaultTab}</p>
    </div>
  );
}
