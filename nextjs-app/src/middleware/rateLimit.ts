import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Key prefix for rate limiting to avoid collisions with other applications
const KEY_PREFIX = "synthalyst:ratelimit:";

// Initialize Redis client if UPSTASH_REDIS_REST_URL is available
let redis: Redis | null = null;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    console.warn("Failed to initialize Redis client:", error);
    console.warn("Rate limiting will be disabled");
    redis = null;
  }
} else {
  console.warn(
    "Redis configuration not found. Rate limiting will be disabled."
  );
}

// Default rate limit settings
const DEFAULT_RATE_LIMIT_MAX = 20; // Maximum requests per window
const DEFAULT_RATE_LIMIT_WINDOW = 60; // Window size in seconds

interface RateLimitOptions {
  max?: number; // Maximum requests per window
  windowInSeconds?: number; // Window size in seconds
}

/**
 * Rate limiting middleware for API routes
 * @param req The incoming request
 * @param options Rate limit options
 * @returns NextResponse or null if rate limit not exceeded
 */
export async function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): Promise<NextResponse | null> {
  // If Redis is not available, skip rate limiting
  if (!redis) {
    console.warn("Redis not configured. Rate limiting disabled.");
    return null;
  }

  const max = options.max || DEFAULT_RATE_LIMIT_MAX;
  const windowInSeconds = options.windowInSeconds || DEFAULT_RATE_LIMIT_WINDOW;

  // Get IP address from request headers or forwarded header
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  // Create a unique key for this IP and route with prefix
  const key = `${KEY_PREFIX}${ip}:${req.nextUrl.pathname}`;

  // Get current count for this IP
  const currentCount = await redis.get<number>(key);

  // If no current count, set to 1 with expiry
  if (currentCount === null) {
    await redis.set(key, 1, { ex: windowInSeconds });
    return null;
  }

  // If under limit, increment
  if (currentCount < max) {
    await redis.incr(key);
    return null;
  }

  // Rate limit exceeded
  return NextResponse.json(
    { error: "Too many requests, please try again later." },
    { status: 429 }
  );
}
