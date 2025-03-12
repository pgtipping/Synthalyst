"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactSubmissionsList from "@/components/contact-submissions/ContactSubmissionsList";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  source: string | null;
  createdAt: string;
  lastRepliedAt: string | null;
}

interface ContactSubmissionsPageProps {
  submissions: ContactSubmission[];
}

export default function ContactSubmissionsPage({
  submissions,
}: ContactSubmissionsPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  // Parse dates for client-side use
  const parsedSubmissions = submissions.map((submission) => ({
    ...submission,
    createdAt: new Date(submission.createdAt),
    lastRepliedAt: submission.lastRepliedAt
      ? new Date(submission.lastRepliedAt)
      : null,
  }));

  // Filter submissions based on active tab
  const filteredSubmissions = parsedSubmissions.filter((submission) => {
    if (activeTab === "all") return true;
    return submission.status.toLowerCase() === activeTab;
  });

  // Count submissions by status
  const counts = {
    all: parsedSubmissions.length,
    new: parsedSubmissions.filter((s) => s.status.toLowerCase() === "new")
      .length,
    in_progress: parsedSubmissions.filter(
      (s) => s.status.toLowerCase() === "in_progress"
    ).length,
    completed: parsedSubmissions.filter(
      (s) => s.status.toLowerCase() === "completed"
    ).length,
    archived: parsedSubmissions.filter(
      (s) => s.status.toLowerCase() === "archived"
    ).length,
  };

  // Handle status change
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const formData = new FormData();
      formData.append("status", status);

      const response = await fetch(
        `/api/admin/contact-submissions/${id}/update-status`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {counts.all}
              </span>
            </TabsTrigger>
            <TabsTrigger value="new">
              New
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                {counts.new}
              </span>
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress
              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                {counts.in_progress}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                {counts.completed}
              </span>
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {counts.archived}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Contact Submissions"
                  : `${
                      activeTab.charAt(0).toUpperCase() +
                      activeTab.slice(1).replace("_", " ")
                    } Submissions`}
              </CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "View and manage all contact form submissions"
                  : `Manage ${activeTab.replace(
                      "_",
                      " "
                    )} contact form submissions`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactSubmissionsList
                submissions={filteredSubmissions}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
