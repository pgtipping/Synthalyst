import { NextRequest, NextResponse } from "next/server";
import { createHandler, successResponse } from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import {
  CreateCommentInput,
  createCommentSchema,
} from "@/lib/validations/comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get comments for a post
export const GET = createHandler(async (req: NextRequest, { params }) => {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return successResponse(comments);
});

// Create a comment on a post
export const POST = createHandler<CreateCommentInput>(
  async (req: NextRequest, { params }, body) => {
    if (!body) throw new Error("Request body is required");

    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const { content, authorEmail, parentId } = body;

    // Get or create author
    const author = await prisma.user.upsert({
      where: { email: authorEmail },
      update: {},
      create: {
        email: authorEmail,
        name: authorEmail.split("@")[0],
      },
    });

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: post.id,
        authorId: author.id,
        ...(parentId && { parentId }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return successResponse(comment, 201);
  },
  {
    validationSchema: createCommentSchema,
    requireAuth: true,
  }
);

// Delete a comment
export const DELETE = createHandler(
  async (req: NextRequest, { params }) => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new NotFoundError("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      throw new NotFoundError("Comment ID is required");
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: true,
      },
    });

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    // Check if the user is the comment author
    if (comment.author.email !== session.user.email) {
      throw new NotFoundError("Unauthorized");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return successResponse({ message: "Comment deleted successfully" });
  },
  {
    requireAuth: true,
  }
);
