"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, Bookmark, ArrowLeft, Save } from "lucide-react";
import FeedbackLayout from "@/components/FeedbackLayout";
import Link from "next/link";

// Question Types
interface Question {
  id: string;
  questionText: string;
  jobType: string;
  industry: string;
  difficulty: string;
  category: string;
  isSaved: boolean;
  notes: string | null;
}

export default function QuestionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [notes, setNotes] = useState<string>("");

  // Get the question ID from the URL parameters
  const questionId = params.id as string;

  useEffect(() => {
    if (!questionId) {
      setError("No question ID provided");
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/interview-prep/questions/${questionId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch question");
        }

        const data = await response.json();
        setQuestion(data);
        setNotes(data.notes || "");
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
            error instanceof Error ? error.message : "Failed to fetch question",
        });
      }
    };

    fetchQuestion();
  }, [questionId, toast]);

  const saveNotes = async () => {
    if (!questionId || !question) return;

    try {
      setSaving(true);

      const response = await fetch(
        `/api/interview-prep/questions/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save notes");
      }

      // Update the local state
      setQuestion((prev) => (prev ? { ...prev, notes } : null));

      toast({
        title: "Notes Saved",
        description: "Your notes have been saved successfully.",
      });

      setSaving(false);
    } catch (error) {
      setSaving(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save notes",
      });
    }
  };

  const unsaveQuestion = async () => {
    if (!questionId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/interview-prep/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove question");
      }

      toast({
        title: "Question Removed",
        description: "The question has been removed from your library.",
      });

      // Navigate back to the questions page
      router.push("/interview-prep/questions");
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove question",
      });
    }
  };

  return (
    <FeedbackLayout appName="Question Detail">
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
            href="/interview-prep/questions"
            className="text-muted-foreground hover:text-foreground"
          >
            Question Library
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Question Detail</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Question Detail</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/interview-prep/questions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
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
        ) : question ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {question.questionText}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.jobType && (
                        <Badge variant="outline">{question.jobType}</Badge>
                      )}
                      {question.industry && (
                        <Badge variant="outline">{question.industry}</Badge>
                      )}
                      {question.difficulty && (
                        <Badge variant="secondary">{question.difficulty}</Badge>
                      )}
                      {question.category && <Badge>{question.category}</Badge>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={unsaveQuestion}>
                    <Bookmark className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Your Notes</h3>
                    <Textarea
                      placeholder="Add your notes about this question here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveNotes} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Notes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-4">Practice Tips</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">
                    How to Answer This Question
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    When answering this question, consider using the STAR method
                    (Situation, Task, Action, Result) to structure your
                    response. Be specific about your experiences and highlight
                    relevant skills.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Key Points to Include</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                    <li>Specific examples from your experience</li>
                    <li>Quantifiable results when possible</li>
                    <li>Relevant skills and competencies</li>
                    <li>Lessons learned or growth from the experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Practice Strategies</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                    <li>Record yourself answering the question</li>
                    <li>Practice with a friend or mentor</li>
                    <li>Time your response (aim for 1-2 minutes)</li>
                    <li>Prepare multiple examples to draw from</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Question Not Found</AlertTitle>
            <AlertDescription>
              The requested question could not be found.
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/interview-prep/questions")}
                >
                  Return to Question Library
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </FeedbackLayout>
  );
}
