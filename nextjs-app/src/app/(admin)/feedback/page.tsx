"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Download, Star, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

interface FeedbackItem {
  id: string;
  appName: string;
  rating: number;
  feedback: string;
  createdAt: string;
  userId: string | null;
  userEmail: string | null;
}

export default function AdminFeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [appNames, setAppNames] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (
      status === "authenticated" &&
      session?.user?.role !== "ADMIN" &&
      session?.user?.email !== "pgtipping1@gmail.com"
    ) {
      router.push("/");
    }

    if (
      status === "authenticated" &&
      (session?.user?.role === "ADMIN" ||
        session?.user?.email === "pgtipping1@gmail.com")
    ) {
      fetchFeedback();
    }
  }, [status, session, router]);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/feedback");

      if (!response.ok) {
        throw new Error("Failed to fetch feedback data");
      }

      const data = (await response.json()) as FeedbackItem[];
      setFeedback(data);

      // Extract unique app names for filtering
      const uniqueAppNames = [...new Set(data.map((item) => item.appName))];
      setAppNames(uniqueAppNames);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback data");
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/admin/feedback/export");

      if (!response.ok) {
        throw new Error("Failed to export feedback data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedback-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Feedback data exported successfully");
    } catch (error) {
      console.error("Error exporting feedback:", error);
      toast.error("Failed to export feedback data");
    }
  };

  const getAverageRating = (appName?: string) => {
    const filteredFeedback = appName
      ? feedback.filter((item) => item.appName === appName)
      : feedback;

    if (filteredFeedback.length === 0) return 0;

    const sum = filteredFeedback.reduce((acc, item) => acc + item.rating, 0);
    return (sum / filteredFeedback.length).toFixed(1);
  };

  const getFeedbackCount = (appName?: string) => {
    if (appName) {
      return feedback.filter((item) => item.appName === appName).length;
    }
    return feedback.length;
  };

  const getFilteredFeedback = () => {
    if (activeTab === "all") return feedback;
    return feedback.filter((item) => item.appName === activeTab);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (status === "loading") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Feedback</h1>

        <Toaster />

        <div className="max-w-7xl mx-auto space-y-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Admin", href: "/admin" },
              { label: "Feedback", href: "/admin/feedback", active: true },
            ]}
          />

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Feedback Dashboard
            </h1>
            <Button
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{feedback.length}</CardTitle>
                <CardDescription>Total Feedback Submissions</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  {getAverageRating()}
                  <Star className="h-5 w-5 ml-1 text-yellow-500 fill-yellow-500" />
                </CardTitle>
                <CardDescription>Average Rating</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{appNames.length}</CardTitle>
                <CardDescription>Apps With Feedback</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              {appNames.map((appName) => (
                <TabsTrigger key={appName} value={appName}>
                  {appName} ({getFeedbackCount(appName)})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "all"
                      ? "All Feedback"
                      : `${activeTab} Feedback`}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "all"
                      ? "Feedback from all applications"
                      : `Average rating: ${getAverageRating(activeTab)}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getFilteredFeedback().length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No feedback data available
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>App</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Feedback</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredFeedback().map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge variant="outline">{item.appName}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {item.rating}
                                <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-md truncate">
                                {item.feedback || (
                                  <span className="text-muted-foreground italic">
                                    No comment
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.userEmail || (
                                <span className="text-muted-foreground italic">
                                  Anonymous
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
