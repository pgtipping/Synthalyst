import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import {
  TaskType,
  detectTaskComplexity,
  selectModel,
  generateContent,
  createMultilingualSystemPrompt,
} from "@/lib/ai/model-router";

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
    const language = formData.language || "English";

    // Validate required fields
    if (!formData.title || !formData.topic || !formData.targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Detect task complexity
    const complexity = detectTaskComplexity(
      `${formData.title} ${formData.topic} ${
        formData.specificRequirements || ""
      }`
    );

    // Estimate content length based on content type and learning level
    const contentLengthEstimate =
      formData.contentType === "Comprehensive Course"
        ? 2000
        : formData.contentType === "Lesson"
        ? 1500
        : formData.contentType === "Tutorial"
        ? 1200
        : formData.contentType === "Exercise"
        ? 800
        : formData.contentType === "Quiz"
        ? 600
        : 1000;

    // Select the appropriate model
    const model = selectModel({
      taskType: TaskType.LEARNING_CREATOR,
      complexity,
      contentLength: contentLengthEstimate,
      language,
      prioritizeCost: true,
    });

    // Generate tags for the content
    const tagsSystemPrompt = "You are a tag generator for educational content.";
    const tagsUserPrompt = `
      Generate 3-5 relevant tags for educational content with the following details:
      Title: ${formData.title}
      Topic: ${formData.topic}
      Content Type: ${formData.contentType}
      Target Audience: ${formData.targetAudience}
      Learning Level: ${formData.learningLevel}
      
      Return only the tags as a comma-separated list, with no additional text.
    `;

    const tagsText = await generateContent(
      model,
      createMultilingualSystemPrompt(tagsSystemPrompt, language),
      tagsUserPrompt,
      0.3,
      50
    );

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    // Main content generation prompt
    const contentSystemPrompt =
      "You are an expert educational content creator specializing in developing high-quality learning materials.";
    const contentUserPrompt = `
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

    const content = await generateContent(
      model,
      createMultilingualSystemPrompt(contentSystemPrompt, language),
      contentUserPrompt,
      0.7,
      2500
    );

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
        language: language,
        modelUsed: model,
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
