import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminLayout from "./components/AdminLayout";

// Import module-specific styles directly
import "./styles/admin.css";

// Add module-specific metadata to ensure CSS loading priority
export const metadata = {
  other: {
    "admin-styles": true,
  },
};

// Do not import global CSS here, it's already imported in the root layout

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

  // Wrap children with the AdminLayout for navigation and sidebar
  return (
    <>
      {/* Add a direct link to the pre-compiled CSS file for reliability */}
      <link rel="stylesheet" href="/admin-styles.css" precedence="high" />

      <div className="admin-root">
        <AdminLayout>{children}</AdminLayout>
      </div>

      {/* Add script to add class to body - using a client-side script tag */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.body.classList.add('admin-view');
        `,
        }}
      />
    </>
  );
}
