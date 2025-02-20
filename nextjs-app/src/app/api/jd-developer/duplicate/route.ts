import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Job description ID is required" },
        { status: 400 }
      );
    }

    const originalJD = await prisma.jobDescription.findUnique({
      where: { id },
    });

    if (!originalJD) {
      return NextResponse.json(
        { error: "Job description not found" },
        { status: 404 }
      );
    }

    // Parse the original content
    const content = JSON.parse(originalJD.content);

    // Create a new copy with updated metadata
    const newContent = {
      ...content,
      metadata: {
        ...content.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.email,
        isTemplate: false,
      },
    };

    // Save the duplicate
    const duplicateJD = await prisma.jobDescription.create({
      data: {
        title: `${originalJD.title} (Copy)`,
        content: JSON.stringify(newContent),
        industry: originalJD.industry,
        level: originalJD.level,
        skills: originalJD.skills,
        userId: session.user.id,
      },
    });

    // Parse the content for the response
    const parsedDuplicate = {
      id: duplicateJD.id,
      ...JSON.parse(duplicateJD.content),
    };

    return NextResponse.json(
      { jobDescription: parsedDuplicate },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error duplicating job description:", error);
    return NextResponse.json(
      { error: "Failed to duplicate job description" },
      { status: 500 }
    );
  }
}
