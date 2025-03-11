import { Redis } from "@upstash/redis";

// Key prefix for caching to avoid collisions with other applications
const KEY_PREFIX = "synthalyst:cache:";

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
    console.warn("Caching will be disabled");
    redis = null;
  }
} else {
  console.warn("Redis configuration not found. Caching will be disabled.");
}

// Default cache expiry time in seconds
const DEFAULT_CACHE_EXPIRY = 60 * 5; // 5 minutes

interface CacheOptions {
  expiryInSeconds?: number;
}

/**
 * Get data from cache
 * @param key Cache key
 * @returns Cached data or null if not found
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    // Add prefix to key
    const prefixedKey = `${KEY_PREFIX}${key}`;
    return await redis.get<T>(prefixedKey);
  } catch (error) {
    console.error("Error getting data from cache:", error);
    return null;
  }
}

/**
 * Set data in cache
 * @param key Cache key
 * @param data Data to cache
 * @param options Cache options
 * @returns Boolean indicating success
 */
export async function setInCache<T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): Promise<boolean> {
  if (!redis) {
    return false;
  }

  const expiryInSeconds = options.expiryInSeconds || DEFAULT_CACHE_EXPIRY;

  try {
    // Add prefix to key
    const prefixedKey = `${KEY_PREFIX}${key}`;
    await redis.set(prefixedKey, data, { ex: expiryInSeconds });
    return true;
  } catch (error) {
    console.error("Error setting data in cache:", error);
    return false;
  }
}

/**
 * Delete data from cache
 * @param key Cache key
 * @returns Boolean indicating success
 */
export async function deleteFromCache(key: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    // Add prefix to key
    const prefixedKey = `${KEY_PREFIX}${key}`;
    await redis.del(prefixedKey);
    return true;
  } catch (error) {
    console.error("Error deleting data from cache:", error);
    return false;
  }
}

/**
 * Clear cache keys matching a pattern
 * @param pattern Pattern to match (e.g., "newsletter:*")
 * @returns Boolean indicating success
 */
export async function clearCachePattern(pattern: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    // Add prefix to pattern
    const prefixedPattern = `${KEY_PREFIX}${pattern}`;
    const keys = await redis.keys(prefixedPattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key: string) => redis!.del(key)));
    }
    return true;
  } catch (error) {
    console.error("Error clearing cache pattern:", error);
    return false;
  }
}
