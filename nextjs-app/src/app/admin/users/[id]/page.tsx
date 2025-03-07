import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { UpdateUserRoleForm } from "./update-role-form";

export const metadata: Metadata = {
  title: "Edit User | Admin Dashboard | Synthalyst",
  description: "Edit user roles in the Synthalyst admin dashboard",
};

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = params.id;

  // Get user details
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/admin/users");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/users"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Users</span>
        </Link>
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              User Details
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="flex items-center gap-4 mb-6">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <h4 className="text-xl font-semibold">
                  {user.name || "Unnamed User"}
                </h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Current Role
                  </h5>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Joined
                  </h5>
                  <p className="mt-1">{user.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Update Role
            </h3>
          </div>
          <div className="p-6 pt-0">
            <UpdateUserRoleForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
