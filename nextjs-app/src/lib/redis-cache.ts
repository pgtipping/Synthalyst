import { Redis } from "@upstash/redis";
import { redisMonitor } from "./redis-monitor";

interface CacheConfig {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  bypassCache?: boolean;
}

class RedisCache {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 hour default TTL
  private defaultPrefix: string = "cache";

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  private generateKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultPrefix}:${key}`;
  }

  async get<T>(key: string, config: CacheConfig = {}): Promise<T | null> {
    const { prefix, bypassCache } = config;
    const cacheKey = this.generateKey(key, prefix);

    if (bypassCache) {
      await redisMonitor.trackCache(cacheKey, false);
      return null;
    }

    try {
      const cachedData = await this.redis.get<T>(cacheKey);

      if (cachedData) {
        await redisMonitor.trackCache(cacheKey, true);
        return cachedData;
      }

      await redisMonitor.trackCache(cacheKey, false);
      return null;
    } catch (error) {
      redisMonitor.trackError("cache.get", error);
      return null;
    }
  }

  async set<T>(
    key: string,
    data: T,
    config: CacheConfig = {}
  ): Promise<boolean> {
    const { ttl = this.defaultTTL, prefix } = config;
    const cacheKey = this.generateKey(key, prefix);

    try {
      await this.redis.set(cacheKey, data, { ex: ttl });
      return true;
    } catch (error) {
      redisMonitor.trackError("cache.set", error);
      return false;
    }
  }

  async delete(key: string, prefix?: string): Promise<boolean> {
    const cacheKey = this.generateKey(key, prefix);

    try {
      await this.redis.del(cacheKey);
      return true;
    } catch (error) {
      redisMonitor.trackError("cache.delete", error);
      return false;
    }
  }

  async getOrSet<T>(
    key: string,
    fetchData: () => Promise<T>,
    config: CacheConfig = {}
  ): Promise<T | null> {
    const cachedData = await this.get<T>(key, config);

    if (cachedData !== null) {
      return cachedData;
    }

    try {
      const freshData = await fetchData();
      await this.set(key, freshData, config);
      return freshData;
    } catch (error) {
      redisMonitor.trackError("cache.getOrSet", error);
      return null;
    }
  }

  // Clear all cache entries with a specific prefix
  async clearPrefix(prefix: string): Promise<boolean> {
    try {
      const keys = await this.redis.keys(`${prefix}:*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      redisMonitor.trackError("cache.clearPrefix", error);
      return false;
    }
  }

  // Get cache statistics for a specific prefix
  async getStats(prefix: string = this.defaultPrefix): Promise<{
    totalKeys: number;
    totalSize: number;
    keysByPattern: Record<string, number>;
  }> {
    try {
      const keys = await this.redis.keys(`${prefix}:*`);
      const patterns: Record<string, number> = {};

      // Group keys by pattern
      keys.forEach((key) => {
        const pattern = key.split(":")[1] || "other";
        patterns[pattern] = (patterns[pattern] || 0) + 1;
      });

      return {
        totalKeys: keys.length,
        totalSize: await this.redis.dbsize(),
        keysByPattern: patterns,
      };
    } catch (error) {
      redisMonitor.trackError("cache.getStats", error);
      return {
        totalKeys: 0,
        totalSize: 0,
        keysByPattern: {},
      };
    }
  }
}

export const redisCache = new RedisCache();
