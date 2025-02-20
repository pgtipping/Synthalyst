"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { JobDescription } from "@/types/jobDescription";
import { Plus, X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string(),
  description: z.string().min(1, "Job description is required"),
  responsibilities: z
    .array(z.string())
    .min(1, "At least one responsibility is required"),
  requiredSkills: z
    .array(z.string())
    .min(1, "At least one required skill is required"),
  preferredSkills: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  experience: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  salaryType: z.enum(["hourly", "monthly", "yearly"]),
  currency: z.string().optional(),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  companyCulture: z.array(z.string()).optional(),
  industry: z.string(),
  level: z.string(),
});

interface JDFormProps {
  initialTemplate: JobDescription | null;
  onClearTemplate: () => void;
}

interface ArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
}

function ArrayInput({ value, onChange, placeholder, error }: ArrayInputProps) {
  const handleAdd = () => {
    onChange([...value, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, newValue: string) => {
    onChange(value.map((v, i) => (i === index ? newValue : v)));
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      description: "",
      responsibilities: [],
      requiredSkills: [],
      preferredSkills: [],
      education: [],
      experience: [],
      certifications: [],
      benefits: [],
      salaryMin: "",
      salaryMax: "",
      salaryType: "yearly",
      currency: "USD",
      companyName: "",
      companyDescription: "",
      companyCulture: [],
      industry: "",
      level: "",
    },
  });

  useEffect(() => {
    if (initialTemplate) {
      form.reset({
        title: initialTemplate.title,
        department: initialTemplate.department || "",
        location: initialTemplate.location || "",
        employmentType: initialTemplate.employmentType || "full-time",
        description: initialTemplate.description,
        responsibilities: initialTemplate.responsibilities
          .join("\n")
          .split("\n"),
        requiredSkills: initialTemplate.requirements.required
          .join("\n")
          .split("\n"),
        preferredSkills:
          initialTemplate.requirements.preferred?.join("\n").split("\n") || [],
        education:
          initialTemplate.qualifications.education?.join("\n").split("\n") ||
          [],
        experience:
          initialTemplate.qualifications.experience?.join("\n").split("\n") ||
          [],
        certifications:
          initialTemplate.qualifications.certifications
            ?.join("\n")
            .split("\n") || [],
        benefits: initialTemplate.benefits?.join("\n").split("\n") || [],
        salaryMin: initialTemplate.salary?.range?.min.toString() || "",
        salaryMax: initialTemplate.salary?.range?.max.toString() || "",
        salaryType: initialTemplate.salary?.type || "yearly",
        currency: initialTemplate.salary?.currency || "USD",
        companyName: initialTemplate.company?.name || "",
        companyDescription: initialTemplate.company?.description || "",
        companyCulture:
          initialTemplate.company?.culture?.join("\n").split("\n") || [],
        industry: initialTemplate.metadata.industry || "",
        level: initialTemplate.metadata.level || "",
      });
    }
  }, [initialTemplate, form]);

  // Add example templates on mount
  useEffect(() => {
    const createExampleTemplates = async () => {
      if (!session?.user?.email) return;

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
          requiredSkills: [
            "5+ years of professional software development experience",
            "Strong proficiency in one or more: Python, JavaScript/TypeScript, Java, or Go",
            "Experience with modern web frameworks (React, Next.js, etc.)",
            "Strong understanding of software design patterns and principles",
            "Experience with cloud platforms (AWS, GCP, or Azure)",
            "Excellent problem-solving and debugging skills",
            "Strong knowledge of database systems and data modeling",
          ],
          preferredSkills: [
            "Experience with microservices architecture",
            "Familiarity with DevOps practices and tools",
            "Experience with Kubernetes and container orchestration",
            "Knowledge of machine learning frameworks",
            "Open source contributions",
          ],
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
          benefits: [
            "Competitive salary and equity package",
            "Health, dental, and vision insurance",
            "Flexible work hours and remote work options",
            "Professional development budget",
            "Regular team events and activities",
          ],
          salaryMin: "130000",
          salaryMax: "180000",
          salaryType: "yearly",
          currency: "USD",
          companyName: "TechCorp",
          companyDescription:
            "A leading technology company focused on building innovative solutions that transform industries.",
          companyCulture: [
            "Innovation-driven environment",
            "Collaborative and inclusive workplace",
            "Focus on continuous learning",
            "Work-life balance",
          ],
          industry: "technology",
          level: "senior",
          isTemplate: true,
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
          requiredSkills: [
            "4+ years of product marketing experience",
            "Strong analytical and strategic thinking abilities",
            "Excellent written and verbal communication skills",
            "Experience with market research and analysis",
            "Project management expertise",
            "Data-driven decision making",
            "Strong presentation skills",
          ],
          preferredSkills: [
            "Experience in SaaS or B2B marketing",
            "Knowledge of marketing automation tools",
            "Experience with product launch campaigns",
            "Understanding of technical products",
            "Content creation and storytelling abilities",
          ],
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
          benefits: [
            "Competitive base salary plus bonus",
            "Comprehensive healthcare coverage",
            "401(k) matching",
            "Professional development opportunities",
            "Flexible work arrangements",
          ],
          salaryMin: "100000",
          salaryMax: "150000",
          salaryType: "yearly",
          currency: "USD",
          companyName: "MarketPro",
          companyDescription:
            "A fast-growing company that helps businesses transform their digital presence and market reach.",
          companyCulture: [
            "Results-driven environment",
            "Cross-functional collaboration",
            "Creative freedom",
            "Data-informed decision making",
          ],
          industry: "marketing",
          level: "mid",
          isTemplate: true,
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
          requiredSkills: [
            "3+ years of UX/UI design experience",
            "Proficiency in Figma, Sketch, or similar tools",
            "Strong portfolio demonstrating UI and UX work",
            "Experience with user research and testing",
            "Understanding of accessibility standards",
            "Knowledge of design systems",
            "Excellent visual design skills",
          ],
          preferredSkills: [
            "Experience with motion design",
            "Basic understanding of HTML/CSS",
            "Experience with design tokens",
            "Knowledge of agile methodologies",
            "Experience with mobile app design",
          ],
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
          benefits: [
            "Competitive salary",
            "Health and wellness benefits",
            "Design tool subscriptions",
            "Conference and learning budget",
            "Remote work setup allowance",
          ],
          salaryMin: "90000",
          salaryMax: "130000",
          salaryType: "yearly",
          currency: "USD",
          companyName: "DesignFlex",
          companyDescription:
            "A design-led technology company creating next-generation digital experiences.",
          companyCulture: [
            "Design-first mindset",
            "User-centered approach",
            "Collaborative environment",
            "Continuous feedback and iteration",
          ],
          industry: "design",
          level: "mid",
          isTemplate: true,
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
            console.error(`Failed to create template: ${template.title}`);
          }
        } catch (error) {
          console.error(`Error creating template ${template.title}:`, error);
        }
      }
    };

    createExampleTemplates();
  }, [session]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate job description");
      }

      // Success response
      toast({
        title: "Success",
        description: "Job description generated successfully.",
      });

      // Reset form and template
      form.reset();
      onClearTemplate();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate job description",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsTemplate = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create templates.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingTemplate(true);
    try {
      const response = await fetch("/api/jd-developer/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          isTemplate: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      toast({
        title: "Success",
        description: "Template saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save template",
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    {...field}
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
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Engineering" {...field} />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., New York, NY" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
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
            name="industry"
            render={({ field }) => (
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
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position level" />
                    </SelectTrigger>
                  </FormControl>
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
                  placeholder="Enter a detailed description of the role..."
                  className="min-h-[100px]"
                  {...field}
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
              <FormLabel>Responsibilities</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter a responsibility"
                  error={form.formState.errors.responsibilities?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="requiredSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Skills</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter a required skill"
                    error={form.formState.errors.requiredSkills?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Skills</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter a preferred skill"
                    error={form.formState.errors.preferredSkills?.message}
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
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Requirements</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter an education requirement"
                    error={form.formState.errors.education?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Requirements</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter an experience requirement"
                    error={form.formState.errors.experience?.message}
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
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Certifications</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter a certification"
                    error={form.formState.errors.certifications?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter a benefit"
                    error={form.formState.errors.benefits?.message}
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
            name="companyCulture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Culture</FormLabel>
                <FormControl>
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter a culture point"
                    error={form.formState.errors.companyCulture?.message}
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
              form.reset();
              onClearTemplate();
            }}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSaveAsTemplate(form.getValues())}
            disabled={isSavingTemplate}
          >
            {isSavingTemplate ? "Saving..." : "Save as Template"}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Job Description"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
