import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import axios from "axios";

const voiceInputSchema = z.object({
  transcript: z.string(),
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
    const { transcript } = voiceInputSchema.parse(body);

    // Process voice input using LLM to extract task information
    const prompt = `
      Extract task information from the following voice input:
      "${transcript}"

      Convert it into a structured task with the following information:
      1. Title (required)
      2. Description (optional)
      3. Priority (low, medium, high)
      4. Due date (try to identify date references)
      5. Tags (optional)

      Format the response as a JSON object with these fields. If a field cannot be determined, omit it.
      For the due date, use relative references (e.g., "tomorrow", "next week") or specific dates mentioned.
      For priority, default to "medium" if not specified.

      Example voice inputs and their interpretations:
      "Remind me to buy groceries tomorrow" ->
      {
        "title": "Buy groceries",
        "dueDate": "[tomorrow's date]",
        "priority": "medium",
        "tags": ["shopping"]
      }

      "High priority meeting with John about the project next Tuesday at 2pm" ->
      {
        "title": "Meeting with John - Project Discussion",
        "description": "Project meeting with John",
        "priority": "high",
        "dueDate": "[next Tuesday's date]",
        "tags": ["meeting", "project"]
      }
    `;

    const response = await axios.post(
      "https://api.groq.com/v1/chat/completions",
      {
        model: "llama-3.2-3b-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in natural language processing and task management.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const taskData = JSON.parse(response.data.choices[0].message.content);

    // Add required fields
    const task = {
      ...taskData,
      status: "todo",
      createdBy: session.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error processing voice input:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process voice input" },
      { status: 500 }
    );
  }
}
