import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Synthalyst",
  description: "Admin dashboard for Synthalyst",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contact Submissions Card */}
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h2 className="text-xl font-semibold mb-2">Contact Submissions</h2>
          <p className="text-muted-foreground mb-4">
            View and manage contact form submissions from users.
          </p>
          <a
            href="/admin/contact-submissions"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View Submissions
          </a>
        </div>

        {/* Add more admin cards here */}
      </div>
    </div>
  );
}
