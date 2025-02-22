"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import PlanForm from "./components/PlanForm";
import PlanList from "./components/PlanList";
import TemplateList from "./components/TemplateList";
import type { TrainingPlan } from "@/types/trainingPlan";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function TrainingPlanPage() {
  const { data: session } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState<TrainingPlan | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("create");
  const [templates, setTemplates] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/training-plan/templates");
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch templates"
        );
        toast({
          title: "Error",
          description: "Failed to load templates. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template: TrainingPlan) => {
    setSelectedTemplate(template);
    setActiveTab("create");
    toast({
      title: "Template Selected",
      description: "The template has been loaded into the form.",
    });
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Training Plan Creator</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to create and manage training plans.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Training Plan", href: "/training-plan", active: true },
          ]}
        />

        <h1 className="text-4xl font-bold">Training Plan Creator</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="p-6">
              <PlanForm
                initialTemplate={selectedTemplate}
                onClearTemplate={() => setSelectedTemplate(null)}
              />
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="p-6">
              <TemplateList
                templates={templates}
                onUseTemplate={handleTemplateSelect}
                isLoading={isLoading}
                error={error}
              />
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="p-6">
              <PlanList onUseAsTemplate={handleTemplateSelect} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
