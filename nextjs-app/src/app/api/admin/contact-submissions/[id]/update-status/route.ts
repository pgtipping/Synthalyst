import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";

// Schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(["new", "in-progress", "resolved"]),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the submission ID from the URL params
    const { id } = params;

    // Parse the form data
    const formData = await request.formData();
    const status = formData.get("status") as string;

    // Validate the status
    const validatedData = statusUpdateSchema.parse({ status });

    try {
      // Update the submission status
      await prisma.contactSubmission.update({
        where: { id },
        data: {
          status: validatedData.status,
          updatedAt: new Date(),
        },
      });
    } catch (dbError) {
      logger.error(
        "Database error updating contact submission status",
        dbError
      );
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    logger.info(
      `Contact submission ${id} status updated to ${validatedData.status}`,
      {
        userId: session.user.id || "unknown",
        submissionId: id,
      }
    );

    // Redirect back to the submission detail page
    return NextResponse.redirect(
      new URL(`/admin/contact-submissions/${id}`, request.url)
    );
  } catch (error) {
    logger.error("Failed to update contact submission status", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
