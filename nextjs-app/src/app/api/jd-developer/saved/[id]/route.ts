import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id: params.id },
    });

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description not found" },
        { status: 404 }
      );
    }

    // Verify that this is not a template
    const content = JSON.parse(jobDescription.content);
    if (content.metadata?.isTemplate) {
      return NextResponse.json(
        { error: "Cannot delete templates through this endpoint" },
        { status: 400 }
      );
    }

    // Verify ownership
    if (jobDescription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this job description" },
        { status: 403 }
      );
    }

    await prisma.jobDescription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job description:", error);
    return NextResponse.json(
      { error: "Failed to delete job description" },
      { status: 500 }
    );
  }
}
