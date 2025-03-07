"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, SparklesIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FeedbackStatistics {
  totalFeedback: number;
  averageRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface FeedbackItem {
  id: string;
  rating: number;
  feedback: string;
  createdAt: string;
  userId: string | null;
  isPublic: boolean;
}

interface FeedbackAnalyticsProps {
  frameworkId: string;
}

export default function FeedbackAnalytics({
  frameworkId,
}: FeedbackAnalyticsProps) {
  const [statistics, setStatistics] = useState<FeedbackStatistics | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/competency-manager/feedback?frameworkId=${frameworkId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }

        const data = await response.json();
        setStatistics(data.statistics);
        setFeedback(data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback data");
      } finally {
        setIsLoading(false);
      }
    };

    if (frameworkId) {
      fetchFeedback();
    }
  }, [frameworkId]);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Loading feedback data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!statistics || statistics.totalFeedback === 0) {
    return (
      <div className="p-4 text-center">
        <p>No ratings available for this AI-generated framework yet.</p>
      </div>
    );
  }

  // Filter for public feedback only
  const publicFeedback = feedback.filter((item) => item.isPublic);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-blue-500" />
            <CardTitle>AI Framework Ratings</CardTitle>
          </div>
          <CardDescription>
            Based on {statistics.totalFeedback} user ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold mr-2">
                {statistics.averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(statistics.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {statistics.totalFeedback}{" "}
              {statistics.totalFeedback === 1 ? "rating" : "ratings"}
            </span>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                statistics.ratingCounts[rating as 1 | 2 | 3 | 4 | 5];
              const percentage =
                statistics.totalFeedback > 0
                  ? (count / statistics.totalFeedback) * 100
                  : 0;

              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-12">
                    <span className="text-sm mr-1">{rating}</span>
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2 flex-1 mx-2"
                    aria-label={`${rating} star ratings: ${percentage.toFixed(
                      1
                    )}%`}
                  />
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {publicFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-blue-500" />
              <CardTitle>User Comments on AI Output</CardTitle>
            </div>
            <CardDescription>
              What users think about this AI-generated framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {publicFeedback
                .filter((item) => item.feedback.trim() !== "")
                .map((item) => (
                  <div key={item.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{item.feedback}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
