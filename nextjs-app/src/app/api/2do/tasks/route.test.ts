import { GET, POST } from "./route";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { APIError, handleAPIError, validateRequest } from "@/lib/middleware";
import { z } from "zod";

// Mock the NextRequest class
class MockNextRequest {
  url: string;
  method: string;
  headers: Headers;
  body: string | null;

  constructor(
    url: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: string;
    } = {}
  ) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = new Headers(options.headers || {});
    this.body = options.body || null;
  }

  json(): Promise<unknown> {
    return Promise.resolve(this.body ? JSON.parse(this.body) : null);
  }
}

// Mock the next-auth module
jest.mock("next-auth");

// Mock the middleware module
jest.mock("@/lib/middleware", () => ({
  validateRequest: jest.fn(async (req, schema) => {
    const body = await req.json();
    return body;
  }),
  handleAPIError: jest.fn((error) => {
    return {
      status: error.status || 500,
      json: () => ({ error: error.message }),
    };
  }),
  APIError: class APIError extends Error {
    status: number;
    code: string;
    constructor(message: string, status: number, code: string) {
      super(message);
      this.status = status;
      this.code = code;
    }
  },
}));

// Mock the logger module
jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Access the global mock Prisma client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrismaClient = (global as any).__mockPrismaClient as PrismaClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetMockStorage = (global as any).__resetMockStorage as () => void;

// Define a mock task schema for validation
// This is just for reference and not actually used in the tests
const _schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  tags: z.array(z.string()).optional(),
});

describe("2Do Tasks API", () => {
  beforeEach(() => {
    // Reset the mock storage before each test
    if (resetMockStorage) {
      resetMockStorage();
    }
    jest.clearAllMocks();

    // Mock the getServerSession function
    (getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: "user123",
        email: "test@example.com",
        name: "Test User",
      },
    });
  });

  describe("GET /api/2do/tasks", () => {
    it("should return an empty list when no tasks exist", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/2do/tasks"
      );
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toEqual([]);
    });

    it("should return a list of tasks for the authenticated user", async () => {
      // Create test tasks
      await mockPrismaClient.task.create({
        data: {
          title: "Task 1",
          description: "Description 1",
          status: "todo",
          priority: "high",
          userId: "user123",
        },
      });
      await mockPrismaClient.task.create({
        data: {
          title: "Task 2",
          description: "Description 2",
          status: "in-progress",
          priority: "medium",
          userId: "user123",
        },
      });
      await mockPrismaClient.task.create({
        data: {
          title: "Task 3",
          description: "Description 3",
          status: "completed",
          priority: "low",
          userId: "different_user", // Different user
        },
      });

      const request = new MockNextRequest(
        "http://localhost:3000/api/2do/tasks"
      );
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks.length).toBe(2); // Only tasks for user123
      expect(data.tasks[0].title).toBe("Task 1");
      expect(data.tasks[1].title).toBe("Task 2");
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock the getServerSession function to return null (unauthenticated)
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new MockNextRequest(
        "http://localhost:3000/api/2do/tasks"
      );

      // Mock handleAPIError to simulate the error response
      handleAPIError.mockImplementation((error) => {
        return {
          status: error.status || 500,
          json: () => ({ error: error.message }),
        };
      });

      try {
        await GET();
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect(error.status).toBe(401);
        expect(error.message).toBe("Authentication required");
      }
    });
  });

  describe("POST /api/2do/tasks", () => {
    it("should create a new task", async () => {
      const taskData = {
        title: "New Task",
        description: "New Description",
        priority: "high",
        status: "todo",
        tags: ["work", "important"],
      };

      const request = new MockNextRequest(
        "http://localhost:3000/api/2do/tasks",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      // Mock the validateRequest function to return the task data
      validateRequest.mockResolvedValue(taskData);

      const response = await POST(request as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task).toBeDefined();
      expect(data.task.title).toBe("New Task");
      expect(data.task.description).toBe("New Description");
      expect(data.task.priority).toBe("high");
      expect(data.task.status).toBe("todo");
      expect(data.task.tags).toEqual(["work", "important"]);

      // Verify that the task was saved to the database
      const savedTasks = await mockPrismaClient.task.findMany({
        where: { title: "New Task" },
      });
      expect(savedTasks.length).toBe(1);
      expect(savedTasks[0].title).toBe("New Task");
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock the getServerSession function to return null (unauthenticated)
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const taskData = {
        title: "New Task",
        description: "New Description",
        priority: "high",
        status: "todo",
      };

      const request = new MockNextRequest(
        "http://localhost:3000/api/2do/tasks",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      // Mock handleAPIError to simulate the error response
      handleAPIError.mockImplementation((error) => {
        return {
          status: error.status || 500,
          json: () => ({ error: error.message }),
        };
      });

      try {
        await POST(request as unknown as NextRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect(error.status).toBe(401);
        expect(error.message).toBe("Authentication required");
      }
    });
  });
});
