import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditNotesForm from "./edit-notes-form";

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
  title: "Edit Notes | Contact Submission | Admin | Synthalyst",
  description: "Edit notes for a contact submission",
};

// Updated interface to use Promise for params according to Next.js 15 requirements
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotesPage(props: PageProps) {
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
            label: "Edit Notes",
            href: `/admin/contact-submissions/${id}/edit`,
            active: true,
          },
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Edit Notes</CardTitle>
            <Link href={`/admin/contact-submissions/${id}`}>
              <Button variant="outline">Back to Details</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <EditNotesForm
            submissionId={contactSubmission.id}
            initialNotes={contactSubmission.notes || ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
