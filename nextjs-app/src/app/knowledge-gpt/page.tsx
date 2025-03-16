"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Info, Globe, Globe2, HeartPulse } from "lucide-react";
import {
  LanguageSelector,
  LanguageInfo,
} from "@/components/ui/language-selector";
import { LoadingDots } from "@/components/ui/loading-dots";
import { useSession } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

// Define the KNOWLEDGE_MODEL constant
const KNOWLEDGE_MODEL = "KNOWLEDGE_MODEL";

// Define knowledge domains
type KnowledgeDomain = "general" | "medical";

// Function to convert asterisks to proper HTML formatting
function formatMessageContent(content: string): string {
  // Replace **text** with <strong>text</strong>
  let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Replace bullet points with proper HTML bullets
  formatted = formatted.replace(/^\s*\*\s+(.+)$/gm, "<li>$1</li>");

  // Wrap bullet lists in <ul> tags
  formatted = formatted.replace(
    /<li>(.+)<\/li>(\n<li>(.+)<\/li>)+/g,
    "<ul>$&</ul>"
  );

  return formatted;
}

export default function KnowledgeGPT() {
  const { data: session } = useSession();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedDomain, setSelectedDomain] =
    useState<KnowledgeDomain>("general");
  const [chatHistory, setChatHistory] = useState<
    {
      role: "user" | "assistant";
      content: string;
      sources?: Array<{
        title: string;
        authors: string[];
        journal: string;
        date: string;
        url: string;
        pmid: string;
      }>;
      evidenceLevel?: string;
    }[]
  >([]);
  const [showTips, setShowTips] = useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Handle language change
  const handleLanguageChange = (language: string) => {
    console.log("Knowledge GPT - Language changed to:", language);
    setSelectedLanguage(language);
  };

  // Handle domain change
  const handleDomainChange = (domain: KnowledgeDomain) => {
    console.log("Knowledge GPT - Domain changed to:", domain);
    setSelectedDomain(domain);
    // Reset chat history when domain changes
    setChatHistory([]);
    setShowTips(true);
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
    console.log("Web search enabled:", webSearchEnabled);
    console.log("Selected domain:", selectedDomain);

    try {
      let response;

      if (selectedDomain === "medical") {
        // Use medical knowledge API
        response = await fetch("/api/medical-knowledge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userQuestion,
            maxResults: 5,
            requireRecent: true,
          }),
        });
      } else {
        // Use general knowledge API
        response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userQuestion,
            language: selectedLanguage,
            type: "knowledge",
            useWebSearch: webSearchEnabled,
          }),
        });
      }

      const data = await response.json();

      // Check if we have content in the response
      if (data.content) {
        // Add assistant response to chat history
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.content,
            sources: data.sources,
            evidenceLevel: data.evidenceLevel,
          },
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

  // Format message with citations
  const formatMessageWithCitations = (content: string) => {
    // Replace citation patterns like [1], [2], etc. with superscript
    return content.replace(
      /\[(\d+)\]/g,
      '<sup class="text-blue-600 font-bold">[$1]</sup>'
    );
  };

  // Get badge color based on evidence level
  const getEvidenceLevelBadge = (level?: string) => {
    switch (level) {
      case "high":
        return "bg-green-500 text-white";
      case "moderate":
        return "bg-blue-500 text-white";
      case "low":
        return "bg-yellow-500 text-white";
      case "very-low":
        return "bg-red-500 text-white";
      default:
        return "";
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="container mx-auto py-8 max-w-5xl flex flex-col flex-grow">
        <h1 className="text-3xl font-bold mb-2">Knowledge GPT</h1>
        <p className="text-muted-foreground mb-6">
          Ask any question and get a detailed, accurate answer. Toggle web
          search for up-to-date information on current events and facts.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSelector
              modelType={KNOWLEDGE_MODEL}
              onLanguageChange={handleLanguageChange}
              defaultLanguage={selectedLanguage}
              className="h-10"
            />

            <Select
              value={selectedDomain}
              onValueChange={(value) =>
                handleDomainChange(value as KnowledgeDomain)
              }
            >
              <SelectTrigger className="w-[180px] h-10">
                <div className="flex items-center gap-2">
                  {selectedDomain === "general" ? null : (
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>
                    {selectedDomain === "general"
                      ? "General Knowledge"
                      : "Medical Knowledge"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <span>General Knowledge</span>
                </SelectItem>
                <SelectItem value="medical">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4" />
                    <span>Medical Knowledge</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDomain === "general" &&
            (session ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-10"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              >
                {webSearchEnabled ? (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Web Search: ON</span>
                  </>
                ) : (
                  <>
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    <span>Web Search: OFF</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="relative inline-block group">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-10"
                  disabled
                >
                  <Globe2 className="h-4 w-4 text-muted-foreground" />
                  <span>Web Search: OFF</span>
                </Button>
                <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-blue-600 rounded-md text-xs font-medium text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                  Login to use web search
                </div>
              </div>
            ))}
        </div>

        {selectedDomain === "general" && (
          <LanguageInfo modelType={KNOWLEDGE_MODEL} />
        )}

        {/* Chat container */}
        <div className="flex-grow overflow-y-auto mb-4 mt-4 bg-muted/30 rounded-lg p-4">
          {showTips && (
            <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700">
                    Tips for using{" "}
                    {selectedDomain === "medical"
                      ? "Medical Knowledge Assistant"
                      : "Knowledge GPT"}
                  </h3>
                  {selectedDomain === "medical" ? (
                    <ul className="text-sm text-blue-600 mt-2 list-disc pl-5 space-y-1">
                      <li>Ask specific health-related questions</li>
                      <li>
                        Inquire about medical conditions, treatments, or
                        preventive care
                      </li>
                      <li>
                        All answers include citations from peer-reviewed medical
                        literature
                      </li>
                      <li>
                        Remember that this is not a substitute for professional
                        medical advice
                      </li>
                      <li>
                        Only ask direct questions - conversational phrases like
                        &quot;hello&quot; or &quot;thank you&quot; will be
                        treated as new queries
                      </li>
                    </ul>
                  ) : (
                    <ul className="text-sm text-blue-600 mt-2 list-disc pl-5 space-y-1">
                      <li>Ask specific questions for more accurate answers</li>
                      <li>Change the language using the selector above</li>
                      <li>
                        Try educational topics, current events, or general
                        knowledge questions
                      </li>
                      <li>
                        Only ask direct questions - conversational phrases like
                        &quot;hello&quot; or &quot;thank you&quot; will be
                        treated as new queries
                      </li>
                      <li>Toggle web search for up-to-date information</li>
                      <li>Press Enter to send your message quickly</li>
                    </ul>
                  )}
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
                    {message.role === "assistant" ? (
                      <>
                        {message.evidenceLevel && (
                          <div
                            className={`mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getEvidenceLevelBadge(
                              message.evidenceLevel
                            )}`}
                          >
                            Evidence Level:{" "}
                            {message.evidenceLevel.toUpperCase()}
                          </div>
                        )}

                        <div
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html:
                              selectedDomain === "medical"
                                ? formatMessageWithCitations(message.content)
                                : formatMessageContent(message.content),
                          }}
                        />

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4 pt-2 border-t border-gray-200">
                            <h4 className="text-sm font-medium flex items-center">
                              <span className="mr-1">Sources</span>
                            </h4>
                            <ol className="text-xs mt-1 space-y-1 text-gray-600">
                              {message.sources.map((source, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="mr-1 font-bold">
                                    [{i + 1}]
                                  </span>
                                  <span>
                                    {source.authors?.slice(0, 1).join(", ")}
                                    {source.authors?.length > 1
                                      ? " et al."
                                      : ""}
                                    .{" "}
                                    <span className="font-medium">
                                      {source.title}
                                    </span>
                                    . {source.journal} (
                                    {new Date(source.date).getFullYear()})
                                    <a
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center ml-1 text-blue-600 hover:underline"
                                    >
                                      <span className="text-[10px] ml-0.5">
                                        ↗
                                      </span>
                                    </a>
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-card border">
                    <LoadingDots className="text-primary" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              placeholder={
                selectedDomain === "medical"
                  ? "Ask a health-related question..."
                  : "Ask a question..."
              }
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
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {selectedDomain === "medical" && (
            <p className="text-xs text-gray-500 mt-2">
              Note: This tool provides information from medical literature but
              is not a substitute for professional medical advice.
            </p>
          )}
        </form>
      </div>
    </TooltipProvider>
  );
}
