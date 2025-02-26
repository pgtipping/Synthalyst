import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await validateRequest(
      request,
      contactSchema,
      false // Don't require authentication for contact form
    );

    logger.info("Processing contact form submission", { name, email, subject });

    // Here you would typically integrate with your email service
    // For example, using nodemailer, SendGrid, or another email service
    // For now, we'll just log the submission
    logger.debug("Contact form details", { name, email, subject, message });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to process contact form submission", error);
    return handleAPIError(error);
  }
}
