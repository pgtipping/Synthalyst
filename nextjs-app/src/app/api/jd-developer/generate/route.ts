import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateJobDescription } from "@/lib/llm";
import { z } from "zod";

const generateSchema = z.object({
  title: z.string(),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string(),
  description: z.string().optional(),
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
      .default([]),
  }),
  qualifications: z.object({
    education: z.array(z.string()).default([]),
    experience: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
  }),
  salary: z.object({
    range: z.object({
      min: z.number(),
      max: z.number(),
    }),
    type: z.enum(["hourly", "monthly", "yearly"]),
    currency: z.string().optional(),
  }),
  company: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      culture: z.array(z.string()).optional(),
    })
    .optional(),
  industry: z.string(),
  level: z.string(),
});

export async function POST(request: Request) {
  try {
    // Get session but don't require authentication for generating job descriptions
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    // Generate enhanced job description using LLM
    const enhancedDescription = await generateJobDescription({
      title: validatedData.title,
      employmentType: validatedData.employmentType,
      industry: validatedData.industry,
      level: validatedData.level,
      department: validatedData.department,
      location: validatedData.location,
      description: validatedData.description,
      responsibilities: validatedData.responsibilities,
      salary: validatedData.salary
        ? {
            range: {
              min: validatedData.salary.range.min,
              max: validatedData.salary.range.max,
            },
            type: validatedData.salary.type,
            currency: validatedData.salary.currency,
          }
        : undefined,
      company: validatedData.company,
      userEmail: session?.user?.email || "anonymous@user.com", // Provide a default email for anonymous users
      // Ensure arrays are always provided
      requirements: {
        required: (validatedData.requirements.required || []).map((req) => ({
          name: req.name || "",
          level: req.level || "intermediate",
          description: req.description || "",
        })),
        preferred: (validatedData.requirements.preferred || []).map((req) => ({
          name: req.name || "",
          level: req.level || "intermediate",
          description: req.description || "",
        })),
      },
      qualifications: {
        education: validatedData.qualifications.education || [],
        experience: validatedData.qualifications.experience || [],
        certifications: validatedData.qualifications.certifications || [],
      },
    });

    if (!enhancedDescription) {
      return NextResponse.json(
        { error: "Failed to generate job description" },
        { status: 500 }
      );
    }

    // Return the generated content without saving to database
    return NextResponse.json(
      { generatedContent: enhancedDescription },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating job description:", errorMessage);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate job description: " + errorMessage },
      { status: 500 }
    );
  }
}
