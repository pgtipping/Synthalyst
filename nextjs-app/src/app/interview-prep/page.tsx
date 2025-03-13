"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JobDetailsForm } from "./components/JobDetailsForm";
import {
  Briefcase,
  BookOpen,
  Mic,
  FileText,
  ArrowLeft,
  RefreshCw,
  Users,
  Library,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function InterviewPrep() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const fromApplyRight = searchParams.get("from") === "applyright";

  const [activeTab, setActiveTab] = useState("job-details");
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
  const [prepPlan, setPrepPlan] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [comingFromApplyRight, setComingFromApplyRight] = useState(false);
  const [dataImportTime, setDataImportTime] = useState<string | null>(null);

  // Check if user is premium based on session
  const checkPremiumStatus = () => {
    if (status === "authenticated" && session?.user) {
      // This is where you would check if the user has a premium subscription
      // For now, we'll just check if they're logged in
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

        if (importTimestamp) {
          setDataImportTime(importTimestamp);
        } else {
          // If no timestamp exists, create one now
          const now = new Date().toLocaleString();
          localStorage.setItem("applyRightDataImportTime", now);
          setDataImportTime(now);
        }

        if (fromApplyRight) {
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

  const clearImportedData = () => {
    localStorage.removeItem("applyRightJobDetails");
    localStorage.removeItem("applyRightResumeText");
    localStorage.removeItem("applyRightDataImportTime");
    setComingFromApplyRight(false);
    setDataImportTime(null);

    // Reset form to empty state
    setJobDetails({
      jobTitle: "",
      company: "",
      industry: "",
      jobLevel: "",
      description: "",
      requiredSkills: [],
      resumeText: "",
    });

    toast.success("Imported data cleared successfully");
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
        setPrepPlan(data.prepPlan);
        setGeneratedQuestions(data.questions || []);

        // Auto-advance to next tab
        setActiveTab("practice");

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

  const handleSignIn = () => {
    // Implement sign-in functionality
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Interview Prep", href: "/interview-prep", active: true },
          ]}
        />

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Interview Prep</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Prepare for your job interviews with AI-powered assistance tailored
            to your specific job application.
          </p>
          <div>
            {status === "authenticated" ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Premium Features Available
              </Badge>
            ) : (
              <Button variant="outline" onClick={handleSignIn} className="mt-2">
                Sign in for Premium Features
              </Button>
            )}
          </div>
        </div>

        {comingFromApplyRight && (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-800 text-lg">
                Data Imported from ApplyRight
              </CardTitle>
              <CardDescription className="text-green-700">
                Your job details have been imported from ApplyRight to help you
                prepare for interviews.
                {dataImportTime && (
                  <span className="block mt-1 text-xs">
                    Imported on: {dataImportTime}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearImportedData}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear Imported Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <Link href="/apply-right">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to ApplyRight
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger
              value="job-details"
              className="flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Job Details</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger
              value="mock-interview"
              className="flex items-center gap-2"
              disabled={!checkPremiumStatus()}
            >
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Mock Interview</span>
            </TabsTrigger>
            <TabsTrigger
              value="question-library"
              className="flex items-center gap-2"
              disabled={!checkPremiumStatus()}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Question Library</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="job-details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Application Details</CardTitle>
                <CardDescription>
                  Provide details about the job you&apos;re applying for to get
                  tailored interview preparation
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

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium">1. Enter Job Details</h2>
                    <p className="text-sm text-muted-foreground">
                      Provide information about the job you&apos;re applying for
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium">
                      2. Get Personalized Prep Plan
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Our AI creates a tailored interview preparation plan
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium">3. Practice with AI</h2>
                    <p className="text-sm text-muted-foreground">
                      Engage in mock interviews and get feedback on your
                      responses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-primary/10 rounded-full mb-4">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-medium">
                          Job-Specific Preparation
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                          Tailored interview questions and preparation based on
                          the job description
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-primary/10 rounded-full mb-4">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-medium">Mock Interviews</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                          Practice with our AI interviewer and receive feedback
                          on your responses
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-primary/10 rounded-full mb-4">
                          <Library className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-medium">Question Library</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                          Access thousands of interview questions across
                          different roles and industries
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {!checkPremiumStatus() && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-center">Free</CardTitle>
                        <CardDescription className="text-center">
                          Basic interview preparation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center text-3xl font-bold mb-4">
                          $0
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              5 practice questions per job
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Basic feedback on responses
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Job-specific preparation
                            </span>
                          </li>
                        </ul>
                        <h2 className="font-medium">Free Tier</h2>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={handleSignIn}>
                          Get Started
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="border-primary bg-primary/5 shadow-md relative">
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                      <CardHeader>
                        <CardTitle className="text-center">Premium</CardTitle>
                        <CardDescription className="text-center">
                          Advanced interview coaching
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center text-3xl font-bold mb-4">
                          $19<span className="text-sm font-normal">/month</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Unlimited practice questions
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Detailed feedback with improvement tips
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Mock interview simulations
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Interview strategy coaching
                            </span>
                          </li>
                        </ul>
                        <h2 className="font-medium">Premium Tier</h2>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Upgrade Now
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-center">
                          Career Bundle
                        </CardTitle>
                        <CardDescription className="text-center">
                          Complete career toolkit
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center text-3xl font-bold mb-4">
                          $29<span className="text-sm font-normal">/month</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              All Premium features
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Job Description Generator
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Training Plan Creator
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm">
                              Competency Framework Builder
                            </span>
                          </li>
                        </ul>
                        <h2 className="font-medium">Bundle Discount</h2>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          Learn More
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Practice Questions</CardTitle>
                <CardDescription>
                  Practice with these tailored interview questions based on your
                  job application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prepPlan ? (
                  <div className="space-y-6">
                    <div className="bg-muted p-4 rounded-md">
                      <h2 className="font-medium mb-2">
                        Your Interview Prep Plan:
                      </h2>
                      <p className="text-sm whitespace-pre-line">{prepPlan}</p>
                    </div>

                    <div className="space-y-4">
                      <h2 className="font-medium">Practice Questions:</h2>
                      {generatedQuestions.map((question, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <p className="font-medium mb-2">
                            Question {index + 1}:
                          </p>
                          <p className="text-sm">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Please submit your job details first to generate practice
                      questions.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("job-details")}
                      className="mt-4"
                    >
                      Go to Job Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mock-interview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mock Interview</CardTitle>
                <CardDescription>
                  Practice with an AI-powered mock interviewer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {checkPremiumStatus() ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Mock interview functionality will be implemented here
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Mock interviews are a premium feature. Please sign in or
                      upgrade to access.
                    </p>
                    <Button
                      variant="default"
                      onClick={handleSignIn}
                      className="mt-4"
                    >
                      Sign In for Premium Features
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="question-library" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question Library</CardTitle>
                <CardDescription>
                  Browse our comprehensive library of interview questions by job
                  type and industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                {checkPremiumStatus() ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Question library functionality will be implemented here
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      The question library is a premium feature. Please sign in
                      or upgrade to access.
                    </p>
                    <Button
                      variant="default"
                      onClick={handleSignIn}
                      className="mt-4"
                    >
                      Sign In for Premium Features
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
