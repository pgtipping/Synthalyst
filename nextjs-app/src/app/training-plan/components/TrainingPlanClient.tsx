"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PlanForm from "./PlanForm";
import SavedPlans from "./SavedPlans";
import { Button } from "@/components/ui/button";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("create");
  const [usageCount, setUsageCount] = useState(0);

  // Set the active tab based on the URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "create" || tab === "saved")) {
      setActiveTab(tab);
    }

    // Load usage count from localStorage
    const storedCount = localStorage.getItem("trainingPlanUsageCount");
    if (storedCount) {
      setUsageCount(parseInt(storedCount, 10));
    }
  }, [searchParams]);

  // Only require authentication for the "saved" tab
  useEffect(() => {
    if (activeTab === "saved" && status === "unauthenticated") {
      toast.error("You must be logged in to view saved training plans", {
        action: {
          label: "Sign In",
          onClick: () =>
            signIn(undefined, { callbackUrl: "/training-plan?tab=saved" }),
        },
      });
      setActiveTab("create");
    }
  }, [activeTab, status]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="container py-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    if (value === "saved" && status === "unauthenticated") {
      toast.error("You must be logged in to view saved training plans", {
        action: {
          label: "Sign In",
          onClick: () =>
            signIn(undefined, { callbackUrl: "/training-plan?tab=saved" }),
        },
      });
      return;
    }

    setActiveTab(value);
    router.push(`/training-plan?tab=${value}`);
  };

  return (
    <div className="container py-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Plans {status === "unauthenticated" && "🔒"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <PlanForm
            session={session}
            usageCount={usageCount}
            setUsageCount={(count: number) => {
              setUsageCount(count);
              localStorage.setItem("trainingPlanUsageCount", count.toString());
            }}
          />
        </TabsContent>

        <TabsContent value="saved">
          {status === "authenticated" ? (
            <SavedPlans />
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Authentication Required
              </h3>
              <p className="mb-6">
                You need to sign in to view your saved training plans.
              </p>
              <Button
                onClick={() =>
                  signIn(undefined, { callbackUrl: "/training-plan?tab=saved" })
                }
              >
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
