import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Schema for validating the request body
const regenerateSectionSchema = z.object({
  sectionId: z.string(),
});

// Define the section type
interface Section {
  id: string;
  title: string;
  description: string;
  topics: string[];
  activities: Array<{
    type: string;
    description: string;
    duration: string;
  }>;
  resources: Array<{
    type: string;
    title: string;
    url: string;
    description: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const planId = id;
    const body = await req.json();
    const { sectionId } = regenerateSectionSchema.parse(body);

    // Get the training plan
    const trainingPlan = await prisma.trainingPlan.findUnique({
      where: { id: planId },
    });

    if (!trainingPlan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Check if the user owns the plan
    if (trainingPlan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to modify this plan" },
        { status: 403 }
      );
    }

    // Parse the content
    const content = JSON.parse(trainingPlan.content as string);

    // Find the section to regenerate
    const section = content.sections.find((s: Section) => s.id === sectionId);

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Generate a prompt for the LLM
    const prompt = `
    I need to regenerate a section for a training plan. Here are the details:

    Training Plan Title: ${trainingPlan.title}
    Training Plan Description: ${trainingPlan.description}
    Learning Objectives: ${trainingPlan.objectives.join(", ")}
    
    Current Section:
    Title: ${section.title}
    Description: ${section.description}
    
    Please create a new version of this section with:
    1. An improved title (if needed)
    2. A more detailed description
    3. A list of 3-5 relevant topics
    4. 2-3 engaging learning activities with descriptions and durations
    5. 2-3 helpful resources with titles, types, and descriptions
    
    Return the response as a JSON object with the following structure:
    {
      "id": "${section.id}",
      "title": "Improved Section Title",
      "description": "Detailed description of the section",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "activities": [
        {
          "type": "Activity Type (e.g., Exercise, Discussion, Project)",
          "description": "Detailed description of the activity",
          "duration": "Estimated duration (e.g., 30 minutes, 1 hour)"
        }
      ],
      "resources": [
        {
          "type": "Resource Type (e.g., Article, Video, Book)",
          "title": "Resource Title",
          "url": "URL if applicable",
          "description": "Brief description of the resource"
        }
      ]
    }
    `;

    // Call the LLM to regenerate the section
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer and instructional specialist.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.2-3b-preview",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content || "{}";
    const regeneratedSection = JSON.parse(responseContent);

    // Update the section in the content
    const updatedSections = content.sections.map((s: Section) =>
      s.id === sectionId ? regeneratedSection : s
    );

    content.sections = updatedSections;

    // Update the training plan in the database
    const updatedPlan = await prisma.trainingPlan.update({
      where: { id: planId },
      data: {
        content: JSON.stringify(content),
      },
    });

    // Transform the response to include parsed content
    const transformedPlan = {
      ...updatedPlan,
      content,
    };

    return NextResponse.json(transformedPlan);
  } catch (error) {
    console.error("[REGENERATE_SECTION]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
