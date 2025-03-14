import { useState, useEffect, useCallback } from "react";
import {
  SpeechRecognitionOptions,
  SpeechRecognitionState,
  createSpeechRecognizer,
} from "@/lib/audio/speech-to-text";

/**
 * React hook for using speech recognition
 * @param options Configuration options for the recognizer
 * @returns Object with recognizer methods and state
 */
export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [state, setState] = useState<SpeechRecognitionState>({
    isRecognizing: false,
    transcript: "",
    isSupported: false,
  });

  // Create recognizer with custom callbacks
  const recognizer = useCallback(() => {
    return createSpeechRecognizer({
      ...options,
      onResult: (text: string, isFinal: boolean) => {
        if (isFinal) {
          setTranscript((prev) => prev + text + " ");
          setInterimTranscript("");
        } else {
          setInterimTranscript(text);
        }
        if (options.onResult) {
          options.onResult(text, isFinal);
        }
      },
    });
  }, [options]);

  // Start recognition
  const startRecognition = useCallback(() => {
    const rec = recognizer();
    return rec.start();
  }, [recognizer]);

  // Stop recognition
  const stopRecognition = useCallback(() => {
    const rec = recognizer();
    rec.stop();
  }, [recognizer]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    const rec = recognizer();
    rec.resetTranscript();
  }, [recognizer]);

  // Update state
  useEffect(() => {
    const intervalId = setInterval(() => {
      const rec = recognizer();
      setState(rec.getState());
    }, 100);

    return () => {
      clearInterval(intervalId);
      const rec = recognizer();
      rec.cleanup();
    };
  }, [recognizer]);

  return {
    // State
    state,
    transcript,
    interimTranscript,

    // Methods
    startRecognition,
    stopRecognition,
    resetTranscript,
  };
}
