import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, syncSubscriberToSendGrid } from "@/lib/sendgrid";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    // Find the subscriber with the given email and token
    const subscriber = await prisma.newsletter.findFirst({
      where: {
        email,
        token,
        tokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update the subscriber to confirmed status
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        confirmed: true,
        token: null,
        tokenExpiry: null,
      },
    });

    // Send welcome email
    await sendWelcomeEmail(email);

    // Sync with SendGrid (optional)
    await syncSubscriberToSendGrid(email, subscriber.tags);

    // Redirect to a confirmation page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/newsletter/confirmed`
    );
  } catch (error) {
    console.error("Error confirming subscription:", error);
    return NextResponse.json(
      { error: "Failed to confirm subscription" },
      { status: 500 }
    );
  }
}
