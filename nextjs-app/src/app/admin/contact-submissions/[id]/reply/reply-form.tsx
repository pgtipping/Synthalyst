"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface ReplyFormProps {
  submissionId: string;
  recipientEmail: string;
  initialSubject: string;
}

export default function ReplyForm({
  submissionId,
  recipientEmail,
  initialSubject,
}: ReplyFormProps) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send the reply email via API
      const response = await fetch(
        `/api/admin/contact-submissions/${submissionId}/send-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail,
            subject,
            message,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send reply");
      }

      // Update the submission status to "in-progress" if it was "new"
      await fetch(
        `/api/admin/contact-submissions/${submissionId}/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            status: "in-progress",
          }),
        }
      );

      toast.success("Reply sent successfully");
      router.push(`/admin/contact-submissions/${submissionId}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reply"
      );
      console.error("Error sending reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="RE: Your inquiry"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply here..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
