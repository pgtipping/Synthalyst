"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash,
} from "lucide-react";
import { DeleteSubmissionButton } from "./DeleteSubmissionButton";
import { formatDistanceToNow } from "date-fns";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  source: string | null;
  createdAt: Date;
  lastRepliedAt: Date | null;
}

interface ContactSubmissionsListProps {
  submissions: ContactSubmission[];
  onStatusChange?: (id: string, status: string) => Promise<void>;
}

export default function ContactSubmissionsList({
  submissions,
  onStatusChange,
}: ContactSubmissionsListProps) {
  const router = useRouter();
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(
    null
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            New
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSourceBadge = (source: string | null) => {
    if (!source) return null;

    switch (source.toUpperCase()) {
      case "WEBSITE":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Website
          </Badge>
        );
      case "QUICK_CONTACT":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200"
          >
            Quick Contact
          </Badge>
        );
      case "NEWSLETTER":
        return (
          <Badge
            variant="outline"
            className="bg-pink-50 text-pink-700 border-pink-200"
          >
            Newsletter
          </Badge>
        );
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (onStatusChange) {
      await onStatusChange(id, status);
      router.refresh();
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No contact submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
              <>
                <TableRow key={submission.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium">{submission.name}</div>
                    <div className="text-sm text-gray-500">
                      {submission.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-[200px] truncate"
                      title={submission.subject}
                    >
                      {submission.subject}
                    </div>
                  </TableCell>
                  <TableCell>{getSourceBadge(submission.source)}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    <div title={submission.createdAt.toLocaleString()}>
                      {formatDistanceToNow(submission.createdAt, {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpand(submission.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onStatusChange && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(submission.id, "new")
                                }
                              >
                                <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                                Mark as New
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    submission.id,
                                    "in_progress"
                                  )
                                }
                              >
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                Mark In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(submission.id, "completed")
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(submission.id, "archived")
                                }
                              >
                                <Trash className="mr-2 h-4 w-4 text-gray-500" />
                                Archive
                              </DropdownMenuItem>
                            </>
                          )}
                          <DeleteSubmissionButton
                            submissionId={submission.id}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>

                {expandedSubmission === submission.id && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-gray-50 p-4">
                      <div className="text-sm">
                        <div className="font-medium mb-2">Message:</div>
                        <div className="whitespace-pre-wrap bg-white p-3 rounded border">
                          {submission.message}
                        </div>

                        {submission.lastRepliedAt && (
                          <div className="mt-4 text-gray-500">
                            Last replied:{" "}
                            {formatDistanceToNow(submission.lastRepliedAt, {
                              addSuffix: true,
                            })}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
