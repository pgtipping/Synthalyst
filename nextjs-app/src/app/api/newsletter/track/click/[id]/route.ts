import { NextRequest, NextResponse } from "next/server";
import { trackNewsletterClick } from "@/lib/newsletterAnalytics";
import { prisma } from "@/lib/prisma";

// GET /api/newsletter/track/click/[id] - Track newsletter click and redirect
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const recipientEmail = searchParams.get("r");

    if (!id || !url) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get user agent and IP
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "Unknown";

    // Find the subscriber ID from the email
    let subscriberId = "unknown";
    if (recipientEmail) {
      const decodedEmail = decodeURIComponent(recipientEmail);
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: decodedEmail },
        select: { id: true },
      });

      if (subscriber) {
        subscriberId = subscriber.id;
      }
    }

    // Track the click event asynchronously
    trackNewsletterClick(id, subscriberId, url, userAgent, ip).catch(
      (error) => {
        console.error("Error tracking newsletter click:", error);
      }
    );

    // Redirect to the target URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error tracking newsletter click:", error);

    // If there's an error, try to redirect to the URL if available
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (url) {
      return NextResponse.redirect(url);
    }

    // Otherwise return an error
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}
