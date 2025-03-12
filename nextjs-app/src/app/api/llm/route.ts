import { NextRequest } from "next/server";
import { streamGeminiResponse, getCachedGeminiResponse } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";
import { redisCache } from "@/lib/redis-cache";
import { redisMonitor } from "@/lib/redis-monitor";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit.check(req, 60, "1h"); // 60 requests per hour

    if (!limiter.success) {
      return new Response("Too Many Requests", { status: 429 });
    }

    const { prompt, options = {} } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const {
      stream = false,
      bypassCache = false,
      timeout = 30000,
      maxRetries = 3,
    } = options;

    // Generate cache key from prompt and options
    const cacheKey = `llm:${Buffer.from(prompt).toString("base64")}:${stream}`;

    if (stream) {
      // For streaming responses, we don't use cache
      const response = await streamGeminiResponse(prompt, {
        timeout,
        maxRetries,
      });

      // Track the streaming request
      await redisMonitor.trackCache(cacheKey, false);

      return new Response(response.stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // For non-streaming responses, use enhanced caching
      const response = await redisCache.getOrSet(
        cacheKey,
        async () => {
          const result = await getCachedGeminiResponse(prompt, {
            bypassCache: true, // Always get fresh data when cache miss
            timeout,
            maxRetries,
          });
          return result;
        },
        {
          ttl: 3600, // 1 hour cache
          prefix: "llm_responses",
          bypassCache,
        }
      );

      if (!response) {
        throw new Error("Failed to generate response");
      }

      return new Response(JSON.stringify({ response }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": bypassCache ? "no-store" : "s-maxage=3600",
        },
      });
    }
  } catch (error) {
    // Track the error
    redisMonitor.trackError("llm.route", error);

    console.error("LLM API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
