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
      // Call the API to generate interview prep plan
      const response = await fetch("/api/interview-prep/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDetails: details,
          isPremiumUser: checkPremiumStatus(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate interview prep plan");
      }

      const data = await response.json();

      if (data.success) {
        setPrepPlan(data.prepPlan as PrepPlan);
        setGeneratedQuestions(data.questions || []);
        toast.success("Interview prep plan generated successfully!");
      } else {
        throw new Error(
          data.message || "Failed to generate interview prep plan"
        );
      }
    } catch (error) {
      console.error("Error generating interview prep plan:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate interview prep plan"
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
                      >
                        <Download className="h-4 w-4" />
                        <span>Export PDF</span>
                      </Button>
                    </PDFRenderer>
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
