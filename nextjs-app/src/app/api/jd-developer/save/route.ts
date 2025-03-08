import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createHash } from "@/lib/crypto-server";

const saveSchema = z.object({
  title: z.string(),
  department: z.string(),
  location: z.string(),
  employmentType: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  requirements: z.object({
    required: z.array(
      z.object({
        name: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        description: z.string(),
      })
    ),
    preferred: z
      .array(
        z.object({
          name: z.string(),
          level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
          description: z.string(),
        })
      )
      .optional()
      .nullable(),
  }),
  qualifications: z.object({
    education: z.array(z.string()),
    experience: z.array(z.string()),
    certifications: z.array(z.string()),
  }),
  salary: z
    .object({
      range: z.object({
        min: z.number(),
        max: z.number(),
      }),
      type: z.enum(["hourly", "monthly", "yearly"]),
      currency: z.string(),
    })
    .optional(),
  metadata: z.object({
    industry: z.string(),
    level: z.string(),
    isTemplate: z.boolean(),
  }),
});

// Function to generate content hash
function generateContentHash(content: string): string {
  return createHash(content);
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
    const validatedData = saveSchema.parse(body);

    // Transform the data into the JobDescription format
    const jobDescriptionData = {
      title: validatedData.title,
      department: validatedData.department,
      location: validatedData.location,
      employmentType: validatedData.employmentType,
      description: validatedData.description,
      responsibilities: validatedData.responsibilities,
      requirements: validatedData.requirements,
      qualifications: validatedData.qualifications,
      salary: validatedData.salary || {
        range: {
          min: 0,
          max: 0,
        },
        type: "yearly" as const,
        currency: "USD",
      },
      company: null,
      metadata: {
        industry: validatedData.metadata.industry,
        level: validatedData.metadata.level,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.email,
        isTemplate: validatedData.metadata.isTemplate,
        version: 1,
        isLatest: true,
      },
    };

    // Save to database
    const content = JSON.stringify(jobDescriptionData);
    const contentHash = generateContentHash(content);

    const jobDescription = await prisma.jobDescription.create({
      data: {
        title: jobDescriptionData.title,
        content,
        industry: jobDescriptionData.metadata.industry,
        level: jobDescriptionData.metadata.level,
        skills: jobDescriptionData.requirements.required.map(
          (skill) => skill.name
        ),
        userId: session.user.id,
        contentHash,
        version: 1,
        isLatest: true,
      },
    });

    return NextResponse.json({ jobDescription }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error saving job description:", errorMessage);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save job description: " + errorMessage },
      { status: 500 }
    );
  }
}
