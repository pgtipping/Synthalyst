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
} from "lucide-react";

export default function ApplyRight() {
  const [activeTab, setActiveTab] = useState("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [transformedResume, setTransformedResume] = useState<string | null>(
    null
  );
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
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
      // This would be replaced with actual API call
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock transformed resume
      setTransformedResume(
        "This is a placeholder for the transformed resume content."
      );

      // Mock cover letter
      setCoverLetter(
        "This is a placeholder for the generated cover letter content."
      );

      // Auto-advance to next tab
      setActiveTab("results");
    } catch (error) {
      console.error("Error transforming resume:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to toggle premium status (for demo purposes)
  const togglePremiumStatus = () => {
    setIsPremiumUser(!isPremiumUser);
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

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold">
              Apply<span className="text-primary">Right</span>
            </h1>
            <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Beta
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your resume instantly with AI-powered enhancements and
            targeted optimizations.
          </p>
        </div>

        <HowItWorks />

        <div className="bg-muted/30 rounded-xl p-6 md:p-8 shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
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
                Job Details
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

            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                  <CardDescription>
                    Upload your current resume to get started. We support PDF
                    and DOCX formats.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handleResumeUpload} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="job-description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Job Description (Optional)</CardTitle>
                  <CardDescription>
                    For better results, paste the job description you&apos;re
                    applying for.
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
                    Skip <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="transform" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transform Your Resume</CardTitle>
                  <CardDescription>
                    Our AI will enhance your resume with professional language
                    and targeted optimizations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Ready to transform:</h3>
                    <p className="text-sm text-muted-foreground">
                      {resumeFile?.name}{" "}
                      {jobDescription
                        ? "with job description"
                        : "without job description"}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleTransformResume}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Transform Resume <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {!isPremiumUser && (
                      <p className="text-xs text-muted-foreground text-center">
                        Free tier: 1 transformation per resume
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("job-description")}
                    className="w-full"
                  >
                    Back
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Enhanced Resume</CardTitle>
                    <CardDescription>
                      Your resume with professional improvements and
                      optimizations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResumePreview content={transformedResume} />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Changes</Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                    <CardDescription>
                      Generated cover letter based on your resume and job
                      description.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CoverLetterPreview content={coverLetter} />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" disabled={!isPremiumUser}>
                      Customize
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("transform")}
                  className="mr-4"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    setResumeFile(null);
                    setJobDescription("");
                    setTransformedResume(null);
                    setCoverLetter(null);
                    setActiveTab("upload");
                  }}
                >
                  Start New
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <FeaturesSection />

        <PricingSection isPremiumUser={isPremiumUser} />

        {/* Demo button to toggle premium status - would be removed in production */}
        <div className="text-center">
          <Button variant="outline" onClick={togglePremiumStatus}>
            {isPremiumUser
              ? "Switch to Free Tier (Demo)"
              : "Switch to Premium Tier (Demo)"}
          </Button>
        </div>
      </div>
    </div>
  );
}
