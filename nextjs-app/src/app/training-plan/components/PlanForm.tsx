"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  ControllerRenderProps,
  UseFormStateReturn,
  ControllerFieldState,
} from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { InfoIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/lib/toast-migration";
import type { TrainingPlan } from "@/types/trainingPlan";

// Updated schema with only essential fields required
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objectives: z.string().min(1, "Learning objectives are required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  duration: z.string().min(1, "Duration is required"),
  // Optional fields
  description: z.string().optional(),
  difficulty: z.string().optional(),
  prerequisites: z.string().optional(),
  idealFor: z.string().optional(),
  learningStylePrimary: z.string().optional(),
  learningMethods: z.string().optional(),
  industry: z.string().optional(),
  category: z.string().optional(),
  hoursPerSection: z.coerce.number().optional(),
  weeksToComplete: z.coerce.number().optional(),
  tags: z.string().optional(),
  theoryRatio: z.coerce
    .number()
    .min(0, "Theory ratio must be at least 0")
    .max(100, "Theory ratio must be at most 100")
    .optional(),
  practicalRatio: z.coerce
    .number()
    .min(0, "Practical ratio must be at least 0")
    .max(100, "Practical ratio must be at most 100")
    .optional(),
  requiredMaterials: z.string().optional(),
  optionalMaterials: z.string().optional(),
  providedMaterials: z.string().optional(),
  certificationType: z.string().optional(),
  certificationRequirements: z.string().optional(),
  certificationValidity: z.string().optional(),
});

interface FormValues extends z.infer<typeof formSchema> {
  title: string;
  objectives: string;
  targetAudienceLevel: string;
  duration: string;
  description?: string;
  difficulty?: string;
  prerequisites?: string;
  idealFor?: string;
  learningStylePrimary?: string;
  learningMethods?: string;
  industry?: string;
  category?: string;
  hoursPerSection?: number;
  weeksToComplete?: number;
  tags?: string;
  theoryRatio?: number;
  practicalRatio?: number;
  requiredMaterials?: string;
  optionalMaterials?: string;
  providedMaterials?: string;
  certificationType?: string;
  certificationRequirements?: string;
  certificationValidity?: string;
}

interface PlanFormProps {
  initialTemplate: TrainingPlan | null;
  onClearTemplate: () => void;
}

type FieldRenderProps<T extends keyof FormValues> = {
  field: ControllerRenderProps<FormValues, T>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FormValues>;
};

// Define the preview plan structure
interface PreviewSection {
  title: string;
  description: string;
  topics: string[];
  activities: {
    type: string;
    description: string;
    duration: string;
  }[];
}

interface PreviewPlan {
  title: string;
  objectives: string[];
  sections: PreviewSection[];
}

