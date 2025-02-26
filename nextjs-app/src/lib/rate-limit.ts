interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const WINDOW_SIZE = parseInt(process.env.RATE_LIMIT_WINDOW_SIZE || "60000", 10); // Default: 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "60", 10); // Default: 60 requests per minute

const rateLimitStore = new Map<string, RateLimitInfo>();

export async function rateLimit(
  identifier: string
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const info = rateLimitStore.get(identifier);

  // Clean up old entries
  if (info && now > info.resetTime) {
    rateLimitStore.delete(identifier);
  }

  // If no existing record, create new one
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_SIZE,
    });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  // Update existing record
  const currentInfo = rateLimitStore.get(identifier)!;
  if (currentInfo.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  currentInfo.count += 1;
  rateLimitStore.set(identifier, currentInfo);

  return {
    success: true,
    remaining: MAX_REQUESTS - currentInfo.count,
  };
}
