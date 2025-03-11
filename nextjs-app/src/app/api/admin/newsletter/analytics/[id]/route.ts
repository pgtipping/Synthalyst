import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNewsletterAnalytics } from "@/lib/newsletterAnalytics";
import { rateLimit } from "@/middleware/rateLimit";

// GET /api/admin/newsletter/analytics/[id] - Get newsletter analytics
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply rate limiting - now using prefixed keys
    const rateLimitResult = await rateLimit(req, {
      max: 20, // 20 requests per minute
      windowInSeconds: 60,
    });

    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Newsletter ID is required" },
        { status: 400 }
      );
    }

    // Get analytics for the newsletter
    const analytics = await getNewsletterAnalytics(id);
    if (!analytics) {
      return NextResponse.json(
        { error: "Newsletter not found or no analytics available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Error fetching newsletter analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter analytics" },
      { status: 500 }
    );
  }
}
