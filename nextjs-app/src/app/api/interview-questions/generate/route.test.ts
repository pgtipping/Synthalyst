import { NextRequest } from "next/server";
import { POST } from "./route";

// Mock Groq SDK
jest.mock("groq-sdk", () => {
  const mockCreate = jest.fn();

  // Store the mock function in module scope for tests to access
  (global as any).__mockGroqCreate = mockCreate;

  return {
    Groq: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

// Mock the environment variable
const originalEnv = process.env;

describe("Interview Questions API", () => {
  // Get the mock function from global scope
  const mockCreate = (global as any).__mockGroqCreate;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Set up environment variables
    process.env = { ...originalEnv, GROQ_API_KEY: "test-api-key" };
  });

  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
  });

  describe("POST /api/interview-questions/generate", () => {
    it("should generate interview questions successfully", async () => {
      // Mock the Groq response
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                "1. First interview question\n2. Second interview question\n3. Third interview question",
            },
          },
        ],
      });

      const req = new NextRequest(
        "http://localhost:3000/api/interview-questions/generate",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            industry: "Technology",
            jobLevel: "Senior",
            roleDescription:
              "A senior software engineer responsible for designing and implementing scalable solutions.",
            coreCompetencies: "Problem-solving, Leadership, Communication",
            numberOfQuestions: "5",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.questions).toBeInstanceOf(Array);
      expect(data.questions.length).toBe(3);
      expect(data.questions[0]).toBe("First interview question");

      // Verify the prompt structure
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            {
              role: "system",
              content: expect.stringContaining("expert interviewer"),
            },
            {
              role: "user",
              content: expect.stringContaining("Technology"),
            },
          ]),
          model: "mixtral-8x7b-32768",
        })
      );
    });

    it("should validate required fields", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/interview-questions/generate",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Validation error");
      expect(data.details).toBeDefined();
    });

    it("should handle invalid request body", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/interview-questions/generate",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: "invalid-json",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid request body");
    });

    it("should handle LLM API errors", async () => {
      // Mock an API error
      mockCreate.mockRejectedValueOnce(new Error("API Error"));

      const req = new NextRequest(
        "http://localhost:3000/api/interview-questions/generate",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            industry: "Technology",
            jobLevel: "Senior",
            roleDescription:
              "A senior software engineer responsible for designing and implementing scalable solutions.",
            coreCompetencies: "Problem-solving, Leadership, Communication",
            numberOfQuestions: "5",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        "Failed to generate questions. Please try again."
      );
    });

    it("should handle empty LLM response", async () => {
      // Mock an empty response
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "",
            },
          },
        ],
      });

      const req = new NextRequest(
        "http://localhost:3000/api/interview-questions/generate",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            industry: "Technology",
            jobLevel: "Senior",
            roleDescription:
              "A senior software engineer responsible for designing and implementing scalable solutions.",
            coreCompetencies: "Problem-solving, Leadership, Communication",
            numberOfQuestions: "5",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        "Failed to generate questions. Please try again."
      );
    });

    it("should handle missing API key", async () => {
      // Temporarily remove the API key
      delete process.env.GROQ_API_KEY;

      const req = new NextRequest(
        "http://localhost:3000/api/interview-questions/generate",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            industry: "Technology",
            jobLevel: "Senior",
            roleDescription:
              "A senior software engineer responsible for designing and implementing scalable solutions.",
            coreCompetencies: "Problem-solving, Leadership, Communication",
            numberOfQuestions: "5",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Service configuration error");
    });
  });
});
