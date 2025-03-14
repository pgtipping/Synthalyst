"use client";

import { useState, useEffect } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioRecorderProps {
  /** Callback when recording is completed */
  onRecordingComplete?: (blob: Blob, url: string) => void;
  /** Maximum recording duration in milliseconds (default: 2 minutes) */
  maxDuration?: number;
  /** Whether to show the audio player */
  showPlayer?: boolean;
  /** Whether to show the progress bar */
  showProgress?: boolean;
  /** Whether to auto-request permission */
  autoRequestPermission?: boolean;
  /** CSS class name */
  className?: string;
}

/**
 * Audio recorder component for the Mock Interview feature
 */
export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 2 * 60 * 1000, // 2 minutes
  showPlayer = true,
  showProgress = true,
  autoRequestPermission = true,
  className,
}: AudioRecorderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const { addToast } = useToast();

  // Initialize audio recorder
  const { state, audioUrl, startRecording, stopRecording, requestPermission } =
    useAudioRecorder({
      maxDuration,
      onStop: (blob: Blob) => {
        if (onRecordingComplete && audioUrl) {
          onRecordingComplete(blob, audioUrl);
        }
        // Show toast when recording is complete
        addToast({
          title: "Recording complete",
          description: `Audio recorded successfully (${formatFileSize(
            blob.size
          )})`,
          variant: "success",
        });
      },
    });

  // Format duration as MM:SS
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Format file size in KB or MB
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Calculate progress percentage
  const progressPercentage = (state.duration / maxDuration) * 100;

  // Request permission on mount if auto-request is enabled
  useEffect(() => {
    if (autoRequestPermission) {
      const init = async () => {
        try {
          const hasPermission = await requestPermission();
          setPermissionDenied(!hasPermission);
        } catch {
          setPermissionDenied(true);
        } finally {
          setIsInitializing(false);
        }
      };
      init();
    } else {
      setIsInitializing(false);
    }
  }, [autoRequestPermission, requestPermission]);

  // Handle start recording with button animation
  const handleStartRecording = async () => {
    console.log("Start recording button clicked");

    // Button press animation
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);

    if (!state.hasPermission) {
      console.log("No permission, requesting...");
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        console.error("Permission denied");
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);
    }

    console.log("Starting recording...");
    const success = await startRecording();
    if (success) {
      // Show toast when recording starts
      addToast({
        title: "Recording started",
        description: "Your microphone is now recording audio",
        variant: "success",
      });
    } else {
      console.error("Failed to start recording");
      // Show an error message to the user
      addToast({
        variant: "destructive",
        title: "Recording failed",
        description: "Please check your browser settings and try again.",
      });
    }
  };

  // Handle stop recording with button animation
  const handleStopRecording = () => {
    // Button press animation
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);

    stopRecording();
  };

  if (isInitializing) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Initializing microphone...</span>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 text-center",
          className
        )}
      >
        <MicOff className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          Microphone access denied. Please allow microphone access in your
          browser settings.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            requestPermission().then((hasPermission) =>
              setPermissionDenied(!hasPermission)
            )
          }
        >
          Request Permission
        </Button>
      </div>
    );
  }

  if (!state.isSupported) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 text-center",
          className
        )}
      >
        <MicOff className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground">
          Audio recording is not supported in your browser. Please try using
          Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Recording status banner - only shown when recording */}
      {state.isRecording && (
        <Alert variant="destructive" className="animate-pulse border-red-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-3 animate-pulse"></div>
            <span className="font-medium">
              RECORDING IN PROGRESS - {formatDuration(state.duration)}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Recording controls */}
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-md transition-all duration-300",
          state.isRecording
            ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-800 shadow-lg"
            : "bg-muted/50 border border-gray-200"
        )}
      >
        <div className="flex items-center w-full">
          {state.isRecording ? (
            <Button
              variant="destructive"
              size="lg"
              onClick={handleStopRecording}
              aria-label="Stop recording"
              className={cn(
                "relative transition-transform duration-200 shadow-md hover:shadow-lg",
                isButtonPressed ? "transform scale-95" : ""
              )}
            >
              <Square className="h-5 w-5 mr-2" />
              <span>Stop Recording</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              onClick={handleStartRecording}
              aria-label="Start recording"
              disabled={state.isProcessing}
              className={cn(
                "transition-transform duration-200 shadow-md hover:shadow-lg",
                isButtonPressed ? "transform scale-95" : ""
              )}
            >
              <Mic className="h-5 w-5 mr-2" />
              <span>Start Recording</span>
            </Button>
          )}

          <div className="ml-4 flex-1">
            {state.isRecording ? (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-700 dark:text-red-400">
                  Recording in progress
                </span>
                <span className="text-xs text-muted-foreground">
                  Click the STOP RECORDING button when finished
                </span>
              </div>
            ) : audioUrl ? (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-green-700">
                  Recording complete
                </span>
                <span className="text-xs text-muted-foreground">
                  Listen to your recording below
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Ready to record</span>
                <span className="text-xs text-muted-foreground">
                  Click the START RECORDING button to begin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && state.isRecording && (
        <div className="space-y-1">
          <Progress
            value={progressPercentage}
            className="h-3 bg-gray-200"
            indicatorClassName="bg-red-500 transition-all duration-300"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-medium">
              {formatDuration(state.duration)}
            </span>
            <span>Maximum: {formatDuration(maxDuration)}</span>
          </div>
        </div>
      )}

      {/* Audio player */}
      {showPlayer && audioUrl && !state.isRecording && (
        <div className="mt-2 p-3 border rounded-md bg-gray-50">
          <div className="text-sm font-medium mb-2">Your Recording:</div>
          <audio
            src={audioUrl}
            controls
            className="w-full h-12"
            controlsList="nodownload"
          />
        </div>
      )}
    </div>
  );
}
