import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const templates = await prisma.trainingPlan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter and transform the templates to include parsed content
    const transformedTemplates = templates
      .map((template) => ({
        ...template,
        content: template.content as unknown as Record<string, unknown>,
      }))
      .filter((template) => {
        const content = template.content as Record<string, unknown>;
        const metadata = content.metadata as Record<string, unknown>;
        return metadata?.isTemplate === true;
      });

    return NextResponse.json({ templates: transformedTemplates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Training plan ID is required" },
        { status: 400 }
      );
    }

    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Create a new template from the existing plan
    const existingContent = existingPlan.content as unknown as Record<
      string,
      unknown
    >;
    const content = {
      ...existingContent,
      metadata: {
        ...(existingContent.metadata as Record<string, unknown>),
        isTemplate: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.email,
      },
    };

    const template = await prisma.trainingPlan.create({
      data: {
        title: existingPlan.title,
        description: existingPlan.description,
        objectives: existingPlan.objectives,
        content: content as any,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
