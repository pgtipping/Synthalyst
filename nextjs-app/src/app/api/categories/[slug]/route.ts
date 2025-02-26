import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import {
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/lib/validations/category";
import { ConflictError, NotFoundError } from "@/lib/errors";
import slugify from "slugify";

export const GET = createHandler<void, { slug: string }>(
  async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
    const { slug } = await props.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return successResponse(category);
  }
);

export const PATCH = createHandler<UpdateCategoryInput, { slug: string }>(
  async (
    req: NextRequest,
    props: { params: Promise<{ slug: string }> },
    body
  ) => {
    if (!body) throw new Error("Request body is required");

    const { slug: paramSlug } = await props.params;

    const category = await prisma.category.findUnique({
      where: { slug: paramSlug },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const { name, description } = body;

    // If name is being updated, generate new slug
    let slug = category.slug;
    if (name) {
      slug = slugify(name, {
        lower: true,
        strict: true,
      });

      // Check if new slug already exists (excluding current category)
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { name, id: { not: category.id } },
            { slug, id: { not: category.id } },
          ],
        },
      });

      if (existingCategory) {
        throw new ConflictError("A category with this name already exists");
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: {
        ...(name && { name, slug }),
        ...(description && { description }),
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return successResponse(updatedCategory);
  },
  {
    validationSchema: updateCategorySchema,
    requireAuth: true,
  }
);

export const DELETE = createHandler<void, { slug: string }>(
  async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
    const { slug } = await props.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    // Don't allow deletion if category has posts
    if (category._count.posts > 0) {
      throw new ConflictError("Cannot delete category that has posts");
    }

    await prisma.category.delete({
      where: { id: category.id },
    });

    return successResponse({ message: "Category deleted successfully" });
  },
  {
    requireAuth: true,
  }
);
