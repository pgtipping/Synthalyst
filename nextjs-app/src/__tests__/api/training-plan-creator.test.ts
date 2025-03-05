import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { POST as createTrainingPlan } from "@/app/api/training-plan/route";
import { POST as createEnhancedTrainingPlan } from "@/app/api/training-plan/enhanced-generate/route";
import { POST as saveTrainingPlan } from "@/app/api/training-plan/saved/route";
import { generateTrainingPlanWithFallback } from "@/lib/trainingPlanFallback";
import { generatePlanWithLlama } from "@/lib/llama";
import { fetchResourcesWithGemini } from "@/lib/gemini";
import { subscription } from "@/lib/subscription";
import { prismaMock } from "@/lib/__mocks__/prisma";

// Mock dependencies
jest.mock("@/lib/trainingPlanFallback");
jest.mock("@/lib/llama");
jest.mock("@/lib/gemini");
jest.mock("@/lib/subscription");
jest.mock("next-auth");

describe("Training Plan Creator API", () => {
  const mockSession = {
    user: {
      id: "test-user-id",
      email: "test@example.com",
      subscriptionTier: "premium",
    },
  };

  const mockBasicRequest = {
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

  const mockEnhancedRequest = {
    ...mockBasicRequest,
    userEmail: "test@example.com",
  };

  const mockSaveRequest = {
    id: "test-plan-id",
    title: "Test Training Plan",
    content: "Test content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("Basic Training Plan Generation", () => {
    it("should generate a training plan for premium users with resources", async () => {
      const mockResources = [
        { title: "Resource 1", url: "http://example.com/1" },
        { title: "Resource 2", url: "http://example.com/2" },
      ];

      const mockPlanResponse = {
        text: "Generated training plan content",
      };

      (generateResourcesWithGemini as jest.Mock).mockResolvedValue(
        mockResources
      );
      (generateTrainingPlanWithFallback as jest.Mock).mockResolvedValue(
        mockPlanResponse
      );

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan",
        {
          method: "POST",
          body: JSON.stringify(mockBasicRequest),
        }
      );

      const response = await createTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        plan: mockPlanResponse.text,
        isPremiumUser: true,
        resourceCount: 2,
        resources: mockResources,
      });
    });

    it("should handle validation errors", async () => {
      const invalidRequest = {
        ...mockBasicRequest,
        title: "", // Invalid: title is required
      };

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan",
        {
          method: "POST",
          body: JSON.stringify(invalidRequest),
        }
      );

      const response = await createTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Validation error");
    });
  });

  describe("Enhanced Training Plan Generation", () => {
    it("should generate an enhanced plan for premium users", async () => {
      const mockResources = [
        { title: "Resource 1", url: "http://example.com/1" },
      ];

      const mockPlanResponse = {
        text: "Enhanced training plan content",
      };

      (subscription.isPremium as jest.Mock).mockResolvedValue(true);
      (fetchResourcesWithGemini as jest.Mock).mockResolvedValue(mockResources);
      (generatePlanWithLlama as jest.Mock).mockResolvedValue(mockPlanResponse);

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/enhanced-generate",
        {
          method: "POST",
          body: JSON.stringify(mockEnhancedRequest),
        }
      );

      const response = await createEnhancedTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toMatchObject({
        title: mockEnhancedRequest.title,
        content: mockPlanResponse.text,
        resources: mockResources,
        isPremium: true,
      });
    });

    it("should handle unauthorized access", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/enhanced-generate",
        {
          method: "POST",
          body: JSON.stringify(mockEnhancedRequest),
        }
      );

      const response = await createEnhancedTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe(
        "You must be logged in to generate a training plan"
      );
    });
  });

  describe("Save Training Plan", () => {
    it("should save a training plan successfully", async () => {
      const mockSavedPlan = {
        id: "test-plan-id",
        title: "Test Training Plan",
        content: "Test content",
        userId: "test-user-id",
      };

      prismaMock.trainingPlan.create.mockResolvedValue(mockSavedPlan);

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/saved",
        {
          method: "POST",
          body: JSON.stringify(mockSaveRequest),
        }
      );

      const response = await saveTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: {
          id: mockSavedPlan.id,
          title: mockSavedPlan.title,
        },
      });
    });

    it("should handle unauthorized save attempts", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/saved",
        {
          method: "POST",
          body: JSON.stringify(mockSaveRequest),
        }
      );

      const response = await saveTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("You must be logged in to save a training plan");
    });

    it("should handle validation errors when saving", async () => {
      const invalidRequest = {
        ...mockSaveRequest,
        title: "", // Invalid: title is required
      };

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/saved",
        {
          method: "POST",
          body: JSON.stringify(invalidRequest),
        }
      );

      const response = await saveTrainingPlan(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid request data");
    });
  });
});
