import { useState, useEffect, useCallback } from "react";
import {
  RecorderOptions,
  RecordingState,
  createRecorder,
} from "@/lib/audio/recorder";

/**
 * React hook for using the audio recorder
 * @param options Configuration options for the recorder
 * @returns Object with recorder methods and state
 */
export function useAudioRecorder(options: RecorderOptions = {}) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    isProcessing: false,
    hasPermission: false,
    isSupported: false,
  });

  // Create recorder with custom callbacks
  const recorder = useCallback(() => {
    return createRecorder({
      ...options,
      onError: (error: Error) => {
        console.error("Audio recorder error:", error);
        if (options.onError) {
          options.onError(error);
        }
      },
      onStop: (blob: Blob) => {
        console.log("Recording stopped, blob size:", blob.size);
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (options.onStop) {
          options.onStop(blob);
        }
      },
    });
  }, [options]);

  // Start recording
  const startRecording = useCallback(async () => {
    console.log("Starting recording...");
    const rec = recorder();
    try {
      const success = await rec.start();
      console.log("Recording started:", success);
      if (success) {
        // Clear previous recording
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }
        setAudioBlob(null);
      } else {
        console.error("Failed to start recording");
      }
      return success;
    } catch (error) {
      console.error("Error starting recording:", error);
      return false;
    }
  }, [recorder, audioUrl]);

  // Stop recording
  const stopRecording = useCallback(() => {
    console.log("Stopping recording...");
    try {
      const rec = recorder();
      rec.stop();
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }, [recorder]);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    console.log("Requesting microphone permission...");
    try {
      const rec = recorder();
      const result = await rec.requestPermission();
      console.log("Permission request result:", result);
      return result;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  }, [recorder]);

  // Update state
  useEffect(() => {
    const intervalId = setInterval(() => {
      try {
        const rec = recorder();
        const currentState = rec.getState();
        setState(currentState);
      } catch (error) {
        console.error("Error updating recorder state:", error);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [recorder, audioUrl]);

  return {
    // State
    state,
    audioBlob,
    audioUrl,

    // Methods
    startRecording,
    stopRecording,
    requestPermission,
  };
}
