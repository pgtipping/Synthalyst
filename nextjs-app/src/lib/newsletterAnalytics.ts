import { prisma } from "@/lib/prisma";
import { getFromCache, setInCache } from "@/lib/cache";

// Cache keys - no need to add prefix here as it's handled by the cache utility
const NEWSLETTER_ANALYTICS_KEY = "newsletter:analytics:";
const CACHE_EXPIRY = 60 * 15; // 15 minutes

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
  other: number;
}

interface LocationStats {
  [country: string]: number;
}

interface TimeStats {
  morning: number; // 6am-12pm
  afternoon: number; // 12pm-6pm
  evening: number; // 6pm-12am
  night: number; // 12am-6am
}

interface LinkClickStats {
  [url: string]: number;
}

export interface NewsletterAnalytics {
  id: string;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  bounces: number;
  unsubscribes: number;
  deviceStats: DeviceStats;
  locationStats: LocationStats;
  timeStats: TimeStats;
  linkClicks: LinkClickStats;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

/**
 * Track a newsletter open event
 * @param newsletterId The ID of the newsletter
 * @param subscriberId The ID of the subscriber
 * @param userAgent The user agent string
 * @param ipAddress The IP address
 */
export async function trackNewsletterOpen(
  newsletterId: string,
  subscriberId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  try {
    // Record the open event
    await prisma.newsletterOpenEvent.create({
      data: {
        newsletterId,
        subscriberId,
        userAgent: userAgent || "Unknown",
        ipAddress: ipAddress || "Unknown",
      },
    });

    // Update the newsletter opens count
    await prisma.newsletterSend.update({
      where: { id: newsletterId },
      data: {
        opens: { increment: 1 },
      },
    });

    // Clear analytics cache for this newsletter
    await clearAnalyticsCache(newsletterId);
  } catch (error) {
    console.error("Error tracking newsletter open:", error);
  }
}

/**
 * Track a newsletter click event
 * @param newsletterId The ID of the newsletter
 * @param subscriberId The ID of the subscriber
 * @param url The clicked URL
 * @param userAgent The user agent string
 * @param ipAddress The IP address
 */
export async function trackNewsletterClick(
  newsletterId: string,
  subscriberId: string,
  url: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  try {
    // Record the click event
    await prisma.newsletterClickEvent.create({
      data: {
        newsletterId,
        subscriberId,
        url,
        userAgent: userAgent || "Unknown",
        ipAddress: ipAddress || "Unknown",
      },
    });

    // Update the newsletter clicks count
    await prisma.newsletterSend.update({
      where: { id: newsletterId },
      data: {
        clicks: { increment: 1 },
      },
    });

    // Clear analytics cache for this newsletter
    await clearAnalyticsCache(newsletterId);
  } catch (error) {
    console.error("Error tracking newsletter click:", error);
  }
}

/**
 * Track a newsletter bounce event
 * @param newsletterId The ID of the newsletter
 * @param subscriberId The ID of the subscriber
 * @param reason The bounce reason
 */
export async function trackNewsletterBounce(
  newsletterId: string,
  subscriberId: string,
  reason: string
): Promise<void> {
  try {
    // Record the bounce event
    await prisma.newsletterBounceEvent.create({
      data: {
        newsletterId,
        subscriberId,
        reason,
      },
    });

    // Update the newsletter bounces count
    await prisma.newsletterSend.update({
      where: { id: newsletterId },
      data: {
        bounces: { increment: 1 },
      },
    });

    // Update subscriber status
    await prisma.newsletterSubscriber.update({
      where: { id: subscriberId },
      data: {
        status: "bounced",
      },
    });

    // Clear analytics cache for this newsletter
    await clearAnalyticsCache(newsletterId);
  } catch (error) {
    console.error("Error tracking newsletter bounce:", error);
  }
}

/**
 * Track a newsletter unsubscribe event
 * @param newsletterId The ID of the newsletter
 * @param subscriberId The ID of the subscriber
 * @param reason The unsubscribe reason
 */
export async function trackNewsletterUnsubscribe(
  newsletterId: string,
  subscriberId: string
): Promise<void> {
  try {
    // Get subscriber email
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      console.error(`Subscriber not found: ${subscriberId}`);
      return;
    }

    // Record unsubscribe event
    try {
      await prisma.newsletterUnsubscribeEvent.create({
        data: {
          subscriber: { connect: { id: subscriberId } },
          send: newsletterId ? { connect: { id: newsletterId } } : undefined,
        },
      });
    } catch (error) {
      console.error("Error tracking newsletter unsubscribe:", error);
    }

    // Update the newsletter unsubscribes count
    await prisma.newsletterSend.update({
      where: { id: newsletterId },
      data: {
        unsubscribes: { increment: 1 },
      },
    });

    // Update subscriber status
    await prisma.newsletterSubscriber.update({
      where: { id: subscriberId },
      data: {
        status: "unsubscribed",
        unsubscribed: true,
        unsubscribedAt: new Date(),
      },
    });

    // Clear analytics cache for this newsletter
    await clearAnalyticsCache(newsletterId);
  } catch (error) {
    console.error("Error tracking newsletter unsubscribe:", error);
  }
}

