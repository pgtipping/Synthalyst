import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";

// Schema for notes update
const notesUpdateSchema = z.object({
  notes: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user has admin role or is the admin email
    if (
      session.user.role !== "ADMIN" &&
      session.user.email !== "pgtipping1@gmail.com"
    ) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get the submission ID from the URL params
    const paramsValue = await params;
    const { id } = paramsValue;

    // Parse the request body
    const body = await request.json();

    // Validate the notes
    const validatedData = notesUpdateSchema.parse(body);

    try {
      // Update the submission notes
      await prisma.$queryRaw`
        UPDATE "ContactSubmission"
        SET notes = ${validatedData.notes}, "updatedAt" = ${new Date()}
        WHERE id = ${id}
      `;
    } catch (dbError) {
      logger.error("Database error updating contact submission notes", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    logger.info(`Contact submission ${id} notes updated`, {
      userId: session.user.id || "unknown",
      submissionId: id,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Notes updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to update contact submission notes", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 }
    );
  }
}
