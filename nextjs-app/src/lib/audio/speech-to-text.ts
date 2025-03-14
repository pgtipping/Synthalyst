/**
 * Speech recognition functionality for the Interview Prep feature
 * Uses Web Speech API with fallback options
 */

export interface SpeechRecognitionOptions {
  /** Language for speech recognition (default: 'en-US') */
  language?: string;
  /** Whether to use continuous recognition (default: true) */
  continuous?: boolean;
  /** Whether to return interim results (default: true) */
  interimResults?: boolean;
  /** Maximum alternatives to return (default: 1) */
  maxAlternatives?: number;
  /** Callback when results are available */
  onResult?: (transcript: string, isFinal: boolean) => void;
  /** Callback when recognition ends */
  onEnd?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when recognition starts */
  onStart?: () => void;
}

export interface SpeechRecognitionState {
  /** Whether recognition is currently active */
  isRecognizing: boolean;
  /** Current transcript */
  transcript: string;
  /** Whether the browser supports speech recognition */
  isSupported: boolean;
  /** Error message if any */
  error?: string;
}

/**
 * SpeechRecognition class for handling speech-to-text in the browser
 */
export class SpeechRecognizer {
  private recognition: any = null;
  private options: SpeechRecognitionOptions;
  private state: SpeechRecognitionState = {
    isRecognizing: false,
    transcript: "",
    isSupported: this.checkSupport(),
  };

  /**
   * Create a new SpeechRecognizer instance
   * @param options Configuration options for the recognizer
   */
  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      language: "en-US",
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      ...options,
    };

    if (this.state.isSupported) {
      this.initializeRecognition();
    }
  }

  /**
   * Check if the browser supports speech recognition
   * @returns Whether speech recognition is supported
   */
  private checkSupport(): boolean {
    return !!(
      typeof window !== "undefined" &&
      (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)
    );
  }

  /**
   * Initialize the speech recognition object
   */
  private initializeRecognition(): void {
    // Get the appropriate SpeechRecognition constructor
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognition) {
      this.state.isSupported = false;
      this.state.error = "Speech recognition is not supported in this browser";
      return;
    }

    // Create the recognition instance
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.lang = this.options.language;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;
    this.recognition.maxAlternatives = this.options.maxAlternatives;

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update state with the latest transcript
      if (finalTranscript) {
        this.state.transcript += finalTranscript + " ";
      }

      // Call the result callback if provided
      if (this.options.onResult) {
        const currentTranscript = finalTranscript || interimTranscript;
        this.options.onResult(currentTranscript, !!finalTranscript);
      }
    };

    this.recognition.onstart = () => {
      this.state.isRecognizing = true;
      if (this.options.onStart) {
        this.options.onStart();
      }
    };

    this.recognition.onend = () => {
      this.state.isRecognizing = false;
      if (this.options.onEnd) {
        this.options.onEnd();
      }
    };

    this.recognition.onerror = (event: any) => {
      this.state.error = `Recognition error: ${event.error}`;
      if (this.options.onError) {
        this.options.onError(new Error(event.error));
      }
    };
  }

  /**
   * Get the current recognition state
   * @returns The current recognition state
   */
  getState(): SpeechRecognitionState {
    return { ...this.state };
  }

  /**
   * Start speech recognition
   * @returns Whether recognition started successfully
   */
  start(): boolean {
    if (!this.state.isSupported || !this.recognition) {
      this.state.error = "Speech recognition is not supported in this browser";
      return false;
    }

    if (this.state.isRecognizing) {
      return true;
    }

    try {
      this.recognition.start();
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
   * Stop speech recognition
   */
  stop(): void {
    if (!this.state.isRecognizing || !this.recognition) return;

    try {
      this.recognition.stop();
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Abort speech recognition
   */
  abort(): void {
    if (!this.recognition) return;

    try {
      this.recognition.abort();
      this.state.isRecognizing = false;
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Reset the transcript
   */
  resetTranscript(): void {
    this.state.transcript = "";
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stop();
    this.recognition = null;
    this.state.isRecognizing = false;
    this.state.transcript = "";
  }
}

/**
 * Create a hook-friendly speech recognizer instance
 * @param options Configuration options for the recognizer
 * @returns An object with recognizer methods and state
 */
export function createSpeechRecognizer(options: SpeechRecognitionOptions = {}) {
  const recognizer = new SpeechRecognizer(options);

  return {
    start: () => recognizer.start(),
    stop: () => recognizer.stop(),
    abort: () => recognizer.abort(),
    resetTranscript: () => recognizer.resetTranscript(),
    getState: () => recognizer.getState(),
    cleanup: () => recognizer.cleanup(),
  };
}

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }
}
