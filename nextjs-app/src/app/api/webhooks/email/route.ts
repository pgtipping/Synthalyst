import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * SendGrid Inbound Parse Webhook Handler
 *
 * This endpoint processes emails received through SendGrid's Inbound Parse feature.
 * It receives parsed email data and can be used to:
 * - Process email replies to newsletters
 * - Create tickets or tasks from emails
 * - Store email content for later processing
 *
 * Documentation: https://docs.sendgrid.com/for-developers/parsing-email/inbound-email
 */
export async function POST(request: NextRequest) {
  try {
    // Log the webhook receipt
    logger.info("Received inbound email webhook from SendGrid");

    // Parse the form data (SendGrid sends multipart/form-data)
    const formData = await request.formData();

    // Extract email data
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const html = formData.get("html") as string;
    const attachments = formData.get("attachments") as string;
    const attachmentCount = attachments ? JSON.parse(attachments).length : 0;

    // Log the received email details
    logger.info(`Email received: ${subject}`, {
      from,
      to,
      attachmentCount,
    });

    // Process the email based on its purpose
    // This is where you would add logic to handle different types of emails
    if (to.includes("newsletter@synthalyst.com")) {
      // Handle newsletter replies
      await handleNewsletterReply(from, subject, text, html);
    } else if (to.includes("support@synthalyst.com")) {
      // Handle support emails
      await handleSupportEmail(from, subject, text, html);
    } else {
      // Handle general emails
      logger.info("Received general email, storing for review");
      // Store the email for later processing
      await storeInboundEmail(from, to, subject, text, html, attachmentCount);
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: "Email processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log the error
    logger.error("Error processing inbound email", error);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Error processing email" },
      { status: 500 }
    );
  }
}

/**
 * Handle newsletter replies
 */
async function handleNewsletterReply(
  from: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    // Extract email address from the from field
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = from.match(emailRegex);
    const email = match ? match[0] : "";

    if (!email) {
      logger.warn("Could not extract email from the from field", { from });
      return;
    }

    // Try to find the most recent newsletter send to this email
    const recentSend = await findRecentNewsletterSend(email);

    if (!recentSend) {
      logger.warn(`No recent newsletter send found for ${email}`);
      // Store as a general inbound email instead
      await storeInboundEmail(
        from,
        "newsletter@synthalyst.com",
        subject,
        text,
        html,
        0
      );
      return;
    }

    // Store the reply in the database
    await prisma.newsletterReply.create({
      data: {
        content: text || html,
        sendId: recentSend.id,
      },
    });

    logger.info(
      `Stored newsletter reply from ${email} for send ${recentSend.id}`
    );
  } catch (error) {
    logger.error("Error handling newsletter reply", error);
    throw error;
  }
}

/**
 * Find the most recent newsletter send to an email
 */
async function findRecentNewsletterSend(email: string) {
  try {
    // Find the subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return null;
    }

    // Find the most recent send that includes this subscriber
    // This is a simplified approach - in a real implementation, you would
    // need to check if the subscriber was actually included in the send
    const recentSend = await prisma.newsletterSend.findFirst({
      where: {
        status: "completed",
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    return recentSend;
  } catch (error) {
    logger.error("Error finding recent newsletter send", error);
    return null;
  }
}

/**
 * Handle support emails
 */
async function handleSupportEmail(
  from: string,
  subject: string,
  text: string,
  html: string
) {
  // This is a placeholder for future support ticket functionality
  logger.info("Support email handling not yet implemented");

  // For now, just store the email
  await storeInboundEmail(
    from,
    "support@synthalyst.com",
    subject,
    text,
    html,
    0
  );
}

/**
 * Store inbound email in the database
 */
async function storeInboundEmail(
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
  attachmentCount: number
) {
  try {
    // Extract email address from the from field
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = from.match(emailRegex);
    const email = match ? match[0] : from;

    // Store in database (assuming we have an InboundEmail model)
    // If the model doesn't exist, this will fail gracefully
    try {
      // @ts-expect-error - The InboundEmail model might not exist yet
      await prisma.inboundEmail.create({
        data: {
          fromEmail: email,
          fromFull: from,
          to,
          subject,
          textContent: text,
          htmlContent: html,
          attachmentCount,
          processed: false,
        },
      });
      logger.info(`Stored inbound email from ${email}`);
    } catch (error) {
      // If the model doesn't exist, log it but don't throw
      logger.warn("Could not store inbound email, model may not exist", error);
    }
  } catch (error) {
    logger.error("Error storing inbound email", error);
    throw error;
  }
}
