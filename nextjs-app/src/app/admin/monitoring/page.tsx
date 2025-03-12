import { RedisMonitoring } from "@/components/admin/RedisMonitoring";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Monitoring | Admin Dashboard",
  description: "Monitor Redis performance, caching, and rate limiting metrics",
};

export default function MonitoringPage() {
  return (
    <div className="container mx-auto py-8">
      <RedisMonitoring />
    </div>
  );
}
