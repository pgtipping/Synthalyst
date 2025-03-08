"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface FeedbackData {
  rating: number;
  count: number;
  percentage: number;
}

interface FeedbackAnalyticsProps {
  frameworkId?: string;
  showGlobalStats?: boolean;
}

export default function FeedbackAnalytics({
  frameworkId,
  showGlobalStats = false,
}: FeedbackAnalyticsProps) {
  const [feedbackStats, setFeedbackStats] = useState<{
    averageRating: number;
    totalFeedback: number;
    ratingDistribution: FeedbackData[];
    qualityFeedback: { good: number; needsImprovement: number };
    recentFeedback: Array<{
      rating: number;
      feedback: string;
      createdAt: string;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = frameworkId
          ? `/api/competency-manager/feedback?frameworkId=${frameworkId}`
          : "/api/competency-manager/feedback";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch feedback statistics");
        }

        const data = await response.json();
        setFeedbackStats(data);
      } catch (err) {
        console.error("Error fetching feedback stats:", err);
        setError("Failed to load feedback statistics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackStats();
  }, [frameworkId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (!feedbackStats) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 rounded-md">
        <p>No feedback data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {showGlobalStats
          ? "Global Feedback Analytics"
          : "Framework Feedback Analytics"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-3xl font-bold">
                {feedbackStats.averageRating.toFixed(1)}
              </span>
              <span className="text-yellow-400 ml-2">★</span>
              <span className="text-sm text-gray-500 ml-2">/ 5.0</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {feedbackStats.totalFeedback}{" "}
              {feedbackStats.totalFeedback === 1 ? "review" : "reviews"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Quality Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Good</span>
                <span>
                  {Math.round(
                    (feedbackStats.qualityFeedback.good /
                      feedbackStats.totalFeedback) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (feedbackStats.qualityFeedback.good /
                    feedbackStats.totalFeedback) *
                  100
                }
                className="h-2"
              />

              <div className="flex justify-between text-xs">
                <span>Needs Improvement</span>
                <span>
                  {Math.round(
                    (feedbackStats.qualityFeedback.needsImprovement /
                      feedbackStats.totalFeedback) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (feedbackStats.qualityFeedback.needsImprovement /
                    feedbackStats.totalFeedback) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {feedbackStats.totalFeedback}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {showGlobalStats ? "Across all frameworks" : "For this framework"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="distribution">Rating Distribution</TabsTrigger>
          <TabsTrigger value="recent">Recent Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="w-full md:w-1/2 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={feedbackStats.ratingDistribution}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="rating" />
                          <YAxis />
                          <RechartsTooltip
                            formatter={(value, name) => [
                              `${value} reviews`,
                              "Count",
                            ]}
                            labelFormatter={(label) => `${label} stars`}
                          />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full md:w-1/2 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={feedbackStats.ratingDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="rating"
                          >
                            {feedbackStats.ratingDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {feedbackStats.ratingDistribution.map((item) => (
                  <div key={item.rating} className="text-center">
                    <div className="text-sm font-medium">{item.rating} ★</div>
                    <div className="text-xs text-gray-500">{item.count}</div>
                    <div className="text-xs text-gray-500">
                      ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              {feedbackStats.recentFeedback.length > 0 ? (
                <div className="space-y-4">
                  {feedbackStats.recentFeedback.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">
                            {"★".repeat(item.rating)}
                            <span className="text-gray-300">
                              {"★".repeat(5 - item.rating)}
                            </span>
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm">
                        {item.feedback || "No comment provided."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No feedback comments available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-gray-500 text-center">
        Feedback data is updated in real-time as users provide ratings and
        comments.
      </div>
    </div>
  );
}
