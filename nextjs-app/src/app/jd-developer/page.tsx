"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import JDForm from "./components/JDForm";
import TemplateList from "./components/TemplateList";
import type { JobDescription } from "@/types/jobDescription";

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

  const handleTemplateSelect = (template: JobDescription) => {
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
          <h1 className="text-4xl font-bold mb-4">JD Developer</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to create and manage job descriptions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">JD Developer</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create JD</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}
