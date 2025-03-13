"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  jobLevel: z.string().optional().default(""),
  description: z.string().optional().default(""),
  requiredSkills: z
    .string()
    .optional()
    .default("")
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : []
    ),
});

type FormValues = z.infer<typeof formSchema>;

// Define the type for the form submission
interface JobDetails {
  jobTitle: string;
  company: string;
  industry: string;
  jobLevel: string;
  description: string;
  requiredSkills: string[];
  resumeText: string;
}

const jobLevels = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "Executive",
];

interface JobDetailsFormProps {
  initialValues: JobDetails;
  onSubmit: (values: JobDetails) => void;
  isProcessing: boolean;
  comingFromApplyRight: boolean;
}

export function JobDetailsForm({
  initialValues,
  onSubmit,
  isProcessing,
  comingFromApplyRight,
}: JobDetailsFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: initialValues.jobTitle || "",
      company: initialValues.company || "",
      industry: initialValues.industry || "",
      jobLevel: initialValues.jobLevel || "",
      description: initialValues.description || "",
      requiredSkills: initialValues.requiredSkills.join(", ") || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Transform the form values to match the expected format
    const formattedValues: JobDetails = {
      jobTitle: values.jobTitle,
      company: values.company || "",
      industry: values.industry || "",
      jobLevel: values.jobLevel || "",
      description: values.description || "",
      requiredSkills: Array.isArray(values.requiredSkills)
        ? values.requiredSkills
        : ((typeof values.requiredSkills === "string"
            ? values.requiredSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : []) as string[]),
      resumeText: initialValues.resumeText || "",
    };

    console.log("Submitting form with values:", formattedValues);
    onSubmit(formattedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {comingFromApplyRight && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p className="text-green-700 text-sm">
              Job details have been imported from ApplyRight. You can edit them
              if needed.
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title *</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormDescription>
                The title of the position you&apos;re applying for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormDescription>
                The company you&apos;re applying to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Technology" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Copy and paste the job description to get more tailored
                preparation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Node.js" {...field} />
              </FormControl>
              <FormDescription>
                Enter skills separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isProcessing} className="w-full">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            "Generate Interview Prep Plan"
          )}
        </Button>
      </form>
    </Form>
  );
}
