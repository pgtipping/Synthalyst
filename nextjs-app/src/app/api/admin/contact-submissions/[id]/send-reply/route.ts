import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { sendContactReply } from "@/lib/email";

// Schema for email reply
const replySchema = z.object({
  recipientEmail: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(
  request: Request,
  context: { params: { id: string } }
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
    const { id } = context.params;

    // Parse the request body
    const body = await request.json();

    // Validate the reply data
    const validatedData = replySchema.parse(body);

    // Check if the submission exists
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Send the email
    try {
      logger.info("Sending reply email", {
        to: validatedData.recipientEmail,
        subject: validatedData.subject,
        messagePreview: validatedData.message.substring(0, 50) + "...",
        submissionId: id,
      });

      // Format the message as HTML
      const htmlMessage = validatedData.message.replace(/\n/g, "<br>");

      // Send the email using SendGrid
      const emailSent = await sendContactReply(
        validatedData.recipientEmail,
        validatedData.subject,
        htmlMessage,
        "Synthalyst Support"
      );

      if (!emailSent) {
        throw new Error("Failed to send email");
      }

      // Record the reply in the database
      await prisma.contactSubmissionReply.create({
        data: {
          submissionId: id,
          subject: validatedData.subject,
          message: validatedData.message,
          sentBy: session.user.id || "unknown",
          sentAt: new Date(),
        },
      });

      // Update the submission status and last replied date
      await prisma.contactSubmission.update({
        where: { id },
        data: {
          status: "in-progress",
          updatedAt: new Date(),
          lastRepliedAt: new Date(),
        },
      });
    } catch (emailError) {
      logger.error("Failed to send reply email", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Reply sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to process reply", error);

    // Return appropriate error response
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
