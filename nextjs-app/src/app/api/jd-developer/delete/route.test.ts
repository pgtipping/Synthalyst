import { DELETE } from "./route";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

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

// Access the global mock Prisma client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrismaClient = (global as any).__mockPrismaClient as PrismaClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetMockStorage = (global as any).__resetMockStorage as () => void;

describe("JD Developer Delete API", () => {
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

  it("should delete a job description", async () => {
    // Create a job description first
    await mockPrismaClient.jobDescription.create({
      data: {
        title: "Software Engineer",
        content: JSON.stringify({ title: "Software Engineer" }),
        industry: "Technology",
        level: "Mid-level",
        skills: ["JavaScript", "React"],
        userId: "user123",
        contentHash: "hash123",
        version: 1,
        isLatest: true,
      },
    });

    // Get the created job description
    const jobDescriptions = await mockPrismaClient.jobDescription.findMany({
      where: { title: "Software Engineer" },
    });
    expect(jobDescriptions.length).toBe(1);
    const jobId = jobDescriptions[0].id;

    const request = new MockNextRequest(
      `http://localhost:3000/api/jd-developer/delete?id=${jobId}`,
      {
        method: "DELETE",
      }
    );

    const response = await DELETE(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify that the job description was deleted
    const remainingJobs = await mockPrismaClient.jobDescription.findMany({
      where: { title: "Software Engineer" },
    });
    expect(remainingJobs.length).toBe(0);
  });

  it("should return 401 if user is not authenticated", async () => {
    // Mock the getServerSession function to return null (unauthenticated)
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new MockNextRequest(
      "http://localhost:3000/api/jd-developer/delete?id=job123",
      {
        method: "DELETE",
      }
    );

    const response = await DELETE(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 400 if job ID is missing", async () => {
    const request = new MockNextRequest(
      "http://localhost:3000/api/jd-developer/delete",
      {
        method: "DELETE",
      }
    );

    const response = await DELETE(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Job description ID is required");
  });

  it("should return 404 if job description is not found", async () => {
    const request = new MockNextRequest(
      "http://localhost:3000/api/jd-developer/delete?id=nonexistent",
      {
        method: "DELETE",
      }
    );

    const response = await DELETE(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Job description not found");
  });

  it("should return 403 if user is not the owner", async () => {
    // Create a job description with a different user ID
    await mockPrismaClient.jobDescription.create({
      data: {
        title: "Software Engineer",
        content: JSON.stringify({ title: "Software Engineer" }),
        industry: "Technology",
        level: "Mid-level",
        skills: ["JavaScript", "React"],
        userId: "different_user",
        contentHash: "hash123",
        version: 1,
        isLatest: true,
      },
    });

    // Get the created job description
    const jobDescriptions = await mockPrismaClient.jobDescription.findMany({
      where: { title: "Software Engineer" },
    });
    expect(jobDescriptions.length).toBe(1);
    const jobId = jobDescriptions[0].id;

    const request = new MockNextRequest(
      `http://localhost:3000/api/jd-developer/delete?id=${jobId}`,
      {
        method: "DELETE",
      }
    );

    const response = await DELETE(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Not authorized to delete this job description");
  });
});
