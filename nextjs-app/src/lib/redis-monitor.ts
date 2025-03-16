import { Redis } from "@upstash/redis";

interface RedisMetrics {
  rateLimitHits: number;
  cacheHits: number;
  cacheMisses: number;
  errors: Array<{
    timestamp: string;
    operation: string;
    error: string;
  }>;
}

class RedisMonitor {
  private redis: Redis;
  private metrics: RedisMetrics = {
    rateLimitHits: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errors: [],
  };

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  // Track rate limit hits
  async trackRateLimit(ip: string, endpoint: string) {
    try {
      await this.redis.hincrby("rate_limit_metrics", `${endpoint}:${ip}`, 1);
      this.metrics.rateLimitHits++;
    } catch (error) {
      this.trackError("trackRateLimit", error);
    }
  }

  // Track cache operations
  async trackCache(key: string, hit: boolean) {
    try {
      if (hit) {
        await this.redis.hincrby("cache_metrics", "hits", 1);
        this.metrics.cacheHits++;
      } else {
        await this.redis.hincrby("cache_metrics", "misses", 1);
        this.metrics.cacheMisses++;
      }
    } catch (error) {
      this.trackError("trackCache", error);
    }
  }

  // Track errors
  trackError(operation: string, error: unknown) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      operation,
      error: error instanceof Error ? error.message : String(error),
    };

    this.metrics.errors.push(errorEntry);

    // Store error in Redis for persistence
    this.redis
      .lpush("redis_errors", JSON.stringify(errorEntry))
      .catch(console.error);
  }

  // Get current metrics
  async getMetrics(): Promise<RedisMetrics> {
    try {
      const [rateMetrics, cacheMetrics, errors] = await Promise.all([
        this.redis.hgetall("rate_limit_metrics"),
        this.redis.hgetall("cache_metrics"),
        this.redis.lrange("redis_errors", 0, 99), // Get last 100 errors
      ]);

      // Safely parse error JSON
      const parsedErrors = errors.map((e) => {
        try {
          // Check if e is already an object
          if (typeof e === "object" && e !== null) {
            return e;
          }
          // Otherwise, parse it as JSON
          return JSON.parse(e);
        } catch (parseError) {
          console.error("Error parsing Redis error entry:", parseError);
          return {
            timestamp: new Date().toISOString(),
            operation: "unknown",
            error: "Error parsing error entry",
          };
        }
      });

      return {
        rateLimitHits: calculateRateLimitHits(rateMetrics || {}),
        cacheHits: Number(cacheMetrics?.hits || 0),
        cacheMisses: Number(cacheMetrics?.misses || 0),
        errors: parsedErrors,
      };
    } catch (error) {
      console.error("Error fetching Redis metrics:", error);
      return this.metrics;
    }
  }

  // Reset metrics (for maintenance)
  async resetMetrics() {
    try {
      await Promise.all([
        this.redis.del("rate_limit_metrics"),
        this.redis.del("cache_metrics"),
        this.redis.del("redis_errors"),
      ]);
      this.metrics = {
        rateLimitHits: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: [],
      };
    } catch (error) {
      this.trackError("resetMetrics", error);
    }
  }
}

// Helper function to calculate rate limit hits with proper typing
function calculateRateLimitHits(metrics: Record<string, unknown>): number {
  let total = 0;
  for (const value of Object.values(metrics)) {
    if (typeof value === "string") {
      total += Number(value);
    }
  }
  return total;
}

export const redisMonitor = new RedisMonitor();
