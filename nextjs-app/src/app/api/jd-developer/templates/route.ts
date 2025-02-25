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
    const parsedTemplates = templates.map((template) => ({
      id: template.id,
      ...JSON.parse(template.content),
    }));

    return NextResponse.json({ templates: parsedTemplates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
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

    const body = await request.json();
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

    return NextResponse.json(
      { error: "Failed to create template" },
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
    return NextResponse.json(
      { error: "Failed to remove duplicates" },
      { status: 500 }
    );
  }
}
