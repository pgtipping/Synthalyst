import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Helper function to check if EmailLog model exists in Prisma
const hasEmailLogModel = (): boolean => {
  try {
    // More robust check for EmailLog model existence
    // @ts-expect-error - Checking if model exists
    return (
      typeof prisma.emailLog === "object" &&
      // @ts-expect-error - Additional check for model methods
      typeof prisma.emailLog.create === "function" &&
      // @ts-expect-error - Additional check for model methods
      typeof prisma.emailLog.findFirst === "function"
    );
  } catch (error) {
    logger.error("Error checking for EmailLog model:", error);
    return false;
  }
};

// Helper function to safely create an email log entry
const safelyCreateEmailLog = async (
  data: Record<string, unknown>
): Promise<EmailLogEntry | null> => {
  try {
    if (!hasEmailLogModel()) {
      logger.warn("EmailLog model not available, skipping log creation");
      return null;
    }

    // @ts-expect-error - EmailLog model might not be in the Prisma client type
    return await prisma.emailLog.create({ data });
  } catch (error) {
    logger.error("Failed to create email log entry", error);
    return null;
  }
};

// Helper function to safely update an email log entry
const safelyUpdateEmailLog = async (
  id: string | number,
  data: Record<string, unknown>
): Promise<EmailLogEntry | null> => {
  try {
    if (!hasEmailLogModel() || !id) {
      logger.warn(
        "EmailLog model not available or no ID provided, skipping log update"
      );
      return null;
    }

    // @ts-expect-error - EmailLog model might not be in the Prisma client type
    return await prisma.emailLog.update({
      where: { id },
      data,
    });
  } catch (error) {
    logger.error("Failed to update email log entry", error);
    return null;
  }
};

// Helper function to serialize BigInt values
function serializeBigInt(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "bigint") {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeBigInt);
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        serializeBigInt(value),
      ])
    );
  }

  return data;
}

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

// Type for EmailLog entry
interface EmailLogEntry {
  id: string | number;
  status: string;
  provider?: string | null;
  providerMessageId?: string | null;
  sentAt?: Date | null;
  error?: string | null;
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
  let emailLogEntry: EmailLogEntry | null = null;

  try {
    // Track email sending in database if EmailLog model exists
    emailLogEntry = await safelyCreateEmailLog({
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      from,
      category,
      status: "pending",
    });

    // Try SendGrid first if available
    if (sendgridInitialized) {
      try {
        // Prepare SendGrid message with proper typing
        const msg: sgMail.MailDataRequired = {
          to,
          from,
          subject,
          text,
          html: html || text.replace(/\n/g, "<br>"),
          replyTo,
          attachments: attachments.map((attachment) => ({
            content: attachment.content || "",
            filename: attachment.filename || "",
            type: attachment.type || "",
            disposition: attachment.disposition || "",
            contentId: attachment.contentId || "",
          })),
          templateId,
          dynamicTemplateData,
          // @ts-expect-error - SendGrid types are not fully compatible with category as array
          category: [category],
          trackingSettings: {
            clickTracking: { enable: false },
            openTracking: { enable: true },
          },
          customArgs: {
            emailLogId: emailLogEntry
              ? serializeBigInt(emailLogEntry.id).toString()
              : undefined,
          },
        };

        const response = await sgMail.send(msg);

        // Update email log with success
        if (emailLogEntry) {
          await safelyUpdateEmailLog(emailLogEntry.id, {
            status: "sent",
            provider: "sendgrid",
            providerMessageId: response[0]?.headers["x-message-id"] || null,
            sentAt: new Date(),
          });
        }

        logger.info("Email sent successfully via SendGrid", {
          to: Array.isArray(to) ? to.join(", ") : to,
          subject,
          category,
          emailLogId: emailLogEntry
            ? serializeBigInt(emailLogEntry.id)
            : undefined,
        });

        return {
          success: true,
          provider: "sendgrid",
          emailLogId: emailLogEntry
            ? serializeBigInt(emailLogEntry.id)
            : undefined,
        };
      } catch (sendgridError) {
        logger.error(
          "SendGrid error, falling back to Nodemailer",
          sendgridError
        );
        // Fall through to Nodemailer
      }
    }

    // Fall back to Nodemailer if SendGrid is not available or failed
    try {
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
          filename: attachment.filename || "",
          content: attachment.content || "",
          contentType: attachment.type || "",
        })),
      });

      // Update email log with success
      if (emailLogEntry) {
        await safelyUpdateEmailLog(emailLogEntry.id, {
          status: "sent",
          provider: "nodemailer",
          providerMessageId: info.messageId || null,
          sentAt: new Date(),
        });
      }

      logger.info("Email sent successfully via Nodemailer", {
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        category,
        emailLogId: emailLogEntry
          ? serializeBigInt(emailLogEntry.id)
          : undefined,
      });

      return {
        success: true,
        provider: "nodemailer",
        emailLogId: emailLogEntry
          ? serializeBigInt(emailLogEntry.id)
          : undefined,
      };
    } catch (nodemailerError) {
      // Both SendGrid and Nodemailer failed
      throw new Error(
        `Email sending failed: ${
          nodemailerError instanceof Error
            ? nodemailerError.message
            : "Unknown error"
        }`
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to send email:", error);

    // Update email log with failure
    if (emailLogEntry) {
      await safelyUpdateEmailLog(emailLogEntry.id, {
        status: "failed",
        error: errorMessage,
      });
    }

    return {
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
    };
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
