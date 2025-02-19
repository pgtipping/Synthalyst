"use client";

import { useState } from "react";

interface Question {
  id: string;
  text: string;
  answer: string;
  timestamp: string;
  tags: string[];
}

export default function KnowledgeGPT() {
  const [question, setQuestion] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);

  const knowledgeBases = [
    {
      id: "1",
      title: "Programming Fundamentals",
      description: "Core programming concepts and best practices",
      topics: ["algorithms", "data structures", "design patterns"],
      questions: [],
    },
    {
      id: "2",
      title: "Web Development",
      description: "Modern web development technologies and practices",
      topics: ["frontend", "backend", "databases", "security"],
      questions: [],
    },
    // Add more knowledge bases as needed
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/knowledge-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          topics: selectedTopics,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setCurrentAnswer(data.answer);

      const newQuestion: Question = {
        id: Date.now().toString(),
        text: question,
        answer: data.answer,
        timestamp: new Date().toISOString(),
        tags: selectedTopics,
      };

      setRecentQuestions((prev) => [newQuestion, ...prev.slice(0, 9)]);
      setQuestion("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const allTopics = Array.from(
    new Set(knowledgeBases.flatMap((kb) => kb.topics))
  ).sort();

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const filteredQuestions = recentQuestions.filter(
    (q) =>
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Knowledge GPT</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Question Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700"
              >
                Ask a Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="What would you like to learn about?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTopics.includes(topic)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Getting Answer..." : "Ask Question"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {currentAnswer && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Answer</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 prose max-w-none">
                  <pre className="whitespace-pre-wrap">{currentAnswer}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Questions and Search */}
        <div>
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>

            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="border-b pb-4">
                  <p className="font-medium">{q.text}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(q.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
