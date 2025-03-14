"use client";

import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioVisualizer } from "./AudioVisualizer";

interface SpeechRecognitionDisplayProps {
  /** Callback when transcript changes */
  onTranscriptChange?: (transcript: string) => void;
  /** Callback when recognition starts */
  onRecognitionStart?: () => void;
  /** Callback when recognition ends */
  onRecognitionEnd?: () => void;
  /** Whether to auto-start recognition */
  autoStart?: boolean;
  /** Whether to show controls */
  showControls?: boolean;
  /** Whether to show the visualizer */
  showVisualizer?: boolean;
  /** CSS class name */
  className?: string;
}

/**
 * Speech recognition display component for the Mock Interview feature
 */
export function SpeechRecognitionDisplay({
  onTranscriptChange,
  onRecognitionStart,
  onRecognitionEnd,
  autoStart = false,
  showControls = true,
  showVisualizer = true,
  className,
}: SpeechRecognitionDisplayProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [visualizerData, setVisualizerData] = useState<Uint8Array | undefined>(
    undefined
  );

  // Initialize speech recognition
  const {
    state,
    transcript,
    interimTranscript,
    startRecognition,
    stopRecognition,
    resetTranscript,
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      if (isFinal && onTranscriptChange) {
        onTranscriptChange(transcript + text);
      }
    },
    onStart: onRecognitionStart,
    onEnd: onRecognitionEnd,
  });

  // Create fake visualizer data when speaking
  useEffect(() => {
    if (state.isRecognizing) {
      const intervalId = setInterval(() => {
        // Generate random data for visualization
        const data = new Uint8Array(32);
        for (let i = 0; i < data.length; i++) {
          // More activity when interim transcript is changing
          const activityLevel = interimTranscript ? 180 : 80;
          data[i] = Math.floor(Math.random() * activityLevel);
        }
        setVisualizerData(data);
      }, 100);

      return () => clearInterval(intervalId);
    } else {
      setVisualizerData(undefined);
    }
  }, [state.isRecognizing, interimTranscript]);

  // Auto-start recognition if enabled
  useEffect(() => {
    setIsInitializing(true);

    const initRecognition = async () => {
      if (autoStart && state.isSupported) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for UI
        startRecognition();
      }
      setIsInitializing(false);
    };

    initRecognition();

    return () => {
      if (state.isRecognizing) {
        stopRecognition();
      }
    };
  }, [
    autoStart,
    startRecognition,
    stopRecognition,
    state.isSupported,
    state.isRecognizing,
  ]);

  // Combine transcript and interim transcript
  const displayText =
    transcript + (interimTranscript ? ` ${interimTranscript}` : "");

  if (isInitializing) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Initializing speech recognition...</span>
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
          Speech recognition is not supported in your browser. Please try using
          Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Transcript display */}
      <div className="min-h-[100px] p-4 rounded-md border bg-background">
        {displayText ? (
          <p className="text-sm">
            {displayText}
            {state.isRecognizing && <span className="animate-pulse">|</span>}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {state.isRecognizing ? "Listening..." : "No transcript available"}
          </p>
        )}
      </div>

      {/* Visualizer */}
      {showVisualizer && (
        <div className="flex justify-center">
          <AudioVisualizer
            isActive={state.isRecognizing}
            audioData={visualizerData}
            width={300}
            height={40}
            barColor="var(--primary)"
          />
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="flex justify-between">
          <div>
            {state.isRecognizing ? (
              <Button variant="destructive" size="sm" onClick={stopRecognition}>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={startRecognition}>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetTranscript}
            disabled={!transcript && !interimTranscript}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
