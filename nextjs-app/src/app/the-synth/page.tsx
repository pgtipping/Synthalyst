"use client";

import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface BlogPostMetadata {
  topic: string;
  style: string;
  audience: string;
  generatedAt: string;
}

export default function TheSynthBlog() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("informative");
  const [audience, setAudience] = useState("general professionals");
  const [blogPost, setBlogPost] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<BlogPostMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBlogPost = async () => {
    if (!topic) {
      setError("Please enter a blog topic");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/blog", {
        topic,
        style,
        audience,
      });

      setBlogPost(response.data.blogPost);
      setMetadata({
        topic: response.data.metadata.topic,
        style: response.data.metadata.style,
        audience: response.data.metadata.audience,
        generatedAt: response.data.metadata.generatedAt,
      });
    } catch (err) {
      setError("Failed to generate blog post. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">The Synth - Blog Generator</h1>

      <div className="grid gap-4 mb-6">
        <label htmlFor="blog-topic" className="sr-only">
          Blog Topic
        </label>
        <input
          id="blog-topic"
          type="text"
          placeholder="Enter blog topic"
          aria-label="Blog Topic"
          value={topic}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTopic(e.target.value)
          }
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="writing-style"
              className="block text-sm font-medium text-black mb-1"
            >
              Writing Style
            </label>
            <select
              id="writing-style"
              value={style}
              aria-label="Select writing style"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setStyle(e.target.value)
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="informative">Informative</option>
              <option value="conversational">Conversational</option>
              <option value="professional">Professional</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="target-audience"
              className="block text-sm font-medium text-black mb-1"
            >
              Target Audience
            </label>
            <select
              id="target-audience"
              value={audience}
              aria-label="Select target audience"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAudience(e.target.value)
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general professionals">
                General Professionals
              </option>
              <option value="tech enthusiasts">Tech Enthusiasts</option>
              <option value="students">Students</option>
              <option value="entrepreneurs">Entrepreneurs</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateBlogPost}
          disabled={isLoading}
          aria-label="Generate Blog Post"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
              Generating Blog Post...
            </>
          ) : (
            "Generate Blog Post"
          )}
        </button>

        {error && (
          <div role="alert" className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>

      {blogPost && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Generated Blog Post</h2>

          {metadata && (
            <div className="mb-4 text-sm text-black">
              <p>Topic: {metadata.topic}</p>
              <p>Style: {metadata.style}</p>
              <p>Audience: {metadata.audience}</p>
              <p>
                Generated: {new Date(metadata.generatedAt).toLocaleString()}
              </p>
            </div>
          )}

          <label htmlFor="generated-blog-post" className="sr-only">
            Generated Blog Post
          </label>
          <textarea
            id="generated-blog-post"
            value={blogPost}
            aria-label="Generated Blog Post"
            readOnly
            className="w-full min-h-[300px] px-3 py-2 border rounded-md"
          />
        </div>
      )}
    </div>
  );
}