/**
 * Get analytics for a newsletter
 * @param newsletterId The ID of the newsletter
 * @returns The newsletter analytics
 */
export async function getNewsletterAnalytics(
  newsletterId: string
): Promise<NewsletterAnalytics | null> {
  try {
    // Try to get from cache first - cache utility will add the prefix
    const cacheKey = `${NEWSLETTER_ANALYTICS_KEY}${newsletterId}`;
    const cachedAnalytics = await getFromCache<NewsletterAnalytics>(cacheKey);

    if (cachedAnalytics) {
      return cachedAnalytics;
    }

    // Get the newsletter
    const newsletter = await prisma.newsletterSend.findUnique({
      where: { id: newsletterId },
      select: {
        id: true,
        recipientCount: true,
        opens: true,
        clicks: true,
        bounces: true,
        unsubscribes: true,
      },
    });

    if (!newsletter) {
      return null;
    }

    // Get unique opens
    const uniqueOpens = await prisma.newsletterOpenEvent.groupBy({
      by: ["subscriberId"],
      where: { newsletterId },
      _count: true,
    });

    // Get unique clicks
    const uniqueClicks = await prisma.newsletterClickEvent.groupBy({
      by: ["subscriberId"],
      where: { newsletterId },
      _count: true,
    });

    // Get link clicks
    const linkClicks = await prisma.newsletterClickEvent.groupBy({
      by: ["url"],
      where: { newsletterId },
      _count: true,
    });

    // Calculate metrics
    const openRate =
      newsletter.recipientCount > 0
        ? (newsletter.opens / newsletter.recipientCount) * 100
        : 0;

    const clickRate =
      newsletter.recipientCount > 0
        ? (newsletter.clicks / newsletter.recipientCount) * 100
        : 0;

    const clickToOpenRate =
      newsletter.opens > 0 ? (newsletter.clicks / newsletter.opens) * 100 : 0;

    const bounceRate =
      newsletter.recipientCount > 0
        ? (newsletter.bounces / newsletter.recipientCount) * 100
        : 0;

    const unsubscribeRate =
      newsletter.recipientCount > 0
        ? (newsletter.unsubscribes / newsletter.recipientCount) * 100
        : 0;

    // Compile analytics
    const analytics: NewsletterAnalytics = {
      id: newsletter.id,
      opens: newsletter.opens,
      uniqueOpens: uniqueOpens.length,
      clicks: newsletter.clicks,
      uniqueClicks: uniqueClicks.length,
      bounces: newsletter.bounces,
      unsubscribes: newsletter.unsubscribes,
      deviceStats: {
        desktop: 0,
        mobile: 0,
        tablet: 0,
        other: 0,
      },
      locationStats: {},
      timeStats: {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      },
      linkClicks: linkClicks.reduce((acc, curr) => {
        acc[curr.url] = curr._count;
        return acc;
      }, {} as LinkClickStats),
      openRate,
      clickRate,
      clickToOpenRate,
      bounceRate,
      unsubscribeRate,
    };

    // Cache the analytics - cache utility will add the prefix
    await setInCache(cacheKey, analytics, { expiryInSeconds: CACHE_EXPIRY });

    return analytics;
  } catch (error) {
    console.error("Error getting newsletter analytics:", error);
    return null;
  }
}

/**
 * Clear the analytics cache for a newsletter
 * @param newsletterId The ID of the newsletter
 */
async function clearAnalyticsCache(newsletterId: string): Promise<void> {
  const cacheKey = `${NEWSLETTER_ANALYTICS_KEY}${newsletterId}`;
  await setInCache(cacheKey, null, { expiryInSeconds: 1 });
}
