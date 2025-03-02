import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const {
      competencyName,
      industry,
      category,
      description,
      numLevels,
      additionalContext,
      template,
    } = await request.json();

    const prompt = `
    Create a detailed competency definition for the following:

    Competency Name: ${competencyName}
    Industry: ${industry}
    Category: ${category}
    Description: ${description}
    Number of Levels: ${numLevels}
    Additional Context: ${additionalContext}
    Template: ${template}

    Please create a comprehensive competency definition with ${numLevels} levels of proficiency.
    For each level, provide:
    1. Level name and clear description
    2. Expected behaviors and skills
    3. Specific requirements and qualifications
    4. Performance indicators

    Use industry-standard terminology and best practices.
    Make the levels progressive and clearly differentiated.
    Include measurable criteria for assessment.
    Consider industry-specific requirements and standards.

    Format the response as a structured JSON object with the following schema:
    {
      "id": "unique-id",
      "name": "competency-name",
      "description": "comprehensive-description",
      "industry": "industry-name",
      "category": "category-name",
      "levels": [
        {
          "level": "level-name",
          "description": "level-description",
          "behaviors": ["behavior1", "behavior2", ...],
          "requirements": ["requirement1", "requirement2", ...]
        },
        ...
      ]
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
              "You are an expert in competency framework development and talent management.",
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
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse the response to ensure it's valid JSON
    const competencyDefinition = JSON.parse(
      response.data.choices[0].message.content
    );

    return NextResponse.json({
      competencyDefinition,
    });
  } catch (error) {
    console.error("Competency definition generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate competency definition" },
      { status: 500 }
    );
  }
}
