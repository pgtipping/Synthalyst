"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";

interface QuickReplyFormProps {
  submissionId: string;
  recipientEmail: string;
}

export default function QuickReplyForm({
  submissionId,
  recipientEmail,
}: QuickReplyFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Reply content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/contact-submissions/${submissionId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            sendEmail: true,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reply");
      }

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });

      // Clear the form
      setContent("");

      // Refresh the page to show the new reply
      router.refresh();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={`Reply to ${recipientEmail}...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-y"
        disabled={isSubmitting}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
