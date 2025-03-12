import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = process.env.EMAIL_FROM || "noreply@synthalyst.com",
  replyTo = process.env.EMAIL_REPLY_TO || "support@synthalyst.com",
}: EmailOptions) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Send the email
  const info = await transporter.sendMail({
    from,
    to,
    replyTo,
    subject,
    text,
    html: html || text.replace(/\n/g, "<br>"),
  });

  return info;
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
    console.error("Error processing inbound email:", error);
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
  fromEmail: string = process.env.EMAIL_FROM || "noreply@synthalyst.com",
  replyToEmail: string = process.env.EMAIL_REPLY_TO || "support@synthalyst.com"
) {
  try {
    // Create a formatted from address with name
    const from = `${fromName} <${fromEmail}>`;

    // Send the email using the existing sendEmail function
    await sendEmail({
      to,
      subject,
      text: htmlMessage.replace(/<br>/g, "\n").replace(/<[^>]*>/g, ""), // Convert HTML to plain text
      html: htmlMessage,
      from,
      replyTo: replyToEmail,
    });

    return true;
  } catch (error) {
    console.error("Error sending contact reply:", error);
    return false;
  }
}
