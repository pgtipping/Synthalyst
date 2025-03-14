"use client";

import { useState, useEffect } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

  // Initialize audio recorder
  const { state, audioUrl, startRecording, stopRecording, requestPermission } =
    useAudioRecorder({
      maxDuration,
      onStop: (blob: Blob) => {
        if (onRecordingComplete && audioUrl) {
          onRecordingComplete(blob, audioUrl);
        }
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

  // Handle start recording
  const handleStartRecording = async () => {
    console.log("Start recording button clicked");
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
    if (!success) {
      console.error("Failed to start recording");
      // Show an error message to the user
      alert(
        "Failed to start recording. Please check your browser settings and try again."
      );
    }
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
      {/* Recording controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {state.isRecording ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              onClick={handleStartRecording}
              aria-label="Start recording"
              disabled={state.isProcessing}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}

          <div className="ml-4">
            {state.isRecording ? (
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2" />
                <span className="text-sm font-medium">
                  Recording... {formatDuration(state.duration)}
                </span>
              </div>
            ) : audioUrl ? (
              <span className="text-sm font-medium">Recording complete</span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Click to start recording
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && state.isRecording && (
        <Progress value={progressPercentage} className="h-1" />
      )}

      {/* Audio player */}
      {showPlayer && audioUrl && !state.isRecording && (
        <div className="mt-2">
          <audio
            src={audioUrl}
            controls
            className="w-full h-10"
            controlsList="nodownload"
          />
        </div>
      )}
    </div>
  );
}
