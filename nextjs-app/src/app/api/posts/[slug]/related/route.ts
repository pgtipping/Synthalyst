import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export const GET = createHandler(async (req: NextRequest, { params }) => {
  const { slug } = await params;

  // First, get the current post's categories and tags
  const currentPost = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: true,
      tags: true,
    },
  });

  if (!currentPost) {
    throw new NotFoundError("Post not found");
  }

  // Get category and tag IDs
  const categoryIds = currentPost.categories.map((cat) => cat.id);
  const tagIds = currentPost.tags.map((tag) => tag.id);

  // Find related posts based on shared categories and tags
  const relatedPosts = await prisma.post.findMany({
    where: {
      AND: [
        { id: { not: currentPost.id } }, // Exclude current post
        { published: true },
        {
          OR: [
            {
              categories: {
                some: {
                  id: { in: categoryIds },
                },
              },
            },
            {
              tags: {
                some: {
                  id: { in: tagIds },
                },
              },
            },
          ],
        },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: [
      {
        views: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 3,
  });

  return successResponse(relatedPosts);
});
