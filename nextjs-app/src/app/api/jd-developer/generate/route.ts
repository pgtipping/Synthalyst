import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateJobDescription } from "@/lib/llm";
import { z } from "zod";

const generateSchema = z.object({
  title: z.string(),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  experience: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  salaryType: z.enum(["hourly", "monthly", "yearly"]),
  currency: z.string().optional(),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  companyCulture: z.array(z.string()).optional(),
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

    // Save to database
    const jobDescription = await prisma.jobDescription.create({
      data: {
        title: enhancedDescription.title,
        content: JSON.stringify(enhancedDescription),
        industry: enhancedDescription.metadata.industry,
        level: enhancedDescription.metadata.level,
        skills: enhancedDescription.requirements.required,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ jobDescription }, { status: 201 });
  } catch (error) {
    console.error("Error generating job description:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate job description" },
      { status: 500 }
    );
  }
}
