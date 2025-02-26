import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { handleAPIError, APIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  reminderAt: z.string().optional(),
  completedAt: z.string().optional(),
  subtasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean(),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
        type: z.string(),
      })
    )
    .optional(),
});

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new APIError("Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = await params;

    const [task] = await prisma.$queryRaw<Task[]>`
      SELECT 
        t.*,
        ARRAY_AGG(tt.name) FILTER (WHERE tt.name IS NOT NULL) as tags
      FROM "Task" t
      LEFT JOIN "TaskTag" tt ON t."id" = tt."taskId"
      WHERE t."id" = ${id}
      GROUP BY t.id
    `;

    if (!task) {
      throw new APIError("Task not found", 404, "TASK_NOT_FOUND");
    }

    if (task.userId !== session.user.id) {
      throw new APIError("Not authorized to view this task", 403, "FORBIDDEN");
    }

    return NextResponse.json({ task });
  } catch (error) {
    logger.error("Failed to fetch task", error);
    return handleAPIError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new APIError("Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = await params;

    const [task] = await prisma.$queryRaw<Task[]>`
      SELECT 
        t.*,
        ARRAY_AGG(tt.name) FILTER (WHERE tt.name IS NOT NULL) as tag_names
      FROM "Task" t
      LEFT JOIN "TaskTag" tt ON t."id" = tt."taskId"
      WHERE t."id" = ${id}
      GROUP BY t.id
    `;

    if (!task) {
      throw new APIError("Task not found", 404, "TASK_NOT_FOUND");
    }

    if (task.userId !== session.user.id) {
      throw new APIError(
        "Not authorized to update this task",
        403,
        "FORBIDDEN"
      );
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);
    const { tags: tagNames, ...taskFields } = validatedData;

    logger.info("Updating task", {
      taskId: id,
      userId: session.user.id,
    });

    // Update task and tags in a transaction
    const updatedTask = await prisma.$transaction(async (tx) => {
      // Update task fields
      await tx.$executeRaw`
        UPDATE "Task"
        SET
          "title" = ${taskFields.title || task.title},
          "description" = ${taskFields.description || task.description},
          "status" = ${taskFields.status || task.status},
          "priority" = ${taskFields.priority || task.priority},
          "dueDate" = ${
            taskFields.dueDate ? new Date(taskFields.dueDate) : task.dueDate
          },
          "updatedAt" = NOW()
        WHERE "id" = ${id}
      `;

      // Update tags if provided
      if (tagNames !== undefined) {
        // Delete existing tags
        await tx.$executeRaw`DELETE FROM "TaskTag" WHERE "taskId" = ${id}`;

        // Create new tags
        if (tagNames.length > 0) {
          const tagValues = tagNames
            .map((name) => `('${name}', '${id}', NOW(), NOW())`)
            .join(",");
          await tx.$executeRaw`
            INSERT INTO "TaskTag" ("name", "taskId", "createdAt", "updatedAt")
            VALUES ${Prisma.sql([tagValues])}
          `;
        }
      }

      // Fetch updated task with tags
      const [taskWithTags] = await tx.$queryRaw<Task[]>`
        SELECT 
          t.*,
          ARRAY_AGG(tt.name) FILTER (WHERE tt.name IS NOT NULL) as tags
        FROM "Task" t
        LEFT JOIN "TaskTag" tt ON t."id" = tt."taskId"
        WHERE t."id" = ${id}
        GROUP BY t.id
      `;

      return taskWithTags;
    });

    logger.info("Successfully updated task", {
      taskId: id,
      userId: session.user.id,
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    logger.error("Failed to update task", error);
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new APIError("Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = await params;

    const [task] = await prisma.$queryRaw<Task[]>`
      SELECT * FROM "Task" WHERE "id" = ${id}
    `;

    if (!task) {
      throw new APIError("Task not found", 404, "TASK_NOT_FOUND");
    }

    if (task.userId !== session.user.id) {
      throw new APIError(
        "Not authorized to delete this task",
        403,
        "FORBIDDEN"
      );
    }

    logger.info("Deleting task", {
      taskId: id,
      userId: session.user.id,
    });

    // Task deletion will cascade to tags due to the onDelete: Cascade in the schema
    await prisma.$executeRaw`DELETE FROM "Task" WHERE "id" = ${id}`;

    logger.info("Successfully deleted task", {
      taskId: id,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete task", error);
    return handleAPIError(error);
  }
}
