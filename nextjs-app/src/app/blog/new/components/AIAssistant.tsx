"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
  onTagsGenerated?: (categories: string[], tags: string[]) => void;
  currentContent?: string;
}

export function AIAssistant({
  onContentGenerated,
  onTagsGenerated,
  currentContent = "",
}: AIAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup: abort any ongoing requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleAIRequest = async (
    type: "generate" | "improve" | "suggest_tags" | "open_question"
  ) => {
    try {
      setIsGenerating(true);
      setStreamedContent("");
      setIsStreaming(true);

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: type === "generate" ? prompt : currentContent,
          type,
          options: {
            stream: true,
            timeout: 30000,
            maxRetries: 3,
          },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        content += chunk;
        setStreamedContent(content);
      }

      if (type === "suggest_tags" && onTagsGenerated) {
        // Parse the AI response into categories and tags
        const lines = content.split("\n");
        const categories: string[] = [];
        const tags: string[] = [];

        let isParsingCategories = false;
        let isParsingTags = false;

        lines.forEach((line: string) => {
          if (line.toLowerCase().includes("categories:")) {
            isParsingCategories = true;
            isParsingTags = false;
          } else if (line.toLowerCase().includes("tags:")) {
            isParsingCategories = false;
            isParsingTags = true;
          } else if (line.trim()) {
            const items = line
              .replace(/^[-*•]/, "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);

            if (isParsingCategories) {
              categories.push(...items);
            } else if (isParsingTags) {
              tags.push(...items);
            }
          }
        });

        onTagsGenerated(categories, tags);
      } else {
        onContentGenerated(content);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast({
          title: "Generation cancelled",
          description: "Content generation was cancelled.",
        });
      } else {
        console.error("Error generating content:", error);
        toast({
          title: "Error",
          description: "Failed to generate content. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="improve">Improve</TabsTrigger>
          <TabsTrigger value="suggest_tags">Tags</TabsTrigger>
          <TabsTrigger value="open_question">Ask AI</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handleAIRequest("generate")}
                    disabled={isGenerating || !prompt}
                    className="w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isStreaming ? "Generating..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                  {isGenerating && (
                    <Button
                      onClick={cancelGeneration}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improve">
          <Card>
            <CardHeader>
              <CardTitle>Improve Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleAIRequest("improve")}
                disabled={isGenerating || !currentContent}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? (
                  <>{isStreaming ? "Analyzing..." : "Processing..."}</>
                ) : (
                  "Improve Content"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggest_tags">
          <Card>
            <CardHeader>
              <CardTitle>Generate Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleAIRequest("suggest_tags")}
                disabled={isGenerating || !currentContent}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? (
                  <>{isStreaming ? "Analyzing..." : "Processing..."}</>
                ) : (
                  "Generate Tags"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open_question">
          <Card>
            <CardHeader>
              <CardTitle>Ask AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask a question about your content..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={() => handleAIRequest("open_question")}
                  disabled={isGenerating || !prompt}
                  className="w-full"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isGenerating ? (
                    <>{isStreaming ? "Thinking..." : "Processing..."}</>
                  ) : (
                    "Ask Question"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {streamedContent && (
        <div className="relative rounded-lg border p-4 mt-4">
          <div className="prose max-w-none dark:prose-invert">
            {streamedContent}
          </div>
        </div>
      )}
    </div>
  );
}
