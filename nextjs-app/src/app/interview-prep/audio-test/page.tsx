"use client";

import { useState } from "react";
import { AudioRecorder } from "@/components/interview-prep";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

export default function AudioTestPage() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleRecordingComplete = (blob: Blob, url: string) => {
    console.log("Recording complete, blob size:", blob.size);
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Audio Recorder Test</h1>
        <p className="text-muted-foreground">
          This is a simplified test page for the audio recorder component.
        </p>

        <div className="flex space-x-2 mb-4">
          <Link href="/interview-prep">
            <Button variant="outline">Back to Interview Prep</Button>
          </Link>
          <Link href="/interview-prep/audio-demo">
            <Button variant="outline">Go to Full Audio Demo</Button>
          </Link>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Basic Audio Recorder</h2>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
              <li>Click the microphone button to start recording</li>
              <li>You should see visual feedback that recording has started</li>
              <li>Speak into your microphone</li>
              <li>Click the stop button (square icon) when finished</li>
              <li>Your recording will appear below for playback</li>
            </ol>
          </div>

          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            maxDuration={30 * 1000} // 30 seconds
            showPlayer={true}
            showProgress={true}
            autoRequestPermission={true}
            className="mb-4"
          />

          <div className="mt-4 text-sm">
            <p className="font-medium">Debug Information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Audio Blob: {audioBlob ? `${audioBlob.size} bytes` : "None"}
              </li>
              <li>Audio URL: {audioUrl ? "Available" : "None"}</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm">
              <strong>Troubleshooting:</strong> If the recorder isn&apos;t
              working, please check:
            </p>
            <ul className="list-disc pl-5 text-sm">
              <li>
                Your browser permissions (click the lock icon in the address
                bar)
              </li>
              <li>
                That you&apos;re using a supported browser (Chrome, Firefox, or
                Safari)
              </li>
              <li>That your microphone is properly connected and working</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
