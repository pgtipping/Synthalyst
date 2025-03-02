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
import { useToast } from "@/lib/toast-migration";
import type { TrainingPlan } from "@/types/trainingPlan";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  objectives: z.string().min(1, "Learning objectives are required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  difficulty: z.string().min(1, "Difficulty level is required"),
  duration: z.string().min(1, "Duration is required"),
  prerequisites: z.string().optional(),
  idealFor: z.string().optional(),
  learningStylePrimary: z.string().min(1, "Primary learning style is required"),
  learningMethods: z.string().min(1, "Learning methods are required"),
  industry: z.string().min(1, "Industry is required"),
  category: z.string().min(1, "Category is required"),
  hoursPerSection: z.coerce
    .number()
    .min(1, "Hours per section must be at least 1"),
  weeksToComplete: z.coerce
    .number()
    .min(1, "Weeks to complete must be at least 1"),
  tags: z.string().optional(),
  theoryRatio: z.coerce
    .number()
    .min(0, "Theory ratio must be at least 0")
    .max(100, "Theory ratio must be at most 100"),
  practicalRatio: z.coerce
    .number()
    .min(0, "Practical ratio must be at least 0")
    .max(100, "Practical ratio must be at most 100"),
  requiredMaterials: z.string().optional(),
  optionalMaterials: z.string().optional(),
  providedMaterials: z.string().optional(),
  certificationType: z.string().min(1, "Certification type is required"),
  certificationRequirements: z.string().optional(),
  certificationValidity: z.string().optional(),
});

interface FormValues extends z.infer<typeof formSchema> {
  title: string;
  description: string;
  objectives: string;
  targetAudienceLevel: string;
  difficulty: string;
  duration: string;
  prerequisites?: string;
  idealFor?: string;
  learningStylePrimary: string;
  learningMethods: string;
  industry: string;
  category: string;
  hoursPerSection: number;
  weeksToComplete: number;
  tags?: string;
  theoryRatio: number;
  practicalRatio: number;
  requiredMaterials?: string;
  optionalMaterials?: string;
  providedMaterials?: string;
  certificationType: string;
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

export default function PlanForm({
  initialTemplate,
  onClearTemplate,
}: PlanFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      objectives: "",
      targetAudienceLevel: "beginner",
      difficulty: "easy",
      duration: "",
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
    }
  }, [initialTemplate, form]);

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
          learningMethods: values.learningMethods.split("\n").filter(Boolean),
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
          hoursPerSection: Number(values.hoursPerSection),
          weeksToComplete: Number(values.weeksToComplete),
          theoryRatio: Number(values.theoryRatio),
          practicalRatio: Number(values.practicalRatio),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }: FieldRenderProps<"title">) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter training plan title" {...field} />
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
                <FormLabel>Total Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 12 weeks" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectives"
          render={({ field }: FieldRenderProps<"objectives">) => (
            <FormItem>
              <FormLabel>Learning Objectives</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="targetAudienceLevel"
            render={({ field }: FieldRenderProps<"targetAudienceLevel">) => (
              <FormItem>
                <FormLabel>Target Audience Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }: FieldRenderProps<"difficulty">) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                    <SelectItem value="intensive">Intensive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idealFor"
            render={({ field }: FieldRenderProps<"idealFor">) => (
              <FormItem>
                <FormLabel>Ideal For</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter target audience descriptions (one per line)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="learningStylePrimary"
            render={({ field }: FieldRenderProps<"learningStylePrimary">) => (
              <FormItem>
                <FormLabel>Primary Learning Style</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="learningMethods"
            render={({ field }: FieldRenderProps<"learningMethods">) => (
              <FormItem>
                <FormLabel>Learning Methods</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter learning methods (one per line)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }: FieldRenderProps<"industry">) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
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
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }: FieldRenderProps<"category">) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technical">Technical Skills</SelectItem>
                    <SelectItem value="soft-skills">Soft Skills</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="professional">
                      Professional Development
                    </SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="hoursPerSection"
            render={({ field }: FieldRenderProps<"hoursPerSection">) => (
              <FormItem>
                <FormLabel>Hours per Section</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weeksToComplete"
            render={({ field }: FieldRenderProps<"weeksToComplete">) => (
              <FormItem>
                <FormLabel>Weeks to Complete</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }: FieldRenderProps<"tags">) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter tags (comma-separated)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Separate tags with commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="theoryRatio"
            render={({ field }: FieldRenderProps<"theoryRatio">) => (
              <FormItem>
                <FormLabel>Theory Ratio (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="practicalRatio"
            render={({ field }: FieldRenderProps<"practicalRatio">) => (
              <FormItem>
                <FormLabel>Practical Ratio (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="requiredMaterials"
            render={({ field }: FieldRenderProps<"requiredMaterials">) => (
              <FormItem>
                <FormLabel>Required Materials</FormLabel>
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
            name="optionalMaterials"
            render={({ field }: FieldRenderProps<"optionalMaterials">) => (
              <FormItem>
                <FormLabel>Optional Materials</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter optional materials (one per line)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="providedMaterials"
            render={({ field }: FieldRenderProps<"providedMaterials">) => (
              <FormItem>
                <FormLabel>Provided Materials</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter provided materials (one per line)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="certificationType"
            render={({ field }: FieldRenderProps<"certificationType">) => (
              <FormItem>
                <FormLabel>Certification Type</FormLabel>
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
                    <SelectItem value="digital-badge">Digital Badge</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificationRequirements"
            render={({
              field,
            }: FieldRenderProps<"certificationRequirements">) => (
              <FormItem>
                <FormLabel>Certification Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter certification requirements (one per line)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificationValidity"
            render={({ field }: FieldRenderProps<"certificationValidity">) => (
              <FormItem>
                <FormLabel>Certification Validity Period</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onClearTemplate();
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Training Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
