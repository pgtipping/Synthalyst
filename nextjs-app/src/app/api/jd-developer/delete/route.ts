import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Job description ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description not found" },
        { status: 404 }
      );
    }

    if (jobDescription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this job description" },
        { status: 403 }
      );
    }

    // Delete the job description
    await prisma.jobDescription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job description:", error);
    return NextResponse.json(
      { error: "Failed to delete job description" },
      { status: 500 }
    );
  }
}
