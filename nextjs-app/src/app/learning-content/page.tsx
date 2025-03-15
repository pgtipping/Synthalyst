"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send } from "lucide-react";
import {
  LanguageSelector,
  LanguageInfo,
} from "@/components/ui/language-selector";

// Define the LEARNING_MODEL constant
const LEARNING_MODEL = "LEARNING_MODEL";

export default function LearningContentCreator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [previousQueries, setPreviousQueries] = useState<
    { query: string; content: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle language change
  const handleLanguageChange = (language: string) => {
    console.log("Learning Content - Language changed to:", language);
    setSelectedLanguage(language);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    setContent("");

    console.log("Submitting query with language:", selectedLanguage);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: searchQuery,
          language: selectedLanguage,
          type: "learning",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.content);

      // Add to previous queries
      setPreviousQueries((prev) => [
        { query: searchQuery, content: data.content },
        ...prev,
      ]);

      setSearchQuery("");
    } catch (error) {
      console.error("Error:", error);
      setContent("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Learning Content Creator</h1>
      <p className="text-muted-foreground mb-6">
        Generate comprehensive learning content on any topic with AI assistance.
      </p>

      <div className="flex justify-between items-center mb-6">
        <LanguageSelector
          modelType={LEARNING_MODEL}
          onLanguageChange={handleLanguageChange}
          defaultLanguage={selectedLanguage}
        />
      </div>

      <LanguageInfo modelType={LEARNING_MODEL} />

      <form onSubmit={handleSubmit} className="mb-8 mt-4">
        <div className="flex flex-col space-y-4">
          <Textarea
            ref={textareaRef}
            placeholder="Enter a topic or concept you want to learn about..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button
            type="submit"
            className="self-end"
            disabled={!searchQuery.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </form>

      {content && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Learning Content</h2>
          <div className="whitespace-pre-wrap">{content}</div>
        </Card>
      )}

      {previousQueries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Previous Topics</h2>
          <div className="space-y-4">
            {previousQueries.map((item, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-medium mb-2">Topic: {item.query}</h3>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {item.content}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
