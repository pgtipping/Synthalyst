"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast-migration";
import { signIn } from "next-auth/react";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Copy, Loader2, AlertCircle, Download } from "lucide-react";
import { Resource } from "./ResourceCard";
import TrainingPlanPDF from "@/components/TrainingPlanPDF";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Session } from "next-auth";
import PDFRenderer from "@/components/PDFRenderer";

// Updated schema with mandatory and optional fields
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  objectives: z
    .array(z.string())
    .min(1, "At least one learning objective is required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  duration: z.string().min(1, "Duration is required"),
  prerequisites: z.string().optional(),
  learningStylePrimary: z.string().optional(),
  industry: z.string().optional(),
  materialsRequired: z.array(z.string()).optional().default([]),
  certificationDetails: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// Define the type for the generated plan
interface GeneratedPlan {
  content: string;
  isPremiumUser: boolean;
  resourceCount: number;
  resources?: Resource[];
}

interface PlanFormProps {
  session: Session | null;
  usageCount: number;
  setUsageCount: (count: number) => void;
}

export default function PlanForm({
  session,
  usageCount,
  setUsageCount,
}: PlanFormProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(
    null
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      objectives: [""],
      targetAudienceLevel: "",
      duration: "",
      prerequisites: "",
      learningStylePrimary: "",
      industry: "",
      materialsRequired: [],
      certificationDetails: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      setGeneratedPlan(null);

      // Check if user has reached the usage limit and is not authenticated
      const newUsageCount = usageCount + 1;
      if (newUsageCount > 3 && !session) {
        toast({
          title: "Authentication Required",
          description:
            "You've reached the free usage limit. Please sign in to continue using this tool.",
          action: (
            <Button
              variant="outline"
              onClick={() =>
                signIn(undefined, { callbackUrl: window.location.href })
              }
            >
              Sign In
            </Button>
          ),
        });
        return;
      }

      // Update usage count
      setUsageCount(newUsageCount);

      const response = await fetch("/api/training-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate training plan");
      }

      const data = await response.json();
      setGeneratedPlan({
        content: data.plan,
        isPremiumUser: data.isPremiumUser,
        resourceCount: data.resourceCount,
        resources: data.resources || [],
      });

      // Save the plan to local storage
      const savedPlans = JSON.parse(localStorage.getItem("savedPlans") || "[]");
      const newPlan = {
        id: Date.now().toString(),
        title: values.title,
        createdAt: new Date().toISOString(),
        content: data.plan,
        isPremiumUser: data.isPremiumUser,
        resourceCount: data.resourceCount,
        resources: data.resources || [],
      };

      localStorage.setItem(
        "savedPlans",
        JSON.stringify([...savedPlans, newPlan])
      );
    } catch (error) {
      console.error("Error generating plan:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save training plans.",
        action: (
          <Button
            variant="outline"
            onClick={() =>
              signIn(undefined, { callbackUrl: window.location.href })
            }
          >
            Sign In
          </Button>
        ),
      });
      return;
    }

    if (!generatedPlan) return;

    setIsSaving(true);

    try {
      // Get the title from the form
      const title = form.getValues("title");

      // Save the generated plan
      const response = await fetch("/api/training-plan/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: JSON.stringify(generatedPlan),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save training plan");
      }

      toast({
        title: "Success",
        description: "Training plan saved successfully!",
      });

      // Redirect to the saved plans tab
      router.push("/training-plan?tab=saved");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save training plan",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (generatedPlan) {
      try {
        setIsCopying(true);
        await navigator.clipboard.writeText(generatedPlan.content);
        toast({
          title: "Copied to clipboard",
          description: "The training plan has been copied to your clipboard.",
        });
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy to clipboard",
        });
      } finally {
        setIsCopying(false);
      }
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
                    aria-label={`Remove ${
                      fieldName === "objectives" ? "objective" : "material"
                    } ${index + 1}`}
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
    <div className="space-y-8">
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
                      className="synthalyst-radio-layout flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
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
                      <SelectTrigger
                        className="w-32"
                        aria-label="Select duration unit"
                      >
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
                disabled={isSaving}
              >
                {isSaving ? (
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Training Plan"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedPlan && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Training Plan
              </CardTitle>
              <CardDescription>
                {generatedPlan.isPremiumUser
                  ? "Premium plan with AI-curated resources"
                  : "Standard training plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: generatedPlan.content }}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleCopyToClipboard}
                disabled={isCopying}
              >
                {isCopying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
              <PDFRenderer
                document={
                  <TrainingPlanPDF
                    title={form.getValues("title")}
                    content={generatedPlan.content}
                    resources={generatedPlan.resources}
                    createdAt={new Date().toISOString()}
                  />
                }
                fileName={`${form.getValues("title").replace(/\s+/g, "-")}.pdf`}
              >
                <Button variant="outline" size="sm" disabled={isDownloading}>
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </PDFRenderer>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
