import { NextRequest } from "next/server";
import {
  createHandler,
  successResponse,
  errorResponse,
} from "@/lib/api/handler";
import { prisma } from "@/lib/prisma";
import {
  CreatePostInput,
  postQuerySchema,
  createPostSchema,
} from "@/lib/validations/post";
import { ConflictError } from "@/lib/errors";
import slugify from "slugify";
import { Prisma } from "@prisma/client";

export const GET = createHandler(
  async (req: NextRequest) => {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());

    // Parse and validate query parameters
    const {
      page,
      limit,
      published,
      featured,
      categoryId,
      tagId,
      authorId,
      searchQuery,
    } = postQuerySchema.parse({
      ...query,
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
    });

    // Build where clause
    const where: Prisma.PostWhereInput = {
      ...(published !== undefined && { published }),
      ...(featured !== undefined && { featured }),
      ...(categoryId && {
        categories: {
          some: { id: categoryId },
        },
      }),
      ...(tagId && {
        tags: {
          some: { id: tagId },
        },
      }),
      ...(authorId && { authorId }),
      ...(searchQuery && {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    // Get total count for pagination
    const total = await prisma.post.count({ where });

    // Get posts with relations
    const posts = await prisma.post.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
  { requireAuth: false }
);

export const POST = createHandler<CreatePostInput>(
  async (req: NextRequest, _params, body) => {
    if (!body) throw new Error("Request body is required");

    const { categoryIds, tagIds, authorEmail, ...postData } = body;

    if (!authorEmail) {
      throw new Error("Author email is required");
    }

    // Generate slug from title
    const slug = slugify(postData.title, {
      lower: true,
      strict: true,
    });

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      throw new ConflictError("A post with this title already exists");
    }

    // Get or create author by email
    const author = await prisma.user.upsert({
      where: { email: authorEmail },
      update: {},
      create: {
        email: authorEmail,
        name: authorEmail.split("@")[0], // Use email prefix as name
      },
    });

    // Create post with relations
    const post = await prisma.post.create({
      data: {
        ...postData,
        slug,
        authorId: author.id,
        ...(categoryIds?.length && {
          categories: {
            connectOrCreate: categoryIds.map((name: string) => ({
              where: { slug: slugify(name, { lower: true, strict: true }) },
              create: {
                name,
                slug: slugify(name, { lower: true, strict: true }),
              },
            })),
          },
        }),
        ...(tagIds?.length && {
          tags: {
            connectOrCreate: tagIds.map((name: string) => ({
              where: { slug: slugify(name, { lower: true, strict: true }) },
              create: {
                name,
                slug: slugify(name, { lower: true, strict: true }),
              },
            })),
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

    return successResponse(post, 201);
  },
  {
    validationSchema: createPostSchema,
    requireAuth: true,
  }
);

export const PUT = createHandler(
  async (req: NextRequest) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return errorResponse("Post ID is required", "BAD_REQUEST", 400);
    }

    const {
      title,
      content,
      excerpt,
      coverImage,
      categories,
      tags,
      published,
      featured,
    } = await req.json();

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        published,
        featured,
        categories: {
          set: [],
          connectOrCreate: categories.map((category: string) => ({
            where: { name: category },
            create: {
              name: category,
              slug: category
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            },
          })),
        },
        tags: {
          set: [],
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: {
              name: tag,
              slug: tag
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            },
          })),
        },
      },
    });

    return successResponse({ post });
  },
  {
    requireAuth: true,
  }
);

export const DELETE = createHandler(
  async (req: NextRequest) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return errorResponse("Post ID is required", "BAD_REQUEST", 400);
    }

    await prisma.post.delete({
      where: { id },
    });

    return successResponse({ success: true });
  },
  {
    requireAuth: true,
  }
);
