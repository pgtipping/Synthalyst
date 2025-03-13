"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIAssistantProps {
  onSuggestionAccept?: (suggestion: string) => void;
  onContentGenerated?: (content: string) => void;
  onTagsGenerated?: (categories: string[], tags: string[]) => void;
  currentContent?: string;
}

export default function AIAssistant({
  onSuggestionAccept,
  onContentGenerated,
  onTagsGenerated,
  currentContent = "",
}: AIAssistantProps) {
  const [prompt, setPrompt] = useState(currentContent || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const generateSuggestions = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      // In a real app, this would call an API endpoint
      // const response = await fetch('/api/ai/suggestions', {
      //   method: 'POST',
      //   body: JSON.stringify({ prompt }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();

      // Mock response
      const mockSuggestions = [
        "10 Ways to Optimize Your Next.js Application for Better Performance",
        "Understanding Server Components in Next.js: A Comprehensive Guide",
        "Building Accessible Web Applications with Next.js and React",
        "The Future of Web Development: Next.js, React Server Components, and Beyond",
      ];

      // Simulate API delay
      setTimeout(() => {
        setSuggestions(mockSuggestions);
        setIsLoading(false);

        // If content generation is requested, generate mock content
        if (onContentGenerated) {
          const mockContent =
            "# " +
            mockSuggestions[0] +
            "\n\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.";
          onContentGenerated(mockContent);
        }

        // If tag generation is requested, generate mock tags
        if (onTagsGenerated) {
          const mockCategories = ["Technology", "Web Development"];
          const mockTags = ["Next.js", "React", "Performance"];
          onTagsGenerated(mockCategories, mockTags);
        }
      }, 1500);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    onSuggestionAccept?.(suggestion);
    setSuggestions([]);
    setPrompt("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Describe what you want to write about..."
            value={prompt}
            onChange={handlePromptChange}
            className="min-h-[100px]"
          />
          <Button
            onClick={generateSuggestions}
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? "Generating..." : "Generate Suggestions"}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Suggestions</h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="border rounded-md p-3">
                  <p className="text-sm mb-2">{suggestion}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAcceptSuggestion(suggestion)}
                  >
                    Use This
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
