import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isSubscribed = await hasActiveSubscription(session.user.id);

    return NextResponse.json({ hasActiveSubscription: isSubscribed });
  } catch (error) {
    console.error("[SUBSCRIPTION_STATUS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
