"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  onTranscript: (transcript: string) => void;
}

// Simplified type for Web Speech API
type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: {
    results: { [key: number]: [{ transcript: string; isFinal: boolean }] };
  }) => void;
  onerror: () => void;
  onend: () => void;
};

const VoiceInput = ({
  isRecording,
  onStart,
  onStop,
  onTranscript,
}: VoiceInputProps) => {
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cast window to unknown first to avoid type conflicts
    const win = window as unknown as {
      SpeechRecognition: new () => SpeechRecognitionType;
      webkitSpeechRecognition: new () => SpeechRecognitionType;
    };

    const SpeechRecognition =
      win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const results = event.results;
      const lastResult = results[Object.keys(results).length - 1];
      if (lastResult && lastResult[0] && lastResult[0].isFinal) {
        onTranscript(lastResult[0].transcript);
      }
    };

    recognition.onerror = () => {
      onStop();
    };

    recognition.onend = () => {
      onStop();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onStop, onTranscript]);

  useEffect(() => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (isRecording ? onStop() : onStart())}
      className={isRecording ? "bg-red-100 hover:bg-red-200" : ""}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceInput;
