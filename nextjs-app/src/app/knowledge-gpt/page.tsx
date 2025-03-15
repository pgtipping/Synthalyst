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

// Define the KNOWLEDGE_MODEL constant
const KNOWLEDGE_MODEL = "KNOWLEDGE_MODEL";

export default function KnowledgeGPT() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [previousQuestions, setPreviousQuestions] = useState<
    { question: string; answer: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle language change
  const handleLanguageChange = (language: string) => {
    console.log("Knowledge GPT - Language changed to:", language);
    setSelectedLanguage(language);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");

    console.log("Submitting question with language:", selectedLanguage);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          language: selectedLanguage,
          type: "knowledge",
        }),
      });

      const data = await response.json();

      // Check if we have content in the response
      if (data.content) {
        setAnswer(data.content);

        // Add to previous questions
        setPreviousQuestions((prev) => [
          { question, answer: data.content },
          ...prev,
        ]);

        setQuestion("");
      } else if (data.error) {
        // Handle error message from API
        console.error("API Error:", data.error);
        setAnswer(`Error: ${data.error}`);
      } else {
        // Unexpected response format
        console.error("Unexpected API response:", data);
        setAnswer("Sorry, there was an error processing your request.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAnswer(
        "Sorry, there was an error processing your request. Please try again later."
      );
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
  }, [question]);

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Knowledge GPT</h1>
      <p className="text-muted-foreground mb-6">
        Ask any question and get a detailed, accurate answer based on the latest
        available information.
      </p>

      <div className="flex justify-between items-center mb-6">
        <LanguageSelector
          modelType={KNOWLEDGE_MODEL}
          onLanguageChange={handleLanguageChange}
          defaultLanguage={selectedLanguage}
        />
      </div>

      <LanguageInfo modelType={KNOWLEDGE_MODEL} />

      <form onSubmit={handleSubmit} className="mb-8 mt-4">
        <div className="flex flex-col space-y-4">
          <Textarea
            ref={textareaRef}
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button
            type="submit"
            className="self-end"
            disabled={!question.trim() || isLoading}
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

      {answer && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Answer</h2>
          <div className="whitespace-pre-wrap">{answer}</div>
        </Card>
      )}

      {previousQuestions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Previous Questions</h2>
          <div className="space-y-4">
            {previousQuestions.map((item, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-medium mb-2">Q: {item.question}</h3>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  A: {item.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
