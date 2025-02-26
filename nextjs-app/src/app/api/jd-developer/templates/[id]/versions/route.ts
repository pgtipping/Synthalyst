import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJobDescription } from "@/lib/templates";
import { type NextRequest } from "next/server";

export async function GET(
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

    // Get the template and its version history
    const template = await prisma.jobDescription.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Get all versions of this template (including the template itself)
    const versions = await prisma.jobDescription.findMany({
      where: {
        OR: [
          { id: template.id },
          { parentId: template.id },
          ...(template.parentId
            ? [{ id: template.parentId }, { parentId: template.parentId }]
            : []),
        ],
      },
      orderBy: {
        version: "desc",
      },
    });

    // Parse each version
    const parsedVersions = versions.map(parseJobDescription);

    return NextResponse.json({ versions: parsedVersions });
  } catch (error) {
    console.error("Error fetching template versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch template versions" },
      { status: 500 }
    );
  }
}
