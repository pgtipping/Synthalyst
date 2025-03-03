import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { subscription } from "@/lib/subscription";
import { generatePlanWithLlama } from "@/lib/llama";
import { fetchResourcesWithGemini } from "@/lib/gemini";
import { generateUniqueId } from "@/lib/utils";

// Updated schema to match the new form structure
const requestSchema = z.object({
  // Mandatory fields
  title: z.string().min(3, "Title must be at least 3 characters"),
  objectives: z
    .array(z.string())
    .min(1, "At least one learning objective is required"),
  targetAudienceLevel: z.string().min(1, "Target audience level is required"),
  duration: z.string().min(1, "Duration is required"),

  // Optional fields
  description: z.string().optional(),
  prerequisites: z.string().optional(),
  learningStylePrimary: z.string().optional(),
  industry: z.string().optional(),
  materialsRequired: z.array(z.string()).optional(),
  certificationDetails: z.string().optional(),
  additionalNotes: z.string().optional(),

  // User information
  userEmail: z.string().email("Valid email is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = requestSchema.parse(body);

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to generate a training plan" },
        { status: 401 }
      );
    }

    // Check if user email matches session email
    if (validatedData.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "User email does not match session email" },
        { status: 403 }
      );
    }

    // Check subscription status
    const isPro = await subscription.isPremium(validatedData.userEmail);

    if (!isPro) {
      return NextResponse.json(
        {
          error:
            "Pro subscription required to generate enhanced training plans",
        },
        { status: 403 }
      );
    }

    // Fetch relevant resources based on objectives and audience level
    const resourcesPromise = fetchResourcesWithGemini({
      objectives: validatedData.objectives,
      targetAudienceLevel: validatedData.targetAudienceLevel,
      industry: validatedData.industry || "",
    });

    // Generate the training plan with Llama
    const planPromise = generatePlanWithLlama({
      title: validatedData.title,
      description: validatedData.description || "",
      objectives: validatedData.objectives,
      targetAudienceLevel: validatedData.targetAudienceLevel,
      duration: validatedData.duration,
      prerequisites: validatedData.prerequisites || "",
      learningStylePrimary: validatedData.learningStylePrimary || "",
      industry: validatedData.industry || "",
      materialsRequired: validatedData.materialsRequired || [],
      certificationDetails: validatedData.certificationDetails || "",
      additionalNotes: validatedData.additionalNotes || "",
    });

    // Wait for both promises to resolve
    const [resources, planResponse] = await Promise.all([
      resourcesPromise,
      planPromise,
    ]);

    // Check if plan generation was successful
    if (!planResponse.text) {
      return NextResponse.json(
        { error: "Failed to generate training plan" },
        { status: 500 }
      );
    }

    // Create a unique ID for the plan
    const planId = generateUniqueId();

    // Format the final plan with resources
    const formattedPlan = {
      id: planId,
      title: validatedData.title,
      content: planResponse.text,
      objectives: validatedData.objectives,
      targetAudienceLevel: validatedData.targetAudienceLevel,
      duration: validatedData.duration,
      description: validatedData.description || "",
      prerequisites: validatedData.prerequisites || "",
      learningStylePrimary: validatedData.learningStylePrimary || "",
      industry: validatedData.industry || "",
      materialsRequired: validatedData.materialsRequired || [],
      certificationDetails: validatedData.certificationDetails || "",
      additionalNotes: validatedData.additionalNotes || "",
      resources: resources,
      generatedAt: new Date().toISOString(),
      isPro: isPro,
    };

    // Return the generated plan
    return NextResponse.json({
      success: true,
      data: formattedPlan,
    });
  } catch (error) {
    console.error("Error generating training plan:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate training plan" },
      { status: 500 }
    );
  }
}
