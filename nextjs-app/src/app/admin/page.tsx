import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, AlertCircle, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Synthalyst",
  description: "Admin dashboard for Synthalyst",
};

export default async function AdminPage() {
  // Get counts of contact submissions by status
  const submissionCounts = await prisma.$queryRaw<
    { status: string; count: number }[]
  >`
    SELECT status, COUNT(*) as count
    FROM "ContactSubmission"
    GROUP BY status
  `;

  // Create a map of status to count
  const countsByStatus = submissionCounts.reduce((acc, { status, count }) => {
    acc[status] = Number(count);
    return acc;
  }, {} as Record<string, number>);

  // Calculate total unresolved (new + in-progress)
  const unresolvedCount =
    (countsByStatus["new"] || 0) + (countsByStatus["in-progress"] || 0);

  // Get count of users
  const userCount = await prisma.user.count();
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <span className="text-sm text-muted-foreground">In Progress</span>
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
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
              <span className="text-sm text-muted-foreground">Total Users</span>
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
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Manage Users
          </Link>
        </div>

        {/* Add more admin cards here */}
      </div>
    </div>
  );
}
