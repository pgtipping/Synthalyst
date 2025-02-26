import { z } from "zod";

const basePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(300, "Excerpt is too long").optional(),
  coverImage: z.string().url("Invalid cover image URL").optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  authorEmail: z.string().email("Invalid author email"),
});

export const createPostSchema = basePostSchema
  .extend({
    published: z.boolean(),
    featured: z.boolean(),
  })
  .transform((data) => ({
    ...data,
    published: data.published ?? false,
    featured: data.featured ?? false,
  }));

export const updatePostSchema = basePostSchema.extend({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  slug: z.string().optional(),
});

export const postQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  published: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (typeof val === "string" ? val === "true" : val)),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (typeof val === "string" ? val === "true" : val)),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  authorId: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostQueryInput = z.infer<typeof postQuerySchema>;
