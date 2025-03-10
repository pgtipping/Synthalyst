import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteSubmissionButton } from "@/components/contact-submissions/DeleteSubmissionButton";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

// Define the ContactSubmission interface
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  company: string | null;
  phone: string | null;
  inquiryType: string;
  message: string;
  status: string;
  notes: string | null;
  assignedTo: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastRepliedAt: Date | string | null;
}

// Define the ContactSubmissionReply interface
interface ContactSubmissionReply {
  id: string;
  contactSubmissionId: string;
  content: string;
  reference: string | null;
  createdAt: Date | string;
}

export const metadata = {
  title: "Contact Submission Details | Admin Dashboard",
  description: "View and manage contact submission details",
};

// Updated interface to use Promise for params according to Next.js 15 requirements
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContactSubmissionDetailPage(props: PageProps) {
  // Await the params Promise to get the actual id
  const { id } = await props.params;

  // Fetch the contact submission from the database
  const submissions = await prisma.$queryRaw<ContactSubmission[]>`
    SELECT * FROM "ContactSubmission" WHERE id = ${id}
  `;

  const submission = submissions[0];

  // If submission not found, return 404
  if (!submission) {
    notFound();
  }

  // Fetch replies for this submission
  const replies = await prisma.$queryRaw<ContactSubmissionReply[]>`
    SELECT * FROM "ContactSubmissionReply" 
    WHERE "contactSubmissionId" = ${id}
    ORDER BY "createdAt" DESC
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
          { label: "Contact Submissions", href: "/admin/contact-submissions" },
          {
            label: "Details",
            href: `/admin/contact-submissions/${id}`,
            active: true,
          },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Submission Details</h1>
        <Link href="/admin/contact-submissions">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submission Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Submission Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{submission.subject}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusColors[
                      submission.status as keyof typeof statusColors
                    ] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    inquiryTypeColors[
                      submission.inquiryType as keyof typeof inquiryTypeColors
                    ] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.inquiryType}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Message
              </h4>
              <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                {submission.message}
              </div>
            </div>

            {submission.notes && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Admin Notes
                </h4>
                <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                  {submission.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-medium text-primary">
                  {submission.name.charAt(0).toUpperCase()}
                </span>
              </span>
              <div>
                <h3 className="font-medium">{submission.name}</h3>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${submission.email}`}
                className="text-sm hover:underline"
              >
                {submission.email}
              </a>
            </div>

            {submission.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${submission.phone}`}
                  className="text-sm hover:underline"
                >
                  {submission.phone}
                </a>
              </div>
            )}

            {submission.company && (
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{submission.company}</span>
              </div>
            )}

            <div className="border-t my-4"></div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(submission.createdAt), "MMMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(submission.createdAt), "h:mm a")}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{submission.inquiryType}</span>
            </div>

            <div className="flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{submission.status}</span>
            </div>

            {submission.lastRepliedAt && (
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Last replied:{" "}
                  {format(
                    new Date(submission.lastRepliedAt),
                    "MMM d, yyyy h:mm a"
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reply History */}
      {replies.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Reply History
          </h4>
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-muted/30 p-4 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(reply.createdAt), "MMMM d, yyyy h:mm a")}
                  </div>
                  {reply.reference && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {reply.reference}
                    </div>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{reply.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <form
          action={`/api/admin/contact-submissions/${id}/update-status`}
          method="POST"
        >
          <input type="hidden" name="status" value="in-progress" />
          <Button
            type="submit"
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
          >
            Mark as In Progress
          </Button>
        </form>

        <form
          action={`/api/admin/contact-submissions/${id}/update-status`}
          method="POST"
        >
          <input type="hidden" name="status" value="resolved" />
          <Button
            type="submit"
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
          >
            Mark as Resolved
          </Button>
        </form>

        <Link href={`/admin/contact-submissions/${id}/edit`}>
          <Button variant="outline">Edit Notes</Button>
        </Link>

        <Link href={`/admin/contact-submissions/${id}/reply`}>
          <Button
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
          >
            Reply
          </Button>
        </Link>

        <DeleteSubmissionButton submissionId={id} />
      </div>
    </div>
  );
}
