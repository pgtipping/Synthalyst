import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReplyForm from "./reply-form";

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

export const metadata = {
  title: "Reply | Contact Submission | Admin | Synthalyst",
  description: "Reply to a contact submission",
};

// Updated interface to use Promise for params according to Next.js 15 requirements
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReplyPage(props: PageProps) {
  // Await the params Promise to get the actual id
  const { id } = await props.params;

  // Fetch the contact submission from the database
  const submission = await prisma.$queryRaw<ContactSubmission[]>`
    SELECT * FROM "ContactSubmission" WHERE id = ${id}
  `;

  if (!submission || submission.length === 0) {
    notFound();
  }

  const contactSubmission = submission[0];

  return (
    <div className="container mx-auto py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Contact Submissions", href: "/admin/contact-submissions" },
          { label: "Details", href: `/admin/contact-submissions/${id}` },
          {
            label: "Reply",
            href: `/admin/contact-submissions/${id}/reply`,
            active: true,
          },
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reply to {contactSubmission.name}</CardTitle>
            <Link href={`/admin/contact-submissions/${id}`}>
              <Button variant="outline">Back to Details</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Original Message</h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="mb-2">
                <strong>From:</strong> {contactSubmission.name} (
                {contactSubmission.email})
              </p>
              <p className="mb-2">
                <strong>Subject:</strong> {contactSubmission.subject}
              </p>
              <p className="whitespace-pre-wrap">{contactSubmission.message}</p>
            </div>
          </div>

          <ReplyForm
            submissionId={contactSubmission.id}
            recipientEmail={contactSubmission.email}
            initialSubject={`Re: ${contactSubmission.subject}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
