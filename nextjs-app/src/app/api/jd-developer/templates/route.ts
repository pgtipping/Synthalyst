import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string(),
  description: z.string().min(1, "Description is required"),
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
  isTemplate: z.boolean(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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

    // Create the template content
    const templateContent = {
      title: validatedData.title,
      department: validatedData.department,
      location: validatedData.location,
      employmentType: validatedData.employmentType,
      description: validatedData.description,
      responsibilities: validatedData.responsibilities,
      requirements: {
        required: validatedData.requiredSkills,
        preferred: validatedData.preferredSkills,
      },
      qualifications: {
        education: validatedData.education,
        experience: validatedData.experience,
        skills: validatedData.requiredSkills,
        certifications: validatedData.certifications,
      },
      benefits: validatedData.benefits,
      salary:
        validatedData.salaryMin || validatedData.salaryMax
          ? {
              range: {
                min: parseInt(validatedData.salaryMin || "0"),
                max: parseInt(validatedData.salaryMax || "0"),
              },
              type: validatedData.salaryType,
              currency: validatedData.currency,
            }
          : undefined,
      company: {
        name: validatedData.companyName,
        description: validatedData.companyDescription,
        culture: validatedData.companyCulture,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.email,
        isTemplate: true,
        industry: validatedData.industry,
        level: validatedData.level,
      },
    };

    // Save the template
    const template = await prisma.jobDescription.create({
      data: {
        title: validatedData.title,
        content: JSON.stringify(templateContent),
        industry: validatedData.industry,
        level: validatedData.level,
        skills: validatedData.requiredSkills,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { template: { id: template.id, ...templateContent } },
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
