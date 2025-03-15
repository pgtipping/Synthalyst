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
import { toast } from "sonner";
import { FileUpload } from "./components/FileUpload";
import { JobDescription } from "./components/JobDescription";
import ResumePreview from "./components/ResumePreview";
import CoverLetterPreview from "./components/CoverLetterPreview";
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
  Briefcase,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import FeedbackLayout from "@/components/FeedbackLayout";

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
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

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

  const handleJobDescriptionSubmit = (
    description: string,
    title: string,
    companyName: string
  ) => {
    setJobDescription(description);
    setJobTitle(title);
    setCompany(companyName);
    // Auto-advance to next tab
    setActiveTab("transform");
  };

  const handleTransformResume = async () => {
    setIsProcessing(true);

    try {
      // Show a toast notification to inform the user that transformation is in progress
      toast.info("Transforming your resume. This may take a moment...", {
        duration: 10000, // 10 seconds
        id: "transforming-resume",
      });

      // Set up a controller for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout (increased from 30s)

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
          bypassCache: false, // Only bypass cache if explicitly requested
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if the request completes

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error transforming resume:", errorText);

        // If it's a timeout error, show a more user-friendly message
        if (response.status === 504) {
          toast.dismiss("transforming-resume");
          toast.error(
            "The request took too long to process. Please try again with a shorter resume or job description.",
            { duration: 6000 }
          );
          setIsProcessing(false);
          return;
        }

        throw new Error(errorText || "Failed to transform resume");
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
      setTransformedResume("Transforming your resume...");
      setChangesMade(["Analyzing your resume and job description..."]);
      setKeywordsExtracted(["Identifying key skills and qualifications..."]);

      // Show a progress toast
      toast.dismiss("transforming-resume");
      toast.info("Receiving your transformed resume...", {
        duration: 10000,
        id: "streaming-resume",
      });

      // Process the stream
      let lastUpdateTime = Date.now();
      const updateInterval = 300; // Update UI every 300ms at most
      let chunkCount = 0;
      let lastValidData = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkCount++;

        // Decode the chunk and append to the accumulated response
        const chunk = decoder.decode(value, { stream: true });
        responseText = chunk; // Replace instead of append since we're getting complete JSON now

        // Only try to update the UI if enough time has passed since the last update
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime > updateInterval) {
          try {
            // Parse the complete JSON response
            const parsedData = JSON.parse(responseText);
            lastValidData = parsedData; // Store the last valid data

            // Update the UI with the data
            if (parsedData.transformedResume) {
              setTransformedResume(parsedData.transformedResume);

              // Update the toast message to show progress
              toast.dismiss("streaming-resume");
              toast.info(`Processing your resume (chunk ${chunkCount})...`, {
                duration: 5000,
                id: "streaming-resume",
              });
            }

            if (
              parsedData.changesMade &&
              Array.isArray(parsedData.changesMade)
            ) {
              setChangesMade(parsedData.changesMade);
            }

            if (
              parsedData.keywordsExtracted &&
              Array.isArray(parsedData.keywordsExtracted)
            ) {
              setKeywordsExtracted(parsedData.keywordsExtracted);
            }

            if (parsedData.coverLetter) {
              setCoverLetter(parsedData.coverLetter);
            }

            // Show fallback mode message if applicable
            if (parsedData.fallbackMode) {
              toast.dismiss("streaming-resume");
              toast.info("Using simplified transformation due to complexity.", {
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

      // Final processing of the complete response
      try {
        // Use the last valid data if we have it, otherwise try to parse the final response
        const data = lastValidData || JSON.parse(responseText);
        console.log("Complete API response data:", data);

        // Dismiss the streaming toast
        toast.dismiss("streaming-resume");
        toast.dismiss("transforming-resume");

        if (data.success) {
          setTransformedResume(data.transformedResume);
          setCoverLetter(data.coverLetter);
          setChangesMade(data.changesMade || []);
          setKeywordsExtracted(data.keywordsExtracted || []);

          // Store job details for Interview Prep
          const jobDetails = {
            jobTitle,
            company,
            description: jobDescription,
            requiredSkills: keywordsExtracted,
          };
          localStorage.setItem(
            "applyRightJobDetails",
            JSON.stringify(jobDetails)
          );
          localStorage.setItem("applyRightResumeText", resumeText);
          localStorage.setItem(
            "applyRightDataImportTime",
            new Date().toLocaleString()
          );

          // Show success message
          toast.success("Resume transformed successfully!", {
            duration: 5000,
          });

          // Auto-advance to next tab
          setActiveTab("results");
        } else {
          // Handle error in the response
          toast.error(data.message || "Failed to transform resume", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error processing final response:", error);
        toast.error("Error processing the transformed resume", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error in resume transformation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to transform resume. Please try again.",
        { duration: 5000 }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResume = () => {
    if (!transformedResume) return;

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    doc.setProperties({
      title: "Professional Resume",
      subject: "Resume generated by ApplyRight",
      creator: "Synthalyst ApplyRight",
    });

    // Document margins and dimensions
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // Extract candidate name from the resume (first few lines)
    const lines = transformedResume.split("\n");
    let candidateName = "Professional Resume";

    // Try to find the candidate name in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (lines[i].includes("*[Candidate Name]*")) {
        candidateName = lines[i]
          .replace(/\*/g, "")
          .replace(/\[|\]/g, "")
          .trim();
        break;
      } else if (
        lines[i].includes("**") &&
        !lines[i].includes("|") &&
        !lines[i].includes("@")
      ) {
        candidateName = lines[i].replace(/\*/g, "").trim();
        break;
      }
    }

    // Set up the document with a professional header
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Add candidate name as header
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(candidateName, pageWidth / 2, 15, { align: "center" });

    // Add contact information
    let contactInfo = "";
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      if (
        lines[i].includes("|") ||
        (lines[i].includes("[") && lines[i].includes("]"))
      ) {
        contactInfo = lines[i].replace(/\[|\]/g, "").trim();
        break;
      }
    }

    if (contactInfo) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(contactInfo, pageWidth / 2, 25, { align: "center" });
    }

    // Add a subtle line under the header
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Process the resume content
    let yPosition = 45;
    let inBulletList = false;
    let currentSection = "";

    // Process line by line for better control
    lines.forEach((line, index) => {
      // Skip the first few lines that we already processed (name and contact)
      if (
        index < 5 &&
        (line.includes("*") || line.includes("|") || line.trim() === "")
      ) {
        return;
      }

      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      // Handle section headers (marked with asterisks or starting with #)
      if (
        (line.includes("**") && line.trim().length < 50) ||
        line.startsWith("# ") ||
        line.startsWith("## ")
      ) {
        // Add extra space before new sections
        yPosition += 5;

        // Clean up the section title
        currentSection = line.replace(/\*/g, "").replace(/^#+ /, "").trim();

        // Style the section header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);

        // Add a background for the section header
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition - 4, contentWidth, 8, "F");

        // Add the section text
        doc.text(currentSection, margin, yPosition);

        // Add a subtle line under the section header
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

        yPosition += 8;
        inBulletList = false;
        return;
      }

      // Handle bullet points
      if (
        line.trim().startsWith("•") ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*")
      ) {
        // Clean up the bullet text by removing the bullet character
        const bulletText = line.trim().substring(1).trim();

        // Determine indentation level based on leading spaces
        const indentMatch = line.match(/^\s+/);
        const indentLevel = indentMatch
          ? Math.floor(indentMatch[0].length / 2)
          : 0;
        const bulletIndent = margin + indentLevel * 4;

        // Style for bullet points
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);

        // Draw the bullet
        doc.setFont("helvetica", "bold");
        doc.text("•", bulletIndent, yPosition);
        doc.setFont("helvetica", "normal");

        // Wrap the text with proper indentation
        const textLines = doc.splitTextToSize(
          bulletText,
          contentWidth - (bulletIndent - margin) - 5
        );
        doc.text(textLines, bulletIndent + 4, yPosition);

        // Move position based on number of wrapped lines
        yPosition += 5 * textLines.length;
        inBulletList = true;
        return;
      }

      // Handle company or position lines (often have dates)
      if (
        (line.includes("Ltd") ||
          line.includes("Inc") ||
          line.includes("LLC") ||
          (line.includes("-") &&
            (line.includes("20") || line.includes("19")))) &&
        line.trim().length < 100
      ) {
        // Add spacing if coming from a bullet list
        if (inBulletList) {
          yPosition += 2;
          inBulletList = false;
        }

        // Style for company/position
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);

        const textLines = doc.splitTextToSize(line.trim(), contentWidth);
        doc.text(textLines, margin, yPosition);

        yPosition += 5 * textLines.length;
        return;
      }

      // Handle empty lines
      if (line.trim() === "") {
        yPosition += 2;
        return;
      }

      // Regular text - check if it's part of a summary section
      const isSummary =
        currentSection.toLowerCase().includes("summary") ||
        currentSection.toLowerCase().includes("profile");

      // Style for regular text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(
        isSummary ? 80 : 60,
        isSummary ? 80 : 60,
        isSummary ? 80 : 60
      );

      // Wrap and add the text
      const textLines = doc.splitTextToSize(line.trim(), contentWidth);
      doc.text(textLines, margin, yPosition);

      // Move position based on number of wrapped lines
      yPosition += 4.5 * textLines.length;
    });

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
    }

    // Save the PDF with the candidate's name if available
    const filename =
      candidateName !== "Professional Resume"
        ? `${candidateName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Professional_Resume.pdf";

    doc.save(filename);

    toast.success("Resume downloaded as PDF successfully!");
  };

  const handleDownloadCoverLetter = () => {
    if (!coverLetter) return;

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    doc.setProperties({
      title: "Professional Cover Letter",
      subject: "Cover Letter generated by ApplyRight",
      creator: "Synthalyst ApplyRight",
    });

    // Document margins and dimensions
    const margin = 25; // Wider margins for a formal letter
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // Split the cover letter into lines
    const lines = coverLetter.split("\n");

    // Extract sender information (usually at the top)
    let senderName = "";
    const senderInfo = [];
    const recipientInfo = [];
    let dateInfo = "";
    let contentStartIndex = 0;

    // Process the header section to extract sender, recipient, and date
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (line === "") continue;

      // Try to find the sender's name (usually the first non-empty line)
      if (
        !senderName &&
        line.length > 0 &&
        !line.includes("*") &&
        !line.includes("[")
      ) {
        senderName = line;
        continue;
      }

      // Collect sender contact information
      if (
        senderName &&
        senderInfo.length < 3 &&
        !line.includes("*") &&
        !line.includes("[")
      ) {
        senderInfo.push(line);
        continue;
      }

      // Try to find the date (usually contains numbers and months)
      if (
        !dateInfo &&
        (line.match(/\b\d{1,2}(st|nd|rd|th)?\b/) ||
          line.match(
            /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/
          ) ||
          line.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/))
      ) {
        dateInfo = line.replace(/\*/g, "").trim();
        continue;
      }

      // Collect recipient information (usually after sender info and before greeting)
      if (
        senderInfo.length > 0 &&
        !line.startsWith("Dear") &&
        !line.includes("*") &&
        line !== ""
      ) {
        recipientInfo.push(line);
        continue;
      }

      // Find where the actual content starts (usually with "Dear" or a greeting)
      if (
        line.startsWith("Dear") ||
        line.includes("Dear") ||
        line.includes("To Whom")
      ) {
        contentStartIndex = i;
        break;
      }
    }

    // Set up the document with a professional header
    let yPosition = 30;

    // Add sender information at the top
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);

    if (senderName) {
      doc.text(senderName, margin, yPosition);
      yPosition += 6;
    }

    // Add sender contact details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    senderInfo.forEach((info) => {
      doc.text(info, margin, yPosition);
      yPosition += 5;
    });

    // Add some space after sender info
    yPosition += 10;

    // Add date
    if (dateInfo) {
      doc.text(dateInfo, margin, yPosition);
      yPosition += 10;
    } else {
      // Add current date if no date found
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      doc.text(formattedDate, margin, yPosition);
      yPosition += 10;
    }

    // Add recipient information
    doc.setFont("helvetica", "normal");
    recipientInfo.forEach((info) => {
      doc.text(info, margin, yPosition);
      yPosition += 5;
    });

    // Add space after recipient info
    yPosition += 10;

    // Process the cover letter content
    let inGreeting = false;
    let inClosing = false;
    let paragraphStart = true;

    // Process line by line for better control
    for (let i = contentStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }

      // Skip empty lines but mark paragraph start
      if (line === "") {
        yPosition += 5;
        paragraphStart = true;
        continue;
      }

      // Detect greeting (usually starts with "Dear")
      if (line.startsWith("Dear") || line.includes("To Whom")) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.text(line, margin, yPosition);
        yPosition += 10;
        inGreeting = true;
        continue;
      }

      // Detect closing (usually "Sincerely", "Best regards", etc.)
      if (
        line.match(
          /^(Sincerely|Best regards|Regards|Yours truly|Respectfully|Thank you)/i
        )
      ) {
        // Add extra space before closing
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.text(line, margin, yPosition);
        inClosing = true;
        yPosition += 15; // Space for signature
        continue;
      }

      // Handle signature after closing
      if (inClosing) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(senderName || "Applicant Name", margin, yPosition);
        inClosing = false;
        continue;
      }

      // Regular paragraphs
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);

      // Wrap and add the text
      const textLines = doc.splitTextToSize(line, contentWidth);

      // Add paragraph indentation for paragraph starts
      if (paragraphStart && !inGreeting) {
        doc.text(textLines, margin, yPosition);
      } else {
        doc.text(textLines, margin, yPosition);
      }

      // Move position based on number of wrapped lines
      yPosition += 6 * textLines.length;
      paragraphStart = false;
    }

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
    }

    // Save the PDF with the sender's name if available
    const filename = senderName
      ? `${senderName.replace(/\s+/g, "_")}_Cover_Letter.pdf`
      : "Professional_Cover_Letter.pdf";

    doc.save(filename);

    toast.success("Cover Letter downloaded as PDF successfully!");
  };

  const handleSignIn = () => {
    window.location.href = "/api/auth/signin";
  };

  // Calculate match score for a single keyword
  const calculateKeywordMatch = (keyword: string): number => {
    if (!transformedResume) return 0;

    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    const matches = transformedResume.match(regex);

    // If the keyword is found, return a score between 75-100 based on frequency
    if (matches) {
      // For single matches, return 100%
      // For multiple matches, still return 100%
      return 100;
    }

    // Check for partial matches (e.g., "management" vs "manager")
    const keywordRoot =
      keyword.length > 5 ? keyword.substring(0, keyword.length - 2) : keyword;
    const partialRegex = new RegExp(`\\b${keywordRoot}\\w*\\b`, "i");
    const partialMatches = transformedResume.match(partialRegex);

    // If partial matches found, return a score of 75%
    if (partialMatches) {
      return 75;
    }

    return 0;
  };

  // Calculate overall match score across all keywords
  const calculateOverallMatchScore = (): number => {
    if (!keywordsExtracted.length || !transformedResume) return 0;

    // Count how many keywords have a match score > 0
    const matchedKeywords = keywordsExtracted.filter(
      (keyword) => calculateKeywordMatch(keyword) > 0
    ).length;

    // Calculate percentage of matched keywords
    const matchPercentage = Math.round(
      (matchedKeywords / keywordsExtracted.length) * 100
    );

    return matchPercentage;
  };

  return (
    <FeedbackLayout appName="ApplyRight">
      <div className="container mx-auto px-4 py-8">
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
                <Button
                  variant="outline"
                  onClick={handleSignIn}
                  className="mt-2"
                >
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
                    jobTitle={jobTitle}
                    company={company}
                    onJobTitleChange={setJobTitle}
                    onCompanyChange={setCompany}
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
                  <Button
                    onClick={() =>
                      handleJobDescriptionSubmit(
                        jobDescription,
                        jobTitle,
                        company
                      )
                    }
                    disabled={!jobTitle.trim() || !company.trim()}
                  >
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
                    <div className="text-sm flex items-center">
                      {resumeFile?.name}{" "}
                      <Badge variant="outline" className="ml-2">
                        {resumeFile?.type.split("/")[1].toUpperCase()}
                      </Badge>
                    </div>
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
                        Download PDF
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Your professionally enhanced resume ready to download as a
                      PDF
                    </CardDescription>
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
                        Download PDF
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Your tailored cover letter ready to download as a PDF
                    </CardDescription>
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
                        <div className="mb-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Keyword Match Score:
                            </span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{
                                    width: `${calculateOverallMatchScore()}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {calculateOverallMatchScore()}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {keywordsExtracted.map((keyword, index) => {
                            const matchScore = calculateKeywordMatch(keyword);
                            return (
                              <div key={index} className="relative group">
                                <Badge
                                  variant="secondary"
                                  className={`${
                                    matchScore > 0
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : ""
                                  }`}
                                >
                                  {keyword}
                                  {matchScore > 0 && (
                                    <span className="ml-1 text-xs font-normal text-green-600">
                                      ✓
                                    </span>
                                  )}
                                </Badge>
                                <div className="absolute bottom-full mb-2 left-0 transform -translate-x-1/4 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                  Match: {matchScore}%
                                </div>
                              </div>
                            );
                          })}
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

          {transformedResume && (
            <div className="bg-muted p-6 rounded-lg mt-8">
              <h2 className="text-xl font-bold mb-4">Next Steps</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Prepare for Interviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Now that your resume is optimized, prepare for interviews
                      with our AI-powered Interview Prep tool.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/interview-prep?from=applyright">
                        Go to Interview Prep
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Save on Bundle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get ApplyRight and Interview Prep together at a discounted
                      price with our Career Success Bundle.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/career-bundle">
                        View Bundle Options
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          <HowItWorks />
          <FeaturesSection />
          {!checkPremiumStatus() && (
            <PricingSection
              isPremium={checkPremiumStatus()}
              onUpgrade={handleSignIn}
            />
          )}
        </div>
      </div>
    </FeedbackLayout>
  );
}
