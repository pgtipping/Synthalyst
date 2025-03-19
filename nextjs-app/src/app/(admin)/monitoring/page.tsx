"use client";

import { RedisMonitoring } from "@/app/(admin)/components";
import { AdminLayout } from "../components";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function MonitoringPage() {
  const { status } = useSession();

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

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
      <RedisMonitoring />
    </AdminLayout>
  );
}
