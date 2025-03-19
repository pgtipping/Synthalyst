"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Mail,
  MessageSquare,
  Search,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { AdminLayout } from "../components";

// Define interfaces for our data
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  status: string;
  createdAt: string;
  lastRepliedAt: string | null;
  replyCount: number;
}

interface NewsletterReply {
  id: string;
  sendId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  newsletterSubject: string;
  senderEmail: string;
  senderName: string;
}

interface InboundEmail {
  id: string;
  fromEmail: string;
  fromFull: string;
  subject: string;
  createdAt: string;
  processed: boolean;
}

interface UnifiedMessage {
  id: string;
  type: "contact" | "newsletter" | "email";
  subject: string;
  sender: string;
  email: string;
  createdAt: string;
  lastActivity: string;
  status: string;
  messageCount: number;
  originalId: string;
}

export default function CommunicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [unifiedMessages, setUnifiedMessages] = useState<UnifiedMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<UnifiedMessage[]>(
    []
  );

  // Fetch data from multiple sources
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Initialize arrays to store data from each API
      let contactSubmissions: ContactSubmission[] = [];
      let newsletterReplies: NewsletterReply[] = [];
      let inboundEmails: InboundEmail[] = [];

      try {
        // Fetch contact submissions
        try {
          const contactRes = await fetch("/api/admin/contact-submissions");
          if (contactRes.ok) {
            const contactData = await contactRes.json();
            contactSubmissions = contactData.data || [];
          } else {
            console.error(
              "Failed to fetch contact submissions:",
              contactRes.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching contact submissions:", error);
        }

        // Fetch newsletter replies
        try {
          const newsletterRes = await fetch("/api/admin/newsletter/replies");
          if (newsletterRes.ok) {
            const newsletterData = await newsletterRes.json();
            newsletterReplies = newsletterData.data || [];
          } else {
            console.error(
              "Failed to fetch newsletter replies:",
              newsletterRes.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching newsletter replies:", error);
        }

        // Fetch inbound emails
        try {
          const emailRes = await fetch("/api/admin/inbound-emails");
          if (emailRes.ok) {
            const emailData = await emailRes.json();
            inboundEmails = emailData.data || [];
          } else {
            console.error(
              "Failed to fetch inbound emails:",
              emailRes.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching inbound emails:", error);
        }

        // Transform and combine the data
        const unified: UnifiedMessage[] = [
          // Map contact submissions
          ...contactSubmissions.map((item: ContactSubmission) => ({
            id: `contact-${item.id}`,
            type: "contact" as const,
            subject: item.subject,
            sender: item.name,
            email: item.email,
            createdAt: item.createdAt,
            lastActivity: item.lastRepliedAt || item.createdAt,
            status: item.status,
            messageCount: item.replyCount + 1,
            originalId: item.id,
          })),

          // Map newsletter replies
          ...newsletterReplies.map((item: NewsletterReply) => ({
            id: `newsletter-${item.id}`,
            type: "newsletter" as const,
            subject: item.newsletterSubject || "Newsletter Reply",
            sender: item.senderName || "Newsletter Subscriber",
            email: item.senderEmail,
            createdAt: item.createdAt,
            lastActivity: item.updatedAt,
            status: "received",
            messageCount: 1,
            originalId: item.id,
          })),

          // Map inbound emails
          ...inboundEmails.map((item: InboundEmail) => ({
            id: `email-${item.id}`,
            type: "email" as const,
            subject: item.subject,
            sender: item.fromFull,
            email: item.fromEmail,
            createdAt: item.createdAt,
            lastActivity: item.createdAt,
            status: item.processed ? "processed" : "new",
            messageCount: 1,
            originalId: item.id,
          })),
        ];

        setUnifiedMessages(unified);
        setFilteredMessages(unified);
      } catch (error) {
        console.error("Error processing communications data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...unifiedMessages];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((message) => message.type === activeTab);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((message) => message.type === typeFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (message) =>
          message.subject.toLowerCase().includes(query) ||
          message.sender.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof UnifiedMessage];
      const fieldB = b[sortField as keyof UnifiedMessage];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      return 0;
    });

    setFilteredMessages(filtered);
  }, [
    unifiedMessages,
    activeTab,
    searchQuery,
    statusFilter,
    typeFilter,
    sortField,
    sortDirection,
  ]);

  // Handle row click to navigate to detail page
  const handleRowClick = (message: UnifiedMessage) => {
    if (message.type === "contact") {
      router.push(`/admin/contact-submissions/${message.originalId}`);
    } else if (message.type === "newsletter") {
      router.push(`/admin/newsletter/replies/${message.originalId}`);
    } else if (message.type === "email") {
      router.push(`/admin/inbound-emails/${message.originalId}`);
    }
  };

  // Toggle sort direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      received: "bg-purple-100 text-purple-800",
      processed: "bg-teal-100 text-teal-800",
    };

    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  // Type badge colors
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      contact: "bg-indigo-100 text-indigo-800",
      newsletter: "bg-pink-100 text-pink-800",
      email: "bg-orange-100 text-orange-800",
    };

    return typeColors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Breadcrumb
            items={[
              { label: "Admin", href: "/admin" },
              {
                label: "Unified Communications",
                href: "/admin/communications",
              },
            ]}
          />
          <Button
            onClick={() => router.refresh()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Unified Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact
                  </TabsTrigger>
                  <TabsTrigger
                    value="newsletter"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Newsletter
                  </TabsTrigger>
                  <TabsTrigger
                    value="email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                {renderMessageTable()}
              </TabsContent>
              <TabsContent value="contact" className="m-0">
                {renderMessageTable()}
              </TabsContent>
              <TabsContent value="newsletter" className="m-0">
                {renderMessageTable()}
              </TabsContent>
              <TabsContent value="email" className="m-0">
                {renderMessageTable()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Communication Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">
                  Contact Submissions
                </h3>
                <p className="text-3xl font-bold text-blue-900">
                  {unifiedMessages.filter((m) => m.type === "contact").length}
                </p>
                <p className="text-sm text-blue-700">
                  New:{" "}
                  {
                    unifiedMessages.filter(
                      (m) => m.type === "contact" && m.status === "new"
                    ).length
                  }
                </p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-pink-800">
                  Newsletter Replies
                </h3>
                <p className="text-3xl font-bold text-pink-900">
                  {
                    unifiedMessages.filter((m) => m.type === "newsletter")
                      .length
                  }
                </p>
                <p className="text-sm text-pink-700">
                  Last 7 days:{" "}
                  {
                    unifiedMessages.filter(
                      (m) =>
                        m.type === "newsletter" &&
                        new Date(m.createdAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-orange-800">
                  Inbound Emails
                </h3>
                <p className="text-3xl font-bold text-orange-900">
                  {unifiedMessages.filter((m) => m.type === "email").length}
                </p>
                <p className="text-sm text-orange-700">
                  Unprocessed:{" "}
                  {
                    unifiedMessages.filter(
                      (m) => m.type === "email" && m.status === "new"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );

  // Helper function to render the message table
  function renderMessageTable() {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (filteredMessages.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No messages found</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("type")}
                >
                  Type
                  {sortField === "type" && <ArrowUpDown className="h-3 w-3" />}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("subject")}
                >
                  Subject
                  {sortField === "subject" && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("sender")}
                >
                  From
                  {sortField === "sender" && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("messageCount")}
                >
                  Messages
                  {sortField === "messageCount" && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[150px]">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("lastActivity")}
                >
                  Last Activity
                  {sortField === "lastActivity" && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow
                key={message.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(message)}
              >
                <TableCell>
                  <Badge className={getTypeColor(message.type)}>
                    {message.type.charAt(0).toUpperCase() +
                      message.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{message.subject}</TableCell>
                <TableCell>
                  <div>{message.sender}</div>
                  <div className="text-sm text-gray-500">{message.email}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(message.status)}>
                    {message.status.charAt(0).toUpperCase() +
                      message.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {message.messageCount}
                </TableCell>
                <TableCell>
                  {format(new Date(message.lastActivity), "MMM d, yyyy")}
                  <div className="text-xs text-gray-500">
                    {format(new Date(message.lastActivity), "h:mm a")}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
