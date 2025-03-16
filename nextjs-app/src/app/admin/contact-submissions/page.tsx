import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContactSubmissionsPage from "./ContactSubmissionsPage";

export const metadata: Metadata = {
  title: "Contact Submissions | Admin Dashboard",
  description: "Manage contact form submissions",
};

export default async function AdminContactSubmissionsPage() {
  // Check authentication and authorization
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Check if user has admin role
  if (
    session.user.role !== "ADMIN" &&
    session.user.email !== "pgtipping1@gmail.com"
  ) {
    redirect("/");
  }

  // Fetch contact submissions
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100, // Limit to 100 most recent submissions
  });

  // Format dates for serialization
  const formattedSubmissions = submissions.map((submission) => ({
    ...submission,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
    lastRepliedAt: submission.lastRepliedAt
      ? submission.lastRepliedAt.toISOString()
      : null,
    // Ensure source is included (default to "WEBSITE" if null)
    source: submission.source || "WEBSITE",
  }));

  return <ContactSubmissionsPage submissions={formattedSubmissions} />;
}
