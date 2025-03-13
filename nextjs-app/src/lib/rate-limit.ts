import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { redisMonitor } from "./redis-monitor";

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Enhanced rate limiting with monitoring and error tracking
export const rateLimit = {
  async check(request: NextRequest, limit: number, windowInSeconds: number) {
    try {
      // Get IP address from request - use headers instead of request.ip
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      const endpoint = new URL(request.url).pathname;

      // Create a new ratelimiter for this specific limit/window
      const customLimiter = new Ratelimit({
        redis,
        // @ts-expect-error - { seconds: number } is not assignable to Duration but works at runtime
        limiter: Ratelimit.slidingWindow(limit, { seconds: windowInSeconds }),
        analytics: true,
        prefix: `rate_limit_${endpoint}`,
      });

      // Track rate limit attempt in our monitoring
      await redisMonitor.trackRateLimit(ip, endpoint);

      // Check if request is allowed
      const {
        success,
        limit: rateLimitInfo,
        reset,
        remaining,
      } = await customLimiter.limit(`${ip}:${endpoint}`);

      // If rate limit exceeded, return 429 response
      if (!success) {
        return NextResponse.json(
          {
            error: "Too many requests",
            limit: rateLimitInfo,
            remaining,
            reset: new Date(reset).toISOString(),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": rateLimitInfo.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }

      // Request is allowed, return null
      return null;
    } catch (error) {
      console.error("Rate limit error:", error);
      redisMonitor.trackError("rate_limit", error);
      return null; // Don't block requests if rate limiting fails
    }
  },

  // Additional methods for analytics and management
  async getAnalytics(endpoint?: string) {
    try {
      const keys = endpoint
        ? [`rate_limit_${endpoint}:analytics`]
        : await redis.keys("rate_limit_*:analytics");

      const results = await Promise.all(
        keys.map(async (key) => {
          const data = await redis.get(key);
          return {
            endpoint: key.replace("rate_limit_", "").replace(":analytics", ""),
            data,
          };
        })
      );

      return results;
    } catch (error) {
      console.error("Error getting rate limit analytics:", error);
      redisMonitor.trackError("get_rate_limit_analytics", error);
      return [];
    }
  },

  async reset(endpoint?: string) {
    try {
      if (endpoint) {
        await redis.del(`rate_limit_${endpoint}:analytics`);
      } else {
        const keys = await redis.keys("rate_limit_*:analytics");
        for (const key of keys) {
          await redis.del(key);
        }
      }
      return true;
    } catch (error) {
      console.error("Error resetting rate limits:", error);
      redisMonitor.trackError("reset_rate_limits", error);
      return false;
    }
  },
};
