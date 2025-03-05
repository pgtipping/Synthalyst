import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Contact Submissions | Admin Dashboard",
  description: "Manage contact form submissions",
};

export default async function ContactSubmissionsPage() {
  // Fetch contact submissions from the database
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contact submissions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{submission.name}</td>
                  <td className="px-4 py-3 text-sm">{submission.email}</td>
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
                    {formatDistanceToNow(new Date(submission.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
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
      )}
    </div>
  );
}
