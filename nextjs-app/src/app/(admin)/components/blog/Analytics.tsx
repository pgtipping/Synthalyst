"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsData {
  views: number[];
  comments: number[];
  likes: number[];
  dates: string[];
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/admin/blog/analytics?range=${timeRange}`
      );
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!data) {
    return <div>No analytics data available</div>;
  }

  const chartData = data.dates.map((date, index) => ({
    date,
    views: data.views[index],
    comments: data.comments[index],
    likes: data.likes[index],
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Views</h3>
          <p className="text-2xl">
            {data.views.reduce((a, b) => a + b, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Comments</h3>
          <p className="text-2xl">
            {data.comments.reduce((a, b) => a + b, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Likes</h3>
          <p className="text-2xl">
            {data.likes.reduce((a, b) => a + b, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Performance Over Time</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#2563eb"
                name="Views"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#16a34a"
                name="Comments"
              />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#dc2626"
                name="Likes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
