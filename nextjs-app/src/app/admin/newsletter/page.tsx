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
  UserPlus,
  Send,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

export default function NewsletterAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
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

  // Check if user is admin
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

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
        variant: "destructive",
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
        variant: "destructive",
      });
    } finally {
      setAddingSubscriber(false);
    }
  };

  const handleUpdateSubscriberStatus = async (id: string, data: any) => {
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
        variant: "destructive",
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
        variant: "destructive",
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

  if (
    status === "loading" ||
    (status === "authenticated" && session?.user?.role !== "ADMIN")
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Newsletter Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total Subscribers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.confirmed}</CardTitle>
            <CardDescription>Confirmed</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.active}</CardTitle>
            <CardDescription>Active</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.unsubscribed}</CardTitle>
            <CardDescription>Unsubscribed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="subscribers">
        <TabsList className="mb-4">
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="add">Add Subscriber</TabsTrigger>
          <TabsTrigger value="send">Send Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers">
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
              </div>
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
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
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
                          <TableCell>{subscriber.source || "-"}</TableCell>
                          <TableCell>
                            {new Date(
                              subscriber.createdAt
                            ).toLocaleDateString()}
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

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Subscriber</CardTitle>
              <CardDescription>
                Manually add a new subscriber to your newsletter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubscriber} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="subscriber@example.com"
                      value={newSubscriberEmail}
                      onChange={(e) => setNewSubscriberEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name (optional)
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={newSubscriberName}
                      onChange={(e) => setNewSubscriberName(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={addingSubscriber}>
                  {addingSubscriber ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Subscriber
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send Newsletter</CardTitle>
              <CardDescription>
                Create and send a newsletter to your subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Your Newsletter Subject"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    className="min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your newsletter content in HTML format..."
                  ></textarea>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="filter" className="text-sm font-medium">
                    Send to
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Active Subscribers
                      </SelectItem>
                      <SelectItem value="confirmed">Confirmed Only</SelectItem>
                      <SelectItem value="recent">
                        Recent Subscribers (30 days)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Send Newsletter
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Note: This feature is currently in development. In the future,
                  you&apos;ll be able to send newsletters directly from this
                  interface.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
