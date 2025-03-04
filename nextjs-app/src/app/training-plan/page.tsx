import { Metadata } from "next";
import TrainingPlanClient from "./client-component";
import { ClientComponentWrapper } from "@/components/wrappers/ClientComponentWrapper";

export const metadata: Metadata = {
  title: "Training Plan Creator | Synthalyst",
  description: "Create and manage your training plans",
};

export default function TrainingPlanPage() {
  return (
    <ClientComponentWrapper loadingText="Loading Training Plan Creator...">
      <TrainingPlanClient />
    </ClientComponentWrapper>
  );
}
