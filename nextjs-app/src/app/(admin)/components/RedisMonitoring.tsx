"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "../lib/admin-utils";

interface RedisStats {
  connected: boolean;
  hitRate?: number;
  memoryUsage?: number;
  totalKeys?: number;
  uptimeSeconds?: number;
  error?: string;
  lastRefreshed: string;
}

export function RedisMonitoring() {
  const [stats, setStats] = useState<RedisStats>({
    connected: false,
    lastRefreshed: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRedisStats = async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/monitoring/redis-stats");
      if (!response.ok) {
        throw new Error(`Failed to fetch Redis stats: ${response.statusText}`);
      }

      const data = await response.json();
      setStats({
        ...data,
        lastRefreshed: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching Redis stats:", error);
      setStats({
        connected: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        lastRefreshed: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRedisStats();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchRedisStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds?: number) => {
    if (!seconds) return "N/A";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> Redis Status
            </CardTitle>
            <CardDescription>
              Cache performance and health metrics
            </CardDescription>
          </div>
          {stats.connected ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Connected
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200"
            >
              Disconnected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stats.error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">
                Error connecting to Redis
              </p>
              <p className="text-sm text-red-700 mt-1">{stats.error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">Cache Hit Rate</span>
                <span className="font-medium">
                  {stats.hitRate?.toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.hitRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="font-medium">
                  {(stats.memoryUsage || 0).toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.memoryUsage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Total Keys</p>
                <p className="font-semibold mt-1">
                  {stats.totalKeys ? formatNumber(stats.totalKeys) : "N/A"}
                </p>
              </div>

              <div className="border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="font-semibold mt-1">
                  {formatUptime(stats.uptimeSeconds)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-5">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(stats.lastRefreshed).toLocaleTimeString()}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRedisStats}
          disabled={refreshing}
          className="text-xs h-7 px-2"
        >
          {refreshing ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
