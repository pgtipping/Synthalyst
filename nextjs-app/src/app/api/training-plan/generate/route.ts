import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Updated schema to match our simplified form
const generatePlanSchema = z.object({
  title: z.string().min(1),
  objectives: z.array(z.string()),
  targetAudienceLevel: z.string(),
  duration: z.string(),
  // Optional fields
  description: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  idealFor: z.array(z.string()).optional(),
  hoursPerSection: z.number().optional(),
  weeksToComplete: z.number().optional(),
  learningStylePrimary: z.string().optional(),
  learningMethods: z.array(z.string()).optional(),
  theoryRatio: z.number().optional(),
  practicalRatio: z.number().optional(),
  requiredMaterials: z.array(z.string()).optional(),
  optionalMaterials: z.array(z.string()).optional(),
  providedMaterials: z.array(z.string()).optional(),
  certificationType: z.string().optional(),
  certificationRequirements: z.array(z.string()).optional(),
  certificationValidity: z.string().optional(),
  industry: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
  isDraft: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = generatePlanSchema.parse(body);
    const isDraft = validatedData.isDraft || false;

    // If it's a draft, we'll just save the form data without generating content
    if (isDraft) {
      // Create a basic structure for the draft plan
      const content = {
        targetAudience: {
          level: validatedData.targetAudienceLevel,
          prerequisites: validatedData.prerequisites || [],
          idealFor: validatedData.idealFor || [],
        },
        duration: {
          total: validatedData.duration,
          breakdown: {
            sections: 0, // Will be populated when the plan is generated
            hoursPerSection: validatedData.hoursPerSection || 2,
            weeksToComplete: validatedData.weeksToComplete || 12,
          },
        },
        content: {
          sections: [], // Empty sections for draft
        },
        learningStyle: {
          primary: validatedData.learningStylePrimary || "visual",
          methods: validatedData.learningMethods || [],
          ratio: {
            theory: validatedData.theoryRatio || 50,
            practical: validatedData.practicalRatio || 50,
          },
        },
        materials: {
          required: validatedData.requiredMaterials || [],
          optional: validatedData.optionalMaterials || [],
          provided: validatedData.providedMaterials || [],
        },
        certification: validatedData.certificationType
          ? {
              type: validatedData.certificationType,
              requirements: validatedData.certificationRequirements || [],
              validityPeriod: validatedData.certificationValidity || "",
            }
          : undefined,
        metadata: {
          createdBy: session.user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          industry: validatedData.industry || "technology",
          category: validatedData.category || "technical",
          tags: validatedData.tags || [],
          difficulty: validatedData.difficulty || "moderate",
          isTemplate: false,
          isDraft: true,
        },
      };

      const trainingPlan = await prisma.trainingPlan.create({
        data: {
          title: validatedData.title,
          description:
            validatedData.description ||
            `Training plan for ${validatedData.title}`,
          objectives: validatedData.objectives,
          content: JSON.stringify(content),
          userId: session.user.id,
        },
      });

      // Transform the response to include parsed content
      const transformedPlan = {
        ...trainingPlan,
        content,
      };

      return NextResponse.json(transformedPlan);
    }

    // If not a draft, generate a full training plan
    // Create a prompt for the LLM
    const prompt = `
    Create a detailed training plan based on the following information:

    Title: ${validatedData.title}
    Description: ${validatedData.description || ""}
    Learning Objectives: ${validatedData.objectives.join(", ")}
    Target Audience Level: ${validatedData.targetAudienceLevel}
    Duration: ${validatedData.duration}
    ${
      validatedData.prerequisites?.length
        ? `Prerequisites: ${validatedData.prerequisites.join(", ")}`
        : ""
    }
    ${
      validatedData.idealFor?.length
        ? `Ideal For: ${validatedData.idealFor.join(", ")}`
        : ""
    }
    ${
      validatedData.learningStylePrimary
        ? `Primary Learning Style: ${validatedData.learningStylePrimary}`
        : ""
    }
    ${
      validatedData.learningMethods?.length
        ? `Learning Methods: ${validatedData.learningMethods.join(", ")}`
        : ""
    }
    ${
      validatedData.requiredMaterials?.length
        ? `Required Materials: ${validatedData.requiredMaterials.join(", ")}`
        : ""
    }
    ${validatedData.industry ? `Industry: ${validatedData.industry}` : ""}
    ${validatedData.category ? `Category: ${validatedData.category}` : ""}
    ${validatedData.difficulty ? `Difficulty: ${validatedData.difficulty}` : ""}

    Please create a comprehensive training plan with the following structure:
    1. 3-5 sections that cover the learning objectives
    2. Each section should have:
       - A clear title
       - A detailed description
       - A list of topics covered
       - 2-4 learning activities with descriptions and durations
       - 1-3 resources (articles, videos, books, etc.)

    Return the response as a JSON object with the following structure:
    {
      "sections": [
        {
          "id": "section-1",
          "title": "Section Title",
          "description": "Detailed description of the section",
          "topics": ["Topic 1", "Topic 2", "Topic 3"],
          "activities": [
            {
              "type": "Activity Type (e.g., Exercise, Discussion, Project)",
              "description": "Detailed description of the activity",
              "duration": "Estimated duration (e.g., 30 minutes, 1 hour)"
            }
          ],
          "resources": [
            {
              "type": "Resource Type (e.g., Article, Video, Book)",
              "title": "Resource Title",
              "url": "URL if applicable",
              "description": "Brief description of the resource"
            }
          ]
        }
      ]
    }
    `;

    // Call the LLM to generate the plan
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer and instructional specialist.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.2-3b-preview",
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const generatedContent = JSON.parse(completion.choices[0].message.content);

    // Create the full content object
    const content = {
      targetAudience: {
        level: validatedData.targetAudienceLevel,
        prerequisites: validatedData.prerequisites || [],
        idealFor: validatedData.idealFor || [],
      },
      duration: {
        total: validatedData.duration,
        breakdown: {
          sections: generatedContent.sections.length,
          hoursPerSection: validatedData.hoursPerSection || 2,
          weeksToComplete: validatedData.weeksToComplete || 12,
        },
      },
      content: {
        sections: generatedContent.sections,
      },
      learningStyle: {
        primary: validatedData.learningStylePrimary || "visual",
        methods: validatedData.learningMethods || [],
        ratio: {
          theory: validatedData.theoryRatio || 50,
          practical: validatedData.practicalRatio || 50,
        },
      },
      materials: {
        required: validatedData.requiredMaterials || [],
        optional: validatedData.optionalMaterials || [],
        provided: validatedData.providedMaterials || [],
      },
      certification: validatedData.certificationType
        ? {
            type: validatedData.certificationType,
            requirements: validatedData.certificationRequirements || [],
            validityPeriod: validatedData.certificationValidity || "",
          }
        : undefined,
      metadata: {
        createdBy: session.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        industry: validatedData.industry || "technology",
        category: validatedData.category || "technical",
        tags: validatedData.tags || [],
        difficulty: validatedData.difficulty || "moderate",
        isTemplate: false,
        isDraft: false,
      },
    };

    const trainingPlan = await prisma.trainingPlan.create({
      data: {
        title: validatedData.title,
        description:
          validatedData.description ||
          `Training plan for ${validatedData.title}`,
        objectives: validatedData.objectives,
        content: JSON.stringify(content),
        userId: session.user.id,
      },
    });

    // Transform the response to include parsed content
    const transformedPlan = {
      ...trainingPlan,
      content,
    };

    return NextResponse.json(transformedPlan);
  } catch (error) {
    console.error("[TRAINING_PLAN_GENERATE]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
