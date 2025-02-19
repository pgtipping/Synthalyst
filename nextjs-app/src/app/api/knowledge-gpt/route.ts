import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { question, topics } = await request.json();

    const prompt = `
    You are an expert teacher and knowledge curator. Please provide a detailed, accurate, and educational answer to the following question. Focus on the specified topics and provide practical examples where relevant.

    Question: ${question}
    Topics to focus on: ${topics.join(", ")}

    Please structure your response with:
    1. Direct answer to the question
    2. Detailed explanation
    3. Practical examples or applications
    4. Common misconceptions (if any)
    5. Additional resources or related topics to explore

    Make your explanation clear, engaging, and suitable for someone learning about these topics.
    Include code examples if the question is related to programming.
    Cite reliable sources or best practices where applicable.
    `;

    const response = await axios.post(
      "https://api.groq.com/v1/chat/completions",
      {
        model: "llama-3.2-3b-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert teacher and knowledge curator, specializing in providing clear, accurate, and educational answers.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      answer: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Knowledge GPT error:", error);
    return NextResponse.json(
      { error: "Failed to get answer" },
      { status: 500 }
    );
  }
}
