"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart,
  Settings,
  Menu,
  X,
  LogOut,
  MessageSquare,
  Mail,
  Star,
  Inbox,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathname.startsWith("/admin/users"),
    },
    {
      name: "Contact Submissions",
      href: "/admin/contact-submissions",
      icon: Inbox,
      current: pathname.startsWith("/admin/contact-submissions"),
    },
    {
      name: "Email Logs",
      href: "/admin/email-logs",
      icon: MailCheck,
      current: pathname.startsWith("/admin/email-logs"),
    },
    {
      name: "Blog Posts",
      href: "/admin/blog",
      icon: FileText,
      current: pathname.startsWith("/admin/blog"),
    },
    {
      name: "Communications",
      href: "/admin/communications",
      icon: MessageSquare,
      current: pathname.startsWith("/admin/communications"),
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      current: pathname.startsWith("/admin/newsletter"),
    },
    {
      name: "Feedback",
      href: "/admin/feedback",
      icon: Star,
      current: pathname.startsWith("/admin/feedback"),
    },
    {
      name: "Analytics",
      href: "/admin/monitoring",
      icon: BarChart,
      current: pathname.startsWith("/admin/monitoring"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/admin" className="text-xl font-bold text-gray-900">
          Admin Dashboard
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform ease-in-out duration-300 lg:translate-x-0 lg:static lg:h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
