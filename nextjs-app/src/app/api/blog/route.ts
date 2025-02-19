import { NextResponse } from "next/server";
import axios from "axios";

// Blog post generation with advanced prompt engineering
const generateBlogPost = async (
  topic: string,
  style: string,
  audience: string
) => {
  try {
    const prompt = `
    Write a comprehensive, engaging blog post about "${topic}".

    Guidelines:
    - Target audience: ${audience}
    - Writing style: ${style}
    - Structure:
      1. Compelling introduction that hooks the reader
      2. 3-4 main sections with clear headings
      3. Practical insights and actionable takeaways
      4. Conclusion that reinforces key messages

    Ensure the content is:
    - Informative and well-researched
    - Written in a conversational yet professional tone
    - Includes relevant examples or case studies
    - Approximately 800-1200 words long
    `;

    const response = await axios.post(
      "https://api.groq.com/v1/chat/completions",
      {
        model: "llama-3.2-3b-preview", // Groq API model name
        messages: [
          {
            role: "system",
            content: "You are a professional blog content generator.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Blog post generation error:", error);
    throw new Error("Failed to generate blog post");
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      topic,
      style = "informative",
      audience = "general professionals",
    } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const blogPost = await generateBlogPost(topic, style, audience);

    return NextResponse.json({
      blogPost,
      metadata: {
        topic,
        style,
        audience,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}
