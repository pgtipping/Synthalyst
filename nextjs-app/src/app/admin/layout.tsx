import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  BarChart,
  Settings,
  Star,
  Inbox,
  MailCheck,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Breadcrumb } from "@/components/admin/Breadcrumb";

// Extend the session type to include role
interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Communications",
    href: "/admin/communications",
    icon: MessageSquare,
  },
  {
    title: "Contact Submissions",
    href: "/admin/contact-submissions",
    icon: Inbox,
  },
  {
    title: "Email Logs",
    href: "/admin/email-logs",
    icon: MailCheck,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Feedback",
    href: "/admin/feedback",
    icon: Star,
  },
  {
    title: "Monitoring",
    href: "/admin/monitoring",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  let session: ExtendedSession | null = null;

  try {
    session = (await getServerSession(authOptions)) as ExtendedSession | null;

    // Check if user is authenticated and has admin role
    if (
      !session ||
      (session.user?.role !== "ADMIN" &&
        session.user?.email !== "pgtipping1@gmail.com")
    ) {
      redirect("/");
    }
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900">
                  Admin
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        <main className="bg-white shadow-sm rounded-lg p-6">{children}</main>
      </div>
    </div>
  );
}
