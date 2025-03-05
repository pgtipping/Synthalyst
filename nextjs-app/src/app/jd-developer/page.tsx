"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast-migration";
import JDForm from "./components/JDForm";
import TemplateList from "./components/TemplateList";
import SavedJDs from "./components/SavedJDs";
import type { JobDescription } from "@/types/jobDescription";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ClientComponentWrapper } from "@/components/wrappers/ClientComponentWrapper";
import { Button } from "@/components/ui/button";

// Component that safely uses useSearchParams inside a Suspense boundary
function JDDeveloperContent() {
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
      const startTime = Date.now();

      const response = await fetch("/api/jd-developer/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.templates);

      // Ensure loading state is shown for at least 500ms for a smoother transition
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsedTime));
      }
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
    // Initial fetch of templates if user is authenticated
    if (session?.user?.email && activeTab === "templates") {
      fetchTemplates();
    }

    // Set active tab from URL parameter if present
    if (tabParam && ["form", "templates", "saved"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Listen for tab switch events
    const handleTabSwitch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setActiveTab(customEvent.detail);
      if (customEvent.detail === "templates" && session?.user?.email) {
        fetchTemplates();
      }
    };

    window.addEventListener("switchTab", handleTabSwitch);

    return () => {
      window.removeEventListener("switchTab", handleTabSwitch);
    };
  }, [session, tabParam, activeTab]);

  const handleTemplateSelect = (template: JobDescription) => {
    setSelectedTemplate(template);
    setActiveTab("form");
    toast({
      title: "Template Selected",
      description: "The template has been loaded into the form.",
    });
  };

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
            {!session ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">
                  Templates Library
                </h2>
                <p className="text-gray-600 mb-4">
                  Sign in to access and manage job description templates.
                </p>
                <Button
                  onClick={() =>
                    signIn(undefined, {
                      callbackUrl: "/jd-developer?tab=templates",
                    })
                  }
                >
                  Sign In to Access Templates
                </Button>
              </div>
            ) : (
              <TemplateList
                templates={templates}
                onUseTemplate={handleTemplateSelect}
                isLoading={isLoading}
                error={error}
                onTemplatesChanged={fetchTemplates}
              />
            )}
          </Card>
        </TabsContent>
        <TabsContent value="saved">
          <Card className="p-6">
            {!session ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">
                  Saved Job Descriptions
                </h2>
                <p className="text-gray-600 mb-4">
                  Sign in to access your saved job descriptions.
                </p>
                <Button
                  onClick={() =>
                    signIn(undefined, {
                      callbackUrl: "/jd-developer?tab=saved",
                    })
                  }
                >
                  Sign In to View Saved JDs
                </Button>
              </div>
            ) : (
              <SavedJDs onUseAsTemplate={handleTemplateSelect} />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function JDDeveloperPage() {
  return (
    <ClientComponentWrapper loadingText="Loading JD Developer...">
      <JDDeveloperContent />
    </ClientComponentWrapper>
  );
}