export default function PlanForm({
  initialTemplate,
  onClearTemplate,
}: PlanFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PreviewPlan | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      objectives: "",
      targetAudienceLevel: "beginner",
      duration: "",
      description: "",
      difficulty: "easy",
      prerequisites: "",
      idealFor: "",
      learningStylePrimary: "visual",
      learningMethods: "",
      industry: "technology",
      category: "technical",
      hoursPerSection: 2,
      weeksToComplete: 12,
      tags: "",
      theoryRatio: 50,
      practicalRatio: 50,
      requiredMaterials: "",
      optionalMaterials: "",
      providedMaterials: "",
      certificationType: "certificate",
      certificationRequirements: "",
      certificationValidity: "",
    },
  });

  useEffect(() => {
    if (initialTemplate) {
      form.reset({
        title: initialTemplate.title,
        description: initialTemplate.description,
        objectives: initialTemplate.objectives.join("\n"),
        targetAudienceLevel: initialTemplate.targetAudience.level,
        prerequisites:
          initialTemplate.targetAudience.prerequisites?.join("\n") || "",
        idealFor: initialTemplate.targetAudience.idealFor?.join("\n") || "",
        duration: initialTemplate.duration.total,
        hoursPerSection:
          Number(initialTemplate.duration.breakdown?.hoursPerSection) || 2,
        weeksToComplete:
          Number(initialTemplate.duration.breakdown?.weeksToComplete) || 12,
        learningStylePrimary: initialTemplate.learningStyle.primary,
        learningMethods: initialTemplate.learningStyle.methods.join("\n"),
        theoryRatio: Number(initialTemplate.learningStyle.ratio?.theory) || 50,
        practicalRatio:
          Number(initialTemplate.learningStyle.ratio?.practical) || 50,
        requiredMaterials: initialTemplate.materials?.required.join("\n") || "",
        optionalMaterials:
          initialTemplate.materials?.optional?.join("\n") || "",
        providedMaterials:
          initialTemplate.materials?.provided?.join("\n") || "",
        certificationType: initialTemplate.certification?.type || "certificate",
        certificationRequirements:
          initialTemplate.certification?.requirements.join("\n") || "",
        certificationValidity:
          initialTemplate.certification?.validityPeriod || "",
        industry: initialTemplate.metadata.industry || "",
        category: initialTemplate.metadata.category || "",
        tags: initialTemplate.metadata.tags?.join(", ") || "",
        difficulty: initialTemplate.metadata.difficulty || "",
      });

      // Show advanced options if template has values in those fields
      if (
        initialTemplate.description ||
        initialTemplate.targetAudience.prerequisites?.length ||
        initialTemplate.learningStyle.primary ||
        initialTemplate.metadata.industry
      ) {
        setShowAdvancedOptions(true);
      }
    }
  }, [initialTemplate, form]);

  const handlePreview = async () => {
    const values = form.getValues();
    setIsLoading(true);

    try {
      // This would be replaced with an actual API call in the implementation
      // For now, we'll just set a mock preview
      setGeneratedPlan({
        title: values.title,
        objectives: values.objectives.split("\n"),
        sections: [
          {
            title: "Preview Section",
            description: "This is a preview of how your plan would look.",
            topics: ["Topic 1", "Topic 2"],
            activities: [
              {
                type: "Exercise",
                description: "Sample activity",
                duration: "30 minutes",
              },
            ],
          },
        ],
      });
      setShowPreview(true);
    } catch {
      // Catch without binding the error variable
      toast({
        title: "Preview Error",
        description: "Failed to generate preview",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create training plans.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/training-plan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          objectives: values.objectives.split("\n").filter(Boolean),
          prerequisites: values.prerequisites?.split("\n").filter(Boolean),
          idealFor: values.idealFor?.split("\n").filter(Boolean),
          learningMethods:
            values.learningMethods?.split("\n").filter(Boolean) || [],
          requiredMaterials: values.requiredMaterials
            ?.split("\n")
            .filter(Boolean),
          optionalMaterials: values.optionalMaterials
            ?.split("\n")
            .filter(Boolean),
          providedMaterials: values.providedMaterials
            ?.split("\n")
            .filter(Boolean),
          certificationRequirements: values.certificationRequirements
            ?.split("\n")
            .filter(Boolean),
          tags: values.tags
            ?.split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          hoursPerSection: Number(values.hoursPerSection) || 2,
          weeksToComplete: Number(values.weeksToComplete) || 12,
          theoryRatio: Number(values.theoryRatio) || 50,
          practicalRatio: Number(values.practicalRatio) || 50,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate training plan");
      }

      await response.json();
      toast({
        title: "Success",
        description: "Training plan generated successfully.",
      });

      form.reset();
      onClearTemplate();
      setShowPreview(false);
      setGeneratedPlan(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate training plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Training Plan Creator</h1>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog/training-plan-creator-guide">
              <InfoIcon className="mr-2 h-4 w-4" />
              Guide
            </Link>
          </Button>
        </div>

        {/* Essential Fields Section */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Essential Information</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }: FieldRenderProps<"title">) => (
              <FormItem>
                <FormLabel>Title*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter training plan title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objectives"
            render={({ field }: FieldRenderProps<"objectives">) => (
              <FormItem>
                <FormLabel>Learning Objectives*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter learning objectives (one per line)..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter each objective on a new line
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudienceLevel"
            render={({ field }: FieldRenderProps<"targetAudienceLevel">) => (
              <FormItem>
                <FormLabel>Target Audience Level*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="beginner" />
                      </FormControl>
                      <FormLabel className="font-normal">Beginner</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="intermediate" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Intermediate
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="advanced" />
                      </FormControl>
                      <FormLabel className="font-normal">Advanced</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }: FieldRenderProps<"duration">) => (
              <FormItem>
                <FormLabel>Duration*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 12 weeks" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Advanced Options Section */}
        <Collapsible
          open={showAdvancedOptions}
          onOpenChange={setShowAdvancedOptions}
          className="border rounded-lg p-6 bg-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Advanced Options</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {showAdvancedOptions ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Hide Options
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show Options
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }: FieldRenderProps<"description">) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter training plan description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 inline-block ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Adding a detailed description helps the AI
                            understand the context and purpose of your training
                            plan.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }: FieldRenderProps<"prerequisites">) => (
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter prerequisites (one per line)..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 inline-block ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Specifying prerequisites helps tailor content to the
                            right knowledge level and ensures learners are
                            prepared.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningStylePrimary"
              render={({ field }: FieldRenderProps<"learningStylePrimary">) => (
                <FormItem>
                  <FormLabel>Learning Style Preferences</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select learning style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditory</SelectItem>
                      <SelectItem value="reading">Reading/Writing</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                      <SelectItem value="multimodal">Multimodal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 inline-block ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Indicating preferred learning styles helps create
                            activities that match how your audience learns best.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }: FieldRenderProps<"industry">) => (
                <FormItem>
                  <FormLabel>Industry/Domain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 inline-block ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Specifying your industry helps the AI generate more
                            relevant examples and terminology.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional optional fields can be added here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="requiredMaterials"
                render={({ field }: FieldRenderProps<"requiredMaterials">) => (
                  <FormItem>
                    <FormLabel>Materials Required</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter required materials (one per line)..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificationType"
                render={({ field }: FieldRenderProps<"certificationType">) => (
                  <FormItem>
                    <FormLabel>Certification Details</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select certification type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="certificate">
                          Certificate of Completion
                        </SelectItem>
                        <SelectItem value="professional">
                          Professional Certification
                        </SelectItem>
                        <SelectItem value="accredited">
                          Accredited Certification
                        </SelectItem>
                        <SelectItem value="digital-badge">
                          Digital Badge
                        </SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Preview Section */}
        {showPreview && generatedPlan && (
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{generatedPlan.title}</h3>
              <div>
                <h4 className="font-medium">Learning Objectives:</h4>
                <ul className="list-disc pl-5">
                  {generatedPlan.objectives.map((obj: string, i: number) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
              {generatedPlan.sections.map(
                (section: PreviewSection, i: number) => (
                  <div key={i} className="border-t pt-4">
                    <h4 className="font-medium">{section.title}</h4>
                    <p>{section.description}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onClearTemplate();
              setShowPreview(false);
              setGeneratedPlan(null);
            }}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            disabled={isLoading}
          >
            Preview Plan
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Training Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
