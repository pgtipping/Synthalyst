import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export const POST = createHandler(async (req: NextRequest, { params }) => {
  const { slug } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        views: post.views + 1,
      },
    });

    return successResponse(updatedPost);
  } catch (error) {
    console.error("Error updating view count:", error);
    throw error;
  }
});
