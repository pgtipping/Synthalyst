import { Metadata } from "next/types";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Contact Submissions | Admin Dashboard",
  description: "View and manage contact form submissions",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// Define the ContactSubmission interface with the new fields
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  status: string;
  createdAt: Date | string;
  lastRepliedAt: Date | string | null;
  replyCount: number;
}

export default async function ContactSubmissionsPage() {
  // Fetch contact submissions from the database using raw SQL to include the new fields
  const submissions = await prisma.$queryRaw<ContactSubmission[]>`
    SELECT 
      cs.id, 
      cs.name, 
      cs.email, 
      cs.subject, 
      cs."inquiryType", 
      cs.status, 
      cs."createdAt",
      (
        SELECT MAX(r."createdAt")
        FROM "ContactSubmissionReply" r
        WHERE r."contactSubmissionId" = cs.id
      ) as "lastRepliedAt",
      (
        SELECT COUNT(*)
        FROM "ContactSubmissionReply" r
        WHERE r."contactSubmissionId" = cs.id
      ) as "replyCount"
    FROM "ContactSubmission" cs
    ORDER BY cs."createdAt" DESC
  `;

  // Status badge colors
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
  };

  // Inquiry type badge colors
  const inquiryTypeColors = {
    general: "bg-gray-100 text-gray-800",
    support: "bg-purple-100 text-purple-800",
    business: "bg-indigo-100 text-indigo-800",
    feedback: "bg-teal-100 text-teal-800",
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          {
            label: "Contact Submissions",
            href: "/admin/contact-submissions",
            active: true,
          },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/contact-submissions?status=new"
            className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
          >
            New
          </Link>
          <Link
            href="/admin/contact-submissions?status=in-progress"
            className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800"
          >
            In Progress
          </Link>
          <Link
            href="/admin/contact-submissions?status=resolved"
            className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800"
          >
            Resolved
          </Link>
          <Link
            href="/admin/contact-submissions"
            className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800"
          >
            All
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Replies
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b last:border-b-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <span className="font-medium">{submission.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {submission.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{submission.subject}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        inquiryTypeColors[
                          submission.inquiryType as keyof typeof inquiryTypeColors
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {submission.inquiryType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statusColors[
                          submission.status as keyof typeof statusColors
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      {format(new Date(submission.createdAt), "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(submission.createdAt), "h:mm a")}
                      </div>
                      {submission.lastRepliedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Replied:{" "}
                          {format(
                            new Date(submission.lastRepliedAt),
                            "MMM d, h:mm a"
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {submission.replyCount > 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {submission.replyCount}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Link
                      href={`/admin/contact-submissions/${submission.id}`}
                      className="text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
