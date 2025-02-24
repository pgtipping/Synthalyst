import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNewVersion } from "@/lib/templates";
import { z } from "zod";

const updateTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string(),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string()),
  requirements: z.object({
    required: z.array(
      z.object({
        name: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        description: z.string().optional(),
      })
    ),
    preferred: z.array(z.string()).optional(),
  }),
  qualifications: z.object({
    education: z.array(z.string()).optional(),
    experience: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
  }),
  metadata: z.object({
    industry: z.string(),
    level: z.string(),
    isTemplate: z.boolean(),
  }),
});

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const template = await prisma.jobDescription.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Verify that this is actually a template
    const content = JSON.parse(template.content);
    if (!content.metadata?.isTemplate) {
      return NextResponse.json(
        { error: "This is not a template" },
        { status: 400 }
      );
    }

    // Verify ownership
    if (template.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this template" },
        { status: 403 }
      );
    }

    await prisma.jobDescription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateTemplateSchema.parse(body);

    const result = await createNewVersion(
      validatedData,
      params.id,
      session.user.id
    );

    if (result.type === "unchanged") {
      return NextResponse.json(
        { message: "No changes detected", template: result.template },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "New version created", template: result.template },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating template:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}
