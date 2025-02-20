import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const generatePlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  objectives: z.array(z.string()),
  targetAudienceLevel: z.string(),
  prerequisites: z.array(z.string()).optional(),
  idealFor: z.array(z.string()).optional(),
  duration: z.string(),
  hoursPerSection: z.string().optional(),
  weeksToComplete: z.string().optional(),
  learningStylePrimary: z.string(),
  learningMethods: z.array(z.string()),
  theoryRatio: z.string().optional(),
  practicalRatio: z.string().optional(),
  requiredMaterials: z.array(z.string()).optional(),
  optionalMaterials: z.array(z.string()).optional(),
  providedMaterials: z.array(z.string()).optional(),
  certificationType: z.string().optional(),
  certificationRequirements: z.array(z.string()).optional(),
  certificationValidity: z.string().optional(),
  industry: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = generatePlanSchema.parse(body);

    // Generate sections based on objectives and learning methods
    const sections = await generateSections(
      validatedData.objectives,
      validatedData.learningMethods
    );

    // Create the content object that will be stored as JSON
    const content = {
      targetAudience: {
        level: validatedData.targetAudienceLevel,
        prerequisites: validatedData.prerequisites,
        idealFor: validatedData.idealFor,
      },
      duration: {
        total: validatedData.duration,
        breakdown: {
          hoursPerSection: validatedData.hoursPerSection,
          weeksToComplete: validatedData.weeksToComplete,
        },
      },
      sections,
      learningStyle: {
        primary: validatedData.learningStylePrimary,
        methods: validatedData.learningMethods,
        ratio:
          validatedData.theoryRatio && validatedData.practicalRatio
            ? {
                theory: parseInt(validatedData.theoryRatio),
                practical: parseInt(validatedData.practicalRatio),
              }
            : undefined,
      },
      materials: {
        required: validatedData.requiredMaterials || [],
        optional: validatedData.optionalMaterials,
        provided: validatedData.providedMaterials,
      },
      certification: validatedData.certificationType
        ? {
            type: validatedData.certificationType,
            requirements: validatedData.certificationRequirements || [],
            validityPeriod: validatedData.certificationValidity,
          }
        : undefined,
      metadata: {
        createdBy: session.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        industry: validatedData.industry,
        category: validatedData.category,
        tags: validatedData.tags,
        difficulty: validatedData.difficulty,
        isTemplate: false,
      },
    };

    const trainingPlan = await prisma.trainingPlan.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        objectives: validatedData.objectives,
        content: content as any, // Prisma will handle the JSON serialization
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

async function generateSections(
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
      learningMethods[Math.floor(Math.random() * learningMethods.length)];
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
      learningMethods[Math.floor(Math.random() * learningMethods.length)];

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
