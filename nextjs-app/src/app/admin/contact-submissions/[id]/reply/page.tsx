import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ReplyForm from "./reply-form";

export const metadata: Metadata = {
  title: "Reply to Submission | Admin Dashboard",
  description: "Reply to a contact submission",
};

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
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReplyPage(props: PageProps) {
  const { params } = props;

  // Fetch the contact submission from the database
  const submissions = (await prisma.$queryRaw`
    SELECT * FROM "ContactSubmission" WHERE id = ${params.id}
  `) as ContactSubmission[];

  const submission = submissions[0];

  // If submission not found, return 404
  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Contact Submissions", href: "/admin/contact-submissions" },
          { label: "Details", href: `/admin/contact-submissions/${params.id}` },
          {
            label: "Reply",
            href: `/admin/contact-submissions/${params.id}/reply`,
            active: true,
          },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reply to Submission</h1>
        <Link href={`/admin/contact-submissions/${params.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </Link>
      </div>

      <div className="bg-muted/30 p-4 rounded-md mb-6">
        <div className="mb-2">
          <span className="font-medium">From:</span> {submission.name} (
          {submission.email})
        </div>
        <div className="mb-2">
          <span className="font-medium">Subject:</span> {submission.subject}
        </div>
        <div>
          <span className="font-medium">Message:</span>
          <div className="mt-2 whitespace-pre-wrap">{submission.message}</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <ReplyForm
            submissionId={params.id}
            recipientEmail={submission.email}
            initialSubject={`RE: ${submission.subject}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
