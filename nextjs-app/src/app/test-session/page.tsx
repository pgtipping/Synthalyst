"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session in test page:", session);
    console.log("Session status:", status);
    if (session?.user) {
      console.log("User role:", session.user.role);
    }
  }, [session, status]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Session Test Page</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Session Status: {status}</h2>

        {status === "loading" && <p>Loading session...</p>}

        {status === "unauthenticated" && (
          <p className="text-red-500">You are not signed in.</p>
        )}

        {status === "authenticated" && session && (
          <div>
            <p className="text-green-500 mb-4">You are signed in!</p>

            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {session.user.id}
              </p>
              <p>
                <strong>Name:</strong> {session.user.name || "Not provided"}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email || "Not provided"}
              </p>
              <p>
                <strong>Role:</strong> {session.user.role || "Not provided"}
              </p>
              <p>
                <strong>Is Admin:</strong>{" "}
                {session.user.role === "ADMIN" ? "Yes" : "No"}
              </p>
            </div>

            <pre className="mt-6 p-4 bg-gray-100 rounded overflow-auto max-h-96">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
