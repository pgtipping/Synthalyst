import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to use this feature" },
        { status: 401 }
      );
    }

    // Fetch saved content for the user
    const entries = await prisma.learningContentEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching learning content:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to use this feature" },
        { status: 401 }
      );
    }

    const formData = await req.json();

    // Validate required fields
    if (!formData.title || !formData.topic || !formData.targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate tags for the content
    const tagsPrompt = `
      Generate 3-5 relevant tags for educational content with the following details:
      Title: ${formData.title}
      Topic: ${formData.topic}
      Content Type: ${formData.contentType}
      Target Audience: ${formData.targetAudience}
      Learning Level: ${formData.learningLevel}
      
      Return only the tags as a comma-separated list, with no additional text.
    `;

    const tagsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a tag generator for educational content.",
        },
        { role: "user", content: tagsPrompt },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const tagsText = tagsResponse.choices[0]?.message?.content?.trim() || "";
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    // Main content generation prompt
    const prompt = `
      You are an expert educational content creator. Your task is to create high-quality educational content based on the following specifications:
      
      Title: ${formData.title}
      Topic: ${formData.topic}
      Content Type: ${formData.contentType}
      Target Audience: ${formData.targetAudience}
      Learning Level: ${formData.learningLevel}
      Content Format: ${formData.contentFormat}
      
      ${
        formData.specificRequirements
          ? `Specific Requirements: ${formData.specificRequirements}`
          : ""
      }
      
      Instructions:
      1. Create educational content that is tailored to the specified audience and learning level
      2. Follow the structure appropriate for the content type (lesson, tutorial, exercise, etc.)
      3. Include relevant examples, explanations, and exercises where appropriate
      4. Ensure the content is engaging, clear, and educational
      5. Adapt your language and complexity to match the specified learning level
      
      Important:
      - Do NOT use markdown formatting
      - Use plain text only
      - Organize your content with clear section headings and paragraph breaks
      - Use simple formatting like numbered lists (1., 2., etc.) or bullet points (-, *) if needed
      - For exercises or assessments, clearly separate questions from answers
      - Keep your content educational, accurate, and helpful
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational content creator specializing in developing high-quality learning materials.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content =
      response.choices[0]?.message?.content?.trim() ||
      "I couldn't generate content. Please try again.";

    // Save the content to the database
    const contentId = uuidv4();

    const learningContent = await prisma.learningContentEntry.create({
      data: {
        id: contentId,
        title: formData.title,
        topic: formData.topic,
        contentType: formData.contentType,
        targetAudience: formData.targetAudience,
        learningLevel: formData.learningLevel,
        contentFormat: formData.contentFormat,
        content: content,
        specificRequirements: formData.specificRequirements || null,
        tags: tags,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: contentId,
      content,
      tags,
      ...learningContent,
    });
  } catch (error) {
    console.error("Error generating learning content:", error);
    return NextResponse.json(
      { error: "Failed to generate learning content" },
      { status: 500 }
    );
  }
}
