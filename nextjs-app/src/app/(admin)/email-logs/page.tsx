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
import { AdminDashboardWrapper } from "../components";
import { getEmailLogs } from "../lib/admin-api";
import { formatDate, getStatusColorClass } from "../lib/admin-utils";

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: string;
  template: string;
  errorDetails?: string;
}

export default function EmailLogsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [isError, setIsError] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch email logs
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await getEmailLogs({
          page,
          limit: 20,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search.trim() !== "" ? search : undefined,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch email logs");
        }

        const data = response.data as {
          logs: EmailLog[];
          total: number;
          pages: number;
        };

        setLogs(data.logs);
        setTotalPages(data.pages);
        setTotalLogs(data.total);
      } catch (error) {
        console.error("Error fetching email logs:", error);
        toast.error("Failed to fetch email logs");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchLogs();
    }
  }, [page, statusFilter, search, status]);

  // Refresh logs
  const handleRefresh = () => {
    setPage(1);
    // The useEffect will trigger a reload
  };

  // Delete log
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/email-logs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete log");
      }

      setLogs(logs.filter((log) => log.id !== id));
      toast.success("Email log deleted successfully");
    } catch (error) {
      console.error("Error deleting email log:", error);
      toast.error("Failed to delete email log");
    }
  };

  // View log details
  const viewLogDetails = (log: EmailLog) => {
    setSelectedLog(log);
  };

  // Close log details
  const closeLogDetails = () => {
    setSelectedLog(null);
  };

  return (
    <AdminDashboardWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" /> Email Logs
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Email History</CardTitle>
            <CardDescription>
              View a history of all emails sent through the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by recipient or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">
                    Error loading email logs
                  </p>
                  <p className="text-red-700 text-sm">
                    Please try refreshing the page
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : logs.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No email logs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {log.recipient}
                            </TableCell>
                            <TableCell>{log.subject}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusColorClass(log.status)}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{log.template}</TableCell>
                            <TableCell>{formatDate(log.sentAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => viewLogDetails(log)}
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete this email
                                        log. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(log.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {logs.length > 0 ? (page - 1) * 20 + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * 20, totalLogs)}
                    </span>{" "}
                    of <span className="font-medium">{totalLogs}</span> results
                  </p>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Log Details Dialog */}
      <AlertDialog open={!!selectedLog} onOpenChange={() => closeLogDetails()}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Email Details
            </AlertDialogTitle>
            <AlertDialogDescription>
              Viewing details for email sent to {selectedLog?.recipient}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedLog && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
                    Recipient
                  </p>
                  <p className="font-medium">{selectedLog.recipient}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={getStatusColorClass(selectedLog.status)}
                  >
                    {selectedLog.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
                    Subject
                  </p>
                  <p className="font-medium">{selectedLog.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
                    Template
                  </p>
                  <p className="font-medium">{selectedLog.template}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
                    Sent At
                  </p>
                  <p className="font-medium">
                    {formatDate(selectedLog.sentAt)}
                  </p>
                </div>
              </div>

              {selectedLog.errorDetails && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1 text-muted-foreground">
                    Error Details
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {selectedLog.errorDetails}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardWrapper>
  );
}
