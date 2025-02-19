import { NextRequest } from "next/server";
import { POST } from "./route";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Training Plan API", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /api/training-plan", () => {
    it("should generate a training plan successfully", async () => {
      // Mock the AI response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: "Generated training plan content",
              },
            },
          ],
        },
      });

      const req = new NextRequest("http://localhost:3000/api/training-plan", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          topic: "Web Development",
          learningObjectives: "Learn HTML, CSS, and JavaScript",
          targetAudience: "Beginners",
          duration: "8 weeks",
          preferredLearningStyle: "Hands-on",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.plan).toBe("Generated training plan content");

      // Verify the prompt structure
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.groq.com/v1/chat/completions",
        expect.objectContaining({
          messages: expect.arrayContaining([
            {
              role: "system",
              content:
                "You are an expert curriculum designer and instructional specialist.",
            },
            {
              role: "user",
              content: expect.stringContaining("Topic: Web Development"),
            },
          ]),
        }),
        expect.any(Object)
      );
    });

    it("should validate required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/training-plan", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("should handle AI service errors", async () => {
      // Mock an API error
      mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));

      const req = new NextRequest("http://localhost:3000/api/training-plan", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          topic: "Web Development",
          learningObjectives: "Learn HTML, CSS, and JavaScript",
          targetAudience: "Beginners",
          duration: "8 weeks",
          preferredLearningStyle: "Hands-on",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to generate training plan");
    });

    it("should include all required sections in the prompt", async () => {
      // Mock the AI response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: "Generated training plan content",
              },
            },
          ],
        },
      });

      const req = new NextRequest("http://localhost:3000/api/training-plan", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          topic: "Data Science",
          learningObjectives: "Master Python and Statistics",
          targetAudience: "Intermediate",
          duration: "12 weeks",
          preferredLearningStyle: "Project-based",
        }),
      });

      await POST(req);

      // Verify prompt structure includes all required sections
      const promptCall = mockedAxios.post.mock.calls[0][1] as {
        messages: { role: string; content: string }[];
      };
      const userPrompt = promptCall.messages[1].content;

      expect(userPrompt).toContain("Course Overview");
      expect(userPrompt).toContain("Learning Objectives");
      expect(userPrompt).toContain("Prerequisites");
      expect(userPrompt).toContain("Detailed Curriculum Breakdown");
      expect(userPrompt).toContain("Learning Activities and Assessments");
      expect(userPrompt).toContain("Resources and Materials");
      expect(userPrompt).toContain("Success Metrics");
    });
  });
});
