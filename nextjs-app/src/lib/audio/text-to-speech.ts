/**
 * Text-to-speech functionality for the Interview Prep feature
 * Uses Web Speech API with fallback options
 */

export interface TextToSpeechOptions {
  /** Voice to use for speech (default: first available voice) */
  voice?: SpeechSynthesisVoice | null;
  /** Speech rate (0.1 to 10, default: 1) */
  rate?: number;
  /** Speech pitch (0 to 2, default: 1) */
  pitch?: number;
  /** Speech volume (0 to 1, default: 1) */
  volume?: number;
  /** Language for speech (default: 'en-US') */
  lang?: string;
  /** Callback when speech starts */
  onStart?: () => void;
  /** Callback when speech ends */
  onEnd?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when speech is paused */
  onPause?: () => void;
  /** Callback when speech is resumed */
  onResume?: () => void;
}

export interface TextToSpeechState {
  /** Whether speech is currently active */
  isSpeaking: boolean;
  /** Whether speech is paused */
  isPaused: boolean;
  /** Whether the browser supports text-to-speech */
  isSupported: boolean;
  /** Available voices */
  voices: SpeechSynthesisVoice[];
  /** Current voice */
  currentVoice: SpeechSynthesisVoice | null;
  /** Error message if any */
  error?: string;
}

/**
 * TextToSpeech class for handling text-to-speech in the browser
 */
export class TextToSpeech {
  private utterance: SpeechSynthesisUtterance | null = null;
  private options: TextToSpeechOptions;
  private state: TextToSpeechState = {
    isSpeaking: false,
    isPaused: false,
    isSupported: this.checkSupport(),
    voices: [],
    currentVoice: null,
  };

  /**
   * Create a new TextToSpeech instance
   * @param options Configuration options for the speech
   */
  constructor(options: TextToSpeechOptions = {}) {
    this.options = {
      rate: 1,
      pitch: 1,
      volume: 1,
      lang: "en-US",
      ...options,
    };

    if (this.state.isSupported) {
      this.initializeVoices();
    }
  }

  /**
   * Check if the browser supports text-to-speech
   * @returns Whether text-to-speech is supported
   */
  private checkSupport(): boolean {
    return !!(typeof window !== "undefined" && window.speechSynthesis);
  }

  /**
   * Initialize available voices
   */
  private initializeVoices(): void {
    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      this.updateVoices(voices);
    } else {
      // If voices aren't loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        this.updateVoices(updatedVoices);
      };
    }
  }

  /**
   * Update available voices
   * @param voices Array of available voices
   */
  private updateVoices(voices: SpeechSynthesisVoice[]): void {
    this.state.voices = voices;

    // Set default voice if not specified
    if (!this.options.voice) {
      // Try to find a voice matching the specified language
      const langVoice = voices.find((voice) =>
        voice.lang.includes(this.options.lang || "en-US")
      );
      // Or use the first available voice
      this.state.currentVoice = langVoice || voices[0] || null;
    } else {
      this.state.currentVoice = this.options.voice;
    }
  }

  /**
   * Get the current speech state
   * @returns The current speech state
   */
  getState(): TextToSpeechState {
    return { ...this.state };
  }

  /**
   * Get available voices
   * @returns Array of available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.state.isSupported) return [];

    // Force refresh voices if empty
    if (this.state.voices.length === 0) {
      this.state.voices = window.speechSynthesis.getVoices();
    }

    return this.state.voices;
  }

  /**
   * Set the voice to use for speech
   * @param voice Voice to use
   */
  setVoice(voice: SpeechSynthesisVoice): void {
    this.state.currentVoice = voice;
    this.options.voice = voice;
  }

  /**
   * Set the speech rate
   * @param rate Speech rate (0.1 to 10)
   */
  setRate(rate: number): void {
    this.options.rate = Math.max(0.1, Math.min(10, rate));
  }

  /**
   * Set the speech pitch
   * @param pitch Speech pitch (0 to 2)
   */
  setPitch(pitch: number): void {
    this.options.pitch = Math.max(0, Math.min(2, pitch));
  }

  /**
   * Set the speech volume
   * @param volume Speech volume (0 to 1)
   */
  setVolume(volume: number): void {
    this.options.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Speak the specified text
   * @param text Text to speak
   * @returns Whether speech started successfully
   */
  speak(text: string): boolean {
    if (!this.state.isSupported) {
      this.state.error = "Text-to-speech is not supported in this browser";
      return false;
    }

    // Cancel any ongoing speech
    this.stop();

    try {
      // Create a new utterance
      this.utterance = new SpeechSynthesisUtterance(text);

      // Configure the utterance
      this.utterance.rate = this.options.rate || 1;
      this.utterance.pitch = this.options.pitch || 1;
      this.utterance.volume = this.options.volume || 1;
      this.utterance.lang = this.options.lang || "en-US";

      if (this.state.currentVoice) {
        this.utterance.voice = this.state.currentVoice;
      }

      // Set up event handlers
      this.utterance.onstart = () => {
        this.state.isSpeaking = true;
        this.state.isPaused = false;
        if (this.options.onStart) {
          this.options.onStart();
        }
      };

      this.utterance.onend = () => {
        this.state.isSpeaking = false;
        this.state.isPaused = false;
        if (this.options.onEnd) {
          this.options.onEnd();
        }
      };

      this.utterance.onerror = (event) => {
        this.state.error = `Speech error: ${event.error}`;
        if (this.options.onError) {
          this.options.onError(new Error(event.error));
        }
      };

      this.utterance.onpause = () => {
        this.state.isPaused = true;
        if (this.options.onPause) {
          this.options.onPause();
        }
      };

      this.utterance.onresume = () => {
        this.state.isPaused = false;
        if (this.options.onResume) {
          this.options.onResume();
        }
      };

      // Start speaking
      window.speechSynthesis.speak(this.utterance);
      return true;
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (
      !this.state.isSupported ||
      !this.state.isSpeaking ||
      this.state.isPaused
    )
      return;

    try {
      window.speechSynthesis.pause();
      this.state.isPaused = true;
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (
      !this.state.isSupported ||
      !this.state.isSpeaking ||
      !this.state.isPaused
    )
      return;

    try {
      window.speechSynthesis.resume();
      this.state.isPaused = false;
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Stop speech
   */
  stop(): void {
    if (!this.state.isSupported) return;

    try {
      window.speechSynthesis.cancel();
      this.state.isSpeaking = false;
      this.state.isPaused = false;
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stop();
    this.utterance = null;
  }
}

/**
 * Create a hook-friendly text-to-speech instance
 * @param options Configuration options for the speech
 * @returns An object with text-to-speech methods and state
 */
export function createTextToSpeech(options: TextToSpeechOptions = {}) {
  const tts = new TextToSpeech(options);

  return {
    speak: (text: string) => tts.speak(text),
    pause: () => tts.pause(),
    resume: () => tts.resume(),
    stop: () => tts.stop(),
    getState: () => tts.getState(),
    getVoices: () => tts.getVoices(),
    setVoice: (voice: SpeechSynthesisVoice) => tts.setVoice(voice),
    setRate: (rate: number) => tts.setRate(rate),
    setPitch: (pitch: number) => tts.setPitch(pitch),
    setVolume: (volume: number) => tts.setVolume(volume),
    cleanup: () => tts.cleanup(),
  };
}
