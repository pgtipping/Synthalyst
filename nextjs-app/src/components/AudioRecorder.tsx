import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { AlertCircle, Mic, Square, Play, Pause } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface AudioRecorderProps {
  onRecordingComplete?: (
    audioUrl: string,
    filename: string,
    recordingId: string
  ) => void;
  maxDurationInSeconds?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  maxDurationInSeconds = 60,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      setAudioUrl(null);
      setRecordingTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported MIME type
      const mimeTypes = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"];

      const supportedMimeType =
        mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) ||
        "audio/webm";

      mimeTypeRef.current = supportedMimeType;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeTypeRef.current,
        });

        // Create a local URL for preview
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Upload to server
        if (onRecordingComplete) {
          try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("audio", audioBlob);

            const response = await fetch("/api/audio", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to upload audio");
            }

            const data = await response.json();
            onRecordingComplete(data.url, data.filename, data.id);
          } catch (error) {
            console.error("Error uploading audio:", error);
            setError(
              error instanceof Error ? error.message : "Failed to upload audio"
            );
          } finally {
            setIsUploading(false);
          }
        }

        // Stop all tracks on the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= maxDurationInSeconds) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (
              mediaRecorderRef.current &&
              mediaRecorderRef.current.state === "recording"
            ) {
              mediaRecorderRef.current.stop();
            }
            return maxDurationInSeconds;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not start recording. Please check microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Handle audio playback events
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        audioRef.current?.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!isRecording && !audioUrl && (
            <Button onClick={startRecording} variant="default">
              <Mic className="mr-2 h-4 w-4" /> Record
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
          )}

          {audioUrl && (
            <Button onClick={togglePlayback} variant="outline">
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Play
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-sm font-medium">
          {isRecording ? (
            <span className="text-red-500">
              Recording: {formatTime(recordingTime)}
            </span>
          ) : audioUrl ? (
            <span>Recorded: {formatTime(recordingTime)}</span>
          ) : (
            <span>Not Recording</span>
          )}
        </div>
      </div>

      {isRecording && (
        <div className="space-y-2">
          <Progress value={(recordingTime / maxDurationInSeconds) * 100} />
          <p className="text-xs text-gray-500">
            Max duration: {formatTime(maxDurationInSeconds)}
          </p>
        </div>
      )}

      {isUploading && (
        <p className="text-sm text-blue-500">Uploading recording...</p>
      )}

      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
    </div>
  );
};
