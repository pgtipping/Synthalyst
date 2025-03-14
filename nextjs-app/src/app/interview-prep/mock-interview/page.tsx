"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import FeedbackLayout from "@/components/FeedbackLayout";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Import audio components
import { AudioRecorder, TextToSpeechPlayer } from "@/components/interview-prep";

// Mock Interview Session Types
interface InterviewSession {
  id: string;
  jobTitle: string;
  company: string | null;
  industry: string | null;
  status: string;
  startedAt: string;
  endedAt: string | null;
}

interface InterviewQuestion {
  id: string;
  questionText: string;
  questionOrder: number;
  questionType: string;
  response: InterviewResponse | null;
}

interface InterviewResponse {
  id: string;
  responseText: string;
  feedback: string;
  score: number | null;
  strengths: string[];
  improvements: string[];
  submittedAt: string;
}

interface SessionProgress {
  totalQuestions: number;
  answeredQuestions: number;
}

interface SessionData {
  session: InterviewSession;
  questions: InterviewQuestion[];
  progress: SessionProgress;
}

export default function MockInterviewPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<InterviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Audio-related state
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioMode, setIsAudioMode] = useState(false);

  // Check if user has an active session
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        setLoading(true);
        // Check localStorage for active session
        const storedSessionId = localStorage.getItem(
          "activeInterviewSessionId"
        );
        if (storedSessionId) {
          setActiveSession(storedSessionId);
          await fetchSessionData(storedSessionId);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        addToast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to check active session",
        });
      }
    };

    checkActiveSession();
  }, []);

  const fetchSessionData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interview-prep/mock-interview/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch session data");
      }

      const data = await response.json();
      setSessionData(data);

      // Find the first unanswered question
      const firstUnansweredIndex = data.questions.findIndex(
        (q: InterviewQuestion) => q.response === null
      );
      setCurrentQuestionIndex(
        firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      addToast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch session data",
      });
    }
  };

  const startNewSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interview-prep/mock-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: "Head of People",
          company: "Mono",
          industry: "FinTech",
          questionCount: 10,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create new session");
      }

      const data = await response.json();
      setActiveSession(data.id);
      await fetchSessionData(data.id);
      setCurrentQuestionIndex(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      addToast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create new session",
      });
    }
  };

  const submitResponse = async () => {
    if (
      !activeSession ||
      !sessionData ||
      (isAudioMode ? !audioBlob : responseText.trim() === "")
    )
      return;

    const currentQuestion = sessionData.questions[currentQuestionIndex];

    try {
      setSubmitting(true);

      interface RequestBody {
        sessionId: string;
        questionId: string;
        responseText: string;
        audioUrl?: string;
      }

      const requestBody: RequestBody = {
        sessionId: activeSession,
        questionId: currentQuestion.id,
        responseText: isAudioMode ? "Audio response submitted" : responseText,
      };

      // Add audioUrl if in audio mode
      if (isAudioMode && audioUrl) {
        requestBody.audioUrl = audioUrl;
      }

      const response = await fetch("/api/interview-prep/mock-interview", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit response");
      }

      const data = await response.json();
      setFeedback(data.feedback);

      // If there's a next question, prepare to move to it
      if (!data.isLastQuestion) {
        setTimeout(() => {
          setFeedback(null);
          setResponseText("");
          setAudioBlob(null);
          setAudioUrl(null);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 5000); // Show feedback for 5 seconds before moving to next question
      }

      // Refresh session data to get updated progress
      await fetchSessionData(activeSession);

      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      addToast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit response",
      });
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/interview-prep/mock-interview/${activeSession}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to end session");
      }

      // Get the data from the response
      await response.json();

      // Clear the active session
      localStorage.removeItem("activeInterviewSessionId");
      setActiveSession(null);
      setSessionData(null);

      // Show summary
      addToast({
        title: "Session Completed",
        description:
          "Your mock interview session has been completed. Check your summary.",
      });

      // Redirect to summary page or show summary modal
      // For now, we'll just reload the page
      router.push(
        `/interview-prep/mock-interview/summary?sessionId=${activeSession}`
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      addToast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to end session",
      });
    }
  };

  // Handle audio recording completion
  const handleRecordingComplete = (blob: Blob, url: string) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  // Toggle between text and audio mode
  const toggleInputMode = () => {
    setIsAudioMode(!isAudioMode);
    // Reset inputs when switching modes
    setResponseText("");
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return (
    <FeedbackLayout appName="Mock Interview">
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
          <Link
            href="/interview-prep"
            className="text-muted-foreground hover:text-foreground"
          >
            Interview Prep
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Mock Interview</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Mock Interview</h1>
          <p className="text-muted-foreground">
            Practice your interview skills with our AI-powered mock interview
            system. Get real-time feedback and improve your performance.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!activeSession ? (
          <Card>
            <CardHeader>
              <CardTitle>Start a New Mock Interview</CardTitle>
              <CardDescription>
                Enter the details of the job you&apos;re interviewing for to get
                tailored questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Job Title *
                  </label>
                  <input
                    id="jobTitle"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company (Optional)
                  </label>
                  <input
                    id="company"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="industry" className="text-sm font-medium">
                    Industry (Optional)
                  </label>
                  <input
                    id="industry"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Technology"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="questionCount"
                    className="text-sm font-medium"
                  >
                    Number of Questions
                  </label>
                  <select
                    id="questionCount"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  >
                    <option value="3">3 Questions</option>
                    <option value="5">5 Questions</option>
                    <option value="7">7 Questions</option>
                    <option value="10">10 Questions</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={startNewSession}
                disabled={loading || !jobTitle.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Session...
                  </>
                ) : (
                  "Start Mock Interview"
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            {sessionData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Mock Interview: {sessionData.session.jobTitle}
                    {sessionData.session.company &&
                      ` at ${sessionData.session.company}`}
                  </CardTitle>
                  <CardDescription>
                    Progress: {sessionData.progress.answeredQuestions} of{" "}
                    {sessionData.progress.totalQuestions} questions completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sessionData.questions.length > 0 && (
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">
                                Question {currentQuestionIndex + 1} of{" "}
                                {sessionData.questions.length}
                              </h3>
                              <TextToSpeechPlayer
                                text={
                                  sessionData.questions[currentQuestionIndex]
                                    .questionText
                                }
                                showSettings={false}
                              />
                            </div>
                            <p className="text-lg">
                              {
                                sessionData.questions[currentQuestionIndex]
                                  .questionText
                              }
                            </p>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Type:{" "}
                              {
                                sessionData.questions[currentQuestionIndex]
                                  .questionType
                              }
                            </div>
                          </div>

                          {feedback ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-primary/10 rounded-lg">
                                <h3 className="font-medium mb-2">
                                  Your Response
                                </h3>
                                {audioUrl ? (
                                  <div className="space-y-2">
                                    <audio
                                      src={audioUrl}
                                      controls
                                      className="w-full h-10"
                                      controlsList="nodownload"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                      Audio response submitted
                                    </p>
                                  </div>
                                ) : (
                                  <p>{responseText}</p>
                                )}
                              </div>

                              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <h3 className="font-medium mb-2">Feedback</h3>
                                <p>{feedback.feedback}</p>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">
                                      Strengths
                                    </h4>
                                    <ul className="list-disc list-inside">
                                      {feedback.strengths.map(
                                        (strength, index) => (
                                          <li key={index}>{strength}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">
                                      Areas for Improvement
                                    </h4>
                                    <ul className="list-disc list-inside">
                                      {feedback.improvements.map(
                                        (improvement, index) => (
                                          <li key={index}>{improvement}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>

                                {feedback.score !== null && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-sm mb-2">
                                      Score
                                    </h4>
                                    <div className="flex items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div
                                          className="bg-primary h-2.5 rounded-full"
                                          style={{
                                            width: `${
                                              (feedback.score / 10) * 100
                                            }%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="ml-2 text-sm font-medium">
                                        {feedback.score}/10
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center justify-end space-x-2 mb-2">
                                <Label
                                  htmlFor="input-mode"
                                  className={
                                    isAudioMode
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {isAudioMode
                                    ? "Voice Response"
                                    : "Text Response"}
                                </Label>
                                <Switch
                                  id="input-mode"
                                  checked={isAudioMode}
                                  onCheckedChange={toggleInputMode}
                                />
                              </div>

                              {isAudioMode ? (
                                <div className="min-h-[200px] flex flex-col items-center justify-center border border-input rounded-md p-4">
                                  <AudioRecorder
                                    onRecordingComplete={
                                      handleRecordingComplete
                                    }
                                    maxDuration={2 * 60 * 1000} // 2 minutes
                                    showPlayer={true}
                                    showProgress={true}
                                    className="w-full"
                                  />

                                  {audioUrl && (
                                    <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                                      Recording complete. You can re-record or
                                      submit your response.
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <textarea
                                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Type your response here..."
                                  value={responseText}
                                  onChange={(e) =>
                                    setResponseText(e.target.value)
                                  }
                                  disabled={submitting}
                                />
                              )}

                              <div className="flex justify-end">
                                <Button
                                  onClick={submitResponse}
                                  disabled={
                                    submitting ||
                                    (isAudioMode
                                      ? !audioBlob
                                      : responseText.trim() === "")
                                  }
                                >
                                  {submitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    "Submit Response"
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/interview-prep")}
                  >
                    Back to Interview Prep
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={endSession}
                    disabled={loading}
                  >
                    End Session
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </div>
    </FeedbackLayout>
  );
}
