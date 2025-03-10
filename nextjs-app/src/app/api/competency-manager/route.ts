import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Define interface for cache item
interface CacheItem {
  framework: CompetencyFramework;
  timestamp: number;
}

// Simple in-memory cache for frequently used frameworks
const frameworkCache = new Map<string, CacheItem>();

// Cache expiration in ms (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

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

// Helper function to get framework from cache
function getFrameworkFromCache(cacheKey: string) {
  const cachedItem = frameworkCache.get(cacheKey);

  if (cachedItem) {
    // Check if cache has expired
    if (Date.now() - cachedItem.timestamp < CACHE_EXPIRATION) {
      console.log("Framework cache hit for:", cacheKey);
      return cachedItem.framework;
    } else {
      // Remove expired cache entry
      frameworkCache.delete(cacheKey);
    }
  }

  return null;
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

    // Create a cache key based on common parameters
    const cacheKey = `${industry}|${jobFunction}|${roleLevel}|${numberOfCompetencies}|${numberOfLevels}`;

    // Check if we have a cached framework for these parameters
    const cachedFramework = getFrameworkFromCache(cacheKey);
    if (cachedFramework) {
      return NextResponse.json({ framework: cachedFramework });
    }

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
    
    IMPORTANT: Return ONLY the JSON object without any markdown formatting or explanation.
    `;

    // Use Gemini 2.0 Flash as primary LLM
    let competencyFramework;
    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4000,
          responseMimeType: "application/json",
        },
      });

      // Generate content with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout

      try {
        // Generate content
        const result = await model.generateContent(prompt);
        clearTimeout(timeoutId);

        const response = await result.response;
        const text = response.text();

        try {
          competencyFramework = JSON.parse(text);
        } catch (parseError) {
          console.error("Error parsing Gemini response:", parseError);
          console.log("Raw Gemini response:", text);
          throw new Error("Failed to parse Gemini response");
        }
      } catch (genError) {
        clearTimeout(timeoutId);
        throw genError;
      }
    } catch (error) {
      console.error("Gemini API error:", error);

      // Fallback to Groq LLama model if Gemini fails
      try {
        // Set up abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 30000); // 30 second timeout

        try {
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert in competency framework development and talent management. You must return only valid JSON without any markdown formatting or explanation.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            model: "llama-3.2-3b-preview",
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" },
          });
          clearTimeout(timeoutId);

          const content = completion.choices[0].message.content;
          if (content) {
            try {
              competencyFramework = JSON.parse(content);
            } catch (parseError) {
              console.error("Error parsing Groq response:", parseError);
              console.log("Raw Groq response:", content);
              return NextResponse.json(
                {
                  error:
                    "Failed to parse competency framework from Groq response",
                },
                { status: 500 }
              );
            }
          } else {
            throw new Error("Empty response from Groq");
          }
        } catch (groqError) {
          clearTimeout(timeoutId);
          throw groqError;
        }
      } catch (fallbackError) {
        console.error("Fallback LLM error:", fallbackError);
        return NextResponse.json(
          { error: "Failed to generate competency framework" },
          { status: 500 }
        );
      }
    }

    // Cache the generated framework for future requests
    frameworkCache.set(cacheKey, {
      framework: competencyFramework,
      timestamp: Date.now(),
    });

    return NextResponse.json({ framework: competencyFramework });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
