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
      // In a real implementation, you would send an email here
      // This is a placeholder for the email sending functionality
      console.log(
        `Sending email to ${recipientEmail} with subject: ${subject}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Reply sent successfully");
      router.push(`/admin/contact-submissions/${submissionId}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to send reply");
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
