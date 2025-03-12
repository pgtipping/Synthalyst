"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { FileUpload } from "./components/FileUpload";
import { JobDescription } from "./components/JobDescription";
import { ResumePreview } from "./components/ResumePreview";
import { CoverLetterPreview } from "./components/CoverLetterPreview";
import { PricingSection } from "./components/PricingSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorks } from "./components/HowItWorks";
import {
  ArrowRight,
  Upload,
  FileText,
  FileCheck,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function ApplyRight() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [transformedResume, setTransformedResume] = useState<string | null>(
    null
  );
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [changesMade, setChangesMade] = useState<string[]>([]);
  const [keywordsExtracted, setKeywordsExtracted] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is premium based on session
  const checkPremiumStatus = () => {
    if (status === "authenticated" && session?.user) {
      // This is where you would check if the user has a premium subscription
      // For now, we'll just check if they're logged in
      return true;
    }
    return false;
  };

  const handleResumeUpload = (file: File, text: string) => {
    setResumeFile(file);
    setResumeText(text);
    // Auto-advance to next tab
    setActiveTab("job-description");
  };

  const handleJobDescriptionSubmit = (description: string) => {
    setJobDescription(description);
    // Auto-advance to next tab
    setActiveTab("transform");
  };

  const handleTransformResume = async () => {
    setIsProcessing(true);

    try {
      // Call the API to transform the resume
      const response = await fetch("/api/apply-right/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          isPremiumUser: checkPremiumStatus(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to transform resume");
      }

      const data = await response.json();

      if (data.success) {
        setTransformedResume(data.transformedResume);
        setCoverLetter(data.coverLetter);
        setChangesMade(data.changesMade || []);
        setKeywordsExtracted(data.keywordsExtracted || []);

        // Auto-advance to next tab
        setActiveTab("results");

        // Show a different message if we're in fallback mode
        if (data.fallbackMode) {
          toast.warning(
            "AI service is currently unavailable. Using basic transformation instead."
          );
        } else {
          toast.success("Resume transformed successfully!");
        }
      } else {
        throw new Error(data.message || "Failed to transform resume");
      }
    } catch (error) {
      console.error("Error transforming resume:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to transform resume"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResume = () => {
    if (!transformedResume) return;

    // Create a blob from the transformed resume
    const blob = new Blob([transformedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "transformed_resume.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Resume downloaded successfully!");
  };

  const handleDownloadCoverLetter = () => {
    if (!coverLetter) return;

    // Create a blob from the cover letter
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Cover letter downloaded successfully!");
  };

  const handleSignIn = () => {
    window.location.href = "/api/auth/signin";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "ApplyRight", href: "/apply-right", active: true },
          ]}
        />

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">ApplyRight</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your resume with professional enhancements and targeted
            optimizations for your dream job.
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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="job-description"
              disabled={!resumeFile || isProcessing}
            >
              <FileText className="h-4 w-4 mr-2" />
              Job Description
            </TabsTrigger>
            <TabsTrigger
              value="transform"
              disabled={!resumeFile || isProcessing}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Transform
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!transformedResume || isProcessing}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your current resume in PDF, DOC, DOCX, or TXT format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleResumeUpload} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Max file size: 5MB
                </p>
                <Button
                  onClick={() => setActiveTab("job-description")}
                  disabled={!resumeFile}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="job-description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Job Description</CardTitle>
                <CardDescription>
                  Paste the job description to tailor your resume (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JobDescription
                  value={jobDescription}
                  onChange={setJobDescription}
                  onSubmit={handleJobDescriptionSubmit}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("upload")}
                >
                  Back
                </Button>
                <Button onClick={() => setActiveTab("transform")}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="transform" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transform Your Resume</CardTitle>
                <CardDescription>
                  Enhance your resume with professional improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Ready to transform:</h3>
                  <p className="text-sm">
                    {resumeFile?.name}{" "}
                    <Badge variant="outline" className="ml-2">
                      {resumeFile?.type.split("/")[1].toUpperCase()}
                    </Badge>
                  </p>
                  {jobDescription && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Job description:</p>
                      <p className="text-xs text-muted-foreground">
                        {jobDescription.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <Button
                    size="lg"
                    onClick={handleTransformResume}
                    disabled={isProcessing || !resumeFile}
                    className="w-full max-w-xs"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Transform Resume
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This may take a few moments
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("job-description")}
                  disabled={isProcessing}
                >
                  Back
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Transformed Resume
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadResume}
                      disabled={!transformedResume}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResumePreview content={transformedResume || ""} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Cover Letter
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadCoverLetter}
                      disabled={!coverLetter}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CoverLetterPreview content={coverLetter || ""} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Improvements Made</CardTitle>
                <CardDescription>
                  Key enhancements applied to your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Changes Made:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {changesMade.map((change, index) => (
                        <li key={index} className="text-sm">
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {keywordsExtracted.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">
                        Keywords from Job Description:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywordsExtracted.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("transform")}
                >
                  Back
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-12 mt-12">
          <HowItWorks />
          <FeaturesSection />
          <PricingSection
            isPremium={status === "authenticated"}
            onUpgrade={handleSignIn}
          />
        </div>
      </div>
    </div>
  );
}
