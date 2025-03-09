import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, sendConfirmationEmail } from "@/lib/sendgrid";
import { z } from "zod";

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, source, name } = result.data;

    // Check if the email is already subscribed
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // If already confirmed, return success
      if (existingSubscriber.confirmed) {
        return NextResponse.json(
          { message: "You are already subscribed to our newsletter" },
          { status: 200 }
        );
      }

      // If not confirmed, generate a new token and send confirmation email
      const token = generateToken();
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await prisma.newsletter.update({
        where: { email },
        data: {
          token,
          tokenExpiry,
        },
      });

      await sendConfirmationEmail(email, token);

      return NextResponse.json(
        { message: "Confirmation email sent. Please check your inbox." },
        { status: 200 }
      );
    }

    // Create a new subscriber
    const token = generateToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.newsletter.create({
      data: {
        email,
        name,
        source,
        token,
        tokenExpiry,
        tags: source ? [source] : [],
      },
    });

    // Send confirmation email
    await sendConfirmationEmail(email, token);

    return NextResponse.json(
      {
        message: "Subscription initiated. Please check your email to confirm.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}
