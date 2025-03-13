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
  Download,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InterviewPrepPDF from "@/components/InterviewPrepPDF";
import PDFRenderer from "@/components/PDFRenderer";

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

// Custom Markdown renderer function
function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null;

  // Process the text in steps
  let formattedText = text;

  // First, clean up any extra whitespace and normalize line breaks
  formattedText = formattedText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");

  // Handle bold text (before other replacements to avoid conflicts)
  formattedText = formattedText.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Handle italic text (before other replacements to avoid conflicts)
  formattedText = formattedText.replace(/\*([^*]+?)\*/g, "<em>$1</em>");

  // Handle main title (usually starts with # or has all caps INTERVIEW PREPARATION PLAN)
  formattedText = formattedText.replace(
    /^# (.+)$/m,
    '<h1 class="text-2xl font-bold text-primary mb-4 mt-2 pb-2 border-b border-primary/20">$1</h1>'
  );
  formattedText = formattedText.replace(
    /^(INTERVIEW PREPARATION PLAN.+)$/m,
    '<h1 class="text-2xl font-bold text-primary mb-4 mt-2 pb-2 border-b border-primary/20">$1</h1>'
  );

  // Handle section headers (## headers)
  formattedText = formattedText.replace(
    /^## (.+)$/gm,
    '<h2 class="text-xl font-bold text-primary/90 mt-6 mb-3 pb-1 border-b border-primary/10">$1</h2>'
  );

  // Handle subsection headers (### headers)
  formattedText = formattedText.replace(
    /^### (.+)$/gm,
    '<h3 class="text-lg font-semibold text-primary/80 mt-4 mb-2">$1</h3>'
  );

  // Handle OVERARCHING GOAL: section - ensure it starts on a new line
  formattedText = formattedText.replace(
    /(\S+\s*)OVERARCHING GOAL:/g,
    '$1<br /><span class="text-md font-bold text-primary/90 mt-4 mb-2 inline-block">OVERARCHING GOAL:</span>'
  );
  // Also handle when it appears at the beginning of a line
  formattedText = formattedText.replace(
    /^OVERARCHING GOAL:/gm,
    '<span class="text-md font-bold text-primary/90 mt-4 mb-2 inline-block">OVERARCHING GOAL:</span>'
  );

  // Handle TIMELINE: section - ensure it starts on a new line (adjust font size from text-lg to text-md)
  formattedText = formattedText.replace(
    /(\S+\s*)TIMELINE:/g,
    '$1<br /><span class="text-md font-bold text-primary/90 mt-4 mb-2 inline-block">TIMELINE:</span>'
  );
  // Also handle when it appears at the beginning of a line
  formattedText = formattedText.replace(
    /^TIMELINE:/gm,
    '<span class="text-md font-bold text-primary/90 mt-4 mb-2 inline-block">TIMELINE:</span>'
  );

  // Handle PHASE sections - ensure they start on a new line (adjust font size from text-lg to text-md)
  formattedText = formattedText.replace(
    /(\S+\s*)PHASE (\d+):/g,
    '$1<br /><span class="text-md font-bold text-primary/90 mt-4 mb-2 inline-block">PHASE $2:</span>'
  );
  // Also handle when it appears at the beginning of a line
  formattedText = formattedText.replace(
    /^PHASE (\d+):/gm,
    '<span class="text-md font-bold text-primary/90 mt-4 mb-2 inline-block">PHASE $1:</span>'
  );

  // Handle Objective: section
  formattedText = formattedText.replace(
    /Objective:/g,
    '<span class="font-bold text-primary/90 mt-3 mb-1 inline-block">Objective:</span>'
  );

  // Handle special formatting for STAR format template and similar patterns
  // Replace lines starting with "* " (asterisk followed by space) with styled headings
  formattedText = formattedText.replace(
    /^\* ([^:]+):/gm,
    '<h3 class="text-md font-bold my-2 text-primary/90 border-l-4 border-primary/30 pl-2 py-1">$1:</h3>'
  );

  // Handle "Action:" and similar special headings
  formattedText = formattedText.replace(
    /^(Action|Situation|Task|Result):/gm,
    '<h3 class="text-md font-bold my-2 text-primary/90 border-l-4 border-primary/30 pl-2 py-1">$1:</h3>'
  );

  // Handle "Step 2: Anticipate Common Interview Questions:" format
  formattedText = formattedText.replace(
    /^\* (Step \d+: .+?):/gm,
    '<h3 class="text-md font-bold my-3 text-primary/90 bg-primary/5 p-2 rounded-md">$1:</h3>'
  );

  // Also handle without the asterisk
  formattedText = formattedText.replace(
    /^(Step \d+: .+?):/gm,
    '<h3 class="text-md font-bold my-3 text-primary/90 bg-primary/5 p-2 rounded-md">$1:</h3>'
  );

  // Handle specific categories like "Leadership:", "HR Operations:", etc.
  formattedText = formattedText.replace(
    /^\* (Leadership|HR Operations|Compensation & Benefits|Technical Skills|Communication|Problem Solving|Cultural Fit):/gm,
    '<h3 class="text-md font-semibold my-2 text-primary/80 border-l-4 border-primary/30 pl-2 py-1">$1:</h3>'
  );

  // Also handle without the asterisk
  formattedText = formattedText.replace(
    /^(Leadership|HR Operations|Compensation & Benefits|Technical Skills|Communication|Problem Solving|Cultural Fit):/gm,
    '<h3 class="text-md font-semibold my-2 text-primary/80 border-l-4 border-primary/30 pl-2 py-1">$1:</h3>'
  );

  // Handle specific sections like "Website Deep Dive:", "About Us/Mission/Values:", etc.
  formattedText = formattedText.replace(
    /^(Website Deep Dive|About Us\/Mission\/Values|Products\/Services|News\/Blog\/Press Releases|Team\/Leadership):/gm,
    '<h3 class="text-md font-bold my-2 text-primary/90 border-l-4 border-primary/30 pl-2 py-1">$1:</h3>'
  );

  // Handle phase headers like "Research Phase", "Practice Phase", etc.
  formattedText = formattedText.replace(
    /^(Research Phase|Practice Phase|Day Before Preparation|Interview Day|Follow-up)( \(\d+-\d+ days before\))?:/gm,
    '<h3 class="text-lg font-bold my-3 text-primary/90 bg-primary/5 p-2 rounded-md">$1$2:</h3>'
  );

  // Replace lists (- item or * item) but not lines that we've already processed as headings
  formattedText = formattedText.replace(
    /^(?!<h3)[\*\-] (.+)$/gm,
    '<li class="ml-4 list-disc mb-2">$1</li>'
  );

  // Replace numbered lists (1. item)
  formattedText = formattedText.replace(
    /^\d+\. (.+)$/gm,
    '<li class="ml-4 list-decimal mb-2">$1</li>'
  );

  // Group list items
  formattedText = formattedText.replace(/<\/li>\n<li/g, "</li><li");

  // Wrap unordered lists
  formattedText = formattedText.replace(
    /<li class="ml-4 list-disc mb-2">(.+?)(<\/li>)+/g,
    '<ul class="my-3 space-y-1 pl-2">$&</ul>'
  );

  // Wrap ordered lists
  formattedText = formattedText.replace(
    /<li class="ml-4 list-decimal mb-2">(.+?)(<\/li>)+/g,
    '<ol class="my-3 space-y-1 pl-2">$&</ol>'
  );

  // Replace paragraphs (lines with content)
  // But not lines that we've already processed
  formattedText = formattedText.replace(
    /^(?!<h|<li|<ul|<ol|<p|<span|<br)([^<\n].+)$/gm,
    '<p class="my-2">$1</p>'
  );

  // Fix any double paragraph tags
  formattedText = formattedText.replace(
    /<p class="my-2">(.+?)<\/p>\n/g,
    '<p class="my-2">$1</p>'
  );

  // Add a container with proper styling
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div dangerouslySetInnerHTML={{ __html: formattedText }} />
      </div>
    </div>
  );
}

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
  const [prepPlan, setPrepPlan] = useState<PrepPlan>({ sections: [] });
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
        setPrepPlan(data.prepPlan as PrepPlan);
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
                    <div className="bg-muted p-6 rounded-md shadow-sm border">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium text-lg flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Your Interview Prep Plan
                        </h2>
                        <PDFRenderer
                          document={
                            <InterviewPrepPDF
                              jobTitle={jobDetails.jobTitle}
                              company={jobDetails.company}
                              industry={jobDetails.industry}
                              prepPlan={prepPlan}
                              questions={generatedQuestions}
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
                      </div>
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
                                  {section.content}
                                </p>
                              )}
                              {section.items && (
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                  {section.items.map((item, itemIndex) => (
                                    <li
                                      key={itemIndex}
                                      className="text-gray-700 pl-2"
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="font-medium">Practice Questions:</h2>
                      {generatedQuestions.map((question, index) => (
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
                            <SimpleMarkdown text={question} />
                          </div>
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
