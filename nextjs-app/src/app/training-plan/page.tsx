import { Metadata } from "next";
import TrainingPlanClient from "./client-component";

export const metadata: Metadata = {
  title: "Training Plan Creator | Synthalyst",
  description: "Create and manage your training plans",
};

export default function TrainingPlanPage() {
  return <TrainingPlanClient />;
}
