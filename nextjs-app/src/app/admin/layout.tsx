import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminRootLayout({ children }: AdminLayoutProps) {
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

  // Return the children directly - AdminLayout will be used in client components
  return children;
}
