"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wand2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingDots } from "@/components/ui/loading-dots";

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
  onTagsGenerated: (categories: string[], tags: string[]) => void;
  currentContent?: string;
}

export default function AIAssistant({
  onContentGenerated,
  onTagsGenerated,
  currentContent,
}: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [finalContent, setFinalContent] = useState("");

  // Effect to update parent component only when streaming is complete
  useEffect(() => {
    if (!isStreaming && finalContent) {
      onContentGenerated(finalContent);
      setFinalContent("");
    }
  }, [isStreaming, finalContent, onContentGenerated]);

  const handleAIRequest = async (
    type: "generate" | "improve" | "suggest_tags" | "open_question"
  ) => {
    setIsLoading(true);
    setError(null);
    setStreamedContent("");
    setIsStreaming(false);
    setFinalContent("");

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: type === "generate" ? prompt : currentContent,
          type,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process request");
      }

      if (type === "suggest_tags") {
        // For tag suggestions, we don't stream the response
        const data = await response.json();
        try {
          // Parse the AI response into categories and tags
          const lines = data.data.split("\n");
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
        } catch (err) {
          console.error("Error parsing tags:", err);
          setError("Failed to parse AI suggestions");
        }
      } else {
        // For content generation and improvement, we stream the response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("Failed to get response reader");
        }

        setIsStreaming(true);
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setFinalContent(accumulatedContent);
            setIsStreaming(false);
            break;
          }

          const chunk = decoder.decode(value);
          accumulatedContent += chunk;
          setStreamedContent(accumulatedContent);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Writing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="improve">Improve</TabsTrigger>
            <TabsTrigger value="suggest_tags">Tags</TabsTrigger>
            <TabsTrigger value="open_question">Ask</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <Alert>
                <AlertDescription>
                  Describe what you want to write about, and I&apos;ll help you
                  create a blog post following our style guidelines with
                  automatic SEO optimization.
                </AlertDescription>
              </Alert>
              <Textarea
                placeholder="E.g., Write a blog post about the latest trends in AI and their impact on productivity. Use a persuasive tone, place people before actions in sentences, and keep sentences concise by removing extra words."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={() => handleAIRequest("generate")}
                disabled={isLoading || !prompt}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isLoading ? (
                  <>
                    {isStreaming ? "Generating" : "Processing"}
                    <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="improve" className="space-y-4">
            <Alert>
              <AlertDescription>
                I&apos;ll analyze your current content and suggest improvements
                based on our style guidelines, including sentence structure,
                clarity, persuasiveness, and SEO optimization.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => handleAIRequest("improve")}
              disabled={isLoading || !currentContent}
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? (
                <>
                  {isStreaming ? "Analyzing" : "Processing"}
                  <LoadingDots className="ml-2" />
                </>
              ) : (
                "Get Suggestions"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="suggest_tags" className="space-y-4">
            <Alert>
              <AlertDescription>
                I&apos;ll analyze your content and suggest relevant categories
                and tags.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => handleAIRequest("suggest_tags")}
              disabled={isLoading || !currentContent}
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? (
                <>
                  {isStreaming ? "Analyzing" : "Processing"}
                  <LoadingDots className="ml-2" />
                </>
              ) : (
                "Suggest Tags"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="open_question" className="space-y-4">
            <Alert>
              <AlertDescription>
                Ask me any question about blog writing, SEO, or content
                strategy. Try questions like &quot;How do I create an engaging
                excerpt?&quot;, &quot;What&apos;s the ideal blog post
                length?&quot;, or &quot;How can I make my writing more
                persuasive?&quot;
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="E.g., Help me create an excerpt that drives clicks, or How can I improve my sentence structure to place people before actions?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={() => handleAIRequest("open_question")}
              disabled={isLoading || !prompt}
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? (
                <>
                  {isStreaming ? "Thinking" : "Processing"}
                  <LoadingDots className="ml-2" />
                </>
              ) : (
                "Get Answer"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {(isStreaming || streamedContent) && (
          <div className="mt-4 rounded-lg border p-4">
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: streamedContent }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
