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
      .min(1, "At least one preferred skill is required"),
  }),
  qualifications: z.object({
    education: z
      .array(z.string())
      .min(1, "At least one education requirement is required"),
    experience: z
      .array(z.string())
      .min(1, "At least one experience requirement is required"),
    certifications: z
      .array(z.string())
      .min(1, "At least one certification is required"),
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    // Generate enhanced job description using LLM
    const enhancedDescription = await generateJobDescription({
      ...validatedData,
      userEmail: session.user.email,
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
