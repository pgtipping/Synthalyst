/**
 * Audio utilities for the Interview Prep feature
 * Exports all audio-related functionality
 */

// Import all audio utilities
import { AudioMetrics, createAudioAnalysis } from "./analysis";
import { RecordingState, createRecorder } from "./recorder";
import {
  SpeechRecognitionState,
  createSpeechRecognizer,
} from "./speech-to-text";
import { TextToSpeechState, createTextToSpeech } from "./text-to-speech";

// Export everything from the modules
export * from "./recorder";
export * from "./speech-to-text";
export * from "./text-to-speech";
export * from "./analysis";

// Re-export common types for convenience
export type {
  AudioMetrics,
  RecordingState,
  SpeechRecognitionState,
  TextToSpeechState,
};

/**
 * Create a complete audio processing system
 * @returns Object with all audio processing methods
 */
export function createAudioSystem() {
  // Create instances
  const recorder = createRecorder();
  const recognizer = createSpeechRecognizer();
  const tts = createTextToSpeech();
  const analyzer = createAudioAnalysis();

  return {
    // Recording methods
    startRecording: () => recorder.start(),
    stopRecording: () => recorder.stop(),
    getRecordingState: () => recorder.getState(),

    // Speech recognition methods
    startRecognition: () => recognizer.start(),
    stopRecognition: () => recognizer.stop(),
    getRecognitionState: () => recognizer.getState(),

    // Text-to-speech methods
    speak: (text: string) => tts.speak(text),
    stopSpeaking: () => tts.stop(),
    getVoices: () => tts.getVoices(),

    // Analysis methods
    analyzeAudio: (audioBlob: Blob, transcript: string) =>
      analyzer.analyzeAudio(audioBlob, transcript),

    // Cleanup method
    cleanup: () => {
      recorder.cleanup();
      recognizer.cleanup();
      tts.cleanup();
      analyzer.cleanup();
    },
  };
}
