"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import JDForm from "./components/JDForm";
import TemplateList from "./components/TemplateList";
import SavedJDs from "./components/SavedJDs";
import type { JobDescription } from "@/types/jobDescription";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function JDDeveloperPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState<string>(tabParam || "form");
  const [templates, setTemplates] = useState<JobDescription[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<JobDescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/jd-developer/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError("Failed to fetch templates");
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.email) return;

    // Initial fetch
    fetchTemplates();

    // Set active tab from URL parameter if present
    if (tabParam && ["form", "templates", "saved"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Listen for tab switch events
    const handleTabSwitch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setActiveTab(customEvent.detail);
      if (customEvent.detail === "templates") {
        fetchTemplates();
      }
    };

    window.addEventListener("switchTab", handleTabSwitch);

    return () => {
      window.removeEventListener("switchTab", handleTabSwitch);
    };
  }, [session, tabParam]);

  const handleTemplateSelect = (template: JobDescription) => {
    setSelectedTemplate(template);
    setActiveTab("form");
    toast({
      title: "Template Selected",
      description: "The template has been loaded into the form.",
    });
  };

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
    <div className="container py-10">
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
          <TabsTrigger value="form">Create</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved JDs</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
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
              onTemplatesChanged={fetchTemplates}
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
