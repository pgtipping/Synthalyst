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
  Mail,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="flex items-center justify-center h-64">
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Email Logs</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Logs
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Email Logs</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete email logs older than the
                    specified date. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="deleteDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Delete logs older than:
                    </label>
                    <Input
                      id="deleteDate"
                      type="date"
                      value={deleteOlderThan}
                      onChange={(e) => setDeleteOlderThan(e.target.value)}
                    />
                  </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Emails Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Emails</CardTitle>
              <CardDescription>All email logs in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{pagination.total}</div>
              )}
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
              <CardDescription>Email delivery status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : stats.length > 0 ? (
                stats.map((stat) => (
                  <div
                    key={stat.status}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Badge
                        className={getStatusBadgeColor(stat.status)}
                        variant="secondary"
                      >
                        {stat.status}
                      </Badge>
                    </div>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
              <CardDescription>Email categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : categoryStats.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryStats.map((stat) => (
                    <div
                      key={stat.category}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Badge variant="outline">{stat.category}</Badge>
                      </div>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold">Email Log Records</h2>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
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
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryStats.map((stat) => (
                        <SelectItem key={stat.category} value={stat.category}>
                          {stat.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium truncate max-w-[150px]">
                        {log.to}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {log.subject}
                      </TableCell>
                      <TableCell>{log.category}</TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(log.status)}
                          variant="secondary"
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(log.sentAt || log.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>No email logs found</p>
                        {(statusFilter || categoryFilter) && (
                          <p className="text-sm mt-1">
                            Try changing your filters
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="rounded-l-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: pagination.pages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={
                          pagination.page === i + 1 ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        className="hidden md:inline-flex"
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="rounded-r-md"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
              <div className="flex sm:hidden justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="self-center text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
