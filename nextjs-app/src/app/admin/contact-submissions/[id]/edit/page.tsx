"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface EditNotesPageProps {
  params: {
    id: string;
  };
}

export default function EditNotesPage({ params }: EditNotesPageProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing notes when the component mounts
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(
          `/api/admin/contact-submissions/${params.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || "");
        } else {
          toast.error("Failed to fetch submission details");
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
        toast.error("Failed to fetch submission details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/contact-submissions/${params.id}/update-notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notes");
      }

      toast.success("Notes updated successfully");
      router.push(`/admin/contact-submissions/${params.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update notes");
      console.error("Error updating notes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this submission here..."
                className="min-h-[200px]"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Notes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
