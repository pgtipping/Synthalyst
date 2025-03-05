import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { PATCH, DELETE } from "@/app/api/training-plan/[id]/route";
import { prismaMock } from "@/lib/__mocks__/prisma";
import { mockDeep } from "jest-mock-extended";
import { TrainingPlan } from "@prisma/client";

// Mock dependencies
jest.mock("next-auth");

const mockSession = {
  user: {
    id: "test-user-id",
    email: "test@example.com",
  },
};

(getServerSession as jest.Mock).mockResolvedValue(mockSession);

describe("Training Plan Management API", () => {
  const mockPlan: TrainingPlan = {
    id: "test-plan-id",
    userId: "test-user-id",
    content: "Original plan content",
    title: "Original Title",
    description: null,
    objectives: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    duration: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("PATCH /api/training-plan/[id]", () => {
    it("should update a training plan successfully", async () => {
      const updateData = {
        content: "Updated plan content",
        title: "Updated Title",
        description: "Updated description",
        objectives: ["Learn TDD", "Master API Testing"],
        duration: "45 minutes",
      };

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/test-plan-id",
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        }
      );

      const findUniqueMock =
        mockDeep<typeof prismaMock.trainingPlan.findUnique>();
      const updateMock = mockDeep<typeof prismaMock.trainingPlan.update>();

      findUniqueMock.mockResolvedValue(mockPlan);
      updateMock.mockResolvedValue({ ...mockPlan, ...updateData });

      prismaMock.trainingPlan.findUnique = findUniqueMock;
      prismaMock.trainingPlan.update = updateMock;

      const response = await PATCH(request, { params: { id: "test-plan-id" } });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual(
        expect.objectContaining({ plan: expect.objectContaining(updateData) })
      );
    });

    it("should return 404 if plan not found", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/non-existent-id",
        {
          method: "PATCH",
          body: JSON.stringify({ content: "Updated content" }),
        }
      );

      const findUniqueMock =
        mockDeep<typeof prismaMock.trainingPlan.findUnique>();
      findUniqueMock.mockResolvedValue(null);

      prismaMock.trainingPlan.findUnique = findUniqueMock;

      const response = await PATCH(request, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
    });

    it("should handle unauthorized access", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/test-plan-id",
        {
          method: "PATCH",
          body: JSON.stringify({ title: "Updated Title" }),
        }
      );

      const response = await PATCH(request, { params: { id: "test-plan-id" } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should handle unauthorized user", async () => {
      const planOwnedByOtherUser: TrainingPlan = {
        ...mockPlan,
        userId: "other-user-id",
      };

      prismaMock.trainingPlan.findUnique.mockResolvedValue(
        planOwnedByOtherUser
      );

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/test-plan-id",
        {
          method: "PATCH",
          body: JSON.stringify({ title: "Updated Title" }),
        }
      );

      const response = await PATCH(request, { params: { id: "test-plan-id" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to update this plan");
    });
  });

  describe("DELETE /api/training-plan/[id]", () => {
    it("should delete a training plan successfully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/test-plan-id",
        {
          method: "DELETE",
        }
      );

      const findUniqueMock =
        mockDeep<typeof prismaMock.trainingPlan.findUnique>();
      const deleteMock = mockDeep<typeof prismaMock.trainingPlan.delete>();

      findUniqueMock.mockResolvedValue(mockPlan);
      deleteMock.mockResolvedValue(mockPlan);

      prismaMock.trainingPlan.findUnique = findUniqueMock;
      prismaMock.trainingPlan.delete = deleteMock;

      const response = await DELETE(request, {
        params: { id: "test-plan-id" },
      });

      expect(response.status).toBe(200);
    });

    it("should return 404 if plan not found", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/non-existent-id",
        {
          method: "DELETE",
        }
      );

      const findUniqueMock =
        mockDeep<typeof prismaMock.trainingPlan.findUnique>();
      findUniqueMock.mockResolvedValue(null);

      prismaMock.trainingPlan.findUnique = findUniqueMock;

      const response = await DELETE(request, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
    });

    it("should handle unauthorized access", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/test-plan-id",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request, {
        params: { id: "test-plan-id" },
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should handle unauthorized user", async () => {
      const planOwnedByOtherUser: TrainingPlan = {
        ...mockPlan,
        userId: "other-user-id",
      };

      prismaMock.trainingPlan.findUnique.mockResolvedValue(
        planOwnedByOtherUser
      );

      const request = new NextRequest(
        "http://localhost:3000/api/training-plan/test-plan-id",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request, {
        params: { id: "test-plan-id" },
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to update this plan");
    });
  });
});
