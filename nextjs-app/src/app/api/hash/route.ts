import { NextResponse } from "next/server";
import { createHash } from "@/lib/hash.js";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const hash = createHash(content);

    return NextResponse.json({ hash }, { status: 200 });
  } catch (error) {
    console.error("Error generating hash:", error);

    return NextResponse.json(
      { error: "Failed to generate hash" },
      { status: 500 }
    );
  }
}
