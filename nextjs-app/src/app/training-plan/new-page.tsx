import { Suspense } from "react";
import { Metadata } from "next";
import NewTrainingPlanClient from "./new-client";

export const metadata: Metadata = {
  title: "New Training Plan | Synthalyst",
  description: "Create and manage your training plans",
};

export default function NewTrainingPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-8 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <NewTrainingPlanClient />
    </Suspense>
  );
}
