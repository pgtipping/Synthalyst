import { useState, useEffect, useCallback } from "react";
import {
  TextToSpeechOptions,
  TextToSpeechState,
  createTextToSpeech,
} from "@/lib/audio/text-to-speech";

/**
 * React hook for using text-to-speech
 * @param options Configuration options for the speech
 * @returns Object with text-to-speech methods and state
 */
export function useTextToSpeech(options: TextToSpeechOptions = {}) {
  const [state, setState] = useState<TextToSpeechState>({
    isSpeaking: false,
    isPaused: false,
    isSupported: false,
    voices: [],
    currentVoice: null,
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Create text-to-speech with custom callbacks
  const tts = useCallback(() => {
    return createTextToSpeech(options);
  }, [options]);

  // Speak text
  const speak = useCallback(
    (text: string) => {
      const textToSpeech = tts();
      return textToSpeech.speak(text);
    },
    [tts]
  );

  // Pause speech
  const pause = useCallback(() => {
    const textToSpeech = tts();
    textToSpeech.pause();
  }, [tts]);

  // Resume speech
  const resume = useCallback(() => {
    const textToSpeech = tts();
    textToSpeech.resume();
  }, [tts]);

  // Stop speech
  const stop = useCallback(() => {
    const textToSpeech = tts();
    textToSpeech.stop();
  }, [tts]);

  // Set voice
  const setVoice = useCallback(
    (voice: SpeechSynthesisVoice) => {
      const textToSpeech = tts();
      textToSpeech.setVoice(voice);
    },
    [tts]
  );

  // Set rate
  const setRate = useCallback(
    (rate: number) => {
      const textToSpeech = tts();
      textToSpeech.setRate(rate);
    },
    [tts]
  );

  // Set pitch
  const setPitch = useCallback(
    (pitch: number) => {
      const textToSpeech = tts();
      textToSpeech.setPitch(pitch);
    },
    [tts]
  );

  // Set volume
  const setVolume = useCallback(
    (volume: number) => {
      const textToSpeech = tts();
      textToSpeech.setVolume(volume);
    },
    [tts]
  );

  // Update state and voices
  useEffect(() => {
    const intervalId = setInterval(() => {
      const textToSpeech = tts();
      setState(textToSpeech.getState());
      setVoices(textToSpeech.getVoices());
    }, 100);

    return () => {
      clearInterval(intervalId);
      const textToSpeech = tts();
      textToSpeech.cleanup();
    };
  }, [tts]);

  return {
    // State
    state,
    voices,

    // Methods
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  };
}
