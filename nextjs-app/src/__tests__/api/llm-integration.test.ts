/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST as generateTrainingPlan } from "@/app/api/training-plan/route";
import { POST as generateEnhancedPlan } from "@/app/api/training-plan/enhanced-generate/route";
import { generateTrainingPlanWithFallback } from "@/lib/trainingPlanFallback";
import { getServerSession } from "next-auth";
import { Resource } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { openRouter } from "@/lib/openrouter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

// Mock dependencies
jest.mock("next-auth");
jest.mock("@/lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));
jest.mock("@/lib/openrouter");
jest.mock("@google/generative-ai");

// Mock Response for Next.js
global.Response = class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    return new (jest.requireActual("node-fetch").Response)(body, init);
  }
} as typeof Response;

describe("LLM Integration Tests", () => {
  let prismaMock: DeepMockProxy<PrismaClient>;

  const mockSession = {
    user: {
      id: "test-user-id",
      email: "test@example.com",
      subscriptionTier: "premium",
    },
  };

  const mockTrainingPlanRequest = {
    title: "Advanced JavaScript Course",
    description: "Comprehensive JavaScript training",
    objectives: [
      "Master async/await",
      "Understand prototypes",
      "Learn design patterns",
    ],
    targetAudienceLevel: "Intermediate",
    duration: "6 weeks",
    prerequisites: "Basic JavaScript knowledge",
    learningStylePrimary: "Hands-on",
    industry: "Software Development",
    materialsRequired: ["Computer", "Node.js installed"],
    certificationDetails: "JavaScript Certification",
    additionalNotes: "Focus on practical examples",
  };

  const mockEnhancedRequest = {
    ...mockTrainingPlanRequest,
    userEmail: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    // Mock OpenRouter API response
    (openRouter.chat.completions.create as jest.Mock).mockResolvedValue({
      id: "test-completion-id",
      object: "chat.completion",
      created: Date.now(),
      model: "meta-llama/llama-3.2-3b-instruct",
      choices: [
        {
          message: {
            role: "assistant",
            content: `<div class="training-plan">
              <h1>Advanced JavaScript Course</h1>
              <h2>1. Overview</h2>
              <p>A comprehensive JavaScript training program...</p>
              <h2>2. Learning Objectives</h2>
              <p>By the end of this course, participants will...</p>
              <h2>3. Target Audience</h2>
              <p>This course is designed for intermediate developers...</p>
              <h2>4. Prerequisites</h2>
              <p>Basic JavaScript knowledge is required...</p>
              <h2>5. Training Structure</h2>
              <p>The course is organized into modules...</p>
              <h2>6. Detailed Content</h2>
              <div class="module">
                <h3>Module 1: Asynchronous Programming</h3>
                <ul>
                  <li><strong>Duration:</strong> 2 weeks</li>
                  <li><strong>Learning objectives:</strong> Master async/await</li>
                  <li><strong>Content outline:</strong> Promises, async/await</li>
                  <li><strong>Activities:</strong> Coding exercises</li>
                  <li><strong>Resources:</strong> MDN documentation</li>
                </ul>
              </div>
              <h2>7. Learning Activities</h2>
              <ul>
                <li>Hands-on exercises</li>
                <li>Group discussions</li>
                <li>Case studies</li>
              </ul>
              <h2>8. Assessment Methods</h2>
              <ul>
                <li>Coding challenges</li>
                <li>Project work</li>
                <li>Final assessment</li>
              </ul>
              <h2>9. Resources</h2>
              <p>Recommended books, articles, and online resources...</p>
            </div>`,
          },
          finish_reason: "stop",
          index: 0,
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 500,
        total_tokens: 600,
      },
    });

    // Mock Gemini API response
    const mockGeminiModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify([
              {
                id: "resource-1",
                title: "JavaScript: The Good Parts",
                author: "Douglas Crockford",
                type: "book",
                description:
                  "A comprehensive guide to JavaScript best practices",
                relevanceScore: 9,
              },
              {
                id: "resource-2",
                title: "Async JavaScript Deep Dive",
                type: "course",
                url: "https://example.com/course",
                description: "Master asynchronous programming in JavaScript",
                relevanceScore: 8,
              },
            ]),
        },
      }),
    };

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: () => mockGeminiModel,
    }));

    // Mock Prisma
    prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
    prismaMock.trainingPlan.create.mockResolvedValue({
      id: "test-plan-id",
      title: mockTrainingPlanRequest.title,
      description: mockTrainingPlanRequest.description,
      objectives: mockTrainingPlanRequest.objectives,
      duration: mockTrainingPlanRequest.duration,
      content: JSON.stringify({
        sections: [],
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: mockSession.user.id,
    });
  });

  describe("Basic Training Plan Generation with LLM", () => {
    it("should generate a training plan with Llama", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/training-plan",
        {
          method: "POST",
          body: JSON.stringify(mockTrainingPlanRequest),
        }
      );

      const response = await generateTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.plan).toBeDefined();
      expect(typeof data.plan).toBe("string");

      // Verify the plan contains expected sections
      expect(data.plan).toContain("Overview");
      expect(data.plan).toContain("Learning Objectives");
      expect(data.plan).toContain("Target Audience");
      expect(data.plan).toContain("Prerequisites");
      expect(data.plan).toContain("Training Structure");
      expect(data.plan).toContain("Detailed Content");
      expect(data.plan).toContain("Learning Activities");
      expect(data.plan).toContain("Assessment Methods");
      expect(data.plan).toContain("Resources");
    }, 30000); // Increased timeout for API call

    it("should handle LLM error gracefully", async () => {
      // Temporarily invalidate API key to force error
      const originalKey = process.env.OPENROUTER_API_KEY;
      process.env.OPENROUTER_API_KEY = "invalid-key";

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan",
        {
          method: "POST",
          body: JSON.stringify(mockTrainingPlanRequest),
        }
      );

      const response = await generateTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();

      // Restore API key
      process.env.OPENROUTER_API_KEY = originalKey;
    });
  });

  describe("Enhanced Training Plan Generation with Llama and Gemini", () => {
    it("should generate an enhanced plan with resources", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/enhanced-generate",
        {
          method: "POST",
          body: JSON.stringify(mockEnhancedRequest),
        }
      );

      const response = await generateEnhancedPlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.content).toBeDefined();
      expect(data.data.resources).toBeDefined();
      expect(Array.isArray(data.data.resources)).toBe(true);

      // Verify resources structure
      const resources = data.data.resources;
      resources.forEach((resource: Resource) => {
        expect(resource.id).toBeDefined();
        expect(resource.title).toBeDefined();
        expect(resource.type).toBeDefined();
        expect(resource.description).toBeDefined();
        expect(resource.relevanceScore).toBeDefined();
        expect(resource.relevanceScore).toBeGreaterThanOrEqual(1);
        expect(resource.relevanceScore).toBeLessThanOrEqual(10);
      });
    }, 60000); // Increased timeout for multiple API calls

    it("should handle Gemini resource generation failure gracefully", async () => {
      // Temporarily invalidate Gemini API key to force error
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = "invalid-key";

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/enhanced-generate",
        {
          method: "POST",
          body: JSON.stringify(mockEnhancedRequest),
        }
      );

      const response = await generateEnhancedPlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.content).toBeDefined();
      expect(data.data.resources).toBeNull();

      // Restore API key
      process.env.GEMINI_API_KEY = originalKey;
    });
  });

  describe("Fallback Mechanism", () => {
    it("should fallback to Gemini when Llama fails", async () => {
      // Temporarily invalidate OpenRouter API key to force Llama failure
      const originalOpenRouterKey = process.env.OPENROUTER_API_KEY;
      process.env.OPENROUTER_API_KEY = "invalid-key";

      const response = await generateTrainingPlanWithFallback({
        ...mockTrainingPlanRequest,
        isPremiumUser: true,
      });

      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe("string");

      // Restore API key
      process.env.OPENROUTER_API_KEY = originalOpenRouterKey;
    }, 45000); // Increased timeout for fallback

    it("should fallback to default template when all LLMs fail", async () => {
      // Temporarily invalidate all API keys to force complete fallback
      const originalOpenRouterKey = process.env.OPENROUTER_API_KEY;
      const originalGeminiKey = process.env.GEMINI_API_KEY;
      const originalGroqKey = process.env.GROQ_API_KEY;

      process.env.OPENROUTER_API_KEY = "invalid-key";
      process.env.GEMINI_API_KEY = "invalid-key";
      process.env.GROQ_API_KEY = "invalid-key";

      const response = await generateTrainingPlanWithFallback({
        ...mockTrainingPlanRequest,
        isPremiumUser: true,
      });

      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe("string");
      expect(response.text).toContain("Training Plan Template");

      // Restore API keys
      process.env.OPENROUTER_API_KEY = originalOpenRouterKey;
      process.env.GEMINI_API_KEY = originalGeminiKey;
      process.env.GROQ_API_KEY = originalGroqKey;
    });
  });
});
