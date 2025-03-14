"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackButtonProps {
  appName: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export default function FeedbackButton({
  appName,
  buttonText = "Give feedback",
  buttonVariant = "outline",
  buttonSize = "sm",
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<"rating" | "feedback">("rating");

  const handleRatingClick = (value: number) => {
    setRating(value);
    // After selecting a rating, move to the feedback step
    setStep("feedback");
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
      setStep("rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName,
          rating,
          feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok && response.status >= 400) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      // Handle fallback case
      if (data.fallback) {
        // Store in localStorage as a temporary solution
        try {
          const storedFeedback = localStorage.getItem("app_feedback") || "[]";
          const feedbackArray = JSON.parse(storedFeedback);
          feedbackArray.push({
            appName,
            rating,
            feedback,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("app_feedback", JSON.stringify(feedbackArray));
        } catch (storageError) {
          console.error(
            "Error storing feedback in localStorage:",
            storageError
          );
        }

        toast.success(
          "Thank you for your feedback! It will be saved locally until our database is available."
        );
      } else {
        toast.success("Thank you for your feedback!");
      }

      setIsOpen(false);

      // Reset the form
      setRating(0);
      setFeedback("");
      setStep("rating");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset the form
    setRating(0);
    setFeedback("");
    setStep("rating");
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => setIsOpen(true)}
        className="feedback-button"
      >
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === "rating" ? "Rate this tool" : "Share your thoughts"}
            </DialogTitle>
            <DialogDescription>
              {step === "rating"
                ? "How helpful was this tool for you?"
                : "Your feedback helps us improve this tool."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === "rating" ? (
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center py-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => handleRatingHover(value)}
                      onMouseLeave={handleRatingLeave}
                      onTouchStart={() => handleRatingHover(value)}
                      onTouchEnd={handleRatingLeave}
                      className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full touch-manipulation"
                      aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-10 w-10 ${
                          (hoveredRating || rating) >= value
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500">
                  {hoveredRating > 0
                    ? `${hoveredRating} star${hoveredRating > 1 ? "s" : ""}`
                    : "Select a rating"}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-6 w-6 ${
                        value <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder="How can we improve this tool? (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px] w-full resize-y"
                />
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
              {step === "rating" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="mt-2 sm:mt-0"
                >
                  Cancel
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("rating")}
                    className="mt-2 sm:mt-0"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 sm:mt-0"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
