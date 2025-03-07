"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface FeedbackMechanismProps {
  frameworkId: string;
}

export default function FeedbackMechanism({
  frameworkId,
}: FeedbackMechanismProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isPublicRating, setIsPublicRating] = useState(true);
  const [llmQualityFeedback, setLlmQualityFeedback] = useState<
    "good" | "needs_improvement" | null
  >(null);
  const [llmImprovementSuggestion, setLlmImprovementSuggestion] = useState("");

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleLlmQualityFeedback = (quality: "good" | "needs_improvement") => {
    setLlmQualityFeedback(quality);
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please provide a rating before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/competency-manager/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frameworkId,
          rating,
          feedback,
          isPublic: isPublicRating,
          llmQualityFeedback,
          llmImprovementSuggestion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      toast.success("Thank you for your feedback!");
      setRating(null);
      setFeedback("");
      setLlmQualityFeedback(null);
      setLlmImprovementSuggestion("");
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      {!showForm ? (
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          className="w-full"
        >
          Rate this AI-generated framework
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Rate this AI-Generated Framework</CardTitle>
            <CardDescription>
              Your feedback helps us improve our AI framework generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="public-rating">Include in public ratings</Label>
                <Switch
                  id="public-rating"
                  checked={isPublicRating}
                  onCheckedChange={setIsPublicRating}
                />
              </div>

              <div>
                <Label htmlFor="rating">Framework Quality Rating</Label>
                <div className="flex items-center mt-2 space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      className="focus:outline-none"
                      aria-label={`Rate ${value} stars`}
                    >
                      <StarIcon
                        className={`w-8 h-8 ${
                          rating && rating >= value
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="feedback">Public Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="What did you think about this AI-generated framework?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">
                Help Improve Our AI (Private Feedback)
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                This feedback is only used to improve our AI and won't be shown
                publicly
              </p>

              <div className="space-y-4">
                <div>
                  <Label>AI Quality Assessment</Label>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      type="button"
                      variant={
                        llmQualityFeedback === "good" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleLlmQualityFeedback("good")}
                      className="flex items-center"
                    >
                      <ThumbsUpIcon className="w-4 h-4 mr-2" />
                      Good output
                    </Button>
                    <Button
                      type="button"
                      variant={
                        llmQualityFeedback === "needs_improvement"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleLlmQualityFeedback("needs_improvement")
                      }
                      className="flex items-center"
                    >
                      <ThumbsDownIcon className="w-4 h-4 mr-2" />
                      Needs improvement
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="llm-improvement">
                    AI Improvement Suggestions
                  </Label>
                  <Textarea
                    id="llm-improvement"
                    placeholder="How could our AI generate better competency frameworks?"
                    value={llmImprovementSuggestion}
                    onChange={(e) =>
                      setLlmImprovementSuggestion(e.target.value)
                    }
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
