import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { sendContactReply } from "@/lib/email";
import { Prisma } from "@prisma/client";

// Schema for email reply
const replySchema = z.object({
  recipientEmail: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  replyToEmail: z.string().email("Invalid reply-to email").optional(),
  fromEmail: z
    .union([z.literal("default"), z.string().email("Invalid sender email")])
    .optional(),
});

// Generate a reference number for the reply
function generateReference(submissionId: string) {
  // Format: REF-{first 8 chars of submissionId}-{timestamp}
  const timestamp = Date.now().toString(36);
  const shortId = submissionId.substring(0, 8);
  return `REF-${shortId}-${timestamp}`.toUpperCase();
}

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

    // Generate reference number
    const reference = generateReference(id);

    // Parse the request body
    const body = await request.json();

    // Validate the reply data
    const validatedData = replySchema.parse(body);

    // Modify subject to include reference
    const subjectWithRef = `${validatedData.subject} [${reference}]`;

    // Add reply instructions to the message
    const messageWithInstructions = `${validatedData.message}\n\n---\nTo reply to this message, please use our contact form and include "${reference}" in the subject line.`;

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
        subject: subjectWithRef,
        messagePreview: validatedData.message.substring(0, 50) + "...",
        reference,
        submissionId: id,
      });

      // Format the message as HTML
      const htmlMessage = messageWithInstructions.replace(/\n/g, "<br>");

      // Send the email using SendGrid
      const emailSent = await sendContactReply(
        validatedData.recipientEmail,
        subjectWithRef,
        htmlMessage,
        "Synthalyst Support",
        "noreply@synthalyst.com",
        "noreply@synthalyst.com"
      );

      if (!emailSent) {
        throw new Error("Failed to send email");
      }

      // Use a transaction to ensure both operations succeed or fail together
      await prisma.$transaction(async (tx) => {
        // Create the reply record using Prisma's model API
        await tx.$queryRaw(
          Prisma.sql`
            INSERT INTO "ContactSubmissionReply" (
              "id", 
              "contactSubmissionId", 
              "content",
              "reference",
              "createdAt"
            ) 
            VALUES (
              ${crypto.randomUUID()}, 
              ${id}, 
              ${messageWithInstructions},
              ${reference},
              NOW()
            )
          `
        );

        // Update the submission status using Prisma's model API
        await tx.$queryRaw(
          Prisma.sql`
            UPDATE "ContactSubmission"
            SET 
              "status" = 'in-progress',
              "updatedAt" = NOW(),
              "lastRepliedAt" = NOW()
            WHERE "id" = ${id}
          `
        );
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
