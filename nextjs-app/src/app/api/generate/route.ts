import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContentV2 } from "@/lib/ai/model-router";

// Interface for search results
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      question,
      language = "English",
      type = "knowledge",
      useWebSearch = false,
    } = await req.json();

    console.log(
      `API Request - Type: ${type}, Language: ${language}, Question: ${question}, Web Search: ${useWebSearch}`
    );

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // For knowledge questions, try to get web search results first
    let searchResults: SearchResult[] = [];
    let searchError = null;

    // Check if user is authenticated for web search
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;

    if (type === "knowledge" && useWebSearch) {
      // Only allow web search for authenticated users
      if (!isAuthenticated) {
        console.log("Web search requested but user is not authenticated");
        return NextResponse.json(
          { error: "You must be logged in to use web search" },
          { status: 401 }
        );
      }

      try {
        // Call the web search API
        const searchResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web-search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: question }),
          }
        );

        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
          searchResults = searchData.results;
          console.log(
            `Found ${searchResults.length} search results for question`
          );
        } else if (searchData.error) {
          searchError = searchData.error;
          console.warn(`Search error: ${searchError}`);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else if (type === "knowledge" && !useWebSearch) {
      console.log("Web search disabled by user");
    }

    // Create a system prompt based on the type and language
    let systemPrompt = "";

    if (type === "knowledge") {
      // Updated prompt to ensure current information is provided
      systemPrompt = `You are a helpful assistant providing accurate and up-to-date information. 
      
Important: Always provide the most current information available. For example, as of 2025, Donald Trump is the President of the United States (having won the 2024 election).

${
  useWebSearch
    ? "The user has enabled web search for this question."
    : "The user has disabled web search for this question. Use only your built-in knowledge to answer."
}

FORMATTING INSTRUCTIONS:
- Do NOT use markdown formatting with asterisks (**) for bold text
- Use proper numbered lists (1., 2., 3.) instead of asterisks for numbered points
- Use proper bullet points (•) for bullet lists instead of asterisks
- Format your response with clean paragraphs and proper spacing
`;

      // Add search results to the prompt if available
      if (searchResults.length > 0) {
        systemPrompt += `\nI've found some recent information that might help answer the question. Please use this information if relevant:

${searchResults
  .map(
    (result, index) => `[${index + 1}] "${result.title}" (${result.source})
${result.snippet}
URL: ${result.link}`
  )
  .join("\n\n")}

Based on the above information and your knowledge, please provide accurate information about ${question}.`;
      } else {
        systemPrompt += `\nPlease provide accurate information about ${question}.`;
      }

      // Add language instruction if not English
      if (language !== "English") {
        systemPrompt += ` Please respond in ${language}.`;
      }
    } else if (type === "learning") {
      // Simple, clear prompt that's less likely to trigger content filters
      systemPrompt = `You are a helpful assistant. Create educational content about ${question}.`;

      // Add language instruction if not English
      if (language !== "English") {
        systemPrompt += ` Please create the content in ${language}.`;
      }
    }

    try {
      // Generate content using the appropriate model based on type
      const content = await generateContentV2({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        type,
        language,
      });

      return NextResponse.json({ content });
    } catch (error) {
      console.error("Error generating content:", error);

      // Provide a more helpful error message to the client
      if (error instanceof Error) {
        if (error.message.includes("moderation")) {
          return NextResponse.json(
            {
              content:
                "I'm unable to provide a response to this question due to content moderation. Please try rephrasing your question in a different way.",
            },
            { status: 200 } // Return 200 with error message in content
          );
        } else if (error.message.includes("API key")) {
          // Don't expose API key errors to the client
          console.error("API key error:", error);
          return NextResponse.json(
            {
              content:
                "I'm sorry, I encountered an error while generating a response. Please try again later.",
            },
            { status: 200 } // Return 200 with generic error message
          );
        }
      }

      // For other errors, return a generic error
      return NextResponse.json(
        {
          content:
            "I'm sorry, I encountered an error while generating a response. Please try again with a different question.",
        },
        { status: 200 } // Return 200 with error message in content
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again later.",
      },
      { status: 200 } // Return 200 with error message in content
    );
  }
}
