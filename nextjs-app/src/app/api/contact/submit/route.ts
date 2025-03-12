import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Define validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate the data
    const validatedData = contactSchema.parse(body);

    // Store in database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        subject: validatedData.subject,
        phone: validatedData.phone || null,
        inquiryType: "General",
        status: "new",
        source: "QUICK_CONTACT",
      },
    });

    // Send email notification (implement this based on your email service)
    // Example: await sendEmailNotification(validatedData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Contact submission received successfully",
        id: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process contact submission",
      },
      { status: 500 }
    );
  }
}
