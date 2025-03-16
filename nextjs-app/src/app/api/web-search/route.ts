import { NextRequest, NextResponse } from "next/server";

// Define the search result interface
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    console.log(`Web Search API - Query: ${query}`);

    // Check if API keys are available
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.error("Google Search API keys not configured");
      return NextResponse.json(
        {
          results: [],
          error: "Search functionality is not available at this time",
        },
        { status: 200 } // Return 200 with empty results to not break the client
      );
    }

    // Build the Google Custom Search API URL
    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.append("key", apiKey);
    url.searchParams.append("cx", searchEngineId);
    url.searchParams.append("q", query);
    url.searchParams.append("num", "5"); // Number of results to return

    // Make the request to Google Custom Search API
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error("Google Search API error:", data);
      return NextResponse.json(
        {
          results: [],
          error: "Failed to fetch search results",
        },
        { status: 200 } // Return 200 with empty results to not break the client
      );
    }

    // Extract and format the search results
    const results: SearchResult[] =
      data.items?.map(
        (item: { title: string; link: string; snippet: string }) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          source: new URL(item.link).hostname,
        })
      ) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error processing web search request:", error);
    return NextResponse.json(
      {
        results: [],
        error: "Failed to process search request",
      },
      { status: 200 } // Return 200 with empty results to not break the client
    );
  }
}
