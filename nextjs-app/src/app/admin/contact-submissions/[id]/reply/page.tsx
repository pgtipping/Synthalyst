"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

interface ReplyPageProps {
  params: {
    id: string;
  };
}

export default function ReplyPage({ params }: ReplyPageProps) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch submission details when the component mounts
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(
          `/api/admin/contact-submissions/${params.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setSubmission(data);
          setSubject(`RE: ${data.subject}`);
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
      // In a real implementation, you would send an email here
      // This is a placeholder for the email sending functionality
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Reply sent successfully");
      router.push(`/admin/contact-submissions/${params.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to send reply");
      console.error("Error sending reply:", error);
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
            label: "Reply",
            href: `/admin/contact-submissions/${params.id}/reply`,
            active: true,
          },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reply to Submission</h1>
        <Link href={`/admin/contact-submissions/${params.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : submission ? (
        <>
          <div className="bg-muted/30 p-4 rounded-md mb-6">
            <div className="mb-2">
              <span className="font-medium">From:</span> {submission.name} (
              {submission.email})
            </div>
            <div className="mb-2">
              <span className="font-medium">Subject:</span> {submission.subject}
            </div>
            <div>
              <span className="font-medium">Message:</span>
              <div className="mt-2 whitespace-pre-wrap">
                {submission.message}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compose Reply</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Submission not found.</p>
        </div>
      )}
    </div>
  );
}
