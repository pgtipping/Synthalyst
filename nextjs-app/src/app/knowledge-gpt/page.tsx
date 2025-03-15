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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  BookOpen,
  MessageSquare,
  History,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  LanguageSelector,
  LanguageInfo,
} from "@/components/ui/language-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Question {
  id: string;
  question: string;
  answer: string;
  topic: string;
  timestamp: string;
  tags?: string[];
  language: string;
  modelUsed: string;
}

// Replace the specific model type with a generic "KNOWLEDGE_MODEL" constant
// This will be used for the LanguageSelector and LanguageInfo components
const KNOWLEDGE_MODEL = "KNOWLEDGE_MODEL";

export default function KnowledgeGPT() {
  const { data: session } = useSession();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("ask");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [topics, setTopics] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("English");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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
      setQuestions(data.questions || []);
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
    if (questions.length > 0) {
      const uniqueTopics = Array.from(
        new Set(questions.map((q) => q.topic))
      ).filter(Boolean);
      setTopics(uniqueTopics);
    }
  }, [questions]);

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
        body: JSON.stringify({ question, language }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data.answer);

      if (data.id) {
        setQuestions((prev) => [
          {
            id: data.id,
            question,
            answer: data.answer,
            topic: data.topic || "General",
            timestamp: new Date().toISOString(),
            tags: data.tags || [],
            language,
            modelUsed: data.modelUsed || "AI Model",
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

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
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
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Ask a Question
                </CardTitle>
                <CardDescription>
                  Ask any educational question and get a detailed answer
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
                      placeholder="e.g., What is the difference between mitosis and meiosis?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <LanguageSelector
                      modelType={KNOWLEDGE_MODEL}
                      onLanguageChange={handleLanguageChange}
                      defaultLanguage={language}
                    />

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get Answer
                        </>
                      )}
                    </Button>
                  </div>

                  <LanguageInfo modelType={KNOWLEDGE_MODEL} />
                </form>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {answer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Answer
                  </CardTitle>
                  <CardDescription className="flex justify-between items-center">
                    <span>Detailed explanation to your question</span>
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
                  Your Question History
                </CardTitle>
                <CardDescription>
                  Browse your previous questions and answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedTopic === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTopicChange("all")}
                    >
                      All Topics
                    </Badge>
                    {topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant={
                          selectedTopic === topic ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleTopicChange(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((item) => (
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
                          <CardFooter className="flex justify-between items-center pt-0">
                            <div className="flex flex-wrap gap-1">
                              {item.tags?.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.language || "English"}
                            </Badge>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No questions found. Start asking questions to build your
                      history.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
