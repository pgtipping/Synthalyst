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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Send,
  RefreshCw,
  Download,
  BarChart,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tag,
  Tags,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminLayout } from "../components";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  confirmed: boolean;
  active: boolean;
  unsubscribed: boolean;
  createdAt: string;
  source: string | null;
  tags: string[];
}

interface SubscriberStats {
  total: number;
  confirmed: number;
  active: number;
  unsubscribed: number;
}

interface SubscriberUpdateData {
  confirmed?: boolean;
  active?: boolean;
  unsubscribed?: boolean;
  name?: string | null;
  tags?: string[];
}

interface NewsletterHistory {
  id: string;
  subject: string;
  content?: string;
  recipientCount: number;
  sentBy: string;
  filter: string;
  createdAt: string;
  opens: number;
  clicks: number;
  bounces: number;
  unsubscribes: number;
  metrics: NewsletterMetrics;
  analytics?: NewsletterAnalytics;
}

interface NewsletterHistoryResponse {
  history: NewsletterHistory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface NewsletterTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface NewsletterAnalytics {
  linkClicks: Record<string, number>;
  deviceStats: Record<string, number>;
  locationStats: Record<string, number>;
  openTimes: Record<string, number>;
}

interface NewsletterMetrics {
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

interface TagCount {
  name: string;
  count: number;
}

export default function NewsletterAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<SubscriberStats>({
    total: 0,
    confirmed: 0,
    active: 0,
    unsubscribed: 0,
  });
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [newSubscriberName, setNewSubscriberName] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // Add new state for newsletter sending
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const [history, setHistory] = useState<NewsletterHistory[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<NewsletterHistory | null>(null);
  const [loadingNewsletterDetails, setLoadingNewsletterDetails] =
    useState(false);

  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [tags, setTags] = useState<TagCount[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loadingTags, setLoadingTags] = useState(false);

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch subscribers
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchSubscribers();
    }
  }, [status, session]);

  // Filter subscribers when search term or status filter changes
  useEffect(() => {
    if (subscribers.length > 0) {
      let filtered = [...subscribers];

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((subscriber) => {
          if (statusFilter === "confirmed") return subscriber.confirmed;
          if (statusFilter === "unconfirmed") return !subscriber.confirmed;
          if (statusFilter === "active") return subscriber.active;
          if (statusFilter === "unsubscribed") return subscriber.unsubscribed;
          return true;
        });
      }

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (subscriber) =>
            subscriber.email.toLowerCase().includes(term) ||
            (subscriber.name && subscriber.name.toLowerCase().includes(term))
        );
      }

      setFilteredSubscribers(filtered);
    }
  }, [subscribers, searchTerm, statusFilter]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/newsletter/subscribers");
      if (!response.ok) {
        throw new Error("Failed to fetch subscribers");
      }
      const data = await response.json();
      setSubscribers(data.subscribers);
      setFilteredSubscribers(data.subscribers);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriberEmail) return;

    setAddingSubscriber(true);
    try {
      const response = await fetch("/api/admin/newsletter/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newSubscriberEmail,
          name: newSubscriberName || null,
          source: "admin",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add subscriber");
      }

      toast({
        title: "Success",
        description: "Subscriber added successfully.",
      });

      setNewSubscriberEmail("");
      setNewSubscriberName("");
      fetchSubscribers();
    } catch (error) {
      console.error("Error adding subscriber:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add subscriber",
      });
    } finally {
      setAddingSubscriber(false);
    }
  };

  const handleUpdateSubscriberStatus = async (
    id: string,
    data: SubscriberUpdateData
  ) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to update subscriber");
      }

      toast({
        title: "Success",
        description: "Subscriber updated successfully.",
      });

      fetchSubscribers();
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update subscriber",
      });
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete subscriber");
      }

      toast({
        title: "Success",
        description: "Subscriber deleted successfully.",
      });

      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete subscriber",
      });
    }
  };

  const exportSubscribers = () => {
    const csv = [
      [
        "Email",
        "Name",
        "Confirmed",
        "Active",
        "Unsubscribed",
        "Created At",
        "Source",
        "Tags",
      ].join(","),
      ...filteredSubscribers.map((subscriber) =>
        [
          subscriber.email,
          subscriber.name || "",
          subscriber.confirmed,
          subscriber.active,
          subscriber.unsubscribed,
          subscriber.createdAt,
          subscriber.source || "",
          subscriber.tags.join(";"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterSubject || !newsletterContent) {
      toast({
        title: "Error",
        description:
          "Please provide both subject and content for the newsletter.",
      });
      return;
    }

    setSendingNewsletter(true);
    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: newsletterSubject,
          content: newsletterContent,
          filter: recipientFilter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send newsletter");
      }

      toast({
        title: "Success",
        description: data.message || "Newsletter sent successfully.",
      });

      // Reset form
      setNewsletterSubject("");
      setNewsletterContent("");
      setRecipientFilter("all");
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send newsletter",
      });
    } finally {
      setSendingNewsletter(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(
        `/api/admin/newsletter/history?page=${page}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter history");
      }
      const data: NewsletterHistoryResponse = await response.json();
      setHistory(data.history);
      setHistoryPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching newsletter history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch newsletter history",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchHistory(historyPage);
    }
  }, [status, session, historyPage]);

  const viewNewsletter = async (id: string) => {
    setLoadingNewsletterDetails(true);
    try {
      const response = await fetch(`/api/admin/newsletter/history/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter details");
      }
      const data = await response.json();
      setSelectedNewsletter(data);
    } catch (error) {
      console.error("Error fetching newsletter details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch newsletter details",
      });
    } finally {
      setLoadingNewsletterDetails(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !newsletterContent) {
      toast({
        title: "Error",
        description: "Please provide both name and content for the template.",
      });
      return;
    }

    setSavingTemplate(true);
    try {
      const response = await fetch("/api/admin/newsletter/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateName,
          content: newsletterContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      toast({
        title: "Success",
        description: "Template saved successfully.",
      });

      setTemplateName("");
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template",
      });
    } finally {
      setSavingTemplate(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/newsletter/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchTemplates();
    }
  }, [status, session]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setNewsletterContent(template.content);
    }
  };

  const fetchTags = async () => {
    setLoadingTags(true);
    try {
      const response = await fetch("/api/admin/newsletter/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tags",
      });
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchTags();
    }
  }, [status, session]);

  const handleAddTag = async () => {
    if (!newTag || selectedSubscribers.length === 0) {
      toast({
        title: "Error",
        description: "Please select subscribers and enter a tag",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/newsletter/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriberIds: selectedSubscribers,
          tags: [newTag],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add tag");
      }

      toast({
        title: "Success",
        description: "Tag added successfully",
      });

      setNewTag("");
      fetchSubscribers();
      fetchTags();
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: "Failed to add tag",
      });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (selectedSubscribers.length === 0) {
      toast({
        title: "Error",
        description: "Please select subscribers",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/newsletter/tags", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriberIds: selectedSubscribers,
          tags: [tag],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove tag");
      }

      toast({
        title: "Success",
        description: "Tag removed successfully",
      });

      fetchSubscribers();
      fetchTags();
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: "Failed to remove tag",
      });
    }
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
        <h1 className="text-3xl font-bold">Newsletter Management</h1>

        <Tabs defaultValue="subscribers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="send">Send Newsletter</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscriber List</CardTitle>
                <CardDescription>
                  Manage your newsletter subscribers
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email or name..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={fetchSubscribers}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportSubscribers}
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      disabled={selectedSubscribers.length === 0}
                    />
                    <Button
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!newTag || selectedSubscribers.length === 0}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
                </div>

                {loadingTags ? (
                  <div className="flex items-center gap-2 mt-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading tags...
                  </div>
                ) : tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Tags className="h-4 w-4 text-muted-foreground" />
                    {tags.map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag.name)}
                      >
                        {tag.name} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredSubscribers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No subscribers found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <input
                              type="checkbox"
                              title="Select all subscribers"
                              aria-label="Select all subscribers"
                              checked={
                                selectedSubscribers.length ===
                                filteredSubscribers.length
                              }
                              onChange={(e) => {
                                setSelectedSubscribers(
                                  e.target.checked
                                    ? filteredSubscribers.map((s) => s.id)
                                    : []
                                );
                              }}
                              className="h-4 w-4"
                            />
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                title={`Select ${subscriber.email}`}
                                aria-label={`Select ${subscriber.email}`}
                                checked={selectedSubscribers.includes(
                                  subscriber.id
                                )}
                                onChange={(e) => {
                                  setSelectedSubscribers(
                                    e.target.checked
                                      ? [...selectedSubscribers, subscriber.id]
                                      : selectedSubscribers.filter(
                                          (id) => id !== subscriber.id
                                        )
                                  );
                                }}
                                className="h-4 w-4"
                              />
                            </TableCell>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{subscriber.name || "-"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {subscriber.confirmed ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200"
                                  >
                                    Confirmed
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Unconfirmed
                                  </Badge>
                                )}
                                {subscriber.active ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Active
                                  </Badge>
                                ) : null}
                                {subscriber.unsubscribed ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200"
                                  >
                                    Unsubscribed
                                  </Badge>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {subscriber.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{subscriber.source || "-"}</TableCell>
                            <TableCell>
                              {format(new Date(subscriber.createdAt), "PPP")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {!subscriber.confirmed && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateSubscriberStatus(
                                        subscriber.id,
                                        {
                                          confirmed: true,
                                        }
                                      )
                                    }
                                  >
                                    Confirm
                                  </Button>
                                )}
                                {subscriber.unsubscribed && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateSubscriberStatus(
                                        subscriber.id,
                                        {
                                          unsubscribed: false,
                                          active: true,
                                        }
                                      )
                                    }
                                  >
                                    Reactivate
                                  </Button>
                                )}
                                {!subscriber.unsubscribed && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateSubscriberStatus(
                                        subscriber.id,
                                        {
                                          unsubscribed: true,
                                          active: false,
                                        }
                                      )
                                    }
                                  >
                                    Unsubscribe
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteSubscriber(subscriber.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Send Newsletter Tab */}
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Newsletter</CardTitle>
                <CardDescription>
                  Create and send a newsletter to your subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendNewsletter} className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Your Newsletter Subject"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={newsletterContent}
                      onChange={setNewsletterContent}
                      placeholder="Write your newsletter content here..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="filter" className="text-sm font-medium">
                      Send to
                    </label>
                    <Select
                      value={recipientFilter}
                      onValueChange={setRecipientFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Active Subscribers
                        </SelectItem>
                        <SelectItem value="confirmed">
                          Confirmed Only
                        </SelectItem>
                        <SelectItem value="recent">
                          Recent Subscribers (30 days)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={sendingNewsletter}>
                    {sendingNewsletter ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Newsletter
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter History</CardTitle>
                <CardDescription>
                  View past newsletters and their performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No newsletters have been sent yet
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Recipients</TableHead>
                            <TableHead>Sent By</TableHead>
                            <TableHead>Filter</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                {format(new Date(item.createdAt), "PPP")}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto font-normal"
                                  onClick={() => viewNewsletter(item.id)}
                                >
                                  {item.subject}
                                </Button>
                              </TableCell>
                              <TableCell>{item.recipientCount}</TableCell>
                              <TableCell>{item.sentBy}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{item.filter}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {historyPagination && (
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setHistoryPage((p) => Math.max(1, p - 1))
                          }
                          disabled={historyPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1 text-sm">
                          <span>Page</span>
                          <span className="font-medium">{historyPage}</span>
                          <span>of</span>
                          <span className="font-medium">
                            {historyPagination.totalPages || 1}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setHistoryPage((p) =>
                              Math.min(historyPagination.totalPages || 1, p + 1)
                            )
                          }
                          disabled={
                            historyPage === (historyPagination.totalPages || 1)
                          }
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Templates</CardTitle>
                <CardDescription>
                  Save and manage your newsletter templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="templateName"
                        className="text-sm font-medium"
                      >
                        Template Name
                      </label>
                      <Input
                        id="templateName"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="templateContent"
                        className="text-sm font-medium"
                      >
                        Content
                      </label>
                      <RichTextEditor
                        value={newsletterContent}
                        onChange={setNewsletterContent}
                        placeholder="Write your template content..."
                      />
                    </div>
                    <Button
                      onClick={handleSaveTemplate}
                      disabled={savingTemplate}
                    >
                      {savingTemplate ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Template
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">
                      Saved Templates
                    </h3>
                    {templates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No templates saved yet
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {templates.map((template) => (
                          <Card key={template.id}>
                            <CardHeader>
                              <CardTitle>{template.name}</CardTitle>
                              <CardDescription>
                                Created on{" "}
                                {format(new Date(template.createdAt), "PPP")}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleTemplateSelect(template.id)
                                }
                              >
                                Use Template
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="space-y-4">
            {/* ... existing tags tab content ... */}
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!selectedNewsletter}
          onOpenChange={() => setSelectedNewsletter(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedNewsletter?.subject}</DialogTitle>
              <DialogDescription>
                Sent on{" "}
                {selectedNewsletter?.createdAt &&
                  format(new Date(selectedNewsletter.createdAt), "PPP")}{" "}
                to {selectedNewsletter?.recipientCount} recipients
              </DialogDescription>
            </DialogHeader>
            {loadingNewsletterDetails ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">
                        {selectedNewsletter?.metrics.openRate.toFixed(1)}%
                      </CardTitle>
                      <CardDescription>Open Rate</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">
                        {selectedNewsletter?.metrics.clickRate.toFixed(1)}%
                      </CardTitle>
                      <CardDescription>Click Rate</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">
                        {selectedNewsletter?.metrics.bounceRate.toFixed(1)}%
                      </CardTitle>
                      <CardDescription>Bounce Rate</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">
                        {selectedNewsletter?.metrics.unsubscribeRate.toFixed(1)}
                        %
                      </CardTitle>
                      <CardDescription>Unsubscribe Rate</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {selectedNewsletter?.analytics && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        <Monitor className="inline-block mr-2 h-5 w-5" />
                        Device Distribution
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(
                          selectedNewsletter.analytics.deviceStats
                        ).map(([device, count]) => (
                          <div key={device} className="flex items-center gap-2">
                            {device === "desktop" ? (
                              <Monitor className="h-4 w-4" />
                            ) : (
                              <Smartphone className="h-4 w-4" />
                            )}
                            <span className="font-medium">{device}:</span>
                            <span>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        <Globe className="inline-block mr-2 h-5 w-5" />
                        Top Locations
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(
                          selectedNewsletter.analytics.locationStats
                        ).map(([location, count]) => (
                          <div
                            key={location}
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">{location}:</span>
                            <span>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        <Clock className="inline-block mr-2 h-5 w-5" />
                        Open Times
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(
                          selectedNewsletter.analytics.openTimes
                        ).map(([time, count]) => (
                          <div key={time} className="flex items-center gap-2">
                            <span className="font-medium">{time}:</span>
                            <span>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        <BarChart className="inline-block mr-2 h-5 w-5" />
                        Link Clicks
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(
                          selectedNewsletter.analytics.linkClicks
                        ).map(([link, count]) => (
                          <div
                            key={link}
                            className="flex items-center justify-between"
                          >
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate max-w-[80%]"
                            >
                              {link}
                            </a>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Content</h3>
                  <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedNewsletter?.content || "",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
