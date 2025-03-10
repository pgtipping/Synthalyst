import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const submissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  reference: z.string().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = submissionSchema.parse(body);

    // Create the submission
    const submission = await prisma.$transaction(async (tx) => {
      // If there's a reference, find the original submission
      let parentSubmissionId = null;
      if (validatedData.reference) {
        const parentReply = await tx.contactSubmissionReply.findFirst({
          where: { reference: validatedData.reference },
          select: { contactSubmissionId: true },
        });
        if (parentReply) {
          parentSubmissionId = parentReply.contactSubmissionId;
        }
      }

      // Create the new submission
      const newSubmission = await tx.contactSubmission.create({
        data: {
          id: crypto.randomUUID(),
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
          status: "new",
          parentSubmissionId, // Link to parent if this is a reply
        },
      });

      // If this is a reply, update the parent submission's status
      if (parentSubmissionId) {
        await tx.contactSubmission.update({
          where: { id: parentSubmissionId },
          data: {
            status: "awaiting-reply",
            updatedAt: new Date(),
          },
        });
      }

      return newSubmission;
    });

    return NextResponse.json(
      { message: "Submission created successfully", id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating submission:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
