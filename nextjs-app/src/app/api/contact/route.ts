import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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

// Updated schema to match the enhanced contact form
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  company: z.string().optional(),
  phone: z.string().optional(),
  inquiryType: z.enum(["general", "support", "business", "feedback"], {
    required_error: "Please select an inquiry type",
  }),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(request: Request) {
  try {
    // Validate the request body against our schema
    const formData = await validateRequest(
      request,
      contactSchema,
      false // Don't require authentication for contact form
    );

    logger.info("Processing contact form submission", {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      inquiryType: formData.inquiryType,
    });

    try {
      // Save the submission to the database
      const submission = await prisma.contactSubmission.create({
        data: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          company: formData.company,
          phone: formData.phone,
          inquiryType: formData.inquiryType,
          message: formData.message,
          status: "new",
        },
      });

      logger.debug("Contact form saved to database", {
        id: submission.id,
        ...formData,
        // Mask part of the message for privacy in logs
        message:
          formData.message.length > 20
            ? `${formData.message.substring(0, 20)}...`
            : formData.message,
      });

      try {
        // Send notification email to admin
        const adminNotificationResult = await sendEmail({
          to: process.env.ADMIN_EMAIL || "support@synthalyst.com",
          from: "Synthalyst Contact Form <noreply@synthalyst.com>",
          subject: `New Contact Form: ${formData.subject}`,
          text: `
            Name: ${formData.name}
            Email: ${formData.email}
            Company: ${formData.company || "Not provided"}
            Phone: ${formData.phone || "Not provided"}
            Inquiry Type: ${formData.inquiryType}
            Message: ${formData.message}
            
            View in admin: ${
              process.env.NEXT_PUBLIC_APP_URL
            }/admin/contact-submissions/${submission.id}
          `,
          category: "contact_form_notification",
        });

        if (!adminNotificationResult.success) {
          logger.warn("Failed to send admin notification email", {
            error: adminNotificationResult.error,
            submissionId: submission.id,
          });
          // Continue even if admin notification fails
        }
      } catch (emailError) {
        logger.error("Error sending admin notification email", emailError);
        // Continue even if admin notification fails
      }

      try {
        // Send auto-response to the user
        const autoResponseResult = await sendEmail({
          to: formData.email,
          from: "Synthalyst Support <support@synthalyst.com>",
          subject: `We've received your message: ${formData.subject}`,
          text: `Thank you for contacting Synthalyst. We've received your message and our team will review it shortly.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4a6cf7;">Thank you for contacting Synthalyst</h2>
              <p>Hello ${formData.name},</p>
              <p>We've received your message and our team will review it shortly. Here's a summary of what you sent us:</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Inquiry Type:</strong> ${formData.inquiryType}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-line;">${formData.message}</p>
              </div>
              
              <p>We typically respond within 1-2 business days. If your matter is urgent, please call us at ${
                process.env.SUPPORT_PHONE || "+1 (555) 123-4567"
              }.</p>
              
              <p>Best regards,<br>The Synthalyst Team</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <p>This is an automated response to your inquiry. Please do not reply to this email.</p>
              </div>
            </div>
          `,
          category: "contact_form_auto_response",
        });

        if (!autoResponseResult.success) {
          logger.warn("Failed to send auto-response email", {
            error: autoResponseResult.error,
            submissionId: submission.id,
          });
          // Continue even if auto-response fails
        }
      } catch (emailError) {
        logger.error("Error sending auto-response email", emailError);
        // Continue even if auto-response fails
      }

      // Serialize any BigInt values before returning the response
      const serializedSubmissionId = serializeBigInt(submission.id);

      return NextResponse.json(
        {
          message: "Message sent successfully",
          success: true,
          submissionId: serializedSubmissionId,
        },
        { status: 200 }
      );
    } catch (dbError: unknown) {
      logger.error("Database error in contact form submission", dbError);
      return NextResponse.json(
        {
          error: {
            message: "Failed to save your message to our database",
            details:
              process.env.NODE_ENV === "development"
                ? dbError instanceof Error
                  ? dbError.message
                  : String(dbError)
                : undefined,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("Failed to process contact form submission", error);
    return handleAPIError(error);
  }
}
