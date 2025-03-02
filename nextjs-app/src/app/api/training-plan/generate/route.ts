import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import OpenAI from "openai";
import type { TrainingPlanContent } from "@/types/trainingPlan";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = generatePlanSchema.parse(body);

    // Generate sections using OpenAI
    const sections = await generateSectionsWithAI(validatedData);

    // Create the content object that will be stored as JSON
    const content = {
      targetAudience: {
        level: validatedData.targetAudienceLevel,
        prerequisites: validatedData.prerequisites || [],
        idealFor: validatedData.idealFor || [],
      },
      duration: {
        total: validatedData.duration,
        breakdown: {
          hoursPerSection: validatedData.hoursPerSection || 2,
          weeksToComplete: validatedData.weeksToComplete || 12,
        },
      },
      sections,
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
      },
    };

    const trainingPlan = await prisma.trainingPlan.create({
      data: {
        title: validatedData.title,
        description:
          validatedData.description ||
          `Training plan for ${validatedData.title}`,
        objectives: validatedData.objectives,
        content: content as TrainingPlanContent,
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

async function generateSectionsWithAI(
  data: z.infer<typeof generatePlanSchema>
) {
  try {
    // Create a prompt for the AI
    const prompt = `
      Create a detailed training plan with the following information:
      
      Title: ${data.title}
      Objectives: ${data.objectives.join(", ")}
      Target Audience Level: ${data.targetAudienceLevel}
      Duration: ${data.duration}
      ${data.description ? `Description: ${data.description}` : ""}
      ${
        data.prerequisites?.length
          ? `Prerequisites: ${data.prerequisites.join(", ")}`
          : ""
      }
      ${
        data.learningStylePrimary
          ? `Learning Style: ${data.learningStylePrimary}`
          : ""
      }
      ${data.industry ? `Industry: ${data.industry}` : ""}
      
      For each objective, create a section with:
      1. A clear title and description
      2. 3-5 relevant topics with descriptions and durations
      3. 2-3 engaging activities with descriptions, types, and durations
      4. 2-3 helpful resources with titles, types, and formats
      5. 1-2 appropriate assessments with descriptions and criteria
      
      Format the response as a JSON array of sections, where each section has:
      {
        "id": "unique-id",
        "title": "Section Title",
        "description": "Section description",
        "topics": [
          {
            "id": "topic-id",
            "title": "Topic Title",
            "description": "Topic description",
            "duration": "Duration (e.g., 1 hour)"
          }
        ],
        "activities": [
          {
            "id": "activity-id",
            "title": "Activity Title",
            "description": "Activity description",
            "type": "Activity type (e.g., Exercise, Discussion)",
            "duration": "Duration (e.g., 30 minutes)",
            "groupSize": "Group size (e.g., individual, pairs, small groups)"
          }
        ],
        "resources": [
          {
            "id": "resource-id",
            "title": "Resource Title",
            "type": "Resource type (e.g., Video, Reading)",
            "url": "#",
            "format": "Resource format (e.g., video, document)"
          }
        ],
        "assessments": [
          {
            "id": "assessment-id",
            "title": "Assessment Title",
            "type": "Assessment type (e.g., Quiz, Project)",
            "description": "Assessment description",
            "criteria": ["Criterion 1", "Criterion 2", "Criterion 3"],
            "weight": 25
          }
        ]
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert instructional designer who creates detailed, structured training plans. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.sections || [];
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      // Fallback to the original generation method
      return generateSectionsFallback(
        data.objectives,
        data.learningMethods || []
      );
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    // Fallback to the original generation method
    return generateSectionsFallback(
      data.objectives,
      data.learningMethods || []
    );
  }
}

// Fallback method if AI generation fails
function generateSectionsFallback(
  objectives: string[],
  learningMethods: string[]
) {
  // Initialize sections array
  const sections = [];

  // Generate a section for each objective
  for (let i = 0; i < objectives.length; i++) {
    const section = {
      id: `section-${i + 1}`,
      title: `Section ${i + 1}: ${objectives[i].split(":")[0]}`,
      description: objectives[i],
      topics: generateTopics(objectives[i]),
      activities: generateActivities(learningMethods),
      resources: generateResources(),
      assessments: generateAssessments(learningMethods),
    };
    sections.push(section);
  }

  return sections;
}

function generateTopics(objective: string) {
  // Split the objective into key concepts
  const concepts = objective
    .toLowerCase()
    .split(/[,.]/)
    .map((concept) => concept.trim())
    .filter(Boolean);

  // Generate 3-5 topics based on the concepts
  return concepts.slice(0, Math.min(5, concepts.length)).map((concept) => ({
    id: `topic-${Math.random().toString(36).substr(2, 9)}`,
    title: concept.charAt(0).toUpperCase() + concept.slice(1),
    description: `Understanding ${concept}`,
    duration: "1 hour",
  }));
}

function generateActivities(learningMethods: string[]) {
  const activities = [];
  const activityTypes = [
    "Individual Exercise",
    "Group Discussion",
    "Case Study",
    "Project Work",
    "Hands-on Practice",
  ];

  // Generate 2-3 activities using the learning methods
  for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
    const method =
      learningMethods.length > 0
        ? learningMethods[Math.floor(Math.random() * learningMethods.length)]
        : "Self-paced learning";
    const type =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];

    activities.push({
      id: `activity-${Math.random().toString(36).substr(2, 9)}`,
      title: `${type}: ${method}`,
      description: `Apply your knowledge through ${method.toLowerCase()} using ${type.toLowerCase()}`,
      type,
      duration: "30 minutes",
      groupSize: type.includes("Group") ? "3-5 participants" : "individual",
    });
  }

  return activities;
}

function generateResources() {
  const resourceTypes = [
    "Video Tutorial",
    "Reading Material",
    "Interactive Demo",
    "Reference Guide",
    "Worksheet",
  ];

  // Generate 2-3 resources
  const resources = [];
  const numResources = Math.floor(Math.random() * 2) + 2;

  for (let i = 0; i < numResources; i++) {
    const type =
      resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    resources.push({
      id: `resource-${Math.random().toString(36).substr(2, 9)}`,
      title: `${type} ${i + 1}`,
      type,
      url: "#",
      format: type.toLowerCase().includes("video") ? "video" : "document",
    });
  }

  return resources;
}

function generateAssessments(learningMethods: string[]) {
  const assessmentTypes = [
    "Quiz",
    "Project",
    "Presentation",
    "Written Assignment",
    "Practical Test",
  ];

  // Generate 1-2 assessments
  const assessments = [];
  const numAssessments = Math.floor(Math.random() * 2) + 1;

  for (let i = 0; i < numAssessments; i++) {
    const type =
      assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)];
    const method =
      learningMethods.length > 0
        ? learningMethods[Math.floor(Math.random() * learningMethods.length)]
        : "Self-assessment";

    assessments.push({
      id: `assessment-${Math.random().toString(36).substr(2, 9)}`,
      title: `${type}: ${method}`,
      type,
      description: `Demonstrate your understanding through a ${type.toLowerCase()} focusing on ${method.toLowerCase()}`,
      criteria: [
        "Understanding of key concepts",
        "Application of learning",
        "Quality of work",
      ],
      weight: Math.floor(Math.random() * 30) + 20, // Random weight between 20-50
    });
  }

  return assessments;
}
