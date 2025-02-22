"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import JDForm from "./components/JDForm";
import TemplateList from "./components/TemplateList";
import SavedJDs from "./components/SavedJDs";
import type { JobDescription } from "@/types/jobDescription";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface SwitchTabEvent extends CustomEvent {
  detail: string;
}

export default function JDDeveloperPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTemplate, setSelectedTemplate] =
    useState<JobDescription | null>(null);
  const [templates, setTemplates] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/jd-developer/templates");
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

  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent<string>) => {
      setActiveTab(event.detail);
    };

    window.addEventListener("switchTab", handleTabSwitch as EventListener);

    return () => {
      window.removeEventListener("switchTab", handleTabSwitch as EventListener);
    };
  }, []);

  const handleTemplateSelect = (template: JobDescription) => {
    setSelectedTemplate(template);
    setActiveTab("create");
    toast({
      title: "Template Selected",
      description: "The template has been loaded into the form.",
    });
  };

  useEffect(() => {
    const handleSwitchTab = (event: SwitchTabEvent) => {
      const tab = event.detail;
      const tabsElement = document.querySelector('[role="tablist"]');
      if (tabsElement) {
        const trigger = tabsElement.querySelector(
          `[data-state][value="${tab}"]`
        );
        if (trigger) {
          (trigger as HTMLElement).click();
        }
      }
    };

    window.addEventListener("switchTab", handleSwitchTab as EventListener);
    return () =>
      window.removeEventListener("switchTab", handleSwitchTab as EventListener);
  }, []);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">JD Developer</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to create and manage job descriptions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "JD Developer", href: "/jd-developer", active: true },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Job Description Developer</h1>
        <p className="text-muted-foreground">
          Create professional job descriptions powered by AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved JDs</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card className="p-6">
            <JDForm
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
            <SavedJDs onUseAsTemplate={handleTemplateSelect} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
