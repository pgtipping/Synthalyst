"use client";

import React, { ReactNode, useState, useEffect } from "react";
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
import { Breadcrumb } from "@/components/admin/Breadcrumb";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("admin-sidebar");
      if (isMobile && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar overlay - mobile only */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - collapsible on mobile, fixed on desktop */}
      <div
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform ease-in-out duration-300 lg:translate-x-0 lg:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
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
                    onClick={() => isMobile && setSidebarOpen(false)}
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
      <div className="flex-1 flex flex-col">
        {/* Top navigation bar - visible on all screen sizes */}
        <div className="bg-white shadow-sm z-10 sticky top-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden mr-2"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <span className="text-xl font-bold text-gray-900 lg:hidden">
                  Admin
                </span>
              </div>

              {/* Desktop horizontal nav */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                {navigation.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-2 py-1 text-sm font-medium rounded-md",
                        item.current
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Sign out button - always visible */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <main className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mt-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
