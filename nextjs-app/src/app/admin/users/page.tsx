import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard | Synthalyst",
  description: "Manage users and roles in the Synthalyst admin dashboard",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in
  if (!session) {
    redirect("/");
  }

  // Check if user is admin or has specific email
  const isAdmin = session.user.role === "ADMIN";
  const hasAdminEmail = session.user.email === "pgtipping1@gmail.com";

  // Redirect if not admin and doesn't have admin email
  if (!isAdmin && !hasAdminEmail) {
    redirect("/");
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="h-6 w-6" /> User Management
          </h1>
        </div>
        <div>
          <Badge variant="outline" className="text-sm">
            {users.length} Users
          </Badge>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-gray-500 dark:text-gray-400">
            View and manage user roles. Currently, role changes must be made
            directly in the database. A user interface for role management will
            be implemented soon.
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(
                (user: {
                  id: string;
                  name: string | null;
                  email: string | null;
                  role: string;
                  createdAt: Date;
                }) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || "N/A"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "destructive" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
