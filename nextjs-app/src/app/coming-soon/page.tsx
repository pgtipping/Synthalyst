import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Bell } from "lucide-react";

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string; path?: string }>;
}) {
  // Resolve searchParams since it's a Promise in Next.js 15
  const resolvedParams = await searchParams;
  const toolName = resolvedParams.tool || "This tool";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-white text-center">
          <Clock className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Coming Soon</h1>
        </div>

        <div className="p-6 bg-[#f5f5f7]">
          <p className="text-lg text-center mb-6">
            <strong>{toolName}</strong> is currently under development and will
            be available soon.
          </p>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-primary" />
              Get Notified
            </h2>
            <p className="text-gray-600 mb-4">
              Want to be the first to know when this tool is ready?
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button>Notify Me</Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/tools" className="w-full">
              <Button className="w-full">Return to Tools</Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
