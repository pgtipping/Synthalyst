import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { POST } from "@/app/api/training-plan/route";
import { generateTrainingPlanWithFallback } from "@/lib/trainingPlanFallback";
import { generateResourcesWithGemini } from "@/lib/gemini";

// Mock the dependencies
jest.mock("@/lib/trainingPlanFallback");
jest.mock("@/lib/gemini");
jest.mock("next-auth");

describe("Training Plan API", () => {
  const mockSession = {
    user: {
      id: "test-user-id",
      email: "test@example.com",
      subscriptionTier: "premium",
    },
  };

  const mockRequest = {
    title: "Test Training Plan",
    description: "A test training plan",
    objectives: ["Learn testing", "Master Jest"],
    targetAudienceLevel: "Intermediate",
    duration: "2 weeks",
    prerequisites: "Basic JavaScript",
    learningStylePrimary: "Visual",
    industry: "Technology",
    materialsRequired: ["Computer", "Internet"],
    certificationDetails: "None",
    additionalNotes: "Test notes",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it("should generate a training plan for premium users with resources", async () => {
    const mockResources = [
      { title: "Resource 1", url: "http://example.com/1" },
      { title: "Resource 2", url: "http://example.com/2" },
    ];

    const mockPlanResponse = {
      text: "Generated training plan content",
    };

    (generateResourcesWithGemini as jest.Mock).mockResolvedValue(mockResources);
    (generateTrainingPlanWithFallback as jest.Mock).mockResolvedValue(
      mockPlanResponse
    );

    const request = new NextRequest("http://localhost:3000/api/training-plan", {
      method: "POST",
      body: JSON.stringify(mockRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      plan: mockPlanResponse.text,
      isPremiumUser: true,
      resourceCount: 2,
      resources: mockResources,
    });

    expect(generateResourcesWithGemini).toHaveBeenCalledWith(
      mockRequest.title,
      mockRequest.objectives,
      mockRequest.targetAudienceLevel,
      mockRequest.industry,
      mockRequest.learningStylePrimary
    );

    expect(generateTrainingPlanWithFallback).toHaveBeenCalledWith({
      ...mockRequest,
      isPremiumUser: true,
      resources: mockResources,
    });
  });

  it("should generate a training plan for non-premium users without resources", async () => {
    const nonPremiumSession = {
      user: {
        ...mockSession.user,
        subscriptionTier: "free",
      },
    };
    (getServerSession as jest.Mock).mockResolvedValue(nonPremiumSession);

    const mockPlanResponse = {
      text: "Generated training plan content",
    };

    (generateTrainingPlanWithFallback as jest.Mock).mockResolvedValue(
      mockPlanResponse
    );

    const request = new NextRequest("http://localhost:3000/api/training-plan", {
      method: "POST",
      body: JSON.stringify(mockRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      plan: mockPlanResponse.text,
      isPremiumUser: false,
      resourceCount: 0,
      resources: [],
    });

    expect(generateResourcesWithGemini).not.toHaveBeenCalled();
    expect(generateTrainingPlanWithFallback).toHaveBeenCalledWith({
      ...mockRequest,
      isPremiumUser: false,
      resources: null,
    });
  });

  it("should handle validation errors", async () => {
    const invalidRequest = {
      ...mockRequest,
      title: "", // Invalid: title is required
    };

    const request = new NextRequest("http://localhost:3000/api/training-plan", {
      method: "POST",
      body: JSON.stringify(invalidRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Validation error");
    expect(data).toHaveProperty("details");
  });

  it("should handle resource generation errors gracefully", async () => {
    (generateResourcesWithGemini as jest.Mock).mockRejectedValue(
      new Error("Resource generation failed")
    );

    const mockPlanResponse = {
      text: "Generated training plan content",
    };
    (generateTrainingPlanWithFallback as jest.Mock).mockResolvedValue(
      mockPlanResponse
    );

    const request = new NextRequest("http://localhost:3000/api/training-plan", {
      method: "POST",
      body: JSON.stringify(mockRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      plan: mockPlanResponse.text,
      isPremiumUser: true,
      resourceCount: 0,
      resources: [],
    });
  });
});
