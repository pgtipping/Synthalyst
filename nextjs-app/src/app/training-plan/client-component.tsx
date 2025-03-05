"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanForm from "./components/PlanForm";
import SavedPlans from "./components/SavedPlans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function TrainingPlanClient() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "create";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update the active tab if the URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "create";
    setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Training Plan Creator
            </CardTitle>
            <CardDescription className="text-base">
              Create comprehensive, structured training plans for any subject or
              skill with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Structured Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Generate well-organized training plans with clear objectives,
                  modules, and assessments.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Resource Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Get curated books, courses, and tools that support your
                  training objectives.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Assessment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Include effective evaluation strategies to measure learning
                  progress and outcomes.
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/blog/training-plan-creator-guide">
                <HelpCircle className="mr-2 h-4 w-4" />
                Read the comprehensive guide
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
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
    </div>
  );
}
