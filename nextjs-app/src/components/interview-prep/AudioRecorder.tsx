"use client";

import { useState, useEffect } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
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
  const [statusMessage, setStatusMessage] = useState("Ready to record");
  const [statusDetail, setStatusDetail] = useState(
    "Click the START RECORDING button to begin"
  );
  const [statusType, setStatusType] = useState<
    "default" | "recording" | "success" | "error"
  >("default");

  // Initialize audio recorder with higher quality settings
  const { state, audioUrl, startRecording, stopRecording, requestPermission } =
    useAudioRecorder({
      maxDuration,
      onStop: (blob: Blob) => {
        if (onRecordingComplete && audioUrl) {
          onRecordingComplete(blob, audioUrl);
        }
        // Update status message instead of toast
        setStatusMessage("Recording complete");
        setStatusDetail(
          `Audio recorded successfully (${formatFileSize(blob.size)})`
        );
        setStatusType("success");
      },
      // Use higher quality audio settings
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 128000,
      noiseReduction: false, // Disable noise reduction for better voice quality
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
          setStatusMessage("Initializing microphone...");
          setStatusDetail("Please wait while we set up your microphone");
          const hasPermission = await requestPermission();
          setPermissionDenied(!hasPermission);
          if (hasPermission) {
            setStatusMessage("Ready to record");
            setStatusDetail("Click the START RECORDING button to begin");
          }
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
      setStatusMessage("Requesting microphone access");
      setStatusDetail("Please allow access when prompted");
      setStatusType("default");

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        console.error("Permission denied");
        setPermissionDenied(true);
        setStatusMessage("Microphone access denied");
        setStatusDetail("Please check your browser settings");
        setStatusType("error");
        return;
      }
      setPermissionDenied(false);
    }

    console.log("Starting recording...");
    setStatusMessage("Starting recording...");
    setStatusDetail("Initializing microphone");

    const success = await startRecording();
    if (success) {
      // Update status message instead of toast
      setStatusMessage("Recording in progress");
      setStatusDetail("Speak clearly into your microphone");
      setStatusType("recording");
    } else {
      console.error("Failed to start recording");
      // Update status message instead of toast
      setStatusMessage("Recording failed");
      setStatusDetail("Please check your microphone and try again");
      setStatusType("error");
    }
  };

  // Handle stop recording with button animation
  const handleStopRecording = () => {
    // Button press animation
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);

    setStatusMessage("Processing recording...");
    setStatusDetail("Please wait while we process your audio");

    stopRecording();
  };

  // Monitor for auto-stop and update status
  useEffect(() => {
    if (state.isRecording && state.duration >= maxDuration - 1000) {
      setStatusMessage("Almost at maximum duration");
      setStatusDetail("Recording will stop automatically in 1 second");
    }
  }, [state.isRecording, state.duration, maxDuration]);

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
            requestPermission().then((hasPermission) => {
              setPermissionDenied(!hasPermission);
              if (hasPermission) {
                setStatusMessage("Microphone access granted");
                setStatusDetail("You can now start recording");
                setStatusType("default");
              }
            })
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
                  {statusMessage} - {formatDuration(state.duration)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {statusDetail}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-medium",
                    statusType === "success" && "text-green-700",
                    statusType === "error" && "text-red-700"
                  )}
                >
                  {statusMessage}
                </span>
                <span className="text-xs text-muted-foreground">
                  {statusDetail}
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
