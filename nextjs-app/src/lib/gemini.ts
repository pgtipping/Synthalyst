import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

/**
 * Gets the Gemini model instance
 */
export function getGeminiModel(modelName = "gemini-2.0-flash") {
  return genAI.getGenerativeModel({ model: modelName });
}

// Define the schema for a resource
const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  type: z.enum(["book", "article", "course", "tool", "community"]),
  url: z.string().optional(),
  publicationDate: z.string().optional(),
  description: z.string(),
  relevanceScore: z.number().min(1).max(10),
});

// Define the schema for the resources array
const resourcesSchema = z.array(resourceSchema);

// Type for the resources
export type Resource = z.infer<typeof resourceSchema>;

/**
 * Fetches resources with Gemini based on training plan parameters
 */
export async function fetchResourcesWithGemini({
  objectives,
  targetAudienceLevel,
  industry,
  learningStyle,
}: {
  objectives: string[];
  targetAudienceLevel: string;
  industry?: string;
  learningStyle?: string;
}): Promise<Resource[]> {
  return generateResourcesWithGemini(
    "Training Plan",
    objectives,
    targetAudienceLevel,
    industry,
    learningStyle
  );
}

/**
 * Generates resources for a training plan using Google's Gemini API
 */
export async function generateResourcesWithGemini(
  title: string,
  objectives: string[],
  targetAudienceLevel: string,
  industry?: string,
  learningStyle?: string
): Promise<Resource[]> {
  try {
    // Get the Gemini Pro model
    const model = getGeminiModel("gemini-pro");

    // Create a prompt for Gemini
    const prompt = `
      As an expert instructional designer and educational resource curator, recommend high-quality, current resources for a training plan with the following details:
      
      Title: ${title}
      Learning Objectives: 
      ${objectives.map((obj) => `- ${obj}`).join("\n")}
      Target Audience Level: ${targetAudienceLevel}
      ${industry ? `Industry/Domain: ${industry}` : ""}
      ${learningStyle ? `Primary Learning Style: ${learningStyle}` : ""}
      
      Provide 8-10 diverse, high-quality resources that directly support the learning objectives. Include a mix of:
      
      1. Books (2-3): Focus on authoritative, well-reviewed books published within the last 5 years when possible. Include classic texts if they remain definitive resources in the field.
      
      2. Online Courses (2-3): Include courses from reputable platforms like Coursera, edX, LinkedIn Learning, or specialized industry platforms. Prioritize courses with strong reviews, expert instructors, and hands-on components.
      
      3. Articles/Guides (1-2): Include comprehensive guides, white papers, or research articles from respected sources that provide deep insights on specific topics.
      
      4. Tools/Software (1-2): If applicable, recommend tools or software that learners can use to practice skills or implement concepts from the training.
      
      5. Communities/Forums (1): Suggest active professional communities, forums, or discussion groups where learners can ask questions and continue learning.
      
      For each resource:
      - Ensure it directly supports at least one specific learning objective
      - Match the difficulty level to the target audience
      - Prioritize resources with practical, actionable content over purely theoretical materials
      - Include resources that reflect current best practices and methodologies
      - Consider the industry/domain context in your recommendations
      
      Format your response as a JSON array of resources with the following structure for each resource:
      {
        "id": "unique-id-1", // Generate a unique ID for each resource
        "title": "Resource Title",
        "author": "Author Name", // Optional, include if available
        "type": "book", // One of: "book", "article", "course", "tool", "community"
        "url": "https://example.com/resource", // Optional, include if available
        "publicationDate": "2023", // Optional, include if available (year is sufficient)
        "description": "A concise description of the resource and how it supports specific learning objectives.",
        "relevanceScore": 9 // A number from 1-10 indicating how relevant this resource is to the learning objectives
      }
      
      Return ONLY the JSON array with no additional text or explanation.
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract the JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const jsonString = jsonMatch[0];

    // Parse the JSON and validate with Zod
    const parsedResources = JSON.parse(jsonString);
    const validatedResources = resourcesSchema.parse(parsedResources);

    return validatedResources;
  } catch (error) {
    console.error("Error generating resources with Gemini:", error);
    // Return an empty array if there's an error
    return [];
  }
}
