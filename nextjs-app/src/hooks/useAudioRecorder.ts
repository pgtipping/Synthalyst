import { useCallback, useEffect, useRef, useState } from "react";
import { createRecorder } from "@/lib/audio/recorder";

interface RecorderState {
  isRecording: boolean;
  isSupported: boolean;
  hasPermission: boolean;
}

interface RecorderOptions {
  maxDuration?: number;
  onRecordingComplete?: (blob: Blob) => void;
}

/**
 * React hook for using the audio recorder
 * @param options Configuration options for the recorder
 * @returns Object with recorder methods and state
 */
export function useAudioRecorder(options: RecorderOptions = {}) {
  const { maxDuration = 120000 } = options;

  // State
  const [state, setState] = useState<RecorderState>(() => ({
    isRecording: false,
    isSupported: false, // Initialize as false, will be updated in effect
    hasPermission: false,
  }));
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const recorderRef = useRef<ReturnType<typeof createRecorder> | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout>();

  // Check browser support in client-side effect
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isSupported: typeof window !== "undefined" && "MediaRecorder" in window,
    }));
  }, []);

  // Get or create recorder instance
  const getRecorder = useCallback(() => {
    if (!recorderRef.current) {
      recorderRef.current = createRecorder({
        maxDuration,
        mimeType: "audio/webm",
        audioBitsPerSecond: 128000,
        noiseReduction: true,
        verboseLogging: false,
        onError: (err: Error) => {
          console.error("Recorder error:", err);
          setError(err.message);
          setState((prev) => ({ ...prev, isRecording: false }));
          setDuration(0);
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
          }
        },
        onDataAvailable: (blob: Blob) => {
          console.log(`Recording complete: ${blob.size} bytes`);
          try {
            // Revoke previous URL if it exists
            if (audioUrl) {
              URL.revokeObjectURL(audioUrl);
            }

            // Create new URL
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);

            if (options.onRecordingComplete) {
              options.onRecordingComplete(blob);
            }
          } catch (err) {
            console.error("Error creating audio URL:", err);
            setError("Failed to process recording");
          }
        },
      });
    }
    return recorderRef.current;
  }, [audioUrl, maxDuration, options.onRecordingComplete]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (state.isRecording) {
      console.warn("Already recording");
      return false;
    }

    setError(null);
    setDuration(0);
    const recorder = getRecorder();

    try {
      const success = await recorder.start();
      if (success) {
        startTimeRef.current = Date.now();
        setState((prev) => ({ ...prev, isRecording: true }));

        // Start duration tracking
        durationIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          setDuration(elapsed);

          // Stop recording if max duration is reached
          if (elapsed >= maxDuration) {
            console.log(
              `Max duration (${maxDuration}ms) reached, stopping recording`
            );
            stopRecording();
          }
        }, 100);

        return true;
      }
      return false;
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
      return false;
    }
  }, [getRecorder, maxDuration, state.isRecording]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!state.isRecording) {
      console.warn("Not recording");
      return;
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    if (recorderRef.current) {
      recorderRef.current.stop();
      setState((prev) => ({ ...prev, isRecording: false }));
      setDuration(0);
    }
  }, [state.isRecording]);

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ audio: true });
      setState((prev) => ({ ...prev, hasPermission: true }));
      result.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.error("Error requesting permission:", err);
      setState((prev) => ({ ...prev, hasPermission: false }));
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get microphone permission"
      );
      return false;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
    };
  }, [audioUrl]);

  return {
    isRecording: state.isRecording,
    isSupported: state.isSupported,
    hasPermission: state.hasPermission,
    duration,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    requestPermission,
  };
}
