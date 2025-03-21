import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, AlertCircle, Users, Mail, Star } from "lucide-react";
import AdminDashboardWrapper from "@/components/admin/AdminDashboardWrapper";

export const metadata: Metadata = {
  title: "Admin Dashboard | Synthalyst",
  description: "Admin dashboard for Synthalyst",
};

export default async function AdminPage() {
  // Initialize default values
  let countsByStatus: Record<string, number> = {};
  let unresolvedCount = 0;
  let userCount = 0;
  let adminCount = 0;
  let subscriberStats = {
    total: 0,
    confirmed: 0,
    active: 0,
    unsubscribed: 0,
  };
  let feedbackStats = {
    totalApps: 0,
    totalFeedback: 0,
    averageRating: 0,
  };

  // Get counts of contact submissions by status
  try {
    // Check if ContactSubmission table exists
    const tableExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'ContactSubmission'
      );
    `;

    if (tableExists[0]?.exists) {
      const submissionCounts = await prisma.$queryRaw<
        { status: string; count: number }[]
      >`
        SELECT status, COUNT(*) as count
        FROM "ContactSubmission"
        GROUP BY status
      `;

      // Create a map of status to count
      countsByStatus = submissionCounts.reduce((acc, { status, count }) => {
        acc[status] = Number(count);
        return acc;
      }, {} as Record<string, number>);

      // Calculate total unresolved (new + in-progress)
      unresolvedCount =
        (countsByStatus["new"] || 0) + (countsByStatus["in-progress"] || 0);
    }
  } catch (error) {
    console.error("Error fetching contact submission stats:", error);
  }

  // Get count of users
  try {
    userCount = await prisma.user.count();
    adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
  }

  // Get newsletter subscriber counts
  try {
    // Check if newsletter table exists
    const newsletterTableExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Newsletter'
      );
    `;

    if (newsletterTableExists[0]?.exists) {
      // Use type assertion to work around the type error
      const prismaAny = prisma as unknown;
      const prismaWithNewsletter = prismaAny as {
        newsletter: {
          findMany: () => Promise<
            Array<{
              confirmed: boolean;
              active: boolean;
              unsubscribed: boolean;
            }>
          >;
        };
      };

      if (prismaWithNewsletter.newsletter) {
        const subscribers = await prismaWithNewsletter.newsletter.findMany();

        subscriberStats = {
          total: subscribers.length,
          confirmed: subscribers.filter(
            (s: { confirmed: boolean }) => s.confirmed
          ).length,
          active: subscribers.filter((s: { active: boolean }) => s.active)
            .length,
          unsubscribed: subscribers.filter(
            (s: { unsubscribed: boolean }) => s.unsubscribed
          ).length,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
  }

  // Get app feedback stats
  try {
    // Check if appFeedback table exists
    const feedbackTableExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'AppFeedback'
      );
    `;

    if (feedbackTableExists[0]?.exists) {
      // Use type assertion to work around the type error
      const prismaAny = prisma as unknown;
      const prismaWithFeedback = prismaAny as {
        appFeedback: {
          count: () => Promise<number>;
          groupBy: (args: { by: string[] }) => Promise<{ appName: string }[]>;
          aggregate: (args: {
            _avg: { rating: boolean };
          }) => Promise<{ _avg: { rating: number | null } }>;
        };
      };

      const feedbackCount = await prismaWithFeedback.appFeedback.count();
      const appsWithFeedback = await prismaWithFeedback.appFeedback.groupBy({
        by: ["appName"],
      });

      const averageRatingResult =
        await prismaWithFeedback.appFeedback.aggregate({
          _avg: {
            rating: true,
          },
        });

      feedbackStats = {
        totalApps: appsWithFeedback.length,
        totalFeedback: feedbackCount,
        averageRating: averageRatingResult._avg.rating || 0,
      };
    }
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
  }

  // Wrap the dashboard content with the AdminLayout component
  return (
    <AdminDashboardWrapper>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Contact Submissions Card */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Contact Submissions</h2>
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New</span>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {countsByStatus["new"] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  In Progress
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  {countsByStatus["in-progress"] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resolved</span>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {countsByStatus["resolved"] || 0}
                </span>
              </div>
            </div>

            {unresolvedCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  {unresolvedCount} unresolved{" "}
                  {unresolvedCount === 1 ? "submission" : "submissions"}
                </span>
              </div>
            )}

            <Link
              href="/admin/contact-submissions"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              View Submissions
            </Link>
          </div>

          {/* User Management Card */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Users
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {userCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Admins</span>
                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  {adminCount}
                </span>
              </div>
            </div>

            <Link
              href="/admin/users"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              Manage Users
            </Link>
          </div>

          {/* Newsletter Management Card */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Newsletter Management</h2>
              <Mail className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Subscribers
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {subscriberStats.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {subscriberStats.active}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Unsubscribed
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  {subscriberStats.unsubscribed}
                </span>
              </div>
            </div>

            <Link
              href="/admin/newsletter"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              Manage Newsletter
            </Link>
          </div>

          {/* App Feedback Card */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">App Feedback</h2>
              <Star className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Apps with Feedback
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {feedbackStats.totalApps}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Feedback
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {feedbackStats.totalFeedback}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Average Rating
                </span>
                <div className="flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  {feedbackStats.averageRating.toFixed(1)}
                  <Star className="h-3 w-3 ml-1 fill-yellow-800" />
                </div>
              </div>
            </div>

            <Link
              href="/admin/feedback"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              View Feedback
            </Link>
          </div>
        </div>
      </div>
    </AdminDashboardWrapper>
  );
}
