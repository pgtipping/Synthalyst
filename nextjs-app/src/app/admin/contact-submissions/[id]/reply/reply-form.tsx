"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReplyFormProps {
  submissionId: string;
  recipientEmail: string;
  initialSubject: string;
}

// Available sender email addresses
const SENDER_EMAILS = [
  { value: "", label: "Default Sender (from .env)" },
  { value: "info@synthalyst.com", label: "info@synthalyst.com" },
  { value: "support@synthalyst.com", label: "support@synthalyst.com" },
  { value: "contact@synthalyst.com", label: "contact@synthalyst.com" },
  { value: "noreply@synthalyst.com", label: "noreply@synthalyst.com" },
];

export default function ReplyForm({
  submissionId,
  recipientEmail,
  initialSubject,
}: ReplyFormProps) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [useReplyTo, setUseReplyTo] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailStatus("sending");

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
            replyToEmail: useReplyTo ? replyToEmail : undefined,
            fromEmail: fromEmail || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setEmailStatus("error");
        setErrorMessage(errorData.error || "Failed to send reply");
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

      setEmailStatus("success");
      toast.success("Reply sent successfully");

      // Wait a moment to show the success message before redirecting
      setTimeout(() => {
        router.push(`/admin/contact-submissions/${submissionId}`);
        router.refresh();
      }, 1500);
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
    <div className="space-y-6">
      {emailStatus === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            Email Sent Successfully
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Your reply has been sent to {recipientEmail} via SendGrid.
          </AlertDescription>
        </Alert>
      )}

      {emailStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Send Email</AlertTitle>
          <AlertDescription>
            {errorMessage ||
              "There was an error sending your email. Please try again."}
          </AlertDescription>
        </Alert>
      )}

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
            disabled={isSubmitting || emailStatus === "success"}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fromEmail" className="text-sm font-medium">
              Send From
            </label>
            <Select
              value={fromEmail}
              onValueChange={setFromEmail}
              disabled={isSubmitting || emailStatus === "success"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sender email" />
              </SelectTrigger>
              <SelectContent>
                {SENDER_EMAILS.map((email) => (
                  <SelectItem key={email.value} value={email.value}>
                    {email.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select which email address will appear as the sender. All
              addresses must be verified in SendGrid.
            </p>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="useReplyTo"
              checked={useReplyTo}
              onCheckedChange={(checked) => setUseReplyTo(checked === true)}
              disabled={isSubmitting || emailStatus === "success"}
            />
            <Label
              htmlFor="useReplyTo"
              className="text-sm font-medium cursor-pointer"
            >
              Set custom reply-to email address
            </Label>
          </div>

          {useReplyTo && (
            <div className="space-y-2 pl-6">
              <label htmlFor="replyToEmail" className="text-sm font-medium">
                Reply-To Email
              </label>
              <Input
                id="replyToEmail"
                type="email"
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
                placeholder="your-email@example.com"
                required={useReplyTo}
                disabled={isSubmitting || emailStatus === "success"}
              />
              <p className="text-xs text-muted-foreground">
                When the recipient replies to your email, it will go to this
                address instead of the default sender.
              </p>
            </div>
          )}
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
            disabled={isSubmitting || emailStatus === "success"}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || emailStatus === "success"}
            className={
              emailStatus === "sending" ? "bg-amber-600 hover:bg-amber-700" : ""
            }
          >
            {emailStatus === "sending" ? (
              <>
                <span className="mr-2">Sending via SendGrid...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
