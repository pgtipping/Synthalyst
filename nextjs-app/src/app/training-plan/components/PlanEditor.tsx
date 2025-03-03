"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface PlanEditorProps {
  plan: {
    id: string;
    title: string;
    description: string;
    objectives: string[];
    content: {
      content: {
        sections: Array<{
          id: string;
          title: string;
          description: string;
          topics: string[];
          activities: Array<{
            type: string;
            description: string;
            duration: string;
          }>;
          resources: Array<{
            type: string;
            title: string;
            url: string;
            description: string;
          }>;
        }>;
      };
    };
  };
}

// Schema for section validation
const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export function PlanEditor({ plan }: PlanEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  // Parse the content to get the sections
  const sections = plan.content.content.sections;

  // Form for editing a section
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Function to save the plan
  const savePlan = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/training-plan/${plan.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: plan.title,
          description: plan.description,
          objectives: plan.objectives,
          content: plan.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save plan");
      }

      toast.success("Plan saved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save plan");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to regenerate a section
  const regenerateSection = async (sectionId: string) => {
    setIsRegenerating(true);
    try {
      const response = await fetch(
        `/api/training-plan/${plan.id}/regenerate-section`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sectionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate section");
      }

      const data = await response.json();

      // Update the plan with the new section
      const updatedSections = sections.map((section) =>
        section.id === sectionId
          ? data.content.content.sections.find(
              (s: { id: string }) => s.id === sectionId
            )
          : section
      );

      plan.content.content.sections = updatedSections;

      toast.success("Section regenerated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to regenerate section");
      console.error(error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Function to edit a section
  const editSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      form.reset({
        title: section.title,
        description: section.description,
      });
      setEditingSectionId(sectionId);
    }
  };

  // Function to save section edits
  const onSubmit = (values: z.infer<typeof sectionSchema>) => {
    if (!editingSectionId) return;

    // Update the section in the plan
    const updatedSections = sections.map((section) =>
      section.id === editingSectionId
        ? { ...section, title: values.title, description: values.description }
        : section
    );

    plan.content.content.sections = updatedSections;
    setEditingSectionId(null);
    form.reset();
    savePlan();
  };

  // Function to add a new section
  const addNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      description: "Add a description for this section",
      topics: [],
      activities: [],
      resources: [],
    };

    plan.content.content.sections = [...sections, newSection];
    savePlan();
  };

  // Function to delete a section
  const deleteSection = (sectionId: string) => {
    setSectionToDelete(sectionId);
    setShowDeleteDialog(true);
  };

  // Function to confirm section deletion
  const confirmDeleteSection = () => {
    if (!sectionToDelete) return;

    plan.content.content.sections = sections.filter(
      (section) => section.id !== sectionToDelete
    );

    setShowDeleteDialog(false);
    setSectionToDelete(null);
    savePlan();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Training Plan</h2>
        <div className="flex space-x-2">
          <Button onClick={addNewSection}>Add Section</Button>
          <Button onClick={savePlan} disabled={isSaving}>
            {isSaving ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>

                    {section.topics && section.topics.length > 0 && (
                      <div>
                        <h3 className="font-semibold">Topics</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {section.topics.map((topic, index) => (
                            <li key={index}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.activities && section.activities.length > 0 && (
                      <div>
                        <h3 className="font-semibold">Activities</h3>
                        <div className="space-y-2">
                          {section.activities.map((activity, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              <p className="font-medium">
                                {activity.type} ({activity.duration})
                              </p>
                              <p>{activity.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.resources && section.resources.length > 0 && (
                      <div>
                        <h3 className="font-semibold">Resources</h3>
                        <div className="space-y-2">
                          {section.resources.map((resource, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              <p className="font-medium">
                                {resource.title} ({resource.type})
                              </p>
                              <p>{resource.description}</p>
                              {resource.url && resource.url !== "#" && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View Resource
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => editSection(section.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => regenerateSection(section.id)}
                        disabled={isRegenerating}
                      >
                        {isRegenerating ? <Spinner size="sm" /> : "Regenerate"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteSection(section.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Edit Section Dialog */}
      {editingSectionId && (
        <Dialog
          open={!!editingSectionId}
          onOpenChange={(open) => !open && setEditingSectionId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
              <DialogDescription>
                Make changes to the section details below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this section? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSection}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
