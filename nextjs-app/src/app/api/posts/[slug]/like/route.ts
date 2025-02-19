import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        likes: post.likes + 1,
      },
    });

    return NextResponse.json({ likes: updatedPost.likes });
  } catch (error) {
    console.error("Error updating post likes:", error);
    return NextResponse.json(
      { error: "Failed to update post likes" },
      { status: 500 }
    );
  }
}
