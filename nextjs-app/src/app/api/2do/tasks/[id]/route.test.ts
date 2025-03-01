import { GET, PATCH, DELETE } from "./route";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Mock NextRequest
class MockNextRequest implements NextRequest {
  constructor(
    public readonly url: string,
    public readonly method: string,
    public readonly headers: Headers,
    private readonly requestBody?: any
  ) {}

  json() {
    return Promise.resolve(this.requestBody);
  }

  // Implement other required properties and methods
  readonly cache = {} as RequestCache;
  readonly credentials = {} as RequestCredentials;
  readonly destination = "" as RequestDestination;
  readonly integrity = "";
  readonly keepalive = false;
  readonly mode = "" as RequestMode;
  readonly redirect = "" as RequestRedirect;
  readonly referrer = "";
  readonly referrerPolicy = "" as ReferrerPolicy;
  readonly signal = {} as AbortSignal;
  readonly body = null;
  readonly bodyUsed = false;
  readonly duplex = "" as RequestDuplex;
  clone(): NextRequest {
    return this;
  }
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
  blob(): Promise<Blob> {
    return Promise.resolve(new Blob());
  }
  formData(): Promise<FormData> {
    return Promise.resolve(new FormData());
  }
  text(): Promise<string> {
    return Promise.resolve("");
  }
  nextUrl = new URL(this.url);
  ip = "";
  geo = {};
}

// Mock next-auth
jest.mock("next-auth");

// Mock Prisma
jest.mock("@/lib/prisma", () => {
  const { PrismaClient } = jest.requireActual("@prisma/client");
  return {
    prisma: global.__mockPrismaClient,
  };
});

describe("2Do Tasks [id] API", () => {
  const mockUserId = "user-123";
  const mockTaskId = uuidv4();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: mockUserId,
        email: "test@example.com",
      },
    });
  });

  describe("GET /api/2do/tasks/[id]", () => {
    it("should return a task by ID", async () => {
      // Create a test task in the mock database
      const task = await global.__mockPrismaClient.task.create({
        data: {
          id: mockTaskId,
          userId: mockUserId,
          title: "Test Task",
          description: "Test Description",
          status: "todo",
          priority: "medium",
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create tags for the task
      await global.__mockPrismaClient.taskTag.createMany({
        data: [
          { name: "tag1", taskId: mockTaskId },
          { name: "tag2", taskId: mockTaskId },
        ],
      });

      // Mock the $queryRaw to return the task with tags
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([
        {
          ...task,
          tags: ["tag1", "tag2"],
        },
      ]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "GET",
        new Headers()
      );

      // Call the handler
      const response = await GET(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data.task).toBeDefined();
      expect(data.task.id).toBe(mockTaskId);
      expect(data.task.title).toBe("Test Task");
      expect(data.task.tags).toEqual(["tag1", "tag2"]);
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthenticated session
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "GET",
        new Headers()
      );

      // Call the handler
      const response = await GET(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 404 if task is not found", async () => {
      // Mock $queryRaw to return empty array (task not found)
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "GET",
        new Headers()
      );

      // Call the handler
      const response = await GET(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });

    it("should return 403 if user is not the owner of the task", async () => {
      // Mock $queryRaw to return a task with different userId
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([
        {
          id: mockTaskId,
          userId: "different-user-id",
          title: "Test Task",
          description: "Test Description",
          status: "todo",
          priority: "medium",
          dueDate: new Date(),
          tags: ["tag1", "tag2"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "GET",
        new Headers()
      );

      // Call the handler
      const response = await GET(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to view this task");
    });
  });

  describe("PATCH /api/2do/tasks/[id]", () => {
    it("should update a task successfully", async () => {
      // Mock $queryRaw to return a task
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([
        {
          id: mockTaskId,
          userId: mockUserId,
          title: "Original Title",
          description: "Original Description",
          status: "todo",
          priority: "low",
          dueDate: new Date(),
          tag_names: ["original-tag"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // Mock $transaction to return the updated task
      global.__mockPrismaClient.$transaction.mockImplementationOnce(
        async (callback) => {
          // Execute the callback to simulate transaction
          await callback(global.__mockPrismaClient);

          // Return the updated task
          return {
            id: mockTaskId,
            userId: mockUserId,
            title: "Updated Title",
            description: "Updated Description",
            status: "in-progress",
            priority: "high",
            dueDate: new Date(),
            tags: ["new-tag1", "new-tag2"],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      );

      // Create request with update data
      const updateData = {
        title: "Updated Title",
        description: "Updated Description",
        status: "in-progress",
        priority: "high",
        tags: ["new-tag1", "new-tag2"],
      };

      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "PATCH",
        new Headers(),
        updateData
      );

      // Call the handler
      const response = await PATCH(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data.task).toBeDefined();
      expect(data.task.title).toBe("Updated Title");
      expect(data.task.status).toBe("in-progress");
      expect(data.task.tags).toEqual(["new-tag1", "new-tag2"]);
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthenticated session
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "PATCH",
        new Headers(),
        { title: "Updated Title" }
      );

      // Call the handler
      const response = await PATCH(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 404 if task is not found", async () => {
      // Mock $queryRaw to return empty array (task not found)
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "PATCH",
        new Headers(),
        { title: "Updated Title" }
      );

      // Call the handler
      const response = await PATCH(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });

    it("should return 403 if user is not the owner of the task", async () => {
      // Mock $queryRaw to return a task with different userId
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([
        {
          id: mockTaskId,
          userId: "different-user-id",
          title: "Original Title",
          description: "Original Description",
          status: "todo",
          priority: "low",
          dueDate: new Date(),
          tag_names: ["original-tag"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "PATCH",
        new Headers(),
        { title: "Updated Title" }
      );

      // Call the handler
      const response = await PATCH(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to update this task");
    });

    it("should return 400 if validation fails", async () => {
      // Create request with invalid data
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "PATCH",
        new Headers(),
        { status: "invalid-status" } // Invalid status value
      );

      // Call the handler
      const response = await PATCH(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe("DELETE /api/2do/tasks/[id]", () => {
    it("should delete a task successfully", async () => {
      // Mock $queryRaw to return a task
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([
        {
          id: mockTaskId,
          userId: mockUserId,
          title: "Test Task",
          description: "Test Description",
          status: "todo",
          priority: "medium",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "DELETE",
        new Headers()
      );

      // Call the handler
      const response = await DELETE(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(global.__mockPrismaClient.$executeRaw).toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthenticated session
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "DELETE",
        new Headers()
      );

      // Call the handler
      const response = await DELETE(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 404 if task is not found", async () => {
      // Mock $queryRaw to return empty array (task not found)
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "DELETE",
        new Headers()
      );

      // Call the handler
      const response = await DELETE(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });

    it("should return 403 if user is not the owner of the task", async () => {
      // Mock $queryRaw to return a task with different userId
      global.__mockPrismaClient.$queryRaw.mockResolvedValueOnce([
        {
          id: mockTaskId,
          userId: "different-user-id",
          title: "Test Task",
          description: "Test Description",
          status: "todo",
          priority: "medium",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // Create request
      const request = new MockNextRequest(
        `http://localhost:3000/api/2do/tasks/${mockTaskId}`,
        "DELETE",
        new Headers()
      );

      // Call the handler
      const response = await DELETE(request, {
        params: Promise.resolve({ id: mockTaskId }),
      });
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to delete this task");
    });
  });
});
