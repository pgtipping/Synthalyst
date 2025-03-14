"use client";

import { useState, useEffect, useCallback } from "react";
import { createAudioAnalysis, AudioMetrics } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, BarChart2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define our own display metrics type for the UI
interface DisplayMetrics {
  clarity: number;
  pace: number;
  volume: number;
  fillerWords: number;
  duration: number;
  silencePercentage: number;
}

interface AudioAnalysisDisplayProps {
  /** Audio blob to analyze */
  audioBlob?: Blob;
  /** Whether to auto-analyze the audio */
  autoAnalyze?: boolean;
  /** Callback when analysis is complete */
  onAnalysisComplete?: (metrics: AudioMetrics) => void;
  /** CSS class name */
  className?: string;
}

/**
 * Audio analysis display component for the Mock Interview feature
 */
export function AudioAnalysisDisplay({
  audioBlob,
  autoAnalyze = false,
  onAnalysisComplete,
  className,
}: AudioAnalysisDisplayProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DisplayMetrics | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Helper functions to calculate scores
  const calculatePaceScore = (wordsPerMinute: number): number => {
    // Optimal speaking pace is around 150-160 wpm
    // Score decreases as you move away from this range
    const optimal = 155;
    const diff = Math.abs(wordsPerMinute - optimal);
    return Math.max(0, 100 - diff / 2);
  };

  const calculateFillerWordScore = (
    fillerWordCount: number,
    durationMs: number
  ): number => {
    // Calculate filler words per minute
    const minutes = durationMs / 60000;
    const fillerWordsPerMinute = fillerWordCount / minutes;

    // Fewer than 3 filler words per minute is excellent
    if (fillerWordsPerMinute < 3) return 90;
    // 3-6 is good
    if (fillerWordsPerMinute < 6) return 80;
    // 6-10 is average
    if (fillerWordsPerMinute < 10) return 70;
    // 10-15 is below average
    if (fillerWordsPerMinute < 15) return 60;
    // More than 15 is poor
    return 50;
  };

  const calculateSilenceScore = (speakingRatio: number): number => {
    // Optimal speaking ratio is around 0.7-0.8 (70-80% speaking, 20-30% silence)
    if (speakingRatio >= 0.7 && speakingRatio <= 0.8) return 90;
    // 0.6-0.7 or 0.8-0.9 is good
    if (
      (speakingRatio >= 0.6 && speakingRatio < 0.7) ||
      (speakingRatio > 0.8 && speakingRatio <= 0.9)
    )
      return 80;
    // 0.5-0.6 or 0.9-1.0 is average
    if ((speakingRatio >= 0.5 && speakingRatio < 0.6) || speakingRatio > 0.9)
      return 70;
    // Less than 0.5 is below average (too much silence)
    return 60;
  };

  // Analyze audio
  const analyzeAudio = useCallback(async () => {
    if (!audioBlob) {
      setError("No audio recording available to analyze.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      setAnalysisProgress(0);

      const analysis = createAudioAnalysis();

      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          // Simulate progress up to 90% (the last 10% is when we get results)
          if (prev < 90) {
            return prev + Math.random() * 5;
          }
          return prev;
        });
      }, 200);

      // In a real implementation, we would pass the transcript
      // For now, we'll use an empty string as we're mocking the results
      const result = await analysis.analyzeAudio(audioBlob, "");

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Convert the AudioMetrics to our DisplayMetrics
      // In a real implementation, these would be calculated from the actual metrics
      const displayMetrics: DisplayMetrics = {
        // Calculate clarity based on volume variation (lower variation = higher clarity)
        clarity: 100 - Math.min(100, result.volumeVariation * 100),
        // Calculate pace based on words per minute (optimal is around 150-160 wpm)
        pace: calculatePaceScore(result.wordsPerMinute),
        // Calculate volume consistency (inverse of volume variation)
        volume: 100 - Math.min(100, result.volumeVariation * 200),
        // Calculate filler word score (fewer filler words = higher score)
        fillerWords: calculateFillerWordScore(
          result.totalFillerWords,
          result.totalDuration
        ),
        // Duration in seconds
        duration: result.totalDuration / 1000,
        // Calculate silence percentage score (optimal is around 20-30% silence)
        silencePercentage: calculateSilenceScore(result.speakingRatio),
      };

      setMetrics(displayMetrics);

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze audio.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    audioBlob,
    onAnalysisComplete,
    calculatePaceScore,
    calculateFillerWordScore,
    calculateSilenceScore,
  ]);

  // Auto-analyze audio if enabled
  useEffect(() => {
    if (autoAnalyze && audioBlob && !metrics && !isAnalyzing) {
      analyzeAudio();
    }
  }, [autoAnalyze, audioBlob, metrics, isAnalyzing, analyzeAudio]);

  // Reset analysis
  const resetAnalysis = () => {
    setMetrics(null);
    setError(null);
    setAnalysisProgress(0);
  };

  // Format duration as mm:ss
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Get description based on score
  const getScoreDescription = (
    metric: keyof DisplayMetrics,
    score: number
  ): string => {
    const descriptions: Record<keyof DisplayMetrics, Record<string, string>> = {
      clarity: {
        high: "Your speech is very clear and easy to understand.",
        medium:
          "Your speech is mostly clear but could be improved in some areas.",
        low: "Your speech clarity needs improvement. Try speaking more distinctly.",
      },
      pace: {
        high: "Your speaking pace is excellent - not too fast or too slow.",
        medium:
          "Your speaking pace is acceptable but could be more consistent.",
        low: "Your speaking pace needs adjustment. Try to speak more evenly.",
      },
      volume: {
        high: "Your volume is consistent and appropriate.",
        medium: "Your volume is mostly good but varies in some places.",
        low: "Your volume is inconsistent. Try to maintain a steady volume.",
      },
      fillerWords: {
        high: "You use very few filler words. Excellent!",
        medium: "You use some filler words. Try to reduce them further.",
        low: "You use many filler words. Try to be more conscious of them.",
      },
      duration: {
        high: "",
        medium: "",
        low: "",
      },
      silencePercentage: {
        high: "You use pauses effectively in your speech.",
        medium: "Your use of pauses is acceptable but could be more strategic.",
        low: "You have too many or too few pauses in your speech.",
      },
    };

    const level = score >= 80 ? "high" : score >= 60 ? "medium" : "low";
    return descriptions[metric][level] || "";
  };

  if (!audioBlob) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 text-center",
          className
        )}
      >
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No audio recording available to analyze. Record audio first.
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 space-y-4",
          className
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Analyzing audio...</p>
        <Progress value={analysisProgress} className="w-full max-w-xs" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 text-center",
          className
        )}
      >
        <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={resetAnalysis}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (metrics) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2" />
            Speech Analysis Results
          </CardTitle>
          <CardDescription>
            Analysis of your {formatDuration(metrics.duration)} recording
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Clarity */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium">Clarity</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How clear and understandable your speech is
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className={cn(
                  "text-sm font-bold",
                  getScoreColor(metrics.clarity)
                )}
              >
                {Math.round(metrics.clarity)}%
              </span>
            </div>
            <Progress value={metrics.clarity} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getScoreDescription("clarity", metrics.clarity)}
            </p>
          </div>

          {/* Pace */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium">Speaking Pace</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How consistent and appropriate your speaking pace is
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className={cn("text-sm font-bold", getScoreColor(metrics.pace))}
              >
                {Math.round(metrics.pace)}%
              </span>
            </div>
            <Progress value={metrics.pace} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getScoreDescription("pace", metrics.pace)}
            </p>
          </div>

          {/* Volume */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium">
                      Volume Consistency
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How consistent your speaking volume is
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className={cn(
                  "text-sm font-bold",
                  getScoreColor(metrics.volume)
                )}
              >
                {Math.round(metrics.volume)}%
              </span>
            </div>
            <Progress value={metrics.volume} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getScoreDescription("volume", metrics.volume)}
            </p>
          </div>

          {/* Filler Words */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium">
                      Filler Word Usage
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How well you avoid using filler words (um, uh, like, etc.)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className={cn(
                  "text-sm font-bold",
                  getScoreColor(metrics.fillerWords)
                )}
              >
                {Math.round(metrics.fillerWords)}%
              </span>
            </div>
            <Progress value={metrics.fillerWords} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getScoreDescription("fillerWords", metrics.fillerWords)}
            </p>
          </div>

          {/* Silence Percentage */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium">
                      Effective Pausing
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How well you use pauses in your speech
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className={cn(
                  "text-sm font-bold",
                  getScoreColor(metrics.silencePercentage)
                )}
              >
                {Math.round(metrics.silencePercentage)}%
              </span>
            </div>
            <Progress value={metrics.silencePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getScoreDescription(
                "silencePercentage",
                metrics.silencePercentage
              )}
            </p>
          </div>

          {/* Overall Score */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold">Overall Score</span>
              <span
                className={cn(
                  "text-base font-bold",
                  getScoreColor(
                    (metrics.clarity +
                      metrics.pace +
                      metrics.volume +
                      metrics.fillerWords +
                      metrics.silencePercentage) /
                      5
                  )
                )}
              >
                {Math.round(
                  (metrics.clarity +
                    metrics.pace +
                    metrics.volume +
                    metrics.fillerWords +
                    metrics.silencePercentage) /
                    5
                )}
                %
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAnalysis}
            className="ml-auto"
          >
            Reset Analysis
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-4", className)}
    >
      <Button variant="default" onClick={analyzeAudio} disabled={!audioBlob}>
        <BarChart2 className="h-4 w-4 mr-2" />
        Analyze Recording
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        Analyze your recording to get feedback on your speaking skills
      </p>
    </div>
  );
}
