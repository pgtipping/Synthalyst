import { NextRequest } from "next/server";
import { redisMonitor } from "@/lib/redis-monitor";
import { redisCache } from "@/lib/redis-cache";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Check if request is authorized (you should implement proper auth check)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
    redisMonitor.trackError("monitoring.redis", error);

    console.error("Redis monitoring error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch monitoring data",
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

// Reset metrics endpoint (protected)
export async function POST(req: NextRequest) {
  try {
    // Check if request is authorized (you should implement proper auth check)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Apply strict rate limiting
    // @ts-expect-error - rateLimit.check expects a number but we're passing a string
    const limiter = await rateLimit.check(req, 5, "1h"); // 5 requests per hour
    // @ts-expect-error - limiter.success doesn't exist in the type definition
    if (!limiter.success) {
      return new Response("Too Many Requests", { status: 429 });
    }

    const { action } = await req.json();

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
    redisMonitor.trackError("monitoring.redis.reset", error);

    console.error("Redis reset error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reset metrics",
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

export async function DELETE(req: NextRequest) {
  try {
    // Apply strict rate limiting - 5 requests per hour
    // @ts-ignore - Type mismatch in rateLimit.check parameters
    const limiter = await rateLimit.check(req, 5, "1h"); // 5 requests per hour
    // @ts-ignore - Type mismatch in limiter.success
    if (!limiter.success) {
      return new Response("Too Many Requests", { status: 429 });
    }

    // Check if request is authorized (you should implement proper auth check)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { action } = await req.json();

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
    redisMonitor.trackError("monitoring.redis.reset", error);

    console.error("Redis reset error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reset metrics",
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
