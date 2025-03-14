"use client";

import { useState, useEffect } from "react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Settings,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextToSpeechPlayerProps {
  /** Text to speak */
  text: string;
  /** Whether to auto-play the text */
  autoPlay?: boolean;
  /** Callback when speech starts */
  onSpeechStart?: () => void;
  /** Callback when speech ends */
  onSpeechEnd?: () => void;
  /** Callback when speech is paused */
  onSpeechPause?: () => void;
  /** Callback when speech is resumed */
  onSpeechResume?: () => void;
  /** Whether to show the settings button */
  showSettings?: boolean;
  /** CSS class name */
  className?: string;
}

/**
 * Text-to-speech player component for the Mock Interview feature
 */
export function TextToSpeechPlayer({
  text,
  autoPlay = false,
  onSpeechStart,
  onSpeechEnd,
  onSpeechPause,
  onSpeechResume,
  showSettings = true,
  className,
}: TextToSpeechPlayerProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  // Initialize text-to-speech
  const {
    state,
    voices,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  } = useTextToSpeech({
    onStart: onSpeechStart,
    onEnd: onSpeechEnd,
    onPause: onSpeechPause,
    onResume: onSpeechResume,
  });

  // Auto-play text if enabled
  useEffect(() => {
    setIsInitializing(true);

    const initTTS = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for UI
      setIsInitializing(false);

      if (autoPlay && text) {
        speak(text);
      }
    };

    initTTS();

    return () => {
      if (state.isSpeaking) {
        stop();
      }
    };
  }, [autoPlay, text, speak, stop, state.isSpeaking]);

  // Handle mute/unmute
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(state.volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Get available voices grouped by language
  const voicesByLanguage = voices.reduce((acc, voice) => {
    const lang = voice.lang.split("-")[0];
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  // Sort languages alphabetically
  const sortedLanguages = Object.keys(voicesByLanguage).sort();

  if (isInitializing) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Initializing text-to-speech...</span>
      </div>
    );
  }

  if (!state.isSupported) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 text-center",
          className
        )}
      >
        <VolumeX className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground">
          Text-to-speech is not supported in your browser. Please try using
          Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Main controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {state.isSpeaking ? (
            state.isPaused ? (
              <Button variant="default" size="sm" onClick={resume}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={pause}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => speak(text)}
              disabled={!text}
            >
              <Play className="h-4 w-4 mr-2" />
              Speak
            </Button>
          )}

          {state.isSpeaking && (
            <Button variant="destructive" size="sm" onClick={stop}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {showSettings && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Voice</h4>
                    <Select
                      value={state.voice?.voiceURI || ""}
                      onValueChange={(value) => {
                        const selectedVoice = voices.find(
                          (v) => v.voiceURI === value
                        );
                        if (selectedVoice) {
                          setVoice(selectedVoice);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedLanguages.map((lang) => (
                          <div key={lang}>
                            <div className="px-2 py-1.5 text-sm font-semibold bg-muted/50">
                              {new Intl.DisplayNames([navigator.language], {
                                type: "language",
                              }).of(lang) || lang}
                            </div>
                            {voicesByLanguage[lang].map((voice) => (
                              <SelectItem
                                key={voice.voiceURI}
                                value={voice.voiceURI}
                              >
                                {voice.name} {voice.default ? "(Default)" : ""}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium leading-none">Rate</h4>
                      <span className="text-sm text-muted-foreground">
                        {state.rate.toFixed(1)}x
                      </span>
                    </div>
                    <Slider
                      value={[state.rate]}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) => setRate(value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium leading-none">Pitch</h4>
                      <span className="text-sm text-muted-foreground">
                        {state.pitch.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[state.pitch]}
                      min={0}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) => setPitch(value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium leading-none">Volume</h4>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(state.volume * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[state.volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={([value]) => {
                        setVolume(value);
                        setIsMuted(value === 0);
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {state.isSpeaking && (
        <div className="text-xs text-muted-foreground text-center">
          {state.isPaused ? "Paused" : "Speaking..."}
        </div>
      )}
    </div>
  );
}
