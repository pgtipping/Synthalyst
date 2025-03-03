import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiModel } from "@/lib/gemini";
import { openRouter } from "@/lib/openrouter";
import { prisma } from "@/lib/prisma";
import { subscription } from "@/lib/subscription";

// Define a schema for the request body
const generatePlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  duration: z.string().min(1, "Duration is required"),
  learningStylePrimary: z.string().optional(),
  description: z.string().optional(),
  prerequisites: z.string().optional(),
  industry: z.string().optional(),
  materials: z.array(z.string()).optional(),
  certification: z.string().optional(),
  userEmail: z.string().email("Valid email is required"),
});

// Define a type for the resources returned by Gemini
interface Resource {
  id: string;
  title: string;
  author?: string;
  type: "book" | "article" | "course" | "tool" | "community";
  url?: string;
  publicationDate?: string;
  description: string;
  relevanceScore: number;
  isPremium: boolean;
}

export async function POST(req: Request) {
  try {
    // Extract and validate the request body
    const body = await req.json();
    const validatedData = generatePlanSchema.parse(body);

    // Check if user is premium
    const isPremiumUser = await subscription.isPremium(validatedData.userEmail);

    let resources: Resource[] | null = null;

    // For premium users only: Fetch resources using Gemini + Search API
    if (isPremiumUser) {
      try {
        resources = await fetchResourcesWithGemini(validatedData);
      } catch (error) {
        console.error("Error fetching resources with Gemini:", error);
        // Continue without resources if Gemini fails
      }
    }

    // Generate training plan with Llama using appropriate prompt
    const trainingPlan = await generatePlanWithLlama(
      validatedData,
      resources,
      isPremiumUser
    );

    // Save the training plan to the database
    const savedPlan = await prisma.trainingPlan.create({
      data: {
        title: validatedData.title,
        content: JSON.stringify(trainingPlan),
        user: {
          connectOrCreate: {
            where: { email: validatedData.userEmail },
            create: { email: validatedData.userEmail },
          },
        },
        metadata: {
          industry: validatedData.industry || null,
          targetAudience: validatedData.targetAudienceLevel,
          duration: validatedData.duration,
          premiumResources: isPremiumUser,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: savedPlan.id,
        ...trainingPlan,
      },
    });
  } catch (error) {
    console.error("Error generating training plan:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate training plan",
      },
      { status: 500 }
    );
  }
}

/**
 * Fetches relevant resources using Gemini model with search capabilities
 */
async function fetchResourcesWithGemini(
  data: z.infer<typeof generatePlanSchema>
): Promise<Resource[]> {
  try {
    const gemini = getGeminiModel();

    // Create a prompt for Gemini
    const prompt = `
      Find current and relevant learning resources for a training plan on:
      
      Title: ${data.title}
      Objectives: ${data.objectives.join(", ")}
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
    const resources = JSON.parse(jsonMatch[0]) as Omit<Resource, "isPremium">[];

    // Add isPremium flag to all resources
    return resources.map((resource) => ({
      ...resource,
      isPremium: true,
    }));
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw error;
  }
}

/**
 * Generates a training plan using Llama 3.2 3b
 */
async function generatePlanWithLlama(
  data: z.infer<typeof generatePlanSchema>,
  resources: Resource[] | null,
  isPremiumUser: boolean
) {
  try {
    // Base prompt for all users
    let prompt = `Create a detailed training plan based on:
      Title: ${data.title}
      Learning Objectives: ${data.objectives.join("\n")}
      Target Audience: ${data.targetAudienceLevel}
      Duration: ${data.duration}
      ${
        data.learningStylePrimary
          ? `Learning Style: ${data.learningStylePrimary}`
          : ""
      }
      ${data.description ? `Description: ${data.description}` : ""}
      ${data.prerequisites ? `Prerequisites: ${data.prerequisites}` : ""}
      ${data.industry ? `Industry: ${data.industry}` : ""}
      
      Structure the plan with:
      1. Overview
      2. Detailed sections for each objective
      3. Activities aligned with learning styles
      4. Assessments
      5. Resource recommendations
    `;

    // For premium users: Include Gemini resources
    if (isPremiumUser && resources && resources.length > 0) {
      prompt += `
        Incorporate these current resources where appropriate:
        ${JSON.stringify(resources, null, 2)}
      `;
    }
    // For free users: Enhanced prompt for better resource recommendations
    else {
      prompt += `
        Include a comprehensive resources section with:
        
        1. Books and publications:
           - Include author names and publication years
           - Prioritize respected authors and foundational texts
           - Include both beginner and advanced options
        
        2. Online courses and tutorials:
           - Include platform names (Coursera, Udemy, YouTube, etc.)
           - Specify if they're free or paid when possible
           - Include estimated completion time when relevant
        
        3. Tools and software:
           - Specify which learning objectives they support
           - Include both free and commercial options
           - Note any special features relevant to the learning objectives
        
        4. Communities and forums:
           - Include online communities, forums, and discussion groups
           - Mention any regular meetups or conferences if applicable
           - Note which are most beginner-friendly
        
        Organize resources by difficulty level (beginner, intermediate, advanced) and relevance to specific learning objectives. For each resource, include a brief 1-2 sentence description explaining its value to the learner.
      `;
    }

    // Call Llama API via OpenRouter
    const response = await openRouter.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert training plan creator with deep knowledge of instructional design and adult learning principles.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Extract the response text
    const responseText = response.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Empty response from Llama");
    }

    // Parse the response into a structured training plan
    // This is a simplified example - in a real implementation, you would parse the text into a structured object
    const trainingPlan = {
      title: data.title,
      objectives: data.objectives,
      targetAudience: data.targetAudienceLevel,
      duration: data.duration,
      content: responseText,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "meta-llama/llama-3.2-3b-instruct",
        premiumResources: isPremiumUser && resources ? true : false,
      },
    };

    return trainingPlan;
  } catch (error) {
    console.error("Error generating training plan with Llama:", error);
    throw error;
  }
}
