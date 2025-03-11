import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import { UpdatePostInput, updatePostSchema } from "@/lib/validations/post";
import { NotFoundError } from "@/lib/errors";
import slugify from "slugify";

// Get a single post by slug
export const GET = createHandler(
  async (req: NextRequest, { params }) => {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug },
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
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return successResponse(post);
  },
  { requireAuth: false }
);

// Update a post
export const PATCH = createHandler<UpdatePostInput>(
  async (req: NextRequest, { params }, body) => {
    if (!body) throw new Error("Request body is required");

    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const { categoryIds, tagIds, ...updateData } = body;

    // If title is being updated, generate new slug
    let newSlug = post.slug;
    if (updateData.title) {
      newSlug = slugify(updateData.title, {
        lower: true,
        strict: true,
      });

      // Check if new slug already exists (excluding current post)
      const existingPost = await prisma.post.findFirst({
        where: {
          slug: newSlug,
          id: { not: post.id },
        },
      });

      if (existingPost) {
        throw new NotFoundError("A post with this title already exists");
      }
    }

    // Update post with relations
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        ...updateData,
        slug: newSlug,
        ...(categoryIds && {
          categories: {
            set: [], // Clear existing connections
            connect: categoryIds.map((id: string) => ({ id })),
          },
        }),
        ...(tagIds && {
          tags: {
            set: [], // Clear existing connections
            connect: tagIds.map((id: string) => ({ id })),
          },
        }),
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
      },
    });

    return successResponse(updatedPost);
  },
  {
    validationSchema: updatePostSchema,
    requireAuth: true,
  }
);

// Delete a post
export const DELETE = createHandler(
  async (req: NextRequest, { params }) => {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    return successResponse({ message: "Post deleted successfully" });
  },
  {
    requireAuth: true,
  }
);
