import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure API key is defined
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
}

export const geminiApi = new GoogleGenerativeAI(apiKey || "");

export const getGeminiModel = () => {
  return geminiApi.getGenerativeModel({ model: "gemini-2.0-flash" });
};

interface ResourceQueryParams {
  objectives: string[];
  targetAudienceLevel: string;
  industry: string;
}

interface Resource {
  id: string;
  title: string;
  author?: string;
  type: "book" | "article" | "course" | "tool" | "community";
  url?: string;
  publicationDate?: string;
  description: string;
  relevanceScore: number;
}

/**
 * Fetches relevant resources using Gemini model with search capabilities
 */
export async function fetchResourcesWithGemini(
  data: ResourceQueryParams
): Promise<Resource[]> {
  try {
    const gemini = getGeminiModel();

    // Create a prompt for Gemini
    const prompt = `
      Find current and relevant learning resources for a training plan with these objectives:
      
      Objectives: ${data.objectives.join("\n- ")}
      Target Audience Level: ${data.targetAudienceLevel}
      ${data.industry ? `Industry: ${data.industry}` : ""}
      
      Please provide a structured list of resources including:
      1. Books and articles (with publication dates)
      2. Online courses and tutorials
      3. Tools and software
      4. Communities and forums
      
      For each resource, include:
      - Title
      - Author/Creator
      - Publication date (if applicable)
      - URL (if available)
      - Brief description of relevance
      
      Format your response as a JSON array with the following structure:
      [
        {
          "id": "resource-1",
          "title": "Resource Title",
          "author": "Author Name",
          "type": "book|article|course|tool|community",
          "url": "https://example.com",
          "publicationDate": "YYYY-MM-DD",
          "description": "Brief description of relevance",
          "relevanceScore": 85
        }
      ]
      
      Ensure all resources are current, relevant, and appropriate for the target audience level.
      Organize resources by difficulty level (beginner, intermediate, advanced) and relevance to specific learning objectives.
    `;

    // Call Gemini API
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }

    // Parse the JSON
    const resources = JSON.parse(jsonMatch[0]) as Resource[];

    return resources;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    // Return empty array if there's an error
    return [];
  }
}
