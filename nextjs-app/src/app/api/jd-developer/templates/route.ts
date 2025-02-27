import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const createTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string(),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string()),
  requirements: z.object({
    required: z.array(
      z.object({
        name: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        description: z.string(),
      })
    ),
    preferred: z.array(z.string()).optional(),
  }),
  qualifications: z.object({
    education: z.array(z.string()),
    experience: z.array(z.string()),
    certifications: z.array(z.string()),
  }),
  metadata: z.object({
    industry: z.string(),
    level: z.string(),
    isTemplate: z.boolean(),
  }),
});

// Helper function to remove duplicates
async function removeDuplicateTemplates() {
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

  // Create a map to store unique templates by title
  const uniqueTemplates = new Map();

  // Keep only the most recent template for each title
  templates.forEach((template) => {
    const content = JSON.parse(template.content);
    const title = content.title;

    if (!uniqueTemplates.has(title)) {
      uniqueTemplates.set(title, template);
    }
  });

  // Delete all templates that are not in the uniqueTemplates map
  const templatesToKeep = Array.from(uniqueTemplates.values()).map((t) => t.id);
  await prisma.jobDescription.deleteMany({
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
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Remove duplicates before returning templates
    await removeDuplicateTemplates();

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

    // Parse the content JSON for each template
    const parsedTemplates = templates.map((template) => {
      try {
        return {
          id: template.id,
          ...JSON.parse(template.content),
        };
      } catch (parseError) {
        console.error(`Error parsing template ${template.id}:`, parseError);
        // Return a minimal valid object for this template
        return {
          id: template.id,
          title: `Error: Could not parse template ${template.id}`,
          error: true,
          metadata: {
            createdAt: template.createdAt.toISOString(),
            updatedAt: template.updatedAt.toISOString(),
          },
        };
      }
    });

    return NextResponse.json({ templates: parsedTemplates });
  } catch (error) {
    console.error("Error fetching templates:", error);

    if (error instanceof TypeError) {
      console.error("TypeError details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: (error as { code?: string }).code,
      });

      return NextResponse.json(
        {
          error: "Type error occurred",
          details: error.message,
          code: (error as { code?: string }).code,
          location: "template fetching",
        },
        { status: 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "JSON parsing error",
          details: error.message,
          location: "template content parsing",
        },
        { status: 500 }
      );
    }

    // For any other errors
    console.error("Unhandled error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch templates",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Add error handling for request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body - failed to parse JSON" },
        { status: 400 }
      );
    }

    // Validate that body is not null or undefined
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const validatedData = createTemplateSchema.parse(body);

    // Create a content object that matches our database schema
    const content = {
      ...validatedData,
      metadata: {
        ...validatedData.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.email,
        version: 1,
        isLatest: true,
        contentHash: "",
      },
    };

    // Ensure qualifications arrays are never null
    if (!content.qualifications) {
      content.qualifications = {
        education: [],
        experience: [],
        certifications: [],
      };
    } else {
      content.qualifications.education = content.qualifications.education || [];
      content.qualifications.experience =
        content.qualifications.experience || [];
      content.qualifications.certifications =
        content.qualifications.certifications || [];
    }

    // Generate content hash
    const contentHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(content))
      .digest("hex");

    // Update content with hash
    content.metadata.contentHash = contentHash;

    // Save the template
    const template = await prisma.jobDescription.create({
      data: {
        title: validatedData.title,
        content: JSON.stringify(content),
        industry: validatedData.metadata.industry,
        level: validatedData.metadata.level,
        skills: validatedData.requirements.required.map((skill) => skill.name),
        userId: session.user.id,
        contentHash: contentHash,
      },
    });

    return NextResponse.json(
      { template: { id: template.id, ...content } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error instanceof TypeError) {
      console.error("TypeError details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: (error as { code?: string }).code,
      });

      return NextResponse.json(
        {
          error: "Type error occurred",
          details: error.message,
          code: (error as { code?: string }).code,
          location: "template creation",
        },
        { status: 500 }
      );
    }

    // For any other errors
    console.error("Unhandled error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to create template",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await removeDuplicateTemplates();

    return NextResponse.json({ message: "Duplicates removed successfully" });
  } catch (error) {
    console.error("Error removing duplicates:", error);

    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          error: "Type error occurred",
          details: error.message,
          location: "duplicate removal",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to remove duplicates",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
