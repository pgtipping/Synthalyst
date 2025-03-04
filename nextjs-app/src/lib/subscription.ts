import { prisma } from "@/lib/prisma";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
      // Check if subscription hasn't expired
      OR: [
        { endDate: null }, // Ongoing subscription
        { endDate: { gt: new Date() } }, // Not expired
      ],
    },
  });

  return !!subscription;
}

/**
 * Subscription utility functions for checking user subscription status
 */
export const subscription = {
  /**
   * Check if a user has premium access
   * @param email User email
   * @returns Boolean indicating if the user has premium access
   */
  async isPremium(email: string): Promise<boolean> {
    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          subscriptions: {
            where: {
              status: "active",
              OR: [
                { endDate: null }, // Ongoing subscription
                { endDate: { gt: new Date() } }, // Not expired
              ],
            },
            select: {
              type: true,
              endDate: true,
            },
          },
        },
      });

      // If user doesn't exist, they don't have premium access
      if (!user) return false;

      // Check if user has an active premium subscription
      const activeSubscription = user.subscriptions[0];
      if (activeSubscription && activeSubscription.type === "premium") {
        return true;
      }

      // Default to false for free tier or expired subscriptions
      return false;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      // Default to false on error
      return false;
    }
  },

  /**
   * Get the user's subscription tier
   * @param email User email
   * @returns Subscription tier string or null if user not found
   */
  async getTier(email: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          subscriptions: {
            where: {
              status: "active",
              OR: [
                { endDate: null }, // Ongoing subscription
                { endDate: { gt: new Date() } }, // Not expired
              ],
            },
            select: {
              type: true,
            },
          },
        },
      });

      if (!user || user.subscriptions.length === 0) {
        return "free";
      }

      return user.subscriptions[0].type;
    } catch (error) {
      console.error("Error getting subscription tier:", error);
      return null;
    }
  },
};
