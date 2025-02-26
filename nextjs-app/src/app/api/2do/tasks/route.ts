import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateRequest, handleAPIError, APIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new APIError("Authentication required", 401, "UNAUTHORIZED");
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          priority: "desc",
        },
        {
          dueDate: "asc",
        },
      ],
    });

    // Fetch tags for each task
    const tasksWithTags = await Promise.all(
      tasks.map(async (task) => {
        const taskTags = await prisma.taskTag.findMany({
          where: { taskId: task.id },
          select: { name: true },
        });
        return {
          ...task,
          tags: taskTags.map((tag) => tag.name),
        };
      })
    );

    logger.info("Successfully retrieved tasks", {
      count: tasks.length,
      userId: session.user.id,
    });

    return NextResponse.json({ tasks: tasksWithTags });
  } catch (error) {
    logger.error("Failed to retrieve tasks", error);
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new APIError("Authentication required", 401, "UNAUTHORIZED");
    }

    const taskData = await validateRequest(request, taskSchema);
    const { tags: tagNames, ...taskFields } = taskData;

    logger.info("Creating new task", {
      title: taskData.title,
      userId: session.user.id,
    });

    // Create task and tags in a transaction
    const task = await prisma.$transaction(async (tx) => {
      // Create the task
      const newTask = await tx.task.create({
        data: {
          ...taskFields,
          userId: session.user.id,
        },
      });

      // Create tags if provided
      if (tagNames && tagNames.length > 0) {
        await tx.taskTag.createMany({
          data: tagNames.map((name) => ({
            name,
            taskId: newTask.id,
          })),
        });
      }

      // Fetch the created task's tags
      const taskTags = await tx.taskTag.findMany({
        where: { taskId: newTask.id },
        select: { name: true },
      });

      return {
        ...newTask,
        tags: taskTags.map((tag) => tag.name),
      };
    });

    logger.info("Successfully created task", {
      taskId: task.id,
      userId: session.user.id,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create task", error);
    return handleAPIError(error);
  }
}
