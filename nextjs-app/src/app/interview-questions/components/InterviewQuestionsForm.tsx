"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  industry: z.string().min(2, "Industry is required"),
  jobLevel: z.string().min(2, "Job level is required"),
  roleDescription: z
    .string()
    .min(20, "Please provide a detailed role description"),
  coreCompetencies: z
    .string()
    .min(10, "Please specify at least one core competency"),
  numberOfQuestions: z.string().min(1, "Number of questions is required"),
});

type FormValues = z.infer<typeof formSchema>;

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

export default function InterviewQuestionsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      jobLevel: "",
      roleDescription: "",
      coreCompetencies: "",
      numberOfQuestions: "5",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/interview-questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const result = await response.json();
      setGeneratedQuestions(result.questions);

      toast({
        title: "Questions Generated",
        description: `Successfully generated ${result.questions.length} interview questions.`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error",
        description:
          "Failed to generate interview questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="industry">Industry</FormLabel>
                <FormControl>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    aria-describedby="industry-description"
                    {...field}
                  />
                </FormControl>
                <FormDescription id="industry-description">
                  Specify the industry for targeted questions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="jobLevel">Job Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      id="jobLevel"
                      aria-describedby="jobLevel-description"
                    >
                      <SelectValue placeholder="Select job level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobLevels.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                        role="option"
                        aria-selected={field.value === level}
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription id="jobLevel-description">
                  Choose the seniority level of the position
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="roleDescription">
                  Role Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="roleDescription"
                    placeholder="Describe the role, responsibilities, and key requirements"
                    className="h-32"
                    aria-describedby="roleDescription-description"
                    {...field}
                  />
                </FormControl>
                <FormDescription id="roleDescription-description">
                  Provide details about the position to generate relevant
                  questions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coreCompetencies"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="coreCompetencies">
                  Core Competencies
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="coreCompetencies"
                    placeholder="List key competencies, separated by commas"
                    className="h-24"
                    aria-describedby="coreCompetencies-description"
                    {...field}
                  />
                </FormControl>
                <FormDescription id="coreCompetencies-description">
                  Specify competencies to evaluate (e.g., Leadership,
                  Communication, Problem Solving)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="numberOfQuestions">
                  Number of Questions
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      id="numberOfQuestions"
                      aria-describedby="numberOfQuestions-description"
                    >
                      <SelectValue placeholder="Select number of questions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[5, 10, 15, 20].map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        role="option"
                        aria-selected={field.value === num.toString()}
                      >
                        {num} questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription id="numberOfQuestions-description">
                  Choose how many questions to generate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Generate Questions"
            )}
          </Button>
        </form>
      </Form>

      {generatedQuestions.length > 0 && (
        <div className="mt-8" role="region" aria-label="Generated Questions">
          <h2 className="text-xl font-semibold mb-4">Generated Questions</h2>
          <div className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                role="article"
                aria-label={`Question ${index + 1}`}
              >
                <p className="font-medium text-gray-900">Q{index + 1}:</p>
                <p className="mt-1 text-gray-700">{question}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setGeneratedQuestions([])}
            variant="outline"
            className="mt-4"
            aria-label="Clear all generated questions"
          >
            Clear Questions
          </Button>
        </div>
      )}

      {isLoading && (
        <div
          className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
          role="status"
          aria-label="Generating questions"
        >
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg text-gray-600">
              Generating your interview questions...
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-500 text-center">
            This may take a few moments as we craft relevant questions based on
            your input.
          </p>
        </div>
      )}
    </div>
  );
}
