"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  isListening: boolean;
  onListeningChange: (isListening: boolean) => void;
  onTranscript: (transcript: string) => void;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: {
    results: {
      [key: number]: {
        [key: number]: { transcript: string; isFinal: boolean };
      };
    };
  }) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

// @ts-expect-error - Web Speech API types are not fully supported in TypeScript
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognitionInstance };
    webkitSpeechRecognition: { new (): SpeechRecognitionInstance };
  }
}

const VoiceInput = ({
  isListening,
  onListeningChange,
  onTranscript,
}: VoiceInputProps) => {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    ) {
      const SpeechRecognitionImpl =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionImpl();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        if (lastResult && lastResult[0] && lastResult[0].isFinal) {
          onTranscript(lastResult[0].transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        onListeningChange(false);
      };

      recognitionRef.current.onend = () => {
        onListeningChange(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onListeningChange, onTranscript]);

  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [isListening]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onListeningChange(!isListening)}
      className={isListening ? "bg-red-100 hover:bg-red-200" : ""}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceInput;
