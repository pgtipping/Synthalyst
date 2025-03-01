import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const savedJDs = await prisma.jobDescription.findMany({
      where: {
        userId: session.user.id,
        content: {
          not: {
            contains: '"isTemplate":true',
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Parse the content JSON for each job description
    const parsedJDs = savedJDs
      .map((jd) => {
        try {
          const parsedContent = JSON.parse(jd.content);
          // Double-check that this is not a template
          if (parsedContent.metadata?.isTemplate === true) {
            return null; // Skip this item
          }
          return {
            id: jd.id,
            ...parsedContent,
          };
        } catch (error) {
          console.error(`Error parsing JD ${jd.id}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries

    return NextResponse.json({ jobDescriptions: parsedJDs });
  } catch (error) {
    console.error("Error fetching saved job descriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved job descriptions" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await props.params;

    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id },
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

    await prisma.jobDescription.delete({
      where: { id },
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
