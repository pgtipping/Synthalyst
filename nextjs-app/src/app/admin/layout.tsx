import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  Mail,
  FileText,
} from "lucide-react";
import Link from "next/link";

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
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Communications",
    href: "/admin/communications",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(
    authOptions
  )) as ExtendedSession | null;

  // Check if user is authenticated and has admin role
  if (
    !session ||
    (session.user.role !== "ADMIN" &&
      session.user.email !== "pgtipping1@gmail.com")
  ) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-6 overflow-x-auto py-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
