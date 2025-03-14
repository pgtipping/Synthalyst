/**
 * Hooks for the Interview Prep feature
 * Exports all audio-related hooks
 */

export { useAudioRecorder } from "./useAudioRecorder";
export { useSpeechRecognition } from "./useSpeechRecognition";
export { useTextToSpeech } from "./useTextToSpeech";

// Re-export types for convenience
import { RecorderOptions, RecordingState } from "@/lib/audio/recorder";
import {
  SpeechRecognitionOptions,
  SpeechRecognitionState,
} from "@/lib/audio/speech-to-text";
import {
  TextToSpeechOptions,
  TextToSpeechState,
} from "@/lib/audio/text-to-speech";

export type {
  RecorderOptions,
  RecordingState,
  SpeechRecognitionOptions,
  SpeechRecognitionState,
  TextToSpeechOptions,
  TextToSpeechState,
};
