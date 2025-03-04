import { Suspense } from "react";
import { Metadata } from "next";
import TrainingPlanClient from "./components/TrainingPlanClient";

export const metadata: Metadata = {
  title: "Training Plan Creator | Synthalyst",
  description: "Create and manage your training plans",
};

export default function ComponentTrainingPlanPage() {
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
      <TrainingPlanClient />
    </Suspense>
  );
}
