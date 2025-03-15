"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { JobDetailsForm } from "../components/JobDetailsForm";
import { FileText, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InterviewPrepPDF from "@/components/InterviewPrepPDF";
import PDFRenderer from "@/components/PDFRenderer";
import FeedbackLayout from "@/components/FeedbackLayout";
import { useSession } from "next-auth/react";

// Add these interfaces at the top of the file after the imports:
interface Section {
  type: "timeline" | "phase" | "goal" | "objective" | "star" | "category";
  title: string;
  content?: string;
  items?: string[];
}

interface PrepPlan {
  sections: Section[];
}

export default function InterviewPrepPlan() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const fromApplyRight = searchParams.get("from") === "applyright";

  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    company: "",
    industry: "",
    jobLevel: "",
    description: "",
    requiredSkills: [] as string[],
    resumeText: "", // This will be populated if coming from ApplyRight
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [prepPlan, setPrepPlan] = useState<PrepPlan>({ sections: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [comingFromApplyRight, setComingFromApplyRight] = useState(false);

  // Check if user is premium based on session
  const checkPremiumStatus = () => {
    if (status === "authenticated" && session?.user) {
      // For testing purposes, all authenticated users are treated as premium
      return true;
    }
    return false;
  };

  // Check if coming from ApplyRight with data
  useEffect(() => {
    const storedJobDetails = localStorage.getItem("applyRightJobDetails");
    const storedResumeText = localStorage.getItem("applyRightResumeText");
    const importTimestamp = localStorage.getItem("applyRightDataImportTime");

    if (storedJobDetails && storedResumeText) {
      try {
        const parsedJobDetails = JSON.parse(storedJobDetails);
        setJobDetails((prev) => ({
          ...prev,
          jobTitle: parsedJobDetails.jobTitle || "",
          company: parsedJobDetails.company || "",
          industry: parsedJobDetails.industry || "",
          description: parsedJobDetails.description || "",
          requiredSkills: parsedJobDetails.requiredSkills || [],
          resumeText: storedResumeText,
        }));
        setComingFromApplyRight(true);

        if (importTimestamp && fromApplyRight) {
          toast.success("Job details imported from ApplyRight");
        }
      } catch (error) {
        console.error("Error parsing stored job details:", error);
      }
    }
  }, [fromApplyRight]);

  const handleJobDetailsSubmit = (details: typeof jobDetails) => {
    setJobDetails(details);
    generateInterviewPlan(details);
  };

  const generateInterviewPlan = async (details: typeof jobDetails) => {
    setIsProcessing(true);

    try {
      console.log("Starting interview plan generation");
      console.log("Job details:", JSON.stringify(details));
      console.log("Is premium user:", checkPremiumStatus());

      // Show a toast notification to inform the user that generation is in progress
      toast.info(
        "Generating your interview prep plan. This may take a moment...",
        {
          duration: 10000, // 10 seconds
          id: "generating-plan",
        }
      );

      // Set up a controller for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Call the API to generate interview prep plan with streaming response
      const response = await fetch("/api/interview-prep/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDetails: details,
          isPremiumUser: checkPremiumStatus(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if the request completes
      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);

        // If it's a timeout error, show a more user-friendly message
        if (response.status === 504) {
          toast.dismiss("generating-plan");
          toast.error(
            "The request took too long to process. Please try again with a simpler job description or fewer skills.",
            { duration: 6000 }
          );
          return;
        }

        throw new Error(
          `Failed to generate interview prep plan: ${response.status} ${errorText}`
        );
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      // Create a decoder to convert the stream chunks to text
      const decoder = new TextDecoder();
      let responseText = "";

      // Update UI with progress indicator
      setPrepPlan({
        sections: [
          {
            type: "timeline",
            title: "Generating your personalized interview prep plan...",
            content:
              "We're creating a high-quality preparation plan tailored to your job application. This may take a moment as we ensure the highest quality content.",
          },
        ],
      });
      setGeneratedQuestions(["Preparing your practice questions..."]);

      // Show a progress toast
      toast.dismiss("generating-plan");
      toast.info("Receiving your personalized interview prep plan...", {
        duration: 10000,
        id: "streaming-plan",
      });

      // Process the stream
      let lastUpdateTime = Date.now();
      const updateInterval = 300;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append to the accumulated response
        const chunk = decoder.decode(value, { stream: true });
        responseText = chunk; // Replace instead of append since we're getting complete JSON now

        // Only try to update the UI if we have a reasonable amount of new content
        // or if enough time has passed since the last update
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime > updateInterval) {
          try {
            // Parse the complete JSON response
            const parsedData = JSON.parse(responseText);

            // Update the UI with the data
            if (parsedData.prepPlan && parsedData.prepPlan.sections) {
              setPrepPlan(parsedData.prepPlan);

              // Update the toast message to show progress
              const sectionCount = parsedData.prepPlan.sections.length;
              toast.dismiss("streaming-plan");
              toast.info(`Received ${sectionCount} sections of your plan...`, {
                duration: 5000,
                id: "streaming-plan",
              });
            }

            if (parsedData.questions && Array.isArray(parsedData.questions)) {
              setGeneratedQuestions(parsedData.questions);
            }

            // Show fallback mode message if applicable
            if (parsedData.fallbackMode) {
              toast.dismiss("streaming-plan");
              toast.info("Using simplified content due to complexity.", {
                duration: 5000,
              });
            }

            // Update the last update time
            lastUpdateTime = currentTime;
          } catch (error) {
            // Log the error but don't throw - the stream might be incomplete
            console.log("Error parsing JSON chunk:", error);
          }
        }
      }

      // Final parsing of the complete response
      try {
        const data = JSON.parse(responseText);
        console.log("Complete API response data:", data);

        // Dismiss the streaming toast
        toast.dismiss("streaming-plan");
        toast.dismiss("generating-plan");

        if (data.success) {
          console.log("Plan generation successful");
          console.log(
            "Prep plan sections count:",
            data.prepPlan?.sections?.length || 0
          );
          console.log("Questions count:", data.questions?.length || 0);

          setPrepPlan(data.prepPlan as PrepPlan);
          setGeneratedQuestions(data.questions || []);

          // Show a success message
          toast.success("Your high-quality interview prep plan is ready!", {
            duration: 5000,
          });
        } else {
          console.error("API returned success: false", data.message);
          throw new Error(
            data.message || "Failed to generate interview prep plan"
          );
        }
      } catch (parseError) {
        console.error("Error parsing final JSON response:", parseError);
        throw new Error("Failed to parse the response from the server");
      }
    } catch (error) {
      console.error("Error generating interview prep plan:", error);
      // Log additional details about the error
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        // Handle abort error specifically
        if (error.name === "AbortError") {
          toast.dismiss("generating-plan");
          toast.error(
            "Request timed out. Please try with a simpler job description or fewer skills.",
            { duration: 6000 }
          );
          return;
        }
      } else {
        console.error("Unknown error type:", typeof error);
      }

      toast.dismiss("generating-plan");
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate interview prep plan. Please try again with simpler content.",
        { duration: 5000 }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FeedbackLayout appName="Interview Prep">
      <div className="container mx-auto px-4 py-8">
        <Toaster position="top-right" />

        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center space-x-1 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/interview-prep"
              className="text-muted-foreground hover:text-foreground"
            >
              Interview Prep
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Plan</span>
          </div>

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Interview Prep Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Generate a personalized interview preparation plan based on your
              job application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Job Application Details</CardTitle>
                  <CardDescription>
                    Provide details about the job you&apos;re applying for to
                    get tailored interview preparation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobDetailsForm
                    initialValues={jobDetails}
                    onSubmit={handleJobDetailsSubmit}
                    isProcessing={isProcessing}
                    comingFromApplyRight={comingFromApplyRight}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {prepPlan && prepPlan.sections && prepPlan.sections.length > 0 ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Interview Prep Plan</CardTitle>
                      <CardDescription>
                        Personalized preparation plan for {jobDetails.jobTitle}
                        {jobDetails.company ? ` at ${jobDetails.company}` : ""}
                      </CardDescription>
                    </div>
                    <div className="relative">
                      {process.env.NODE_ENV === "development" && (
                        <div className="absolute -top-10 right-0 text-xs text-muted-foreground">
                          <span className="hidden">
                            Debug:{" "}
                            {JSON.stringify({
                              hasPrepPlan: Boolean(prepPlan),
                              sectionsCount: prepPlan?.sections?.length || 0,
                              questionsCount: generatedQuestions?.length || 0,
                            })}
                          </span>
                        </div>
                      )}
                      <PDFRenderer
                        document={
                          <InterviewPrepPDF
                            jobTitle={jobDetails.jobTitle}
                            company={jobDetails.company}
                            industry={jobDetails.industry}
                            prepPlan={prepPlan || { sections: [] }}
                            questions={generatedQuestions || []}
                          />
                        }
                        fileName={`interview-prep-plan-${jobDetails.jobTitle
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.pdf`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            console.log("Export PDF button clicked");
                            console.log("PrepPlan data:", {
                              hasPrepPlan: Boolean(prepPlan),
                              sectionsCount: prepPlan?.sections?.length || 0,
                              questionsCount: generatedQuestions?.length || 0,
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                          <span>Export PDF</span>
                        </Button>
                      </PDFRenderer>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {prepPlan.sections.map((section, index) => {
                          const sectionClass =
                            {
                              timeline: "bg-blue-50 border-l-4 border-blue-500",
                              phase: "bg-gray-50 border-l-4 border-gray-500",
                              goal: "bg-green-50 border-l-4 border-green-500",
                              objective:
                                "bg-yellow-50 border-l-4 border-yellow-500",
                              star: "bg-purple-50 border-l-4 border-purple-500",
                              category: "bg-red-50 border-l-4 border-red-500",
                            }[section.type] || "bg-white";

                          // Function to clean any markdown syntax that might be present
                          const cleanMarkdown = (text: string): string => {
                            if (!text) return "";

                            // Remove markdown formatting
                            return text
                              .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold markdown
                              .replace(/\*([^*]+?)\*/g, "$1"); // Remove italic markdown
                          };

                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-md ${sectionClass}`}
                            >
                              <h3 className="font-semibold text-lg mb-2">
                                {section.title}
                              </h3>
                              {section.content && (
                                <p className="text-gray-700">
                                  {cleanMarkdown(section.content)}
                                </p>
                              )}
                              {section.items && (
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                  {section.items.map((item, itemIndex) => (
                                    <li
                                      key={itemIndex}
                                      className="text-gray-700 pl-2"
                                    >
                                      {cleanMarkdown(item)}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-4">
                        <h2 className="font-medium text-xl">
                          Practice Questions:
                        </h2>
                        {generatedQuestions && generatedQuestions.length > 0 ? (
                          generatedQuestions.map((question, index) => {
                            // Clean any markdown formatting from the question
                            const cleanedQuestion = question
                              .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold markdown
                              .replace(/\*([^*]+?)\*/g, "$1"); // Remove italic markdown

                            return (
                              <div
                                key={index}
                                className="border rounded-md p-5 hover:bg-muted/50 transition-colors shadow-sm"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary"
                                  >
                                    Question {index + 1}
                                  </Badge>
                                  {index < 3 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm space-y-2">
                                  <p>{cleanedQuestion}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center p-8 text-muted-foreground">
                            No practice questions generated yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Prep Plan</CardTitle>
                    <CardDescription>
                      Fill out the job details form to generate your
                      personalized interview preparation plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground max-w-md">
                      Enter your job application details to receive a tailored
                      interview preparation plan with practice questions.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </FeedbackLayout>
  );
}
