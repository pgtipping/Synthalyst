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
  User,
  CornerDownRight,
} from "lucide-react";
import QuickReplyForm from "./components/QuickReplyForm";
import ThreadTimeline from "./components/ThreadTimeline";

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
    SELECT cs.*, 
      (SELECT COUNT(*) FROM "ContactSubmissionReply" csr WHERE csr."contactSubmissionId" = cs.id) as "replyCount",
      (SELECT MAX(csr."createdAt") FROM "ContactSubmissionReply" csr WHERE csr."contactSubmissionId" = cs.id) as "lastRepliedAt"
    FROM "ContactSubmission" cs 
    WHERE cs.id = ${id}
  `;

  const submission = submissions[0];

  // If submission not found, return 404
  if (!submission) {
    notFound();
  }

  // Fetch replies for this submission
  const replies = await prisma.$queryRaw<ContactSubmissionReply[]>`
    SELECT csr.*, 
      COALESCE(csr.reference, 'REF-' || SUBSTRING(csr."contactSubmissionId", 1, 8) || '-' || 
        TO_CHAR(csr."createdAt", 'YYYYMMDDHH24MISS')) as "reference"
    FROM "ContactSubmissionReply" csr
    WHERE csr."contactSubmissionId" = ${id}
    ORDER BY csr."createdAt" ASC
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

  // Format date for display
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };

  // Check if there are related inbound emails
  const relatedEmails = await prisma.inboundEmail.findMany({
    where: {
      fromEmail: submission.email,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Create a combined thread of the original submission and all replies
  const threadItems = [
    {
      id: submission.id,
      type: "submission" as const,
      content: submission.message,
      sender: submission.name,
      email: submission.email,
      createdAt: submission.createdAt,
      reference: null,
    },
    ...replies.map((reply) => ({
      id: reply.id,
      type: "reply" as const,
      content: reply.content,
      sender: "Admin",
      email: "admin@synthalyst.com",
      createdAt: reply.createdAt,
      reference: reply.reference,
    })),
    ...relatedEmails.map((email) => ({
      id: email.id,
      type: "email" as const,
      content: email.textContent || email.htmlContent || "No content available",
      sender: email.fromFull,
      email: email.fromEmail,
      createdAt: email.createdAt,
      reference: null,
    })),
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            {
              label: "Contact Submissions",
              href: "/admin/contact-submissions",
            },
            { label: "Details", href: `/admin/contact-submissions/${id}` },
          ]}
        />
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/contact-submissions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <DeleteSubmissionButton submissionId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium">{submission.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${submission.email}`}
                    className="hover:underline"
                  >
                    {submission.email}
                  </a>
                </div>
                {submission.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${submission.phone}`}
                      className="hover:underline"
                    >
                      {submission.phone}
                    </a>
                  </div>
                )}
                {submission.company && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building className="h-4 w-4" />
                    <span>{submission.company}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Submitted on {formatDate(submission.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Last updated on {formatDate(submission.updatedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    inquiryTypeColors[
                      submission.inquiryType as keyof typeof inquiryTypeColors
                    ] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.inquiryType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    statusColors[
                      submission.status as keyof typeof statusColors
                    ] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.status}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Subject</h3>
              <p className="text-gray-700">{submission.subject}</p>
            </div>

            {submission.notes && (
              <div className="pt-4">
                <h3 className="font-medium mb-2">Admin Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {submission.notes}
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/contact-submissions/${id}/edit`}>
                  Edit Submission
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href={`/admin/contact-submissions/${id}/reply`}>
                  Full Reply
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Thread */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Conversation Thread
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {threadItems.length} message
                {threadItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thread Timeline Component */}
            <ThreadTimeline items={threadItems} />

            {/* Quick Reply Form */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <CornerDownRight className="h-4 w-4" />
                Quick Reply
              </h3>
              <QuickReplyForm
                submissionId={id}
                recipientEmail={submission.email}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
