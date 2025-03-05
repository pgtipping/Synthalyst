import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePlanSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  objectives: z.array(z.string()).optional(),
  targetAudienceLevel: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  idealFor: z.array(z.string()).optional(),
  duration: z.string().optional(),
  hoursPerSection: z.string().optional(),
  weeksToComplete: z.string().optional(),
  learningStylePrimary: z.string().optional(),
  learningMethods: z.array(z.string()).optional(),
  theoryRatio: z.string().optional(),
  practicalRatio: z.string().optional(),
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

type TrainingPlanContent = {
  targetAudience?: {
    level?: string;
    prerequisites?: string[];
    idealFor?: string[];
  };
  duration?: {
    total?: string;
    breakdown?: {
      hoursPerSection?: string;
      weeksToComplete?: string;
    };
  };
  learningStyle?: {
    primary?: string;
    methods?: string[];
    ratio?: {
      theory: number;
      practical: number;
    };
  };
  materials?: {
    required?: string[];
    optional?: string[];
    provided?: string[];
  };
  certification?: {
    type?: string;
    requirements?: string[];
    validityPeriod?: string;
  };
  metadata?: {
    updatedAt: string;
    industry?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
  };
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    if (plan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this plan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updatePlanSchema.parse(body);

    // Get the current content
    const currentContent = plan.content as unknown as Record<string, unknown>;

    // Create the updated content object
    const content = {
      ...currentContent,
      targetAudience: validatedData.targetAudienceLevel
        ? {
            ...((currentContent.targetAudience as Record<string, unknown>) ||
              {}),
            level: validatedData.targetAudienceLevel,
            prerequisites: validatedData.prerequisites,
            idealFor: validatedData.idealFor,
          }
        : currentContent.targetAudience,
      duration: validatedData.duration
        ? {
            ...((currentContent.duration as Record<string, unknown>) || {}),
            total: validatedData.duration,
            breakdown: {
              hoursPerSection: validatedData.hoursPerSection,
              weeksToComplete: validatedData.weeksToComplete,
            },
          }
        : currentContent.duration,
      learningStyle: validatedData.learningStylePrimary
        ? {
            ...((currentContent.learningStyle as Record<string, unknown>) ||
              {}),
            primary: validatedData.learningStylePrimary,
            methods: validatedData.learningMethods,
            ratio:
              validatedData.theoryRatio && validatedData.practicalRatio
                ? {
                    theory: parseInt(validatedData.theoryRatio),
                    practical: parseInt(validatedData.practicalRatio),
                  }
                : (currentContent.learningStyle as Record<string, unknown>)
                    ?.ratio,
          }
        : currentContent.learningStyle,
      materials: {
        ...((currentContent.materials as Record<string, unknown>) || {}),
        required:
          validatedData.requiredMaterials ||
          (currentContent.materials as Record<string, unknown>)?.required ||
          [],
        optional:
          validatedData.optionalMaterials ||
          (currentContent.materials as Record<string, unknown>)?.optional,
        provided:
          validatedData.providedMaterials ||
          (currentContent.materials as Record<string, unknown>)?.provided,
      },
      certification: validatedData.certificationType
        ? {
            ...((currentContent.certification as Record<string, unknown>) ||
              {}),
            type: validatedData.certificationType,
            requirements: validatedData.certificationRequirements || [],
            validityPeriod: validatedData.certificationValidity,
          }
        : currentContent.certification,
      metadata: {
        ...((currentContent.metadata as Record<string, unknown>) || {}),
        updatedAt: new Date().toISOString(),
        industry:
          validatedData.industry ||
          (currentContent.metadata as Record<string, unknown>)?.industry,
        category:
          validatedData.category ||
          (currentContent.metadata as Record<string, unknown>)?.category,
        tags:
          validatedData.tags ||
          (currentContent.metadata as Record<string, unknown>)?.tags,
        difficulty:
          validatedData.difficulty ||
          (currentContent.metadata as Record<string, unknown>)?.difficulty,
      },
    };

    // Update the training plan
    const updatedPlan = await prisma.trainingPlan.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description && {
          description: validatedData.description,
        }),
        ...(validatedData.objectives && {
          objectives: validatedData.objectives,
        }),
        content: JSON.stringify(content),
      },
    });

    // Transform the plan to include parsed content
    const transformedPlan = {
      ...updatedPlan,
      content: JSON.parse(updatedPlan.content as string) as TrainingPlanContent,
    };

    return NextResponse.json({ plan: transformedPlan });
  } catch (error) {
    console.error("Error updating training plan:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update training plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    if (plan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this plan" },
        { status: 403 }
      );
    }

    await prisma.trainingPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting training plan:", error);
    return NextResponse.json(
      { error: "Failed to delete training plan" },
      { status: 500 }
    );
  }
}
