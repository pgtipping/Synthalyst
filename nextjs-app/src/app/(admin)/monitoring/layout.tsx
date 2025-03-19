import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "System Monitoring | Admin Dashboard",
  description: "Monitor Redis performance, caching, and rate limiting metrics",
};

export default function MonitoringLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
