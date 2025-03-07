"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface RefreshResult {
  message?: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  };
  session?: {
    user: SessionUser;
  };
  error?: string;
}

export default function RefreshButton() {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RefreshResult | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Call the refresh session API
      const response = await fetch("/api/auth/refresh-session");
      const data = await response.json();

      // Log the result
      console.log("Refresh result:", data);
      setResult(data);

      // Update the session
      await update();
      console.log("Session updated");
    } catch (error) {
      console.error("Error refreshing session:", error);
      setResult({ error: "Failed to refresh session" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Refreshing..." : "Refresh Session"}
      </button>

      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Refresh Result:</h3>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
