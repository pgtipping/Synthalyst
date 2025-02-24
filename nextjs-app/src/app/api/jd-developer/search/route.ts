import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJobDescription } from "@/lib/templates";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const searchParamsSchema = z.object({
  search: z.string(),
  industry: z.string().optional(),
  level: z.string().optional(),
  contentType: z.enum(["all", "templates", "jobDescriptions"]),
  sortBy: z.enum(["createdAt", "updatedAt", "version", "relevance"]),
  sortOrder: z.enum(["asc", "desc"]),
  showLatestOnly: z.boolean(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = searchParamsSchema.parse({
      search: searchParams.get("search") || "",
      industry: searchParams.get("industry") || undefined,
      level: searchParams.get("level") || undefined,
      contentType: searchParams.get("contentType") || "all",
      sortBy: searchParams.get("sortBy") || "relevance",
      sortOrder: searchParams.get("sortOrder") || "desc",
      showLatestOnly: searchParams.get("showLatestOnly") === "true",
    });

    // Build the base query
    const baseWhere: Prisma.JobDescriptionWhereInput = {
      userId: session.user.id,
      ...(params.industry ? { industry: params.industry } : {}),
      ...(params.level ? { level: params.level } : {}),
      ...(params.showLatestOnly ? { isLatest: true } : {}),
      ...(params.contentType === "templates"
        ? { content: { contains: '"isTemplate":true' } }
        : params.contentType === "jobDescriptions"
        ? { content: { contains: '"isTemplate":false' } }
        : {}),
      ...(params.search
        ? {
            OR: [
              {
                title: {
                  contains: params.search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                content: {
                  contains: params.search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                skills: {
                  hasSome: [params.search],
                },
              },
            ],
          }
        : {}),
    };

    // Get total counts
    const [totalTemplates, totalJobDescriptions] = await Promise.all([
      prisma.jobDescription.count({
        where: {
          ...baseWhere,
          content: { contains: '"isTemplate":true' },
        },
      }),
      prisma.jobDescription.count({
        where: {
          ...baseWhere,
          content: { contains: '"isTemplate":false' },
        },
      }),
    ]);

    // Get search results
    const results = await prisma.jobDescription.findMany({
      where: baseWhere,
      orderBy: [
        {
          [params.sortBy === "relevance" ? "updatedAt" : params.sortBy]:
            params.sortOrder,
        },
      ],
      include: {
        categories: true,
      },
    });

    // Parse results and include categories
    const parsedResults = results.map((result) => {
      const parsed = parseJobDescription(result);
      return {
        ...parsed,
        categories: result.categories,
      };
    });

    return NextResponse.json({
      results: parsedResults,
      totalTemplates,
      totalJobDescriptions,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
