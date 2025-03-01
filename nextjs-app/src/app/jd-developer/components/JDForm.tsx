"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { JobDescription } from "@/types/jobDescription";
import { Plus, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type RequiredSkill = {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
};

type SkillInput = RequiredSkill;

const convertToRequiredSkill = (skill: SkillInput): RequiredSkill => {
  if (typeof skill === "string") {
    return {
      name: skill,
      level: "intermediate",
      description: "",
    };
  }
  return skill;
};

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().min(1, "Employment type is required"),
  jobDescription: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  requirements: z
    .object({
      required: z
        .array(
          z.object({
            name: z.string(),
            level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
            description: z.string(),
          })
        )
        .default([]),
      preferred: z
        .array(
          z.object({
            name: z.string(),
            level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
            description: z.string(),
          })
        )
        .default([]),
    })
    .default({ required: [], preferred: [] }),
  qualifications: z
    .object({
      education: z.array(z.string()).default([]),
      experience: z.array(z.string()).default([]),
      certifications: z.array(z.string()).default([]),
    })
    .default({
      education: [],
      experience: [],
      certifications: [],
    }),
  salary: z
    .object({
      min: z.number().min(0, "Minimum salary must be at least 0").optional(),
      max: z.number().min(0, "Maximum salary must be at least 0").optional(),
      type: z.enum(["hourly", "monthly", "yearly"]).default("yearly"),
      currency: z.string().default("USD"),
    })
    .default({
      min: 0,
      max: 0,
      type: "yearly",
      currency: "USD",
    })
    .optional(),
  industry: z.string().min(1, "Industry is required"),
  level: z.string().min(1, "Level is required"),
  isTemplate: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface JDFormProps {
  initialTemplate: JobDescription | null;
  onClearTemplate: () => void;
}

interface ArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

function ArrayInput({
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: ArrayInputProps) {
  const handleAdd = () => {
    onChange([...value, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_: string, i: number) => i !== index));
  };

  const handleChange = (index: number, newValue: string) => {
    onChange(value.map((v: string, i: number) => (i === index ? newValue : v)));
  };

  return (
    <div className="space-y-2">
      {value.map((item: string, index: number) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAdd}
        disabled={disabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function JDForm({
  initialTemplate,
  onClearTemplate,
}: JDFormProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: initialTemplate?.title || "",
      department: initialTemplate?.department || "",
      location: initialTemplate?.location || "",
      employmentType: initialTemplate?.employmentType || "",
      jobDescription: initialTemplate?.description || "",
      responsibilities: initialTemplate?.responsibilities || [],
      requirements: {
        required: Array.isArray(initialTemplate?.requirements?.required)
          ? initialTemplate.requirements.required.map(convertToRequiredSkill)
          : [{ name: "", level: "intermediate", description: "" }],
        preferred:
          Array.isArray(initialTemplate?.requirements?.preferred) &&
          initialTemplate?.requirements?.preferred.length > 0
            ? initialTemplate.requirements.preferred.map(convertToRequiredSkill)
            : [{ name: "", level: "intermediate", description: "" }],
      },
      qualifications: {
        education: initialTemplate?.qualifications?.education || [],
        experience: initialTemplate?.qualifications?.experience || [],
        certifications: initialTemplate?.qualifications?.certifications || [],
      },
      salary: {
        min: initialTemplate?.salary?.range?.min || 0,
        max: initialTemplate?.salary?.range?.max || 0,
        type: initialTemplate?.salary?.type || "yearly",
        currency: initialTemplate?.salary?.currency || "USD",
      },
      industry: initialTemplate?.metadata?.industry || "",
      level: initialTemplate?.metadata?.level || "",
      isTemplate: false,
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "requirements.required",
  });

  const {
    fields: preferredSkillFields,
    append: appendPreferredSkill,
    remove: removePreferredSkill,
  } = useFieldArray({
    control: form.control,
    name: "requirements.preferred",
  });

  useEffect(() => {
    if (initialTemplate) {
      form.reset({
        jobTitle: initialTemplate.title,
        department: initialTemplate.department || "",
        location: initialTemplate.location || "",
        employmentType: initialTemplate.employmentType || "",
        jobDescription: initialTemplate.description,
        responsibilities: initialTemplate.responsibilities,
        requirements: {
          required: Array.isArray(initialTemplate.requirements.required)
            ? initialTemplate.requirements.required.map(convertToRequiredSkill)
            : [{ name: "", level: "intermediate", description: "" }],
          preferred:
            Array.isArray(initialTemplate.requirements.preferred) &&
            initialTemplate.requirements.preferred.length > 0
              ? initialTemplate.requirements.preferred.map(
                  convertToRequiredSkill
                )
              : [{ name: "", level: "intermediate", description: "" }],
        },
        qualifications: {
          education: initialTemplate.qualifications.education || [],
          experience: initialTemplate.qualifications.experience || [],
          certifications: initialTemplate.qualifications.certifications || [],
        },
        salary: {
          min: initialTemplate.salary?.range?.min || 0,
          max: initialTemplate.salary?.range?.max || 0,
          type: initialTemplate.salary?.type || "yearly",
          currency: initialTemplate.salary?.currency || "USD",
        },
        industry: initialTemplate.metadata.industry || "",
        level: initialTemplate.metadata.level || "",
        isTemplate: true,
      });
    }
  }, [initialTemplate, form]);

  // Add example templates on mount
  useEffect(() => {
    const createExampleTemplates = async () => {
      if (!session?.user?.email) return;

      // Check if templates have been created before
      const hasCreatedTemplates = localStorage.getItem("hasCreatedTemplates");
      if (hasCreatedTemplates === "true") {
        return; // Don't create templates if they've been created before
      }

      // First check if templates exist
      try {
        const response = await fetch("/api/jd-developer/templates");
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();

        // If templates already exist, don't create more
        if (data.templates && data.templates.length > 0) {
          // Mark that templates have been created
          localStorage.setItem("hasCreatedTemplates", "true");
          return;
        }
      } catch (error) {
        console.error("Error checking existing templates:", error);
        return;
      }

      const templates = [
        {
          title: "Senior Software Engineer",
          department: "Engineering",
          location: "Remote",
          employmentType: "full-time",
          description:
            "We are seeking an experienced Senior Software Engineer to join our dynamic engineering team. The ideal candidate will lead technical initiatives, mentor junior developers, and drive architectural decisions while maintaining high code quality standards.",
          responsibilities: [
            "Lead the design and implementation of complex software systems",
            "Mentor junior developers and conduct code reviews",
            "Collaborate with product managers to define technical requirements",
            "Drive architectural decisions and best practices",
            "Participate in system design discussions and technical planning",
            "Optimize application performance and scalability",
            "Implement security best practices and maintain code quality",
          ],
          requirements: {
            required: [
              {
                name: "Software Development",
                level: "expert",
                description:
                  "5+ years of professional software development experience",
              },
              {
                name: "Programming Languages",
                level: "advanced",
                description:
                  "Strong proficiency in Python, JavaScript/TypeScript, Java, or Go",
              },
              {
                name: "Web Frameworks",
                level: "advanced",
                description:
                  "Experience with modern web frameworks (React, Next.js, etc.)",
              },
              {
                name: "Software Design",
                level: "expert",
                description:
                  "Strong understanding of software design patterns and principles",
              },
              {
                name: "Cloud Platforms",
                level: "advanced",
                description: "Experience with AWS, GCP, or Azure",
              },
            ],
            preferred: [
              "Experience with microservices architecture",
              "Familiarity with DevOps practices and tools",
              "Experience with Kubernetes and container orchestration",
              "Knowledge of machine learning frameworks",
              "Open source contributions",
            ],
          },
          qualifications: {
            education: [
              "Bachelors degree in Computer Science or related field",
              "Masters degree preferred",
            ],
            experience: [
              "5+ years of professional software development",
              "2+ years of technical leadership experience",
              "Experience in agile development environments",
            ],
            certifications: [
              "Relevant cloud certifications (AWS, GCP, Azure)",
              "Security certifications a plus",
            ],
          },
          salary: {
            range: {
              min: 130000,
              max: 180000,
            },
            type: "yearly",
            currency: "USD",
          },
          company: {
            name: "TechCorp",
            description:
              "A leading technology company focused on building innovative solutions that transform industries.",
            culture: [
              "Innovation-driven environment",
              "Collaborative and inclusive workplace",
              "Focus on continuous learning",
              "Work-life balance",
            ],
          },
          metadata: {
            industry: "technology",
            level: "senior",
            isTemplate: true,
          },
        },
        {
          title: "Product Marketing Manager",
          department: "Marketing",
          location: "Hybrid",
          employmentType: "full-time",
          description:
            "We're looking for a strategic Product Marketing Manager to drive our product marketing initiatives. The ideal candidate will bridge the gap between product development and customer needs, creating compelling narratives that drive product adoption and market success.",
          responsibilities: [
            "Develop and execute product marketing strategies",
            "Create compelling product positioning and messaging",
            "Conduct market research and competitive analysis",
            "Work closely with product teams to understand features and benefits",
            "Create sales enablement materials and product documentation",
            "Lead product launches and go-to-market strategies",
            "Track and analyze product marketing metrics",
          ],
          requirements: {
            required: [
              {
                name: "Product Marketing",
                level: "advanced",
                description: "4+ years of product marketing experience",
              },
              {
                name: "Strategic Thinking",
                level: "expert",
                description:
                  "Strong analytical and strategic thinking abilities",
              },
              {
                name: "Communication",
                level: "expert",
                description:
                  "Excellent written and verbal communication skills",
              },
              {
                name: "Market Research",
                level: "advanced",
                description: "Experience with market research and analysis",
              },
              {
                name: "Project Management",
                level: "advanced",
                description:
                  "Project management expertise and data-driven decision making",
              },
            ],
            preferred: [
              "Experience in SaaS or B2B marketing",
              "Knowledge of marketing automation tools",
              "Experience with product launch campaigns",
              "Understanding of technical products",
              "Content creation and storytelling abilities",
            ],
          },
          qualifications: {
            education: [
              "Bachelors degree in Marketing, Business, or related field",
              "MBA preferred",
            ],
            experience: [
              "4+ years in product marketing",
              "Experience with go-to-market strategies",
              "Track record of successful product launches",
            ],
            certifications: [
              "Product Marketing Alliance certification",
              "Digital Marketing certifications",
            ],
          },
          salary: {
            range: {
              min: 100000,
              max: 150000,
            },
            type: "yearly",
            currency: "USD",
          },
          company: {
            name: "MarketPro",
            description:
              "A fast-growing company that helps businesses transform their digital presence and market reach.",
            culture: [
              "Results-driven environment",
              "Cross-functional collaboration",
              "Creative freedom",
              "Data-informed decision making",
            ],
          },
          metadata: {
            industry: "marketing",
            level: "mid",
            isTemplate: true,
          },
        },
        {
          title: "UX/UI Designer",
          department: "Design",
          location: "Remote",
          employmentType: "full-time",
          description:
            "We are seeking a talented UX/UI Designer to create beautiful, intuitive interfaces that delight our users. The ideal candidate will combine creativity with user-centered design principles to deliver exceptional digital experiences.",
          responsibilities: [
            "Create user-centered designs by understanding business requirements",
            "Develop wireframes and prototypes",
            "Conduct user research and usability testing",
            "Create user flows and journey maps",
            "Design responsive interfaces for web and mobile",
            "Collaborate with developers on implementation",
            "Maintain and evolve our design system",
          ],
          requirements: {
            required: [
              {
                name: "UX/UI Design",
                level: "advanced",
                description: "3+ years of UX/UI design experience",
              },
              {
                name: "Design Tools",
                level: "expert",
                description: "Proficiency in Figma, Sketch, or similar tools",
              },
              {
                name: "Portfolio",
                level: "advanced",
                description: "Strong portfolio demonstrating UI and UX work",
              },
              {
                name: "User Research",
                level: "advanced",
                description: "Experience with user research and testing",
              },
              {
                name: "Design Systems",
                level: "intermediate",
                description:
                  "Knowledge of design systems and accessibility standards",
              },
            ],
            preferred: [
              "Experience with motion design",
              "Basic understanding of HTML/CSS",
              "Experience with design tokens",
              "Knowledge of agile methodologies",
              "Experience with mobile app design",
            ],
          },
          qualifications: {
            education: [
              "Bachelors degree in Design, HCI, or related field",
              "UX certification programs",
            ],
            experience: [
              "3+ years in UX/UI design",
              "Experience with enterprise applications",
              "Portfolio of shipped products",
            ],
            certifications: [
              "Google UX Design Certificate",
              "Interaction Design Foundation Certification",
            ],
          },
          salary: {
            range: {
              min: 90000,
              max: 130000,
            },
            type: "yearly",
            currency: "USD",
          },
          company: {
            name: "DesignFlex",
            description:
              "A design-led technology company creating next-generation digital experiences.",
            culture: [
              "Design-first mindset",
              "User-centered approach",
              "Collaborative environment",
              "Continuous feedback and iteration",
            ],
          },
          metadata: {
            industry: "design",
            level: "mid",
            isTemplate: true,
          },
        },
      ];

      for (const template of templates) {
        try {
          const response = await fetch("/api/jd-developer/templates", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(template),
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Unknown error" }));
            console.error(
              `Failed to create template: ${template.title}`,
              errorData
            );
          }
        } catch (error) {
          console.error(`Error creating template ${template.title}:`, error);
        }
      }

      // Mark that templates have been created
      localStorage.setItem("hasCreatedTemplates", "true");
    };

    createExampleTemplates();
  }, [session]);

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create job descriptions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/jd-developer/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.jobTitle,
          department: values.department,
          location: values.location,
          employmentType: values.employmentType,
          description: values.jobDescription || "",
          responsibilities: values.responsibilities || [],
          requirements: {
            required: values.requirements.required || [],
            preferred: values.requirements.preferred || [],
          },
          qualifications: {
            education: values.qualifications.education || [],
            experience: values.qualifications.experience || [],
            certifications: values.qualifications.certifications || [],
          },
          industry: values.industry,
          level: values.level,
          salary: values.salary
            ? {
                range: {
                  min: values.salary.min || 0,
                  max: values.salary.max || 0,
                },
                type: values.salary.type,
                currency: values.salary.currency,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to generate job description"
        );
      }

      const { generatedContent } = await response.json();

      // Update form with generated content
      form.reset({
        jobTitle: generatedContent.title,
        department: generatedContent.department || "",
        location: generatedContent.location || "",
        employmentType: generatedContent.employmentType || "",
        jobDescription: generatedContent.description,
        responsibilities: generatedContent.responsibilities,
        requirements: {
          required: generatedContent.requirements.required,
          preferred:
            Array.isArray(generatedContent.requirements.preferred) &&
            generatedContent.requirements.preferred.length > 0
              ? generatedContent.requirements.preferred
              : [{ name: "", level: "intermediate" as const, description: "" }],
        },
        qualifications: {
          education: generatedContent.qualifications.education,
          experience: generatedContent.qualifications.experience,
          certifications: generatedContent.qualifications.certifications,
        },
        salary: generatedContent.salary
          ? {
              min: generatedContent.salary.range?.min || 0,
              max: generatedContent.salary.range?.max || 0,
              type: generatedContent.salary.type || "yearly",
              currency: generatedContent.salary.currency || "USD",
            }
          : {
              min: 0,
              max: 0,
              type: "yearly" as const,
              currency: "USD",
            },
        industry: generatedContent.metadata.industry || "",
        level: generatedContent.metadata.level || "",
        isTemplate: false,
      });

      toast({
        title: "Success",
        description: "Job description generated successfully!",
      });
    } catch (error) {
      console.error("Error generating job description:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsTemplate = async (values: FormValues) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save templates.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingTemplate(true);

    try {
      // Prepare data in the format expected by our updated API
      const templateData = {
        name: values.jobTitle,
        type: values.industry,
        level: values.level,
        content: JSON.stringify({
          title: values.jobTitle,
          department: values.department,
          location: values.location,
          employmentType: values.employmentType,
          description: values.jobDescription || "",
          responsibilities: values.responsibilities || [],
          requirements: {
            required:
              values.requirements.required.map((skill) => ({
                name: skill.name,
                level: skill.level,
                description: skill.description,
              })) || [],
            preferred: values.requirements.preferred
              ? values.requirements.preferred.map((skill) => {
                  // Handle both string and object formats
                  if (typeof skill === "string") {
                    return skill;
                  }
                  return {
                    name: skill.name,
                    level: skill.level,
                    description: skill.description,
                  };
                })
              : [],
          },
          qualifications: {
            education: values.qualifications.education || [],
            experience: values.qualifications.experience || [],
            certifications: values.qualifications.certifications || [],
          },
          salary: values.salary
            ? {
                range: {
                  min: values.salary.min || 0,
                  max: values.salary.max || 0,
                },
                type: values.salary.type,
                currency: values.salary.currency,
              }
            : {
                range: {
                  min: 0,
                  max: 0,
                },
                type: "yearly",
                currency: "USD",
              },
          metadata: {
            industry: values.industry,
            level: values.level,
            isTemplate: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
        requirements: {
          required: values.requirements.required || [],
          preferred: values.requirements.preferred || [],
        },
      };

      console.log(
        "Sending template data:",
        JSON.stringify(templateData, null, 2)
      );

      const response = await fetch("/api/jd-developer/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch((e) => {
          console.error("Error parsing error response:", e);
          return { error: "Unknown error occurred" };
        });
        console.error("Template save error:", errorData);
        throw new Error(errorData.error || "Failed to save template");
      }

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      // Switch to templates tab
      window.dispatchEvent(
        new CustomEvent("switchTab", { detail: "templates" })
      );
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleSaveJobDescription = async (values: FormValues) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save job descriptions.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingTemplate(true);
    try {
      const jobData = {
        title: values.jobTitle,
        department: values.department,
        location: values.location,
        employmentType: values.employmentType,
        description: values.jobDescription || "",
        responsibilities: values.responsibilities || [],
        requirements: {
          required: values.requirements.required || [],
          preferred: values.requirements.preferred || [],
        },
        qualifications: {
          education: values.qualifications.education || [],
          experience: values.qualifications.experience || [],
          certifications: values.qualifications.certifications || [],
        },
        salary: values.salary
          ? {
              range: {
                min: values.salary.min || 0,
                max: values.salary.max || 0,
              },
              type: values.salary.type as "hourly" | "monthly" | "yearly",
              currency: values.salary.currency,
            }
          : {
              range: {
                min: 0,
                max: 0,
              },
              type: "yearly",
              currency: "USD",
            },
        metadata: {
          industry: values.industry,
          level: values.level,
          isTemplate: false,
        },
      };

      const response = await fetch("/api/jd-developer/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save job description");
      }

      toast({
        title: "Success",
        description: "Job description saved successfully!",
      });

      // Switch to saved tab
      window.dispatchEvent(new CustomEvent("switchTab", { detail: "saved" }));
    } catch (error) {
      console.error("Error saving job description:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    {...field}
                    disabled={isLoading || isSavingTemplate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Engineering"
                    {...field}
                    disabled={isLoading || isSavingTemplate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Remote, New York, NY"
                    {...field}
                    disabled={isLoading || isSavingTemplate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("employmentType");
                    }}
                    defaultValue={field.value}
                    disabled={isLoading || isSavingTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
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
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("industry");
                    }}
                    defaultValue={field.value}
                    disabled={isLoading || isSavingTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Level</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("level");
                    }}
                    defaultValue={field.value}
                    disabled={isLoading || isSavingTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a detailed description of the role..."
                  className="min-h-[100px]"
                  {...field}
                  disabled={isLoading || isSavingTemplate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities (Optional)</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter a responsibility"
                  error={form.formState.errors.responsibilities?.message}
                  disabled={isLoading || isSavingTemplate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Required Skills (Optional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendSkill({
                  name: "",
                  level: "intermediate",
                  description: "",
                })
              }
              disabled={isLoading || isSavingTemplate}
            >
              Add Skill
            </Button>
          </div>

          {skillFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <FormField
                control={form.control}
                name={`requirements.required.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Skill name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`requirements.required.${index}.level`}
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`requirements.required.${index}.description`}
                render={({ field }) => (
                  <FormItem className="w-60">
                    <FormControl>
                      <Textarea {...field} placeholder="Skill description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSkill(index)}
                disabled={isLoading || isSavingTemplate}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Preferred Skills (Optional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendPreferredSkill({
                  name: "",
                  level: "intermediate",
                  description: "",
                })
              }
              disabled={isLoading || isSavingTemplate}
            >
              Add Preferred Skill
            </Button>
          </div>

          {preferredSkillFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <FormField
                control={form.control}
                name={`requirements.preferred.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Skill name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`requirements.preferred.${index}.level`}
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`requirements.preferred.${index}.description`}
                render={({ field }) => (
                  <FormItem className="w-60">
                    <FormControl>
                      <Textarea {...field} placeholder="Skill description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removePreferredSkill(index)}
                disabled={isLoading || isSavingTemplate}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="qualifications.education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Educational Requirements (Optional)</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter required degree, certification, or educational qualification"
                  error={
                    form.formState.errors?.qualifications?.education?.message
                  }
                  disabled={isLoading || isSavingTemplate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qualifications.experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Experience (Optional)</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter required work experience or professional background"
                  error={
                    form.formState.errors?.qualifications?.experience?.message
                  }
                  disabled={isLoading || isSavingTemplate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qualifications.certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Certifications (Optional)</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter required certification"
                  error={
                    form.formState.errors?.qualifications?.certifications
                      ?.message
                  }
                  disabled={isLoading || isSavingTemplate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="salary.min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 50000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading || isSavingTemplate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary.max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 80000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading || isSavingTemplate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Type (Optional)</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading || isSavingTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary.currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., USD"
                    {...field}
                    disabled={isLoading || isSavingTemplate}
                  />
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
              // Clear all form fields including select fields
              form.reset({
                jobTitle: "",
                department: "",
                location: "",
                employmentType: "",
                jobDescription: "",
                responsibilities: [],
                requirements: {
                  required: [
                    { name: "", level: "intermediate", description: "" },
                  ],
                  preferred: [
                    { name: "", level: "intermediate", description: "" },
                  ],
                },
                qualifications: {
                  education: [],
                  experience: [],
                  certifications: [],
                },
                salary: {
                  min: 0,
                  max: 0,
                  type: "yearly",
                  currency: "USD",
                },
                industry: "",
                level: "",
                isTemplate: false,
              });

              // Force reset of select fields
              setTimeout(() => {
                form.setValue("employmentType", "");
                form.setValue("industry", "");
                form.setValue("level", "");
                form.setValue("salary.type", "yearly");
                form.setValue("salary.currency", "USD");
              }, 0);

              onClearTemplate();
            }}
            disabled={isLoading || isSavingTemplate}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSaveAsTemplate(form.getValues())}
            disabled={isLoading || isSavingTemplate}
          >
            {isSavingTemplate ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as Template"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // Save the current form state
              const values = form.getValues();
              handleSaveJobDescription(values);
            }}
            disabled={isLoading || isSavingTemplate}
          >
            Save Job Description
          </Button>
          <Button type="submit" disabled={isLoading || isSavingTemplate}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Job Description"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
