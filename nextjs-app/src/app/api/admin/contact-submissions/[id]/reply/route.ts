import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the submission ID from the URL
    const { id } = params;

    // Parse request body
    const body = await request.json();
    const { content, sendEmail: shouldSendEmail = false } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

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

    // Generate a reference number
    const reference = `REF-${id.substring(0, 8)}-${Date.now()}`;

    // Create the reply
    const reply = await prisma.contactSubmissionReply.create({
      data: {
        contactSubmissionId: id,
        content,
        reference,
      },
    });

    // Update the submission status to in-progress if it's new
    if (submission.status === "new") {
      await prisma.contactSubmission.update({
        where: { id },
        data: { status: "in-progress" },
      });
    }

    // Send email if requested
    if (shouldSendEmail) {
      try {
        await sendEmail({
          to: submission.email,
          subject: `Re: ${submission.subject} [${reference}]`,
          text: content,
          html: `<div>${content.replace(/\n/g, "<br>")}</div>`,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json({
      data: reply,
      message: "Reply created successfully",
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
