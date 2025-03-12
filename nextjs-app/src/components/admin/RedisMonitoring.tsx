import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

interface RedisMetrics {
  timestamp: string;
  metrics: {
    rateLimitHits: number;
    cacheHits: number;
    cacheMisses: number;
    cacheHitRate: string;
    errors: Array<{
      timestamp: string;
      operation: string;
      error: string;
    }>;
  };
  cache: {
    totalKeys: number;
    totalSize: number;
    keysByPattern: Record<string, number>;
    hitRate: string;
  };
  rateLimiting: {
    analytics: Record<string, number>;
    currentLimits: {
      success: boolean;
      limit: number;
      remaining: number;
      reset: string;
    };
  };
  status: {
    healthy: boolean;
    lastError: string | null;
  };
}

export function RedisMonitoring() {
  const [metrics, setMetrics] = useState<RedisMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/monitoring/redis", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
      toast({
        title: "Error",
        description: "Failed to fetch Redis metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to reset metrics
  const resetMetrics = async (
    action: "reset_metrics" | "reset_cache" | "reset_rate_limits"
  ) => {
    try {
      setLoading(true);
      const response = await fetch("/api/monitoring/redis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: `Successfully reset ${action.replace("_", " ")}`,
      });

      // Refresh metrics after reset
      await fetchMetrics();
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to reset ${action.replace("_", " ")}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Redis Monitoring</h2>
        <Button
          onClick={() => fetchMetrics()}
          disabled={loading}
          variant="outline"
        >
          {loading ? (
            <ReloadIcon className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh Metrics"
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cache Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Cache Statistics</CardTitle>
            <CardDescription>Cache performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Hit Rate:</span>
                <span className="font-mono">
                  {metrics?.metrics.cacheHitRate || "0%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Keys:</span>
                <span className="font-mono">
                  {metrics?.cache.totalKeys || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Size:</span>
                <span className="font-mono">
                  {metrics?.cache.totalSize || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
            <CardDescription>Current rate limit status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Hits:</span>
                <span className="font-mono">
                  {metrics?.metrics.rateLimitHits || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Limit:</span>
                <span className="font-mono">
                  {metrics?.rateLimiting.currentLimits.limit || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-mono">
                  {metrics?.rateLimiting.currentLimits.remaining || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Overall system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`font-mono ${
                    metrics?.status.healthy ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {metrics?.status.healthy ? "Healthy" : "Unhealthy"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Error:</span>
                <span className="font-mono">
                  {metrics?.status.lastError
                    ? new Date(metrics.status.lastError).toLocaleString()
                    : "None"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
          <CardDescription>Last 5 system errors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics?.metrics.errors.slice(0, 5).map((error, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(error.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{error.operation}</TableCell>
                  <TableCell>{error.error}</TableCell>
                </TableRow>
              ))}
              {(!metrics?.metrics.errors ||
                metrics.metrics.errors.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No recent errors
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reset Controls */}
      <Card>
        <CardHeader>
          <CardTitle>System Controls</CardTitle>
          <CardDescription>Reset system metrics and caches</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={() => resetMetrics("reset_metrics")}
            disabled={loading}
            variant="outline"
          >
            Reset Metrics
          </Button>
          <Button
            onClick={() => resetMetrics("reset_cache")}
            disabled={loading}
            variant="outline"
          >
            Clear Cache
          </Button>
          <Button
            onClick={() => resetMetrics("reset_rate_limits")}
            disabled={loading}
            variant="outline"
          >
            Reset Rate Limits
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
