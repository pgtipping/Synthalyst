import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processInboundEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    // Parse the webhook payload
    const body = await request.json();

    // Validate the webhook signature if needed
    // This depends on your email provider's webhook format

    // Extract email data from the webhook payload
    // This is an example structure - adjust based on your email provider
    const emailData = {
      fromEmail: body.from || body.sender || body.email,
      fromFull: body.from_full || body.sender_full || body.from,
      subject: body.subject || "",
      textContent: body.text || body.plain || body.content,
      htmlContent: body.html || body.html_content,
      reference: extractReference(body.subject || ""),
    };

    // Store the raw inbound email
    const inboundEmail = await prisma.inboundEmail.create({
      data: {
        fromEmail: emailData.fromEmail,
        fromFull: emailData.fromFull,
        to: body.to || body.recipient || "",
        subject: emailData.subject,
        textContent: emailData.textContent,
        htmlContent: emailData.htmlContent,
        attachmentCount: body.attachments ? body.attachments.length : 0,
        processed: false,
      },
    });

    // Process the email to create a contact submission or reply
    const result = await processInboundEmail(emailData);

    // Update the inbound email record to mark it as processed
    await prisma.inboundEmail.update({
      where: { id: inboundEmail.id },
      data: {
        processed: true,
        processedAt: new Date(),
        notes: JSON.stringify(result),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email processed successfully",
      result,
    });
  } catch (error) {
    console.error("Error processing inbound email webhook:", error);
    return NextResponse.json(
      { error: "Failed to process inbound email" },
      { status: 500 }
    );
  }
}

// Helper function to extract reference from subject
function extractReference(subject: string): string | undefined {
  // Look for patterns like [REF-12345-20230101123456]
  const match = subject.match(/\[([^\]]+)\]/);
  if (match && match[1] && match[1].startsWith("REF-")) {
    return match[1];
  }
  return undefined;
}
