"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface EditNotesFormProps {
  submissionId: string;
  initialNotes: string;
}

export default function EditNotesForm({
  submissionId,
  initialNotes,
}: EditNotesFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/contact-submissions/${submissionId}/update-notes`,
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
      router.push(`/admin/contact-submissions/${submissionId}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update notes");
      console.error("Error updating notes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
