import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CompetencyLevel {
  name: string;
  description: string;
  levelOrder: number;
  behavioralIndicators: string[];
  developmentSuggestions: string[];
}

interface Competency {
  name: string;
  description: string;
  businessImpact: string;
  type: string;
  levels: CompetencyLevel[];
}

interface CompetencyFramework {
  name: string;
  description: string;
  industry: string;
  jobFunction: string;
  roleLevel: string;
  competencies: Competency[];
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const {
      industry,
      jobFunction,
      roleLevel,
      numberOfCompetencies,
      competencyTypes,
      numberOfLevels,
      specificRequirements,
      organizationalValues,
      existingCompetencies,
    } = await request.json();

    // Construct additional context based on optional fields
    let additionalContext = "";

    if (competencyTypes && competencyTypes.length > 0) {
      additionalContext += `Focus on the following competency types: ${competencyTypes.join(
        ", "
      )}.\n`;
    }

    if (numberOfLevels) {
      additionalContext += `Include ${numberOfLevels} proficiency levels for each competency.\n`;
    }

    if (specificRequirements) {
      additionalContext += `Specific requirements: ${specificRequirements}\n`;
    }

    if (organizationalValues) {
      additionalContext += `Organizational values to incorporate: ${organizationalValues}\n`;
    }

    if (existingCompetencies) {
      additionalContext += `Build upon or complement these existing competencies: ${existingCompetencies}\n`;
    }

    const prompt = `
    You are an expert in competency framework development with deep knowledge of skills and behaviors across industries and roles.

    Generate a comprehensive competency framework for a ${roleLevel} ${jobFunction} in the ${industry} industry.

    The framework should include ${numberOfCompetencies} competencies that are:
    1. Specific and measurable
    2. Relevant to the role and industry
    3. Structured with clear progression between levels
    4. Actionable for development planning

    ${additionalContext}

    For each competency, provide:
    - Name: A concise, professional title
    - Description: A clear explanation of the competency (2-3 sentences)
    - Business Impact: How this competency contributes to organizational success
    - ${numberOfLevels || 4} proficiency levels with:
      - Level Name: (e.g., Basic, Intermediate, Advanced, Expert)
      - Level Description: A brief overview of capabilities at this level
      - Behavioral Indicators: 3-5 specific, observable behaviors that demonstrate this level
      - Development Suggestions: 2-3 activities to develop this competency level

    Format the response as structured JSON that can be parsed programmatically with this exact schema:
    {
      "name": "Framework Name",
      "description": "Framework Description",
      "industry": "${industry}",
      "jobFunction": "${jobFunction}",
      "roleLevel": "${roleLevel}",
      "competencies": [
        {
          "name": "Competency Name",
          "description": "Competency Description",
          "businessImpact": "Business Impact Description",
          "type": "Competency Type",
          "levels": [
            {
              "name": "Level Name",
              "description": "Level Description",
              "levelOrder": 1,
              "behavioralIndicators": ["Indicator 1", "Indicator 2", "Indicator 3"],
              "developmentSuggestions": ["Suggestion 1", "Suggestion 2"]
            }
          ]
        }
      ]
    }
    `;

    // Use Gemini 2.0 Flash as primary LLM
    let response;
    try {
      response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
            topP: 0.95,
            topK: 40,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
          },
        }
      );
    } catch (error) {
      console.error("Gemini API error:", error);

      // Fallback to Groq LLama model if Gemini fails
      response = await axios.post(
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
          max_tokens: 4000,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the response based on which API was used
    let competencyFramework;

    if (response.data.candidates) {
      // Gemini response format
      const content = response.data.candidates[0].content.parts[0].text;
      competencyFramework = JSON.parse(content);
    } else if (response.data.choices) {
      // Groq response format
      competencyFramework = JSON.parse(
        response.data.choices[0].message.content
      );
    } else {
      throw new Error("Unexpected API response format");
    }

    // Return the generated framework without saving to database
    return NextResponse.json({
      framework: competencyFramework,
    });
  } catch (error) {
    console.error("Competency framework generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate competency framework" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { framework, industryId, categoryIds } = (await request.json()) as {
      framework: CompetencyFramework;
      industryId?: string;
      categoryIds?: Record<string, string>; // Map of competency index to category ID
    };

    // Save the framework to the database
    const savedFramework = await prisma.competencyFramework.create({
      data: {
        name: framework.name,
        description: framework.description,
        industry: framework.industry,
        jobFunction: framework.jobFunction,
        roleLevel: framework.roleLevel,
        isPublic: false,
        userId: session.user.id,
        // Add industry reference if provided
        industryId: industryId,
        competencies: {
          create: framework.competencies.map(
            (comp: Competency, index: number) => ({
              name: comp.name,
              description: comp.description,
              businessImpact: comp.businessImpact,
              type: comp.type,
              // Add category reference if provided for this competency
              categoryId: categoryIds?.[index.toString()],
              // Add industry reference if provided
              industryId: industryId,
              levels: {
                create: comp.levels.map(
                  (level: CompetencyLevel, levelIndex: number) => ({
                    name: level.name,
                    description: level.description,
                    levelOrder: level.levelOrder || levelIndex + 1,
                    behavioralIndicators: level.behavioralIndicators,
                    developmentSuggestions: level.developmentSuggestions,
                  })
                ),
              },
            })
          ),
        },
      },
      include: {
        competencies: {
          include: {
            levels: true,
            category: true,
          },
        },
        industryRef: true,
      },
    });

    return NextResponse.json({
      framework: savedFramework,
    });
  } catch (error) {
    console.error("Competency framework save error:", error);
    return NextResponse.json(
      { error: "Failed to save competency framework" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const frameworkId = searchParams.get("id");

    if (frameworkId) {
      // Get a specific framework
      const framework = await prisma.competencyFramework.findUnique({
        where: {
          id: frameworkId,
          OR: [{ userId: session.user.id }, { isPublic: true }],
        },
        include: {
          competencies: {
            include: {
              levels: {
                orderBy: {
                  levelOrder: "asc",
                },
              },
              category: true,
              industry: true,
            },
          },
          industryRef: true,
        },
      });

      if (!framework) {
        return NextResponse.json(
          { error: "Framework not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ framework });
    } else {
      // Get all frameworks for the user
      const frameworks = await prisma.competencyFramework.findMany({
        where: {
          OR: [{ userId: session.user.id }, { isPublic: true }],
        },
        include: {
          competencies: {
            include: {
              levels: true,
              category: true,
              industry: true,
            },
          },
          industryRef: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return NextResponse.json({ frameworks });
    }
  } catch (error) {
    console.error("Competency framework fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch competency frameworks" },
      { status: 500 }
    );
  }
}
