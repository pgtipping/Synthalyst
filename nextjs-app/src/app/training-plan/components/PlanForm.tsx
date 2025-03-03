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
import { X, Plus, Info, ChevronDown, ChevronUp } from "lucide-react";
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
  materialsRequired: z.array(z.string()).optional().default([]),
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
  isPremium?: boolean;
  resources?: {
    id: string;
    title: string;
    type: string;
    author?: string;
    description: string;
    url?: string;
  }[];
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
      materialsRequired: [],
      certificationDetails: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to generate a training plan");
      return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      // Add user email to the form data
      const formData = {
        ...values,
        userEmail: session.user.email,
      };

      // Call the enhanced-generate endpoint
      const response = await fetch("/api/training-plan/enhanced-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate training plan");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setGeneratedPlan(data.data);
        toast.success("Training plan generated successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating training plan:", error);
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
                      <Info className="h-4 w-4 ml-2 text-muted-foreground" />
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentFields = form.getValues(fieldName);
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
                  const currentFields = form.getValues(fieldName);
                  form.setValue(fieldName, [...currentFields, ""]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {fieldName === "objectives" ? "Objective" : "Material"}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create a Training Plan</h2>
        <p className="text-muted-foreground">
          Fill in the essential information below to generate a detailed
          training plan.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for your training plan"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive title for your training plan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Learning Objectives Field */}
            {renderArrayInput(
              "objectives",
              "Learning Objectives*",
              "Specific outcomes that participants will achieve through this training.",
              "Clear learning objectives help the AI create more focused and effective training content."
            )}

            {/* Target Audience Level Field */}
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
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
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
                  <FormDescription>
                    Select the knowledge level of your target audience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration Field */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration*</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., 4"
                        className="w-24"
                        {...field}
                      />
                    </FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(field.value.split(" ")[0] + " " + value);
                      }}
                      defaultValue="weeks"
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>
                    The total duration of the training plan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Advanced Options Section */}
          <Collapsible
            open={showAdvancedOptions}
            onOpenChange={setShowAdvancedOptions}
            className="border rounded-md p-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-0 font-semibold"
                type="button"
              >
                <span>Advanced Options</span>
                {showAdvancedOptions ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Description Field */}
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
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
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
                      <Textarea
                        placeholder="Provide a brief overview of the training plan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prerequisites Field */}
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
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Specifying prerequisites helps tailor content to
                              the right knowledge level and ensures learners are
                              prepared.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Knowledge or skills required before starting this training"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Learning Style Field */}
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
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Indicating preferred learning styles helps create
                              activities that match how your audience learns
                              best.
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
                          <SelectValue placeholder="Select a learning style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visual">Visual</SelectItem>
                          <SelectItem value="auditory">Auditory</SelectItem>
                          <SelectItem value="reading/writing">
                            Reading/Writing
                          </SelectItem>
                          <SelectItem value="kinesthetic">
                            Kinesthetic (Hands-on)
                          </SelectItem>
                          <SelectItem value="multimodal">
                            Multimodal (Mixed)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry/Domain Field */}
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
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Specifying your industry helps the AI generate
                              more relevant examples and terminology.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Healthcare, Technology, Education"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Materials Required Field */}
              {renderArrayInput(
                "materialsRequired",
                "Materials Required",
                "List any materials or resources needed for this training.",
                "Specifying required materials helps create a more practical and implementable training plan."
              )}

              {/* Certification Details Field */}
              <FormField
                control={form.control}
                name="certificationDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Certification Details
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Include information about any certification that
                              participants can earn upon completion.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Details about certification, if applicable"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Notes Field */}
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other information that might be helpful"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            {generatedPlan && (
              <Button
                type="button"
                variant="outline"
                onClick={savePlan}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Plan"
                )}
              </Button>
            )}
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                "Generate Plan"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Generated Plan Display */}
      {generatedPlan && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{generatedPlan.title}</h3>
              {generatedPlan.isPremium && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                  <span className="mr-1">✨</span>
                  Premium
                </div>
              )}
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedPlan.content }}
            />

            {/* Premium Resources Section */}
            {generatedPlan.resources && generatedPlan.resources.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">✨</span>
                  AI-Curated Resources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPlan.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="border rounded-lg p-4 bg-slate-50"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{resource.title}</h5>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {resource.type}
                        </span>
                      </div>
                      {resource.author && (
                        <p className="text-sm text-muted-foreground">
                          by {resource.author}
                        </p>
                      )}
                      <p className="text-sm mt-2">{resource.description}</p>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                        >
                          Visit Resource →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
