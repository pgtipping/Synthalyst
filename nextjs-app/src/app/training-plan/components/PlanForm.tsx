"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { X, Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Updated schema with mandatory and optional fields
const formSchema = z.object({
  // Mandatory fields
  title: z.string().min(3, "Title must be at least 3 characters"),
  objectives: z
    .array(z.string())
    .min(1, "At least one learning objective is required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  duration: z.string().min(1, "Duration is required"),

  // Optional fields
  description: z.string().optional(),
  prerequisites: z.string().optional(),
  learningStylePrimary: z.string().optional(),
  industry: z.string().optional(),
  materialsRequired: z.array(z.string()).optional(),
  certificationDetails: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GeneratedPlan {
  id: string;
  title: string;
  content: string;
  objectives?: string[];
  targetAudienceLevel?: string;
  duration?: string;
  description?: string;
  prerequisites?: string;
  learningStylePrimary?: string;
  industry?: string;
  materialsRequired?: string[];
  certificationDetails?: string;
  additionalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function PlanForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      objectives: [""],
      targetAudienceLevel: "",
      duration: "",
      description: "",
      prerequisites: "",
      learningStylePrimary: "",
      industry: "",
      materialsRequired: [""],
      certificationDetails: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);

    try {
      // Check if user is logged in
      if (!session?.user?.email) {
        throw new Error("You must be logged in to generate a training plan");
      }

      // Clean up empty values in arrays
      const cleanedValues = { ...values };

      // Clean array fields
      if (Array.isArray(cleanedValues.objectives)) {
        cleanedValues.objectives = cleanedValues.objectives.filter(
          (item) => item.trim() !== ""
        );
      }

      if (Array.isArray(cleanedValues.materialsRequired)) {
        cleanedValues.materialsRequired =
          cleanedValues.materialsRequired.filter((item) => item.trim() !== "");
      }

      // Call the enhanced generate API
      const response = await fetch("/api/training-plan/enhanced-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cleanedValues,
          userEmail: session.user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate training plan");
      }

      const data = await response.json();

      // Set the generated plan
      setGeneratedPlan(data.data);

      toast.success("Training plan generated successfully!");
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate training plan"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan) return;

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      if (!session?.user?.email) {
        throw new Error("You must be logged in to save a training plan");
      }

      // Save the generated plan
      const response = await fetch("/api/training-plan/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: generatedPlan.id,
          title: generatedPlan.title,
          content: JSON.stringify(generatedPlan),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save training plan");
      }

      toast.success("Training plan saved successfully!");

      // Redirect to the saved plans tab
      router.push("/training-plan?tab=saved");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save training plan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderArrayInput = (
    fieldName: "objectives" | "materialsRequired",
    label: string,
    description?: string,
    tooltip?: string
  ) => {
    const fields = form.watch(fieldName) || [];

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={() => (
          <FormItem>
            <FormLabel className="flex items-center">
              {label}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <div className="space-y-2">
              {fields.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentFields = form.getValues(fieldName) || [];
                      if (currentFields.length > 1) {
                        const newFields = [...currentFields];
                        newFields.splice(index, 1);
                        form.setValue(fieldName, newFields);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const currentFields = form.getValues(fieldName) || [];
                  form.setValue(fieldName, [...currentFields, ""]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {label.toLowerCase()}
              </Button>
            </div>
          </FormItem>
        )}
      />
    );
  };

  return (
    <div>
      {!generatedPlan ? (
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Section */}
                <div className="space-y-6 md:col-span-2">
                  <h2 className="text-xl font-semibold">Basic Information</h2>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title for your training plan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {renderArrayInput(
                    "objectives",
                    "Learning Objectives*",
                    "Specific outcomes learners should achieve",
                    "Be specific and measurable. Good objectives start with action verbs like 'Understand', 'Apply', 'Analyze', etc."
                  )}

                  <FormField
                    control={form.control}
                    name="targetAudienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience Level*</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Beginner" id="beginner" />
                              <Label htmlFor="beginner">Beginner</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Intermediate"
                                id="intermediate"
                              />
                              <Label htmlFor="intermediate">Intermediate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Advanced" id="advanced" />
                              <Label htmlFor="advanced">Advanced</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 4 weeks, 2 days, 6 hours"
                          />
                        </FormControl>
                        <FormDescription>
                          Total time required to complete the training
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Advanced Options Section */}
                <div className="md:col-span-2">
                  <Collapsible
                    open={showAdvancedOptions}
                    onOpenChange={setShowAdvancedOptions}
                    className="border rounded-md p-4"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full justify-between"
                      >
                        <span className="font-semibold">Advanced Options</span>
                        <span>{showAdvancedOptions ? "Hide" : "Show"}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Description
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Adding a detailed description helps the AI
                                      understand the context and purpose of your
                                      training plan.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prerequisites"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Prerequisites
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Specifying prerequisites helps tailor
                                      content to the right knowledge level and
                                      ensures learners are prepared.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="learningStylePrimary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Learning Style Preferences
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Indicating preferred learning styles helps
                                      create activities that match how your
                                      audience learns best.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select learning style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Visual">Visual</SelectItem>
                                  <SelectItem value="Auditory">
                                    Auditory
                                  </SelectItem>
                                  <SelectItem value="Reading/Writing">
                                    Reading/Writing
                                  </SelectItem>
                                  <SelectItem value="Kinesthetic">
                                    Kinesthetic
                                  </SelectItem>
                                  <SelectItem value="Multimodal">
                                    Multimodal
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Industry/Domain
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Specifying your industry helps the AI
                                      generate more relevant examples and
                                      terminology.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {renderArrayInput(
                        "materialsRequired",
                        "Materials Required",
                        "List any materials needed for this training",
                        "Include both physical and digital resources needed for the training."
                      )}

                      <FormField
                        control={form.control}
                        name="certificationDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certification Details</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Details about certification, if applicable"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Spinner className="mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Training Plan"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{generatedPlan.title}</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                Edit Form
              </Button>
              <Button onClick={savePlan} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Plan"
                )}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: generatedPlan.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
