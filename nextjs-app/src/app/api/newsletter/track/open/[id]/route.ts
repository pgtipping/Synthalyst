import { NextRequest, NextResponse } from "next/server";
import { trackNewsletterOpen } from "@/lib/newsletterAnalytics";
import { prisma } from "@/lib/prisma";

// GET /api/newsletter/track/open/[id] - Track newsletter open
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const recipientEmail = searchParams.get("r");

    if (!id) {
      return new NextResponse(null, { status: 400 });
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

    // Track the open event asynchronously
    trackNewsletterOpen(id, subscriberId, userAgent, ip).catch((error) => {
      console.error("Error tracking newsletter open:", error);
    });

    // Return a 1x1 transparent GIF
    const transparentGif = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );

    return new NextResponse(transparentGif, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error tracking newsletter open:", error);

    // Still return a transparent GIF to avoid breaking the email
    const transparentGif = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );

    return new NextResponse(transparentGif, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
}
