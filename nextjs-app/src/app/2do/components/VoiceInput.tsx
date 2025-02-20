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

export default function VoiceInput({
  isRecording,
  onStart,
  onStop,
  onTranscript,
}: VoiceInputProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "SpeechRecognition" in window) {
      recognitionRef.current = new window.SpeechRecognition();
    } else if (
      typeof window !== "undefined" &&
      "webkitSpeechRecognition" in window
    ) {
      recognitionRef.current = new window.webkitSpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");

        if (event.results[0].isFinal) {
          onTranscript(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        onStop();
      };

      recognitionRef.current.onend = () => {
        onStop();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onStop, onTranscript]);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not supported");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      onStop();
    } else {
      recognitionRef.current.start();
      onStart();
    }
  };

  if (!recognitionRef.current) {
    return (
      <Button variant="outline" disabled>
        <MicOff className="h-4 w-4 mr-2" />
        Voice Input Not Supported
      </Button>
    );
  }

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      onClick={handleToggleRecording}
    >
      {isRecording ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Start Recording
        </>
      )}
    </Button>
  );
}
