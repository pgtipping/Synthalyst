import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostList from "@/components/admin/blog/PostList";
import Analytics from "@/components/admin/blog/Analytics";
import Settings from "@/components/admin/blog/Settings";
import AdminDashboardWrapper from "@/components/admin/AdminDashboardWrapper";

export const metadata: Metadata = {
  title: "Blog Management | Admin Dashboard",
  description: "Manage blog posts, view analytics, and configure blog settings",
};

export default async function BlogManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/blog");
  }

  // Fetch initial data
  const [posts, totalPosts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true },
        },
        categories: true,
        tags: true,
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.post.count(),
    prisma.category.findMany(),
    prisma.tag.findMany(),
  ]);

  return (
    <AdminDashboardWrapper>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <Card className="p-6">
              <PostList initialPosts={posts} totalPosts={totalPosts} />
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6">
              <Analytics />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <Settings categories={categories} tags={tags} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardWrapper>
  );
}
