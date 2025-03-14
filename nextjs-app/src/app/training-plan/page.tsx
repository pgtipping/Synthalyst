import { Metadata } from "next";
import TrainingPlanClient from "./client-component";
import { ClientComponentWrapper } from "@/components/wrappers/ClientComponentWrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Training Plan Creator | Synthalyst",
  description: "Create and manage your training plans",
};

export default function TrainingPlanPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            {
              label: "Training Plan Creator",
              href: "/training-plan",
              active: true,
            },
          ]}
        />
      </div>
      <ClientComponentWrapper loadingText="Loading Training Plan Creator...">
        <TrainingPlanClient />
      </ClientComponentWrapper>
    </>
  );
}
