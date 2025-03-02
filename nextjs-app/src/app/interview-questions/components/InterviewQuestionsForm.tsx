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
import { useToast } from "@/lib/toast-migration";
import { Loader2, HelpCircle, Award, CheckSquare, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  includeEvaluationTips: z.boolean().default(false),
  includeScoringRubric: z.boolean().default(false),
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
  const [evaluationTips, setEvaluationTips] = useState<string[]>([]);
  const [scoringRubric, setScoringRubric] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("questions");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      jobLevel: "",
      roleDescription: "",
      coreCompetencies: "",
      numberOfQuestions: "5",
      includeEvaluationTips: false,
      includeScoringRubric: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setGeneratedQuestions([]);
    setEvaluationTips([]);
    setScoringRubric("");
    setActiveTab("questions");

    try {
      const response = await fetch("/api/interview-questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error cases
        if (response.status === 503) {
          toast({
            title: "Service Unavailable",
            description:
              errorData.message ||
              "The interview questions service is temporarily unavailable. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(
          errorData.error || errorData.message || "Failed to generate questions"
        );
      }

      const result = await response.json();

      // Handle questions
      if (result.questions && Array.isArray(result.questions)) {
        setGeneratedQuestions(result.questions);
      } else {
        setGeneratedQuestions([]);
      }

      // Handle evaluation tips
      if (
        data.includeEvaluationTips &&
        result.evaluationTips &&
        Array.isArray(result.evaluationTips)
      ) {
        setEvaluationTips(result.evaluationTips);
      } else {
        setEvaluationTips([]);
      }

      // Handle scoring rubric
      if (data.includeScoringRubric && result.scoringRubric) {
        setScoringRubric(result.scoringRubric);
      } else {
        setScoringRubric("");
      }

      // Set the active tab based on what was generated
      if (generatedQuestions.length > 0) {
        setActiveTab("questions");
      } else if (evaluationTips.length > 0) {
        setActiveTab("tips");
      } else if (scoringRubric) {
        setActiveTab("rubric");
      }

      toast({
        title: "Content Generated",
        description: `Successfully generated ${
          result.questions.length
        } interview questions${
          data.includeEvaluationTips && result.evaluationTips?.length > 0
            ? ", evaluation tips"
            : ""
        }${
          data.includeScoringRubric && result.scoringRubric
            ? " and scoring rubric"
            : ""
        }.`,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate interview content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setGeneratedQuestions([]);
    setEvaluationTips([]);
    setScoringRubric("");
    setActiveTab("questions");
  };

  const hasResults = generatedQuestions.length > 0;
  const hasTips = evaluationTips.length > 0;
  const hasRubric = scoringRubric.length > 0;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Generate Interview Questions
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectItem key={level} value={level}>
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
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <SelectItem key={num} value={num.toString()}>
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

              <FormField
                control={form.control}
                name="includeEvaluationTips"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="includeEvaluationTips"
                        aria-describedby="includeEvaluationTips-description"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="includeEvaluationTips">
                        Include Evaluation Tips
                      </FormLabel>
                      <FormDescription id="includeEvaluationTips-description">
                        Generate tips on how to evaluate responses
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeScoringRubric"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="includeScoringRubric"
                        aria-describedby="includeScoringRubric-description"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="includeScoringRubric">
                        Include Scoring Rubric
                      </FormLabel>
                      <FormDescription id="includeScoringRubric-description">
                        Generate a rubric for scoring responses
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                "Generate Interview Content"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {isLoading && (
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Generating your interview content...
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                This may take a few moments as we craft relevant questions and
                resources based on your input.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {hasResults && !isLoading && (
        <div
          className="bg-white rounded-lg shadow-md"
          role="region"
          aria-label="Generated Content"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Interview Resources
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-gray-500 hover:text-red-500"
              aria-label="Clear all generated content"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-4">
              <TabsList className="w-full grid grid-cols-1 md:grid-cols-3">
                <TabsTrigger
                  value="questions"
                  className="flex items-center justify-center"
                  disabled={!hasResults}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Questions
                </TabsTrigger>
                <TabsTrigger
                  value="tips"
                  className="flex items-center justify-center"
                  disabled={!hasTips}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Evaluation Tips
                </TabsTrigger>
                <TabsTrigger
                  value="rubric"
                  className="flex items-center justify-center"
                  disabled={!hasRubric}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Scoring Rubric
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="questions" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Questions</CardTitle>
                  <CardDescription>
                    Use these questions to evaluate candidates for the position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {generatedQuestions.length > 0 ? (
                        generatedQuestions.map((question, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            role="article"
                            aria-label={`Question ${index + 1}`}
                          >
                            <p className="font-semibold text-gray-900 text-lg">
                              Q{index + 1}:
                            </p>
                            <p className="mt-2 text-gray-700">{question}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No questions were generated. Please try again.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Tips</CardTitle>
                  <CardDescription>
                    Guidelines for evaluating candidate responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {evaluationTips.length > 0 ? (
                        evaluationTips.map((tip, index) => (
                          <div
                            key={index}
                            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                            role="article"
                            aria-label={`Evaluation Tip ${index + 1}`}
                          >
                            <p className="font-semibold text-blue-900 text-lg">
                              Tip {index + 1}:
                            </p>
                            <p className="mt-2 text-blue-700">{tip}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No evaluation tips were generated. Enable the
                            &quot;Include Evaluation Tips&quot; option to
                            generate tips.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rubric" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scoring Rubric</CardTitle>
                  <CardDescription>
                    Framework for scoring candidate responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {scoringRubric ? (
                      <div
                        className="prose max-w-none text-green-800 bg-green-50 p-6 rounded-lg border border-green-200"
                        dangerouslySetInnerHTML={{ __html: scoringRubric }}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No scoring rubric was generated. Enable the
                          &quot;Include Scoring Rubric&quot; option to generate
                          a rubric.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
