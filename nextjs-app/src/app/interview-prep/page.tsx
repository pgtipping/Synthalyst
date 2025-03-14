"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  BookOpen,
  BarChart,
  CheckCircle2,
  FileText,
} from "lucide-react";
import FeedbackLayout from "@/components/FeedbackLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

// Define the statistics interface
interface InterviewStats {
  mockInterviews: number;
  questionsPracticed: number;
  savedQuestions: number;
  averageScore: number | null;
}

export default function InterviewPrepPage() {
  const router = useRouter();
  const { status } = useSession();
  const [stats, setStats] = useState<InterviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch statistics when the component mounts and the user is authenticated
  useEffect(() => {
    const fetchStats = async () => {
      if (status === "authenticated") {
        setIsLoading(true);
        try {
          const response = await fetch("/api/interview-prep/statistics");
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          } else {
            console.error("Failed to fetch interview statistics");
          }
        } catch (error) {
          console.error("Error fetching interview statistics:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
  }, [status]);

  // Function to render the statistics section
  const renderStatsSection = () => {
    if (status === "loading" || isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (status === "unauthenticated") {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Sign in to track your interview preparation progress
          </p>
          <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
        </div>
      );
    }

    // Default values for stats if they're not available
    const defaultStats = {
      mockInterviews: 0,
      questionsPracticed: 0,
      savedQuestions: 0,
      averageScore: null,
    };

    // Use default stats if stats is null
    const displayStats = stats || defaultStats;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Mock Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayStats.mockInterviews}
            </div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Practiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayStats.questionsPracticed}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayStats.savedQuestions}
            </div>
            <p className="text-xs text-muted-foreground">
              For future reference
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayStats.averageScore !== null
                ? displayStats.averageScore
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">From all interviews</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Function to render the call-to-action button
  const renderCtaButton = () => {
    if (status === "unauthenticated") {
      return null;
    }

    if (stats && stats.mockInterviews > 0) {
      return (
        <Button
          variant="outline"
          onClick={() => router.push("/interview-prep/mock-interview")}
        >
          Start Another Mock Interview
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        onClick={() => router.push("/interview-prep/mock-interview")}
      >
        Start Your First Mock Interview
      </Button>
    );
  };

  return (
    <FeedbackLayout appName="Interview Prep">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-1 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/tools"
            className="text-muted-foreground hover:text-foreground"
          >
            Tools
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Interview Prep</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Interview Preparation</h1>
          <p className="text-muted-foreground">
            Prepare for your upcoming interviews with our comprehensive suite of
            tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Interview Prep Plan
              </CardTitle>
              <CardDescription>
                Generate a personalized interview preparation plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Create a tailored interview preparation plan based on your job
                  application. Get a structured timeline, preparation steps, and
                  practice questions.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Personalized</Badge>
                  <Badge variant="outline">PDF Export</Badge>
                  <Badge variant="outline">Practice Questions</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/interview-prep/plan")}
                className="w-full"
              >
                Create Prep Plan
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Badge variant="default">New</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Mock Interview
              </CardTitle>
              <CardDescription>
                Practice with AI-powered mock interviews tailored to your target
                role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Simulate real interview scenarios with our AI interviewer. Get
                  instant feedback on your responses and improve your
                  performance.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Personalized</Badge>
                  <Badge variant="outline">AI Feedback</Badge>
                  <Badge variant="outline">Performance Tracking</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/interview-prep/mock-interview")}
                className="w-full"
              >
                Start Mock Interview
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Question Library
              </CardTitle>
              <CardDescription>
                Browse and save interview questions for your preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Access our extensive library of interview questions across
                  different roles, industries, and difficulty levels. Save
                  questions to create your personalized preparation plan.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">500+ Questions</Badge>
                  <Badge variant="outline">Categorized</Badge>
                  <Badge variant="outline">Save & Notes</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/interview-prep/questions")}
                className="w-full"
              >
                Browse Questions
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Interview Preparation Guide
          </h2>

          <Tabs defaultValue="before">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="before">Before the Interview</TabsTrigger>
              <TabsTrigger value="during">During the Interview</TabsTrigger>
              <TabsTrigger value="after">After the Interview</TabsTrigger>
            </TabsList>

            <TabsContent value="before" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preparation Checklist</CardTitle>
                  <CardDescription>
                    Essential steps to take before your interview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research the Company</h3>
                        <p className="text-sm text-muted-foreground">
                          Understand the company&apos;s mission, values,
                          products, services, and recent news. This shows your
                          interest and helps you align your answers with their
                          culture.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Practice Common Questions
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Use our Question Library to practice answers to common
                          interview questions for your role. Focus on behavioral
                          and technical questions relevant to the position.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Prepare Your STAR Stories
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Develop 5-7 stories from your experience using the
                          STAR method (Situation, Task, Action, Result) that
                          demonstrate your skills and achievements.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Conduct Mock Interviews</h3>
                        <p className="text-sm text-muted-foreground">
                          Use our Mock Interview feature to practice with
                          AI-powered interviews tailored to your target role.
                          Get feedback on your performance and areas for
                          improvement.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="during" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>During the Interview</CardTitle>
                  <CardDescription>
                    Tips for making a great impression during your interview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Make a Strong First Impression
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Arrive 10-15 minutes early, dress appropriately, and
                          greet everyone with a smile and firm handshake. First
                          impressions matter significantly.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Use the STAR Method for Answers
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Structure your responses to behavioral questions using
                          the STAR method: Situation, Task, Action, and Result.
                          This provides a clear and compelling narrative.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Show Interest and Enthusiasm
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Demonstrate your enthusiasm for the role and company.
                          Ask thoughtful questions that show you&apos;ve done
                          your research and are genuinely interested.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Address Potential Concerns
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          If you anticipate concerns about your experience or
                          background, proactively address them by highlighting
                          transferable skills and your eagerness to learn.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="after" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>After the Interview</CardTitle>
                  <CardDescription>
                    Steps to take after your interview is complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Send a Thank You Note</h3>
                        <p className="text-sm text-muted-foreground">
                          Send a personalized thank you email within 24 hours.
                          Express your appreciation for the opportunity,
                          reiterate your interest, and briefly mention a key
                          point from your conversation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Reflect on Your Performance
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Take notes on what went well and what could be
                          improved. This reflection will help you refine your
                          approach for future interviews.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Follow Up Appropriately</h3>
                        <p className="text-sm text-muted-foreground">
                          If you haven&apos;t heard back within the timeframe
                          mentioned, send a polite follow-up email. Express your
                          continued interest and ask about the next steps in the
                          process.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Continue Your Job Search
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Don&apos;t pause your job search while waiting for a
                          response. Continue applying and interviewing for other
                          positions to maximize your opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 bg-primary/5 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Your Interview Stats</h2>
          </div>

          {renderStatsSection()}

          <div className="mt-4 text-center">{renderCtaButton()}</div>
        </div>

        {/* Developer Tools Section */}
        <div className="mt-12 border border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold">Developer Tools</h2>
            <Badge variant="outline">Testing Only</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            These tools are for development and testing purposes only.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/interview-prep/audio-demo")}
            >
              Audio Components Demo
            </Button>
          </div>
        </div>
      </div>
    </FeedbackLayout>
  );
}
