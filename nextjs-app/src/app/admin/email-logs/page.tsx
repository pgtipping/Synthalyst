"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
  Filter,
  Calendar,
  Mail,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types
interface EmailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  category: string;
  status: string;
  provider: string | null;
  providerMessageId: string | null;
  error: string | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface StatusStat {
  status: string;
  count: string | number;
}

interface CategoryStat {
  category: string;
  count: string | number;
}

export default function EmailLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [stats, setStats] = useState<StatusStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteOlderThan, setDeleteOlderThan] = useState<string>("");

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch email logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", pagination.page.toString());
      queryParams.append("limit", pagination.limit.toString());

      if (statusFilter && statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      if (categoryFilter && categoryFilter !== "all") {
        queryParams.append("category", categoryFilter);
      }

      const response = await fetch(
        `/api/admin/email-logs?${queryParams.toString()}`
      );

      if (!response.ok) {
        console.error(
          "API returned error status:",
          response.status,
          response.statusText
        );
        toast.error(
          `Error: ${response.statusText || "Failed to fetch email logs"}`
        );
        setLogs([]);
        setPagination({ ...pagination, total: 0, pages: 0 });
        setStats([]);
        setCategoryStats([]);
        return;
      }

      const data = await response.json();

      // Handle case where data might be missing
      setLogs(data.logs || []);
      setPagination(data.pagination || { ...pagination, total: 0, pages: 0 });
      setStats(data.stats || []);
      setCategoryStats(data.categoryStats || []);
    } catch (error) {
      console.error("Error fetching email logs:", error);
      toast.error("Failed to load email logs");
      // Set default values on error
      setLogs([]);
      setPagination({ ...pagination, total: 0, pages: 0 });
      setStats([]);
      setCategoryStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (session) {
      fetchLogs();
    }
  }, [session, pagination.page, statusFilter, categoryFilter]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Handle delete older than
  const handleDeleteOlderThan = async () => {
    try {
      const date = new Date(deleteOlderThan);

      if (isNaN(date.getTime())) {
        toast.error("Please enter a valid date");
        return;
      }

      const response = await fetch("/api/admin/email-logs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          olderThan: date.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete email logs");
      }

      const data = await response.json();
      toast.success(data.message);
      fetchLogs();
    } catch (error) {
      toast.error("Failed to delete email logs");
      console.error("Error deleting email logs:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (status === "loading") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Email Logs</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchLogs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Logs
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Email Logs</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete email logs older than
                    the specified date.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 my-4">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    value={deleteOlderThan}
                    onChange={(e) => setDeleteOlderThan(e.target.value)}
                    placeholder="Select date"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteOlderThan}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Emails</CardTitle>
              <CardDescription>All email logs in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status Distribution</CardTitle>
              <CardDescription>Email status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.map((stat) => (
                  <Badge
                    key={stat.status}
                    className={`${getStatusBadgeColor(stat.status)} text-white`}
                  >
                    {stat.status}: {stat.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Categories</CardTitle>
              <CardDescription>Most common email categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categoryStats.slice(0, 5).map((stat) => (
                  <Badge key={stat.category} variant="outline">
                    {stat.category}: {stat.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="mb-6">
          <TabsList>
            <TabsTrigger value="logs">Email Logs</TabsTrigger>
            <TabsTrigger value="stats">Detailed Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Email Log History</CardTitle>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categoryStats.map((stat) => (
                            <SelectItem
                              key={stat.category}
                              value={stat.category}
                            >
                              {stat.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Provider</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <Mail className="h-8 w-8 mb-2" />
                              <p>No email logs found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{formatDate(log.createdAt)}</TableCell>
                            <TableCell
                              className="max-w-[200px] truncate"
                              title={log.to}
                            >
                              {log.to}
                            </TableCell>
                            <TableCell
                              className="max-w-[250px] truncate"
                              title={log.subject}
                            >
                              {log.subject}
                            </TableCell>
                            <TableCell>{log.category}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusBadgeColor(
                                  log.status
                                )} text-white`}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{log.provider || "N/A"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {logs.length} of {pagination.total} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages || loading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Breakdown of email statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusBadgeColor(
                              stat.status
                            )} mr-2`}
                          />
                          <span className="capitalize">{stat.status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{stat.count}</span>
                          <span className="text-sm text-gray-500">
                            (
                            {(
                              (Number(stat.count) / pagination.total) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Top email categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((stat) => (
                      <div
                        key={stat.category}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="truncate max-w-[200px]"
                          title={stat.category}
                        >
                          {stat.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{stat.count}</span>
                          <span className="text-sm text-gray-500">
                            (
                            {(
                              (Number(stat.count) / pagination.total) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {logs.some((log) => log.status === "failed") && (
          <Card className="mt-6 border-red-200">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <CardTitle>Failed Emails</CardTitle>
              </div>
              <CardDescription>
                Some emails failed to send. Check the errors below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs
                      .filter((log) => log.status === "failed")
                      .map((log) => (
                        <TableRow key={`failed-${log.id}`}>
                          <TableCell>{formatDate(log.createdAt)}</TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={log.to}
                          >
                            {log.to}
                          </TableCell>
                          <TableCell
                            className="max-w-[250px] truncate"
                            title={log.subject}
                          >
                            {log.subject}
                          </TableCell>
                          <TableCell className="text-red-500">
                            {log.error || "Unknown error"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
