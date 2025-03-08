import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function DELETE(
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
    const { id } = await params;

    try {
      // Delete the submission
      await prisma.$queryRaw`
        DELETE FROM "ContactSubmission"
        WHERE id = ${id}
      `;
    } catch (dbError) {
      logger.error("Database error deleting contact submission", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    logger.info(`Contact submission ${id} deleted`, {
      userId: session.user.id || "unknown",
      submissionId: id,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Submission deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to delete contact submission", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
