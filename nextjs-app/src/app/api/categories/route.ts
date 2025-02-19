import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import {
  CreateCategoryInput,
  createCategorySchema,
  categoryQuerySchema,
} from "@/lib/validations/category";
import { ConflictError } from "@/lib/errors";
import slugify from "slugify";

export const GET = createHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  // Parse and validate query parameters
  const { page, limit, searchQuery } = categoryQuerySchema.parse({
    ...query,
    page: Number(query.page || 1),
    limit: Number(query.limit || 10),
  });

  // Build where clause
  const where = {
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ],
    }),
  };

  // Get total count for pagination
  const total = await prisma.category.count({ where });

  // Get categories with post count
  const categories = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  return successResponse({
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const POST = createHandler<CreateCategoryInput>(
  async (req: NextRequest, _params, body) => {
    if (!body) throw new Error("Request body is required");

    const { name, description } = body;

    // Generate slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // Check if category with same name or slug exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCategory) {
      throw new ConflictError("A category with this name already exists");
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return successResponse(category, 201);
  },
  {
    validationSchema: createCategorySchema,
    requireAuth: true,
  }
);
