import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import EditNotesForm from "./edit-notes-form";

export const metadata: Metadata = {
  title: "Edit Notes | Admin Dashboard",
  description: "Edit notes for a contact submission",
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

export default async function EditNotesPage(props: PageProps) {
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
            label: "Edit Notes",
            href: `/admin/contact-submissions/${params.id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Notes</h1>
        <Link href={`/admin/contact-submissions/${params.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <EditNotesForm
            submissionId={params.id}
            initialNotes={submission.notes || ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
