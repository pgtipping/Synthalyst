"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2 } from "lucide-react";

interface AdminDashboardWrapperProps {
  children: ReactNode;
}

export default function AdminDashboardWrapper({
  children,
}: AdminDashboardWrapperProps) {
  const { status } = useSession();
  const router = useRouter();

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  return <AdminLayout>{children}</AdminLayout>;
}
