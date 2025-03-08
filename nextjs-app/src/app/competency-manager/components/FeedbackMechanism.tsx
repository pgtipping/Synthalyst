"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StarIcon } from "lucide-react";
import { CompetencyFramework } from "../types";
import { toast } from "sonner";

interface FeedbackMechanismProps {
  framework: CompetencyFramework;
}

export default function FeedbackMechanism({
  framework,
}: FeedbackMechanismProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [llmQualityFeedback, setLlmQualityFeedback] = useState<string>("good");
  const [llmImprovementSuggestion, setLlmImprovementSuggestion] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleRatingHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating before submitting");
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
          frameworkId: framework.id,
          rating,
          feedback,
          isPublic,
          llmQualityFeedback,
          llmImprovementSuggestion:
            llmImprovementSuggestion || "No suggestions provided",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      toast.success("Thank you for your feedback!");
      setHasSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Feedback</h3>
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800">
            Thank you for your feedback! Your input helps us improve our
            AI-generated frameworks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Rate this Framework</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
                onMouseLeave={handleRatingLeave}
                onTouchStart={() => handleRatingHover(value)}
                onTouchEnd={handleRatingLeave}
                className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full touch-manipulation"
                aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    (hoveredRating || rating) >= value
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">
            {rating > 0
              ? `${rating} star${rating > 1 ? "s" : ""}`
              : "Select a rating"}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div className="space-y-2">
          <Label htmlFor="feedback">Your Feedback (Optional)</Label>
          <Textarea
            id="feedback"
            placeholder="What did you think of this framework? How could it be improved?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] w-full resize-y"
          />
        </div>

        {/* AI Quality Feedback */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">AI Quality Feedback</h4>
          <p className="text-sm text-gray-500">
            Help us improve our AI by providing specific feedback on the quality
            of this framework.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="llm-quality" className="font-medium">
                How would you rate the AI-generated content?
              </Label>
              <select
                id="llm-quality"
                value={llmQualityFeedback}
                onChange={(e) => setLlmQualityFeedback(e.target.value)}
                className="px-3 py-2 border rounded w-full text-sm h-10"
                aria-label="AI content quality rating"
              >
                <option value="excellent">Excellent - Blew my mind</option>
                <option value="good">Good - Met my expectations</option>
                <option value="needs_improvement">Needs Improvement</option>
              </select>
            </div>

            {llmQualityFeedback === "needs_improvement" && (
              <div className="space-y-2">
                <Label htmlFor="llm-improvement">
                  What could be improved about the AI-generated content?
                </Label>
                <Textarea
                  id="llm-improvement"
                  placeholder="Please provide specific suggestions for improvement..."
                  value={llmImprovementSuggestion}
                  onChange={(e) => setLlmImprovementSuggestion(e.target.value)}
                  className="min-h-[80px] w-full resize-y"
                />
              </div>
            )}
          </div>
        </div>

        {/* Public Feedback Toggle */}
        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="public-feedback"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public-feedback" className="text-sm">
            Make my feedback public (without personal information)
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
}
