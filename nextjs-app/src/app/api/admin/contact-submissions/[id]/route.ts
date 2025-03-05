import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Define the ContactSubmission interface
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  company: string | null;
  phone: string | null;
  inquiryType: string;
  message: string;
  status: string;
  notes: string | null;
  assignedTo: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user's email is the admin email
    const userEmail = session.user.email;
    if (userEmail !== "pgtipping1@gmail.com") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get the submission ID from the URL params
    const { id } = await params;

    try {
      // Fetch the submission
      const submissions = (await prisma.$queryRaw`
        SELECT * FROM "ContactSubmission" WHERE id = ${id}
      `) as ContactSubmission[];

      if (!submissions || submissions.length === 0) {
        return NextResponse.json(
          { error: "Submission not found" },
          { status: 404 }
        );
      }

      const submission = submissions[0];

      // Return the submission
      return NextResponse.json(submission, { status: 200 });
    } catch (dbError) {
      logger.error("Database error fetching contact submission", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  } catch (error) {
    logger.error("Failed to fetch contact submission", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
