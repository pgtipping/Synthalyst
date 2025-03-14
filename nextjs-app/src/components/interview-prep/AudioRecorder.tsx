"use client";

import React, { useEffect, useState } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  maxDuration?: number; // in milliseconds, 2 minutes default
  showProgress?: boolean;
  showDebugInfo?: boolean;
  className?: string;
  showPlayer?: boolean;
  autoRequestPermission?: boolean;
}

/**
 * Audio recorder component for the Mock Interview feature
 */
export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 120000,
  showProgress = true,
  showDebugInfo = false,
  className,
  showPlayer = true,
  autoRequestPermission = false,
}: AudioRecorderProps) {
  // State
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Effect to check environment
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === "development");
  }, []);

  // Use the audio recorder hook
  const {
    isRecording,
    isSupported,
    hasPermission,
    duration,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    requestPermission,
  } = useAudioRecorder({
    maxDuration,
    onRecordingComplete: async (blob) => {
      if (onRecordingComplete) {
        onRecordingComplete(blob);
      }

      try {
        setIsUploading(true);
        setUploadError(null);

        // Create form data
        const formData = new FormData();
        formData.append("audio", blob);

        // Upload to server
        const response = await fetch("/api/audio", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload audio");
        }

        const data = await response.json();
        setDownloadUrl(data.url);
      } catch (err) {
        console.error("Error uploading audio:", err);
        setUploadError("Failed to upload audio. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
  });

  // Effect to auto-request permission
  useEffect(() => {
    if (autoRequestPermission && isSupported && !hasPermission) {
      requestPermission().catch(console.error);
    }
  }, [autoRequestPermission, isSupported, hasPermission, requestPermission]);

  // Handle recording toggle
  const handleRecordingToggle = async () => {
    if (!isSupported) {
      console.error("Audio recording is not supported in this browser");
      return;
    }

    if (!hasPermission) {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        console.error("Microphone permission denied");
        return;
      }
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording().catch((err) => {
        console.error("Failed to start recording:", err);
      });
    }
  };

  // Calculate progress percentage
  const progressPercentage = (duration / maxDuration) * 100;

  // Determine indicator class based on recording state
  const indicatorClassName = cn(
    "w-3 h-3 rounded-full transition-colors",
    isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
  );

  return (
    <div className={cn("flex flex-col gap-4 p-4 border rounded-lg", className)}>
      {/* Recording status banner */}
      {isRecording && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md flex items-center gap-2">
          <div className={indicatorClassName} />
          <span>Recording in progress - {formatDuration(duration)}</span>
        </div>
      )}

      {/* Upload status */}
      {isUploading && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
          Uploading recording...
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md">
          {uploadError}
        </div>
      )}

      {/* Recording controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleRecordingToggle}
          disabled={!isSupported || isUploading}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>

        {showProgress && (
          <div className="flex-1">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatDuration(duration)}</span>
              <span>{formatDuration(maxDuration)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Audio playback */}
      {showPlayer && audioUrl && (
        <div className="flex flex-col gap-2">
          <audio controls className="w-full mt-4">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          {downloadUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(downloadUrl, "_blank")}
            >
              Download Recording
            </Button>
          )}
        </div>
      )}

      {/* Debug information */}
      {(showDebugInfo || isDevelopment) && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm font-mono">
          <p>Recording State: {String(isRecording)}</p>
          <p>Duration: {duration}ms</p>
          <p>Audio URL: {audioUrl || "Not available"}</p>
          <p>Download URL: {downloadUrl || "Not available"}</p>
          <p>Has Permission: {String(hasPermission)}</p>
          <p>Is Supported: {String(isSupported)}</p>
          {error && <p className="text-red-500">Error: {error}</p>}
          {uploadError && (
            <p className="text-red-500">Upload Error: {uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
}
