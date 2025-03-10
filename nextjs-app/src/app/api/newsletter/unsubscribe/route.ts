import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // Find the subscriber with the given email
    const subscriber = await prismaAny.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Update the subscriber to unsubscribed status
    await prismaAny.newsletter.update({
      where: { id: subscriber.id },
      data: {
        unsubscribed: true,
        active: false,
      },
    });

    // Redirect to an unsubscribe confirmation page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/newsletter/unsubscribed`
    );
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
