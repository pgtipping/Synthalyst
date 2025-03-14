"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import FeedbackLayout from "@/components/FeedbackLayout";
import Link from "next/link";

// Summary Types
interface InterviewSummary {
  sessionId: string;
  jobTitle: string;
  company: string | null;
  industry: string | null;
  startedAt: string;
  endedAt: string;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  questions: QuestionSummary[];
}

interface QuestionSummary {
  id: string;
  questionText: string;
  questionType: string;
  responseText: string;
  score: number | null;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export default function SummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<InterviewSummary | null>(null);

  // Get the session ID from the URL query parameters
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/interview-prep/mock-interview/${sessionId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch session summary");
        }

        const data = await response.json();
        setSummary(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch session summary",
        });
      }
    };

    fetchSummary();
  }, [sessionId, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <FeedbackLayout appName="Mock Interview Summary">
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
            href="/interview-prep"
            className="text-muted-foreground hover:text-foreground"
          >
            Interview Prep
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/interview-prep/mock-interview"
            className="text-muted-foreground hover:text-foreground"
          >
            Mock Interview
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Summary</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Interview Summary</h1>
          <p className="text-muted-foreground">
            Review your mock interview performance and feedback.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : summary ? (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {summary.jobTitle}
                      {summary.company && ` at ${summary.company}`}
                    </CardTitle>
                    {summary.industry && (
                      <CardDescription>
                        Industry: {summary.industry}
                      </CardDescription>
                    )}
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {summary.overallScore}/10
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Overall Score
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        Strengths
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.strengths.map((strength, index) => (
                          <li key={index} className="text-sm">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        Areas for Improvement
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">
                      Overall Feedback
                    </h3>
                    <p className="text-sm">{summary.feedback}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Started:</span>{" "}
                      {formatDate(summary.startedAt)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed:</span>{" "}
                      {formatDate(summary.endedAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              Question Responses
            </h2>

            {summary.questions.map((question, index) => (
              <Card key={question.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Question {index + 1}: {question.questionType}
                    </CardTitle>
                    {question.score !== null && (
                      <div className="bg-primary/10 px-2 py-1 rounded-md">
                        <div className="text-sm font-medium">
                          {question.score}/10
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Question</h3>
                      <p className="text-sm bg-muted p-3 rounded-md">
                        {question.questionText}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-2">
                        Your Response
                      </h3>
                      <p className="text-sm bg-primary/5 p-3 rounded-md">
                        {question.responseText}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-sm mb-2">Strengths</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {question.strengths.map((strength, index) => (
                            <li key={index} className="text-sm">
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-2">
                          Areas for Improvement
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {question.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm">
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-2">Feedback</h3>
                      <p className="text-sm">{question.feedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => router.push("/interview-prep/mock-interview")}
              >
                Back to Mock Interview
              </Button>
              <Button onClick={() => router.push("/interview-prep")}>
                Return to Interview Prep
              </Button>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Summary Found</AlertTitle>
            <AlertDescription>
              No interview summary was found for the provided session ID.
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/interview-prep/mock-interview")}
                >
                  Start a New Interview
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </FeedbackLayout>
  );
}
