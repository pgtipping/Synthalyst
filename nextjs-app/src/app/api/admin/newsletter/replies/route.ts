import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" &&
        session.user.email !== "pgtipping1@gmail.com")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    // const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Get newsletter replies with newsletter subject and sender info
    const replies = await prisma.$queryRaw`
      SELECT nr.*, 
        ns.subject as "newsletterSubject",
        ns."sentBy" as "senderEmail",
        '' as "senderName"
      FROM "NewsletterReply" nr
      JOIN "NewsletterSend" ns ON nr."sendId" = ns.id
      ORDER BY nr."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count for pagination
    const totalCount = await prisma.newsletterReply.count();

    return NextResponse.json({
      data: replies,
      meta: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter replies" },
      { status: 500 }
    );
  }
}
