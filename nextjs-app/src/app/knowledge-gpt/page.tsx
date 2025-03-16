"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Info } from "lucide-react";
import {
  LanguageSelector,
  LanguageInfo,
} from "@/components/ui/language-selector";

// Define the KNOWLEDGE_MODEL constant
const KNOWLEDGE_MODEL = "KNOWLEDGE_MODEL";

export default function KnowledgeGPT() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [showTips, setShowTips] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Handle language change
  const handleLanguageChange = (language: string) => {
    console.log("Knowledge GPT - Language changed to:", language);
    setSelectedLanguage(language);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message to chat history immediately
    const userQuestion = question.trim();
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: userQuestion },
    ]);

    // Clear input
    setQuestion("");

    // Hide tips after first question
    if (showTips) setShowTips(false);

    console.log("Submitting question with language:", selectedLanguage);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          language: selectedLanguage,
          type: "knowledge",
        }),
      });

      const data = await response.json();

      // Check if we have content in the response
      if (data.content) {
        // Add assistant response to chat history
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      } else if (data.error) {
        // Handle error message from API
        console.error("API Error:", data.error);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm sorry, I encountered an error: ${data.error}. Please try a different question or try again later.`,
          },
        ]);
      } else {
        // Unexpected response format
        console.error("Unexpected API response:", data);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, there was an error processing your request. Please try again later.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again later.",
        },
      ]);
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
    <div className="container mx-auto py-8 max-w-5xl flex flex-col flex-grow">
      <h1 className="text-3xl font-bold mb-2">Knowledge GPT</h1>
      <p className="text-muted-foreground mb-6">
        Ask any question and get a detailed, accurate answer based on the latest
        available information. Knowledge GPT uses web search to provide
        up-to-date answers.
      </p>

      <div className="flex justify-between items-center mb-4">
        <LanguageSelector
          modelType={KNOWLEDGE_MODEL}
          onLanguageChange={handleLanguageChange}
          defaultLanguage={selectedLanguage}
        />
      </div>

      <LanguageInfo modelType={KNOWLEDGE_MODEL} />

      {/* Chat container */}
      <div className="flex-grow overflow-y-auto mb-4 mt-4 bg-muted/30 rounded-lg p-4">
        {showTips && (
          <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-700">
                  Tips for using Knowledge GPT
                </h3>
                <ul className="text-sm text-blue-600 mt-2 list-disc pl-5 space-y-1">
                  <li>Ask specific questions for more accurate answers</li>
                  <li>Change the language using the selector above</li>
                  <li>
                    Try educational topics, current events, or general knowledge
                    questions
                  </li>
                  <li>Web search is used to provide up-to-date information</li>
                  <li>Press Enter to send your message quickly</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {chatHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Start a conversation by asking a question below
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            type="submit"
            className="h-[60px]"
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
