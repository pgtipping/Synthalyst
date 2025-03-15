"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import {
  BookOpen,
  Loader2,
  Send,
  MessageSquare,
  History,
  Sparkles,
  Clock,
  Tag,
} from "lucide-react";
import { format } from "date-fns";

interface Question {
  id: string;
  question: string;
  answer: string;
  topic: string;
  timestamp: string;
  tags?: string[];
}

export default function KnowledgeGPT() {
  const { data: session } = useSession();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("ask");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);

  const fetchQuestionHistory = useCallback(async () => {
    if (!session?.user) return;

    setIsLoadingHistory(true);
    try {
      const response = await fetch(
        `/api/knowledge-gpt/history${
          selectedTopic !== "all" ? `?topic=${selectedTopic}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch question history");
      }
      const data = await response.json();
      setRecentQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching question history:", error);
      toast.error("Failed to load question history");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [session, selectedTopic]);

  // Fetch question history when component mounts or when tab changes to history
  useEffect(() => {
    if (activeTab === "history" && session?.user) {
      fetchQuestionHistory();
    }
  }, [activeTab, session, selectedTopic, fetchQuestionHistory]);

  // Extract unique topics from questions
  useEffect(() => {
    if (recentQuestions.length > 0) {
      const uniqueTopics = Array.from(
        new Set(recentQuestions.map((q) => q.topic))
      ).filter(Boolean);
      setTopics(uniqueTopics);
    }
  }, [recentQuestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/knowledge-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data.answer);

      // Add to recent questions if not already there
      if (data.id) {
        setRecentQuestions((prev) => [
          {
            id: data.id,
            question,
            answer: data.answer,
            topic: data.topic || "General",
            timestamp: new Date().toISOString(),
            tags: data.tags || [],
          },
          ...prev,
        ]);
      }

      toast.success("Answer generated successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to generate answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          {
            label: "Knowledge GPT",
            href: "/knowledge-gpt",
            active: true,
          },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Knowledge GPT</h1>
          <p className="text-muted-foreground">
            Your AI-powered educational assistant for personalized learning
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ask" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask a Question
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              Question History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ask" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Ask Your Question
                </CardTitle>
                <CardDescription>
                  Ask any educational question and get a detailed, personalized
                  answer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="question" className="text-sm font-medium">
                      Your Question
                    </label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., Explain the concept of photosynthesis in simple terms"
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Answer...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Get Answer
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}

            {answer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Answer
                  </CardTitle>
                  <CardDescription>
                    Detailed explanation to your question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none dark:prose-invert bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                    {answer.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary" />
                  Question History
                </CardTitle>
                <CardDescription>
                  Browse your previously asked questions and answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedTopic === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTopicChange("all")}
                    >
                      All Topics
                    </Button>
                    {topics.map((topic) => (
                      <Button
                        key={topic}
                        variant={
                          selectedTopic === topic ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleTopicChange(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>

                {isLoadingHistory ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recentQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {recentQuestions.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {item.question}
                          </CardTitle>
                          <CardDescription className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.timestamp
                                ? format(
                                    new Date(item.timestamp),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )
                                : "Recent"}
                            </span>
                            <Badge>{item.topic}</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="prose max-w-none dark:prose-invert line-clamp-3 text-sm">
                            {item.answer
                              .split("\n")
                              .slice(0, 3)
                              .map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex flex-wrap gap-2">
                          {item.tags &&
                            item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="flex items-center"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      No questions found. Start asking questions to build your
                      history.
                    </p>
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
