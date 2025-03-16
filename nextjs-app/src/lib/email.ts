import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Initialize SendGrid
let sendgridInitialized = false;
try {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendgridInitialized = true;
    logger.info("SendGrid API key set successfully");
  } else {
    logger.warn("SendGrid API key not found. Falling back to Nodemailer.");
  }
} catch (error) {
  logger.error("Error initializing SendGrid:", error);
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    content?: string;
    filename?: string;
    type?: string;
    disposition?: string;
    contentId?: string;
  }>;
  templateId?: string;
  dynamicTemplateData?: Record<string, string | number | boolean | null>;
  category?: string;
}

/**
 * Unified email sending function that uses SendGrid with Nodemailer fallback
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = process.env.SENDGRID_FROM_EMAIL || "noreply@synthalyst.com",
  replyTo = process.env.EMAIL_REPLY_TO || "support@synthalyst.com",
  attachments = [],
  templateId,
  dynamicTemplateData,
  category = "general",
}: EmailOptions) {
  try {
    // Track email sending in database
    const emailLog = await prisma.emailLog.create({
      data: {
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        from,
        category,
        status: "pending",
      },
    });

    // Try SendGrid first if available
    if (sendgridInitialized) {
      const msg = {
        to,
        from,
        subject,
        text,
        html: html || text.replace(/\n/g, "<br>"),
        replyTo,
        attachments,
        templateId,
        dynamicTemplateData,
        category: [category],
        trackingSettings: {
          clickTracking: { enable: false },
          openTracking: { enable: true },
        },
        customArgs: {
          emailLogId: emailLog.id,
        },
      };

      const response = await sgMail.send(msg);

      // Update email log with success
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: "sent",
          provider: "sendgrid",
          providerMessageId: response[0]?.headers["x-message-id"] || null,
          sentAt: new Date(),
        },
      });

      logger.info("Email sent successfully via SendGrid", {
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        category,
        emailLogId: emailLog.id,
      });

      return { success: true, provider: "sendgrid", emailLogId: emailLog.id };
    }

    // Fall back to Nodemailer if SendGrid is not available
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.type,
      })),
    });

    // Update email log with success
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "sent",
        provider: "nodemailer",
        providerMessageId: info.messageId || null,
        sentAt: new Date(),
      },
    });

    logger.info("Email sent successfully via Nodemailer", {
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      category,
      emailLogId: emailLog.id,
    });

    return { success: true, provider: "nodemailer", emailLogId: emailLog.id };
  } catch (error) {
    logger.error("Failed to send email:", error);

    // Update email log with failure
    try {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: "failed",
          error: error.message || "Unknown error",
        },
      });
    } catch (logError) {
      logger.error("Failed to update email log:", logError);
    }

    return { success: false, error: error.message || "Failed to send email" };
  }
}

// Function to parse incoming emails and create contact submissions
export async function processInboundEmail(email: {
  fromEmail: string;
  fromFull: string;
  subject: string;
  textContent?: string;
  htmlContent?: string;
  reference?: string;
}) {
  try {
    const {
      fromEmail,
      fromFull,
      subject,
      textContent,
      htmlContent,
      reference,
    } = email;

    // Extract name from fromFull (e.g., "John Doe <john@example.com>")
    const nameMatch = fromFull.match(/^([^<]+)</);
    const name = nameMatch ? nameMatch[1].trim() : fromEmail.split("@")[0];

    // Check if this is a reply to an existing submission
    if (reference && reference.startsWith("REF-")) {
      // Extract the submission ID from the reference
      const submissionIdMatch = reference.match(/REF-([a-zA-Z0-9-]+)-/);

      if (submissionIdMatch) {
        const submissionId = submissionIdMatch[1];

        // Check if the submission exists
        const submission = await prisma.contactSubmission.findFirst({
          where: {
            id: {
              startsWith: submissionId,
            },
          },
        });

        if (submission) {
          // Create a reply
          await prisma.contactSubmissionReply.create({
            data: {
              contactSubmissionId: submission.id,
              content: textContent || htmlContent || "No content",
              reference: reference,
            },
          });

          // Update the submission status
          await prisma.contactSubmission.update({
            where: {
              id: submission.id,
            },
            data: {
              status: "in-progress",
            },
          });

          return {
            success: true,
            action: "reply_created",
            submissionId: submission.id,
          };
        }
      }
    }

    // If not a reply or submission not found, create a new submission
    const newSubmission = await prisma.contactSubmission.create({
      data: {
        name,
        email: fromEmail,
        subject,
        inquiryType: "email",
        message: textContent || htmlContent || "No content",
        status: "new",
      },
    });

    return {
      success: true,
      action: "submission_created",
      submissionId: newSubmission.id,
    };
  } catch (error) {
    logger.error("Error processing inbound email:", error);
    return {
      success: false,
      error: "Failed to process inbound email",
    };
  }
}

// Function to send a reply to a contact submission
export async function sendContactReply(
  to: string,
  subject: string,
  htmlMessage: string,
  fromName: string = "Synthalyst Support",
  fromEmail: string = process.env.SENDGRID_FROM_EMAIL ||
    "noreply@synthalyst.com",
  replyToEmail: string = process.env.EMAIL_REPLY_TO || "support@synthalyst.com"
) {
  try {
    // Create a formatted from address with name
    const from = `${fromName} <${fromEmail}>`;

    // Send the email using the unified sendEmail function
    const result = await sendEmail({
      to,
      subject,
      text: htmlMessage.replace(/<br>/g, "\n").replace(/<[^>]*>/g, ""), // Convert HTML to plain text
      html: htmlMessage,
      from,
      replyTo: replyToEmail,
      category: "contact_reply",
    });

    return result.success;
  } catch (error) {
    logger.error("Error sending contact reply:", error);
    return false;
  }
}
