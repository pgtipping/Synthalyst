import { NextRequest } from "next/server";
import { POST } from "./route";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Learning Content API", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /api/learning-content", () => {
    it("should generate learning content successfully", async () => {
      // Mock the AI response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: "Generated learning content",
              },
            },
          ],
        },
      });

      const req = new NextRequest(
        "http://localhost:3000/api/learning-content",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            topic: "JavaScript Promises",
            contentType: "Tutorial",
            targetAudience: "Web Developers",
            learningLevel: "Intermediate",
            contentFormat: "Markdown",
            specificRequirements: "Include practical examples",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe("Generated learning content");

      // Verify the prompt structure
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.groq.com/v1/chat/completions",
        expect.objectContaining({
          messages: expect.arrayContaining([
            {
              role: "system",
              content:
                "You are an expert instructional designer and content creator.",
            },
            {
              role: "user",
              content: expect.stringContaining("Topic: JavaScript Promises"),
            },
          ]),
        }),
        expect.any(Object)
      );
    });

    it("should validate required fields", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/learning-content",
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
      expect(data.error).toBe("Invalid input");
      expect(data.details).toBeDefined();
    });

    it("should handle AI service errors", async () => {
      // Mock an API error
      mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));

      const req = new NextRequest(
        "http://localhost:3000/api/learning-content",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            topic: "JavaScript Promises",
            contentType: "Tutorial",
            targetAudience: "Web Developers",
            learningLevel: "Intermediate",
            contentFormat: "Markdown",
            specificRequirements: "Include practical examples",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to generate learning content");
    });

    it("should validate content type enum values", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/learning-content",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            topic: "JavaScript Promises",
            contentType: "Invalid",
            targetAudience: "Web Developers",
            learningLevel: "Intermediate",
            contentFormat: "Markdown",
          }),
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid input");
      expect(data.details[0].message).toBe("Invalid content type");
    });

    it("should include content structure based on content type", async () => {
      // Mock the AI response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: "Generated learning content",
              },
            },
          ],
        },
      });

      const req = new NextRequest(
        "http://localhost:3000/api/learning-content",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            topic: "JavaScript Promises",
            contentType: "Tutorial",
            targetAudience: "Web Developers",
            learningLevel: "Intermediate",
            contentFormat: "Markdown",
          }),
        }
      );

      await POST(req);

      // Verify prompt includes tutorial structure
      const promptCall = mockedAxios.post.mock.calls[0][1] as {
        messages: { role: string; content: string }[];
      };
      const userPrompt = promptCall.messages[1].content;

      expect(userPrompt).toContain("For Tutorial:");
      expect(userPrompt).toContain("1. Overview");
      expect(userPrompt).toContain("2. Prerequisites");
      expect(userPrompt).toContain("3. Step-by-Step Instructions");
      expect(userPrompt).toContain("4. Common Issues and Solutions");
      expect(userPrompt).toContain("5. Practice Exercise");
      expect(userPrompt).toContain("6. Next Steps");
    });
  });
});
