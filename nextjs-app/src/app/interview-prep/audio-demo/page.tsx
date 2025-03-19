"use client";

import { useState } from "react";
import {
  AudioRecorder,
  SpeechRecognitionDisplay,
  TextToSpeechPlayer,
  AudioAnalysisDisplay,
} from "@/components/interview-prep";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";

export default function AudioDemoPage() {
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);
  const [transcript, setTranscript] = useState("");
  const [activeTab, setActiveTab] = useState("recorder");

  // Sample text for text-to-speech demo
  const sampleText =
    "Welcome to the interview preparation tool. This demo showcases the audio capabilities " +
    "of our application, including recording, speech recognition, text-to-speech, and audio analysis. " +
    "These features will help you practice and improve your interview skills.";

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Audio Components Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the audio components for the Interview Prep
          feature.
        </p>

        <Separator className="my-6" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="recorder">Audio Recorder</TabsTrigger>
            <TabsTrigger value="speech">Speech Recognition</TabsTrigger>
            <TabsTrigger value="tts">Text-to-Speech</TabsTrigger>
            <TabsTrigger value="analysis">Audio Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="recorder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audio Recorder</CardTitle>
                <CardDescription>
                  Record audio for interview practice and analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AudioRecorder
                  onRecordingComplete={(blob) => {
                    setAudioBlob(blob);
                    setActiveTab("analysis");
                  }}
                  maxDuration={60 * 1000}
                  showPlayer
                  showProgress
                />

                <div className="text-sm text-muted-foreground mt-4">
                  <p>
                    Try recording a short sample to test the audio recorder
                    component.
                  </p>
                  <p>
                    After recording, the audio will be available for analysis in
                    the Audio Analysis tab.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speech" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Speech Recognition</CardTitle>
                <CardDescription>
                  Convert speech to text for interview practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SpeechRecognitionDisplay
                  onTranscriptChange={(text) => setTranscript(text)}
                  showControls
                  showVisualizer
                />

                <div className="text-sm text-muted-foreground mt-4">
                  <p>
                    Click &quot;Start Listening&quot; and speak into your
                    microphone to test the speech recognition component.
                  </p>
                  <p>
                    The transcript will be displayed above and can be used for
                    further analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription>
                  Convert text to speech for interview practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/50">
                  <p className="text-sm">{sampleText}</p>
                </div>

                <TextToSpeechPlayer text={sampleText} showSettings />

                <div className="text-sm text-muted-foreground mt-4">
                  <p>
                    Click &quot;Speak&quot; to hear the sample text read aloud.
                  </p>
                  <p>
                    You can adjust the voice, rate, pitch, and volume using the
                    settings button.
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    Try with your own text:
                  </h3>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Enter text to be spoken..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />

                  <TextToSpeechPlayer text={transcript} showSettings />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audio Analysis</CardTitle>
                <CardDescription>
                  Analyze audio recordings for interview feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {audioBlob ? (
                  <AudioAnalysisDisplay
                    audioBlob={audioBlob}
                    autoAnalyze={false}
                  />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground mb-4">
                      No audio recording available for analysis.
                    </p>
                    <Button onClick={() => setActiveTab("recorder")}>
                      Go to Recorder
                    </Button>
                  </div>
                )}

                <div className="text-sm text-muted-foreground mt-4">
                  <p>
                    Record audio in the Audio Recorder tab, then analyze it here
                    to get feedback on your speaking skills.
                  </p>
                  <p>
                    The analysis provides metrics on clarity, pace, volume
                    consistency, filler word usage, and effective pausing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}
