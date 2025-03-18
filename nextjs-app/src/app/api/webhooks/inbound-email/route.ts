import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processInboundEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

interface EmailPayload {
  from?: string;
  sender?: string;
  email?: string;
  from_full?: string;
  sender_full?: string;
  to?: string;
  recipient?: string;
  subject?: string;
  text?: string;
  plain?: string;
  content?: string;
  body?: string;
  html?: string;
  html_content?: string;
  attachments?: Array<Record<string, unknown>>;
  headers?: Record<string, string>;
  email_headers?: Record<string, string>;
  envelope?: {
    from?: string;
    to?: string;
  };
  rawContent?: string;
  [key: string]: unknown; // For other unknown fields
}

export async function POST(request: Request) {
  try {
    // Check content type
    const contentType = request.headers.get("content-type") || "";
    let body: EmailPayload;

    // Handle different content types
    if (contentType.includes("application/json")) {
      try {
        // Parse JSON with extra error handling
        const text = await request.text();

        // Check if we have valid JSON before parsing
        if (!text || !text.trim().startsWith("{")) {
          logger.error("Invalid JSON payload for inbound email", {
            text: text.substring(0, 100),
          });
          return NextResponse.json(
            { error: "Invalid JSON payload" },
            { status: 400 }
          );
        }

        body = JSON.parse(text);
      } catch (parseError) {
        logger.error("JSON parse error in inbound email webhook:", parseError, {
          message: (parseError as Error).message,
          stack: (parseError as Error).stack,
        });

        return NextResponse.json(
          { error: `Failed to parse JSON: ${(parseError as Error).message}` },
          { status: 400 }
        );
      }
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      // Handle form data
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries()) as EmailPayload;
    } else {
      // For other content types, try getting raw text
      try {
        const text = await request.text();

        // Try parsing as JSON first
        try {
          body = JSON.parse(text);
        } catch (jsonError) {
          // If not valid JSON, store as text and log it
          body = { rawContent: text };
          logger.warn("Received non-JSON payload for inbound email", {
            contentType,
            textSample: text.substring(0, 100),
            parseError: (jsonError as Error).message,
          });
        }
      } catch (textError) {
        logger.error("Error reading request body:", textError);
        return NextResponse.json(
          { error: "Unable to read request body" },
          { status: 400 }
        );
      }
    }

    // Log the received payload for debugging (be careful with sensitive data)
    logger.info("Received inbound email webhook payload", {
      contentType,
      payloadKeys: Object.keys(body),
    });

    // Extract email data from the webhook payload
    // This handles different email provider formats
    const emailData = {
      fromEmail:
        body.from || body.sender || body.email || body.envelope?.from || "",
      fromFull:
        body.from_full ||
        body.sender_full ||
        body.from ||
        body.envelope?.from ||
        "",
      subject: body.subject || "",
      textContent: body.text || body.plain || body.content || body.body || "",
      htmlContent: body.html || body.html_content || "",
      reference: extractReference(body.subject || ""),
      // Add raw headers for debugging
      headers: body.headers || body.email_headers || {},
    };

    if (!emailData.fromEmail) {
      logger.error("Missing required email data: fromEmail", {
        body: JSON.stringify(body).substring(0, 200),
      });
      return NextResponse.json(
        { error: "Missing required email data" },
        { status: 400 }
      );
    }

    // Store the raw inbound email
    const inboundEmail = await prisma.inboundEmail.create({
      data: {
        fromEmail: emailData.fromEmail,
        fromFull: emailData.fromFull,
        to: body.to || body.recipient || body.envelope?.to || "",
        subject: emailData.subject,
        textContent: emailData.textContent,
        htmlContent: emailData.htmlContent,
        attachmentCount: body.attachments ? body.attachments.length : 0,
        rawPayload: JSON.stringify(body, null, 2).substring(0, 10000), // Store first 10K chars for debugging
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
    logger.error("Error processing inbound email webhook:", error);

    return NextResponse.json(
      {
        error: "Failed to process inbound email",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
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
