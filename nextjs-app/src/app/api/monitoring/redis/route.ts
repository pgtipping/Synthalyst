import { NextRequest } from "next/server";
import { redisMonitor } from "@/lib/redis-monitor";
import { redisCache } from "@/lib/redis-cache";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Check if Redis connection is available
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return new Response(
        JSON.stringify({
          error: "Redis configuration missing",
          message: "Redis connection details are not properly configured",
          timestamp: new Date().toISOString(),
          metrics: {
            rateLimitHits: 0,
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: "0%",
            errors: [],
          },
          cache: {
            totalKeys: 0,
            totalSize: 0,
            keysByPattern: {},
            hitRate: "0%",
          },
          rateLimiting: {
            analytics: {},
            currentLimits: {
              success: true,
              limit: 0,
              remaining: 0,
              reset: new Date().toISOString(),
            },
          },
          status: {
            healthy: false,
            lastError: new Date().toISOString(),
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Check if request is authorized (you should implement proper auth check)
    const authHeader = req.headers.get("authorization");
    // Make authorization optional for development
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev && !authHeader && !authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Apply rate limiting - 10 requests per minute
    const limiter = await rateLimit.check(req, 10, 60); // 60 seconds = 1 minute
    if (limiter) {
      return limiter;
    }

    // Get metrics from different sources
    const [metrics, cacheStats, rateAnalytics] = await Promise.all([
      redisMonitor.getMetrics(),
      redisCache.getStats(),
      rateLimit.getAnalytics(),
    ]);

    // Calculate cache hit rate
    const hitRate =
      metrics.cacheHits + metrics.cacheMisses > 0
        ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100
        : 0;

    // Compile comprehensive monitoring data
    const monitoringData = {
      timestamp: new Date().toISOString(),
      metrics: {
        ...metrics,
        cacheHitRate: hitRate.toFixed(2) + "%",
      },
      cache: {
        ...cacheStats,
        hitRate: hitRate.toFixed(2) + "%",
      },
      rateLimiting: {
        analytics: rateAnalytics,
        currentLimits: limiter,
      },
      status: {
        healthy: true,
        lastError: metrics.errors[0]?.timestamp || null,
      },
    };

    return new Response(JSON.stringify(monitoringData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    // Track monitoring error
    try {
      redisMonitor.trackError("monitoring.redis", error);
    } catch (trackError) {
      console.error("Failed to track error:", trackError);
    }

    console.error("Redis monitoring error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch monitoring data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        metrics: {
          rateLimitHits: 0,
          cacheHits: 0,
          cacheMisses: 0,
          cacheHitRate: "0%",
          errors: [],
        },
        cache: {
          totalKeys: 0,
          totalSize: 0,
          keysByPattern: {},
          hitRate: "0%",
        },
        rateLimiting: {
          analytics: {},
          currentLimits: {
            success: true,
            limit: 0,
            remaining: 0,
            reset: new Date().toISOString(),
          },
        },
        status: {
          healthy: false,
          lastError: new Date().toISOString(),
        },
      }),
      {
        status: 200, // Return 200 instead of 500 to prevent UI errors
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Reset metrics endpoint (protected)
export async function POST(req: NextRequest) {
  try {
    // Check if Redis connection is available
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return new Response(
        JSON.stringify({
          error: "Redis configuration missing",
          message: "Redis connection details are not properly configured",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if request is authorized (you should implement proper auth check)
    const authHeader = req.headers.get("authorization");
    // Make authorization optional for development
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev && !authHeader && !authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Apply strict rate limiting
    try {
      const limiter = await rateLimit.check(req, 5, 3600); // 5 requests per hour
      if (limiter) {
        return limiter;
      }
    } catch (error) {
      console.error("Rate limiting error:", error);
      // Continue even if rate limiting fails
    }

    let action = "reset_metrics";
    try {
      const body = await req.json();
      action = body.action || "reset_metrics";
    } catch (error) {
      // Default to reset_metrics if JSON parsing fails
    }

    switch (action) {
      case "reset_metrics":
        await redisMonitor.resetMetrics();
        break;
      case "reset_cache":
        await redisCache.clearPrefix("llm_responses");
        break;
      case "reset_rate_limits":
        await rateLimit.reset();
        break;
      default:
        return new Response("Invalid action", { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    try {
      redisMonitor.trackError("monitoring.redis.reset", error);
    } catch (trackError) {
      console.error("Failed to track error:", trackError);
    }

    console.error("Redis reset error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reset metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 200, // Return 200 instead of 500 to prevent UI errors
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
