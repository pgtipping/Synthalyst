"use client";

import { Button } from "@/components/ui/button";

interface DeleteSubmissionButtonProps {
  submissionId: string;
}

export function DeleteSubmissionButton({
  submissionId,
}: DeleteSubmissionButtonProps) {
  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this submission? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `/api/admin/contact-submissions/${submissionId}/delete`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          window.location.href = "/admin/contact-submissions";
        } else {
          alert("Failed to delete submission");
        }
      } catch (error) {
        console.error("Error deleting submission:", error);
        alert("Failed to delete submission");
      }
    }
  };

  return (
    <Button
      onClick={handleDelete}
      variant="outline"
      className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
    >
      Delete
    </Button>
  );
}
