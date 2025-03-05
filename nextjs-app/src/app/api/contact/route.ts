import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";

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

    // Log additional details for debugging
    logger.debug("Contact form details", {
      ...formData,
      // Mask part of the message for privacy in logs
      message:
        formData.message.length > 20
          ? `${formData.message.substring(0, 20)}...`
          : formData.message,
    });

    // Here you would typically integrate with your email service
    // For example, using nodemailer, SendGrid, or another email service

    // TODO: Add actual email sending logic here
    // Example with SendGrid or similar service:
    // await sendEmail({
    //   to: "support@synthalyst.com",
    //   from: "no-reply@synthalyst.com",
    //   subject: `New Contact Form: ${formData.subject}`,
    //   text: `
    //     Name: ${formData.name}
    //     Email: ${formData.email}
    //     Company: ${formData.company || "Not provided"}
    //     Phone: ${formData.phone || "Not provided"}
    //     Inquiry Type: ${formData.inquiryType}
    //     Message: ${formData.message}
    //   `,
    // });

    return NextResponse.json(
      {
        message: "Message sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to process contact form submission", error);
    return handleAPIError(error);
  }
}
