import { NextResponse } from "next/server";
import { prisma, testPrismaConnection, withRetry } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createHash } from "@/lib/crypto-server";

// Helper function to remove duplicates
async function removeDuplicateTemplates() {
  logger.info("Starting duplicate template removal process");

  try {
    // Find all templates
    const templates = await prisma.jobDescription.findMany({
      where: {
        content: {
          contains: '"isTemplate":true',
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info(`Found ${templates.length} total templates`);

    // Create a map to store unique templates by title
    const uniqueTemplates = new Map();

    // Keep only the most recent template for each title
    templates.forEach((template) => {
      try {
        const content = JSON.parse(template.content);
        const title = content.title;

        if (!uniqueTemplates.has(title)) {
          uniqueTemplates.set(title, template);
        }
      } catch (error) {
        logger.warn(
          `Could not parse content for template ${template.id}`,
          error
        );
      }
    });

    logger.info(`Identified ${uniqueTemplates.size} unique templates to keep`);

    // Delete all templates that are not in the uniqueTemplates map
    const templatesToKeep = Array.from(uniqueTemplates.values()).map(
      (t) => t.id
    );

    const deleteResult = await prisma.jobDescription.deleteMany({
      where: {
        AND: [
          {
            content: {
              contains: '"isTemplate":true',
            },
          },
          {
            id: {
              notIn: templatesToKeep,
            },
          },
        ],
      },
    });

    logger.info(`Removed ${deleteResult.count} duplicate templates`);
    return deleteResult.count;
  } catch (error) {
    logger.error("Error in removeDuplicateTemplates", error);
    throw error;
  }
}

// Note: We considered adding sample templates visible to all users,
// but decided to keep templates user-specific and provide a guide instead.
// This simplifies permissions and encourages users to create their own templates.

export async function GET() {
  logger.info("GET /api/jd-developer/templates - Starting request");

  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check database connection
    const isConnected = await testPrismaConnection();
    if (!isConnected) {
      logger.error("Database connection failed before processing GET request");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Use withRetry for database operation
    // Return only templates created by the current user
    const templates = await withRetry(async () => {
      return prisma.jobDescription.findMany({
        where: {
          userId: session.user.id,
          content: {
            contains: '"isTemplate":true',
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    logger.info(`Retrieved ${templates.length} templates successfully`);

    // Parse the content JSON for each template and ensure they are actually templates
    const parsedTemplates = templates
      .map((template) => {
        try {
          const parsedContent = JSON.parse(template.content);

          // Verify this is actually a template
          if (parsedContent.metadata?.isTemplate !== true) {
            return null; // Skip this item
          }

          return {
            id: template.id,
            ...parsedContent,
          };
        } catch (parseError) {
          console.error(`Error parsing template ${template.id}:`, parseError);
          // Return null for invalid templates
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries

    return NextResponse.json({ templates: parsedTemplates });
  } catch (error) {
    logger.error("Error in GET /api/jd-developer/templates", error);

    return NextResponse.json(
      {
        error: "Failed to fetch templates",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV !== "production" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  logger.info("POST /api/jd-developer/templates - Starting request");

  try {
    const session = await getServerSession(authOptions);

    // Debug session information
    logger.info("Session information", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      userId: session?.user?.id,
      sessionKeys: session ? Object.keys(session) : [],
      userKeys: session?.user ? Object.keys(session.user) : [],
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate user ID
    if (!session?.user?.id) {
      logger.error("User ID is missing from session");
      return NextResponse.json(
        { error: "Invalid session: User ID is missing" },
        { status: 401 }
      );
    }

    // First check database connection
    const isConnected = await testPrismaConnection();
    if (!isConnected) {
      logger.error("Database connection failed before processing request");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Verify user exists in database
    try {
      const userExists = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true },
      });

      if (!userExists) {
        logger.error(`User with ID ${session.user.id} not found in database`);
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 401 }
        );
      }

      logger.info(`Verified user ${session.user.id} exists in database`);
    } catch (error) {
      logger.error("Error verifying user in database", error);
      return NextResponse.json(
        { error: "Failed to verify user" },
        { status: 500 }
      );
    }

    // Parse request body
    let payload;
    try {
      payload = await request.json();
      logger.info("Request payload received", {
        payloadKeys: Object.keys(payload),
      });
    } catch (error) {
      logger.error("Failed to parse request body", error);
      return NextResponse.json(
        { error: "Invalid request: Could not parse JSON body" },
        { status: 400 }
      );
    }

    // Validate payload
    if (!payload) {
      logger.error("Payload is null or undefined");
      return NextResponse.json(
        { error: "Invalid request: Payload is missing" },
        { status: 400 }
      );
    }

    // Handle both formats - the new format with name/content/type and the old format with title/etc.
    const templateName = payload.name || payload.title;
    const templateType = payload.type || payload.metadata?.industry;
    let templateContent = payload.content;

    // If content is not provided, create it from the payload
    if (!templateContent && payload.title) {
      templateContent = JSON.stringify({
        title: payload.title,
        department: payload.department,
        location: payload.location,
        employmentType: payload.employmentType,
        description: payload.description,
        responsibilities: payload.responsibilities || [],
        requirements: payload.requirements || { required: [], preferred: [] },
        qualifications: payload.qualifications || {
          education: [],
          experience: [],
          certifications: [],
        },
        metadata: payload.metadata || {
          industry: payload.industry,
          level: payload.level,
          isTemplate: true,
        },
      });
      logger.info("Created content from payload fields");
    }

    // Validate required fields
    if (!templateName || !templateContent || !templateType) {
      logger.error("Missing required fields in payload", {
        hasName: !!templateName,
        hasContent: !!templateContent,
        hasType: !!templateType,
        payloadKeys: Object.keys(payload),
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields: name/title, content, and type/industry are required",
        },
        { status: 400 }
      );
    }

    // Generate content hash
    let contentHash = "";
    try {
      contentHash = createHash(
        typeof templateContent === "string"
          ? templateContent
          : JSON.stringify(templateContent)
      );
      logger.info("Generated content hash", { contentHash });
    } catch (error) {
      logger.warn("Failed to generate content hash", error);
      // Continue without hash if it fails
    }

    // Extract skills from requirements if available
    let skills: string[] = [];
    try {
      if (payload.requirements?.required) {
        if (Array.isArray(payload.requirements.required)) {
          skills = payload.requirements.required
            .map((skill: { name: string } | string) =>
              typeof skill === "string" ? skill : skill.name
            )
            .filter(Boolean);
        }
      }
    } catch (error) {
      logger.warn("Failed to extract skills from requirements", error);
    }

    // Get level from payload
    const level = payload.level || payload.metadata?.level || "";

    // Use withRetry for database operation
    const template = await withRetry(async () => {
      // If we somehow got here without a valid user ID, use a default admin user
      // This is a fallback mechanism and should be logged
      let userIdToUse = session.user.id;

      if (!userIdToUse) {
        logger.warn(
          "Using fallback admin user ID because session user ID is missing"
        );

        // Try to find the test user first
        try {
          const testUser = await prisma.user.findUnique({
            where: { email: "test@example.com" },
            select: { id: true },
          });

          if (testUser) {
            userIdToUse = testUser.id;
            logger.info(`Using test user ID ${userIdToUse} as fallback`);
          } else {
            // Try to find an admin user
            const adminUser = await prisma.user.findFirst({
              where: { role: "admin" },
              select: { id: true },
            });

            if (adminUser) {
              userIdToUse = adminUser.id;
              logger.info(`Using admin user ID ${userIdToUse} as fallback`);
            } else {
              // If no admin, try to find any user
              const anyUser = await prisma.user.findFirst({
                select: { id: true },
              });

              if (anyUser) {
                userIdToUse = anyUser.id;
                logger.info(`Using user ID ${userIdToUse} as fallback`);
              } else {
                throw new Error("No valid user ID found in database");
              }
            }
          }
        } catch (findError) {
          logger.error("Error finding fallback user", findError);
          throw new Error("Failed to find a valid user ID");
        }
      }

      return prisma.jobDescription.create({
        data: {
          title: templateName,
          content:
            typeof templateContent === "string"
              ? templateContent
              : JSON.stringify(templateContent),
          industry: templateType,
          level: level,
          skills: skills,
          userId: userIdToUse,
          contentHash: contentHash,
        },
      });
    });

    logger.info("Template created successfully", { templateId: template.id });

    return NextResponse.json(template);
  } catch (error) {
    logger.error("Error in POST /api/jd-developer/templates", error);

    // Determine if it's a client error or server error
    const isClientError =
      error instanceof Error &&
      (error.message.includes("required") || error.message.includes("invalid"));

    return NextResponse.json(
      {
        error: "Failed to create template",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV !== "production" ? error : undefined,
      },
      { status: isClientError ? 400 : 500 }
    );
  }
}

export async function DELETE() {
  logger.info(
    "DELETE /api/jd-developer/templates - Starting request to remove duplicates"
  );

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      logger.warn("Authentication required for DELETE operation");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check database connection
    const isConnected = await testPrismaConnection();
    if (!isConnected) {
      logger.error(
        "Database connection failed before processing DELETE request"
      );
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Use withRetry for database operation
    const removedCount = await withRetry(async () => {
      return removeDuplicateTemplates();
    });

    logger.info(`Successfully removed ${removedCount} duplicate templates`);
    return NextResponse.json({
      message: "Duplicates removed successfully",
      count: removedCount,
    });
  } catch (error) {
    logger.error("Error in DELETE /api/jd-developer/templates", error);

    return NextResponse.json(
      {
        error: "Failed to remove duplicates",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV !== "production" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
