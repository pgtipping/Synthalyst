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
      onStop: (blob: Blob) => {
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
    const rec = recorder();
    const success = await rec.start();
    if (success) {
      // Clear previous recording
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setAudioBlob(null);
    }
    return success;
  }, [recorder, audioUrl]);

  // Stop recording
  const stopRecording = useCallback(() => {
    const rec = recorder();
    rec.stop();
  }, [recorder]);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    const rec = recorder();
    return await rec.requestPermission();
  }, [recorder]);

  // Update state
  useEffect(() => {
    const intervalId = setInterval(() => {
      const rec = recorder();
      setState(rec.getState());
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
