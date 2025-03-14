"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Download, Star, ArrowLeft } from "lucide-react";
import { Toaster, toast } from "sonner";
import Link from "next/link";

interface FeedbackItem {
  id: string;
  appName: string;
  rating: number;
  feedback: string;
  createdAt: string;
  userId: string | null;
  userEmail: string | null;
}

interface AppFeedbackPageProps {
  params: {
    appName: string;
  };
}

export default function AppFeedbackPage({ params }: AppFeedbackPageProps) {
  const { appName } = params;
  const decodedAppName = decodeURIComponent(appName);
  const { data: session, status } = useSession();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      redirect("/");
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchFeedback();
    }
  }, [status, session, decodedAppName]);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/feedback?appName=${encodeURIComponent(decodedAppName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch feedback data");
      }

      const data = (await response.json()) as FeedbackItem[];
      setFeedback(data);

      // Calculate statistics
      if (data.length > 0) {
        const total = data.length;
        const sum = data.reduce((acc, item) => acc + item.rating, 0);
        const averageRating = parseFloat((sum / total).toFixed(1));

        // Count ratings
        const ratings = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

        data.forEach((item) => {
          ratings[item.rating as keyof typeof ratings]++;
        });

        setStats({
          total,
          averageRating,
          ratings,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback data");
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(
        `/api/admin/feedback/export?appName=${encodeURIComponent(
          decodedAppName
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to export feedback data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${decodedAppName}-feedback-${
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Feedback", href: "/admin/feedback" },
            {
              label: decodedAppName,
              href: `/admin/feedback/${appName}`,
              active: true,
            },
          ]}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/admin/feedback">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {decodedAppName} Feedback
            </h1>
          </div>
          <Button onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
              <CardDescription>Total Submissions</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center">
                {stats.averageRating}
                <Star className="h-5 w-5 ml-1 text-yellow-500 fill-yellow-500" />
              </CardTitle>
              <CardDescription>Average Rating</CardDescription>
            </CardHeader>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    stats.ratings[rating as keyof typeof stats.ratings];
                  const percentage =
                    stats.total > 0
                      ? Math.round((count / stats.total) * 100)
                      : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center w-8">
                        {rating}
                        <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground w-16">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Details</CardTitle>
            <CardDescription>
              All feedback submissions for {decodedAppName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No feedback data available
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {item.rating}
                          <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
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
      </div>
    </div>
  );
}
