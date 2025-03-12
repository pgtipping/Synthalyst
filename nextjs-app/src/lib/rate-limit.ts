import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { redisMonitor } from "./redis-monitor";

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create default ratelimiter instance
const defaultLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
  prefix: "rate_limit",
});

// Enhanced rate limiting with monitoring and error tracking
export const rateLimit = {
  async check(request: NextRequest, limit: number, window: string) {
    try {
      // Get IP address from request
      const ip = request.ip ?? "127.0.0.1";
      const endpoint = new URL(request.url).pathname;

      // Create a new ratelimiter for this specific limit/window
      const customLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, window),
        analytics: true,
        prefix: `rate_limit_${endpoint}`,
      });

      // Limit by IP
      const result = await customLimiter.limit(`${endpoint}_${ip}`);

      // Track rate limit attempt
      await redisMonitor.trackRateLimit(ip, endpoint);

      // Enhanced response with more details
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
        endpoint,
        ip: ip.replace(/(?:^|\.)\d+/g, (m) => m.replace(/\d/g, "*")), // Mask IP for privacy
      };
    } catch (error) {
      // Track error
      redisMonitor.trackError("rateLimit.check", error);

      console.error("Rate limit check failed:", error);
      // If rate limiting fails, allow the request but with limited remaining
      return {
        success: true,
        limit: limit,
        remaining: 1, // Set to 1 to indicate limited availability
        reset: new Date(Date.now() + 3600000).toISOString(),
        endpoint: new URL(request.url).pathname,
        error: "Rate limiting temporarily unavailable",
      };
    }
  },

  // Get rate limit analytics
  async getAnalytics(endpoint?: string) {
    try {
      const analytics = await redis.hgetall(
        endpoint ? `rate_limit_${endpoint}:analytics` : "rate_limit:analytics"
      );
      return analytics;
    } catch (error) {
      redisMonitor.trackError("rateLimit.getAnalytics", error);
      return null;
    }
  },

  // Reset rate limits for testing/maintenance
  async reset(endpoint?: string) {
    try {
      if (endpoint) {
        await redis.del(`rate_limit_${endpoint}:analytics`);
      } else {
        await redis.del("rate_limit:analytics");
      }
      return true;
    } catch (error) {
      redisMonitor.trackError("rateLimit.reset", error);
      return false;
    }
  },
};
