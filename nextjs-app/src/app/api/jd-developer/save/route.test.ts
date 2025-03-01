import { POST } from "./route";
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

describe("JD Developer Save API", () => {
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

  it("should save a new job description", async () => {
    const jobData = {
      title: "Software Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      description: "A great job opportunity",
      responsibilities: ["Code", "Test", "Deploy"],
      requirements: {
        required: [
          {
            name: "JavaScript",
            level: "advanced",
            description: "Strong JS skills",
          },
          {
            name: "React",
            level: "intermediate",
            description: "React experience",
          },
        ],
        preferred: [
          {
            name: "TypeScript",
            level: "intermediate",
            description: "TypeScript knowledge",
          },
        ],
      },
      qualifications: {
        education: ["Bachelor's degree in Computer Science"],
        experience: ["3+ years of software development"],
        certifications: ["AWS Certified Developer"],
      },
      salary: {
        range: {
          min: 80000,
          max: 120000,
        },
        type: "yearly",
        currency: "USD",
      },
      metadata: {
        industry: "Technology",
        level: "Mid-level",
        isTemplate: false,
      },
    };

    const request = new MockNextRequest(
      "http://localhost:3000/api/jd-developer/save",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jobData),
      }
    );

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.jobDescription).toBeDefined();
    expect(data.jobDescription.title).toBe("Software Engineer");

    // Verify that the job description was saved to the database
    const savedJobs = await mockPrismaClient.jobDescription.findMany({
      where: { title: "Software Engineer" },
    });
    expect(savedJobs.length).toBe(1);
    expect(savedJobs[0].title).toBe("Software Engineer");
  });

  it("should return 401 if user is not authenticated", async () => {
    // Mock the getServerSession function to return null (unauthenticated)
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const jobData = {
      title: "Software Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      description: "A great job opportunity",
      responsibilities: ["Code", "Test", "Deploy"],
      requirements: {
        required: [
          {
            name: "JavaScript",
            level: "advanced",
            description: "Strong JS skills",
          },
        ],
        preferred: null,
      },
      qualifications: {
        education: ["Bachelor's degree in Computer Science"],
        experience: ["3+ years of software development"],
        certifications: ["AWS Certified Developer"],
      },
      metadata: {
        industry: "Technology",
        level: "Mid-level",
        isTemplate: false,
      },
    };

    const request = new MockNextRequest(
      "http://localhost:3000/api/jd-developer/save",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jobData),
      }
    );

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 400 if validation fails", async () => {
    // Missing required fields
    const jobData = {
      title: "Software Engineer",
      // Missing department, location, employmentType, etc.
      description: "A great job opportunity",
      responsibilities: ["Code", "Test", "Deploy"],
      requirements: {
        required: [],
        preferred: null,
      },
      qualifications: {
        education: [],
        experience: [],
        certifications: [],
      },
      metadata: {
        industry: "Technology",
        level: "Mid-level",
        isTemplate: false,
      },
    };

    const request = new MockNextRequest(
      "http://localhost:3000/api/jd-developer/save",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jobData),
      }
    );

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
