"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add class to body when JavaScript loads
    document.body.classList.add("js-loaded");

    // Handle chunk loading errors
    const handleError = (event: ErrorEvent) => {
      // Check if the error is related to chunk loading
      if (
        event.message &&
        (event.message.includes("Loading chunk") ||
          event.message.includes("Loading CSS chunk") ||
          event.message.includes("Failed to load resource"))
      ) {
        console.error("Resource loading error:", event.message);

        // Attempt to recover by reloading the page
        if (window.location.href.includes("?retry=true")) {
          console.log("Already attempted retry, not reloading again");
        } else {
          console.log("Attempting to recover by reloading");
          window.location.href = window.location.href + "?retry=true";
        }
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
