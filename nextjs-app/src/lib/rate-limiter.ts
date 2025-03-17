import { LRUCache } from "lru-cache";

type Options = {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number;
};

/**
 * Rate limiting utility using LRU cache
 * @param options Configuration options
 * @returns Rate limiter object
 */
export function rateLimit(options: Options) {
  // Create a new LRUCache instance with the updated constructor pattern for v10+
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    /**
     * Check if the token has exceeded the rate limit
     * @param limit Maximum number of requests allowed in the interval
     * @param token Unique identifier for the client (e.g., IP address)
     */
    check: (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const timestamps = tokenCache.get(token) || [];
      const newTimestamps = [
        ...timestamps.filter((ts: number) => now - ts < options.interval),
        now,
      ];

      tokenCache.set(token, newTimestamps);

      if (newTimestamps.length > limit) {
        return Promise.reject(new Error("Rate limit exceeded"));
      }

      return Promise.resolve();
    },
  };
}
