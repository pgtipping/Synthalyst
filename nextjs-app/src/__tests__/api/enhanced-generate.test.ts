import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { POST } from "@/app/api/training-plan/enhanced-generate/route";
import { generatePlanWithLlama } from "@/lib/llama";
import { fetchResourcesWithGemini } from "@/lib/gemini";
import { subscription } from "@/lib/subscription";

// Mock the dependencies
jest.mock("@/lib/llama");
jest.mock("@/lib/gemini");
jest.mock("@/lib/subscription");
jest.mock("next-auth");

describe("Enhanced Training Plan Generation API", () => {
  const mockSession = {
    user: {
      id: "test-user-id",
      email: "test@example.com",
    },
  };

  const mockRequest = {
    title: "Enhanced Test Plan",
    objectives: ["Learn TDD", "Master API Testing"],
    targetAudienceLevel: "Advanced",
    duration: "4 weeks",
    description: "A comprehensive test plan",
    prerequisites: "Intermediate JavaScript",
    learningStylePrimary: "Hands-on",
    industry: "Software Development",
    materialsRequired: ["Laptop", "IDE"],
    certificationDetails: "Available",
    additionalNotes: "Focus on practical examples",
    userEmail: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (subscription.isPremium as jest.Mock).mockResolvedValue(true);
  });

  it("should generate an enhanced plan for premium users with resources", async () => {
    const mockResources = [
      { title: "Advanced Testing Guide", url: "http://example.com/guide" },
      { title: "TDD Best Practices", url: "http://example.com/tdd" },
    ];

    const mockPlanResponse = {
      text: "Enhanced training plan content",
    };

    (fetchResourcesWithGemini as jest.Mock).mockResolvedValue(mockResources);
    (generatePlanWithLlama as jest.Mock).mockResolvedValue(mockPlanResponse);

    const request = new NextRequest(
      "http://localhost:3000/api/training-plan/enhanced-generate",
      {
        method: "POST",
        body: JSON.stringify(mockRequest),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject({
      title: mockRequest.title,
      content: mockPlanResponse.text,
      resources: mockResources,
      isPremium: true,
    });

    expect(fetchResourcesWithGemini).toHaveBeenCalledWith({
      objectives: mockRequest.objectives,
      targetAudienceLevel: mockRequest.targetAudienceLevel,
      industry: mockRequest.industry,
    });
  });

  it("should handle unauthorized access", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/training-plan/enhanced-generate",
      {
        method: "POST",
        body: JSON.stringify(mockRequest),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe(
      "You must be logged in to generate a training plan"
    );
  });

  it("should handle email mismatch", async () => {
    const requestWithWrongEmail = {
      ...mockRequest,
      userEmail: "wrong@example.com",
    };

    const request = new NextRequest(
      "http://localhost:3000/api/training-plan/enhanced-generate",
      {
        method: "POST",
        body: JSON.stringify(requestWithWrongEmail),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("User email does not match session email");
  });

  it("should handle validation errors", async () => {
    const invalidRequest = {
      ...mockRequest,
      title: "", // Invalid: title must be at least 3 characters
    };

    const request = new NextRequest(
      "http://localhost:3000/api/training-plan/enhanced-generate",
      {
        method: "POST",
        body: JSON.stringify(invalidRequest),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data).toHaveProperty("details");
  });

  it("should handle resource fetching errors gracefully", async () => {
    (fetchResourcesWithGemini as jest.Mock).mockRejectedValue(
      new Error("Resource fetching failed")
    );

    const mockPlanResponse = {
      text: "Enhanced training plan content without resources",
    };
    (generatePlanWithLlama as jest.Mock).mockResolvedValue(mockPlanResponse);

    const request = new NextRequest(
      "http://localhost:3000/api/training-plan/enhanced-generate",
      {
        method: "POST",
        body: JSON.stringify(mockRequest),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject({
      title: mockRequest.title,
      content: mockPlanResponse.text,
      resources: null,
      isPremium: true,
    });
  });

  it("should handle plan generation failure", async () => {
    (generatePlanWithLlama as jest.Mock).mockResolvedValue({ text: null });

    const request = new NextRequest(
      "http://localhost:3000/api/training-plan/enhanced-generate",
      {
        method: "POST",
        body: JSON.stringify(mockRequest),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to generate training plan");
  });
});
