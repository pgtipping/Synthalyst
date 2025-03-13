import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateResourcesWithGemini, Resource } from "@/lib/gemini";
import { generateTrainingPlanWithFallback } from "@/lib/trainingPlanFallback";
import { z } from "zod";

// Define the schema for the request body
const planRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  objectives: z
    .array(z.string())
    .min(1, "At least one learning objective is required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  duration: z.string().min(1, "Duration is required"),
  prerequisites: z.string().optional().default(""),
  learningStylePrimary: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  materialsRequired: z.array(z.string()).optional().default([]),
  certificationDetails: z.string().optional().default(""),
  additionalNotes: z.string().optional().default(""),
});

// Define the type for the session user with subscription tier
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  subscriptionTier?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the session to check if the user is authenticated
    const session = await getServerSession(authOptions);

    // Check if the user is a premium user
    const user = session?.user as SessionUser | undefined;
    const isPremiumUser = user?.subscriptionTier === "premium";

    // Parse the request body
    const body = await request.json();
    const validatedData = planRequestSchema.parse(body);

    // Generate resources with Gemini for premium users
    let resources: Resource[] | null = null;
    if (isPremiumUser) {
      try {
        resources = await generateResourcesWithGemini(
          validatedData.title,
          validatedData.objectives,
          validatedData.targetAudienceLevel,
          validatedData.industry,
          validatedData.learningStylePrimary
        );

        console.log(`Generated ${resources.length} resources with Gemini`);
      } catch (error) {
        console.error("Error generating resources with Gemini:", error);
        // Continue without resources if Gemini fails
      }
    }

    // Generate the training plan with fallback mechanism
    const planResponse = await generateTrainingPlanWithFallback({
      title: validatedData.title,
      description: validatedData.description,
      objectives: validatedData.objectives,
      targetAudienceLevel: validatedData.targetAudienceLevel,
      duration: validatedData.duration,
      prerequisites: validatedData.prerequisites,
      learningStylePrimary: validatedData.learningStylePrimary,
      industry: validatedData.industry,
      materialsRequired: validatedData.materialsRequired,
      certificationDetails: validatedData.certificationDetails,
      additionalNotes: validatedData.additionalNotes,
      isPremiumUser,
      // @ts-expect-error - resources has optional id but it's required in the type
      resources,
    });

    // Return the generated plan
    return NextResponse.json({
      plan: planResponse.text,
      isPremiumUser,
      resourceCount: resources?.length || 0,
      resources: resources || [],
    });
  } catch (error) {
    console.error("Error generating training plan:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors with proper JSON formatting
    return NextResponse.json(
      {
        error: "Failed to generate training plan",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
