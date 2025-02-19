import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  authorEmail: z.string().email("Valid email is required"),
  parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
