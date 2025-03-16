import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Define a type for the EmailLog model
type EmailLogModel = {
  findMany: (args: {
    where?: {
      status?: string;
      category?: string;
    };
    orderBy?: {
      createdAt: "asc" | "desc";
    };
    skip?: number;
    take?: number;
  }) => Promise<
    Array<{
      id: string;
      to: string;
      from: string;
      subject: string;
      category: string;
      status: string;
      provider: string | null;
      providerMessageId: string | null;
      error: string | null;
      sentAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }>
  >;
  count: (args: {
    where?: {
      status?: string;
      category?: string;
    };
  }) => Promise<number>;
  deleteMany: (args: {
    where: {
      id?: {
        in: string[];
      };
      createdAt?: {
        lt: Date;
      };
    };
  }) => Promise<{ count: number }>;
};

// Define a type for Prisma with EmailLog
type PrismaWithEmailLog = typeof prisma & {
  emailLog: EmailLogModel;
};

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true },
    });

    if (user?.role !== "ADMIN" && user?.email !== "pgtipping1@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Check if EmailLog model exists in the database
    try {
      // Try to access the model to see if it exists
      // This will throw an error if the model doesn't exist
      await prisma.$queryRaw`SELECT 1 FROM "EmailLog" LIMIT 1`;
    } catch (error) {
      // If the model doesn't exist, return empty data
      logger.warn("EmailLog table does not exist yet", error);
      return NextResponse.json({
        logs: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0,
        },
        stats: [],
        categoryStats: [],
      });
    }

    // Build where clause based on filters
    const whereClause: {
      status?: string;
      category?: string;
    } = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    // Cast prisma to include the EmailLog model
    const prismaWithEmailLog = prisma as unknown as PrismaWithEmailLog;

    // Get email logs with pagination
    const [logs, total] = await Promise.all([
      prismaWithEmailLog.emailLog.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prismaWithEmailLog.emailLog.count({ where: whereClause }),
    ]);

    // Get statistics
    const stats = await prisma.$queryRaw`
      SELECT 
        status, 
        COUNT(*) as count 
      FROM "EmailLog" 
      GROUP BY status
    `;

    // Get category statistics
    const categoryStats = await prisma.$queryRaw`
      SELECT 
        category, 
        COUNT(*) as count 
      FROM "EmailLog" 
      GROUP BY category
      ORDER BY count DESC
      LIMIT 10
    `;

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      stats,
      categoryStats,
    });
  } catch (error) {
    logger.error("Error retrieving email logs", error);
    return NextResponse.json(
      { error: "Failed to retrieve email logs" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only allow authenticated admin users to delete email logs
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true },
    });

    if (user?.role !== "ADMIN" && user?.email !== "pgtipping1@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Check if EmailLog model exists in the database
    try {
      // Try to access the model to see if it exists
      await prisma.$queryRaw`SELECT 1 FROM "EmailLog" LIMIT 1`;
    } catch (error) {
      // If the model doesn't exist, return a message
      logger.warn("EmailLog table does not exist yet", error);
      return NextResponse.json({
        message: "No email logs to delete (table does not exist yet)",
      });
    }

    // Get request body
    const body = await request.json();
    const { ids, olderThan } = body;

    // Cast prisma to include the EmailLog model
    const prismaWithEmailLog = prisma as unknown as PrismaWithEmailLog;

    if (ids && Array.isArray(ids)) {
      // Delete specific logs by ID
      await prismaWithEmailLog.emailLog.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      logger.info(`Deleted ${ids.length} email logs by ID`, { ids });

      return NextResponse.json({
        message: `Successfully deleted ${ids.length} email logs`,
      });
    } else if (olderThan) {
      // Delete logs older than a specific date
      const date = new Date(olderThan);

      const { count } = await prismaWithEmailLog.emailLog.deleteMany({
        where: {
          createdAt: {
            lt: date,
          },
        },
      });

      logger.info(
        `Deleted ${count} email logs older than ${date.toISOString()}`
      );

      return NextResponse.json({
        message: `Successfully deleted ${count} email logs older than ${date.toISOString()}`,
      });
    } else {
      return NextResponse.json(
        { error: "Either ids or olderThan parameter is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    logger.error("Error deleting email logs", error);
    return NextResponse.json(
      { error: "Failed to delete email logs" },
      { status: 500 }
    );
  }
}
