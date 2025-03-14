/**
 * Audio recording functionality for the Interview Prep feature
 * Handles browser audio recording with MediaRecorder API
 */

export interface RecorderOptions {
  /** Audio MIME type (default: audio/webm) */
  mimeType?: string;
  /** Audio bit rate in bits per second (default: 128000) */
  audioBitsPerSecond?: number;
  /** Whether to apply noise reduction (default: true) */
  noiseReduction?: boolean;
  /** Maximum recording duration in milliseconds (default: 5 minutes) */
  maxDuration?: number;
  /** Callback when recording starts */
  onStart?: () => void;
  /** Callback when recording stops */
  onStop?: (audioBlob: Blob) => void;
  /** Callback when audio data is available */
  onDataAvailable?: (data: Blob) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback for audio visualization data */
  onVisualizationData?: (data: Uint8Array) => void;
  /** Enable verbose logging (default: false) */
  verboseLogging?: boolean;
}

export interface RecordingState {
  /** Whether recording is currently active */
  isRecording: boolean;
  /** Duration of the current recording in milliseconds */
  duration: number;
  /** Whether audio is being processed */
  isProcessing: boolean;
  /** Whether the recorder has permission to access the microphone */
  hasPermission: boolean;
  /** Whether the browser supports audio recording */
  isSupported: boolean;
  /** Error message if any */
  error?: string;
}

// Add error throttling to prevent console spam
const errorThrottleMap = new Map<string, number>();

/**
 * Throttle error logging to prevent console spam
 * @param errorMessage The error message to log
 * @param errorCallback Optional callback to call with the error
 */
function logThrottledError(
  errorMessage: string,
  errorCallback?: (error: Error) => void
): void {
  const now = Date.now();
  const lastErrorTime = errorThrottleMap.get(errorMessage) || 0;

  // Only log errors once per second for the same error message
  if (now - lastErrorTime > 1000) {
    errorThrottleMap.set(errorMessage, now);
    console.error(errorMessage);

    if (errorCallback) {
      errorCallback(new Error(errorMessage));
    }
  }
}

/**
 * AudioRecorder class for handling audio recording in the browser
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private durationInterval: NodeJS.Timeout | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private visualizationInterval: NodeJS.Timeout | null = null;
  private options: RecorderOptions;
  private currentMimeType: string = "";
  private state: RecordingState = {
    isRecording: false,
    duration: 0,
    isProcessing: false,
    hasPermission: false,
    isSupported: this.checkSupport(),
  };
  private verboseLogging: boolean = false;

  /**
   * Create a new AudioRecorder instance
   * @param options Configuration options for the recorder
   */
  constructor(options: RecorderOptions = {}) {
    this.options = {
      mimeType: "audio/wav",
      audioBitsPerSecond: 128000,
      noiseReduction: false,
      maxDuration: 5 * 60 * 1000, // 5 minutes
      verboseLogging: false,
      ...options,
    };
    this.verboseLogging = !!this.options.verboseLogging;
  }

  /**
   * Log message only if verbose logging is enabled
   */
  private log(...args: (string | number | object)[]): void {
    if (this.verboseLogging) {
      console.log("[AudioRecorder]", ...args);
    }
  }

  /**
   * Check if the browser supports audio recording
   * @returns Whether audio recording is supported
   */
  private checkSupport(): boolean {
    return (
      typeof window !== "undefined" &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia &&
      !!window.MediaRecorder
    );
  }

  /**
   * Get the current recording state
   * @returns The current recording state
   */
  getState(): RecordingState {
    return { ...this.state };
  }

  /**
   * Request permission to access the microphone
   * @returns Promise resolving to whether permission was granted
   */
  async requestPermission(): Promise<boolean> {
    this.log("Requesting microphone permission");
    try {
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 1,
        },
      };

      this.log("Requesting user media with constraints:", constraints);
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.log("Permission granted, stream obtained");
      this.state.hasPermission = true;

      if (this.options.onVisualizationData) {
        this.setupAudioContext();
      }

      return true;
    } catch (err) {
      const errorMessage = `Error requesting microphone permission: ${err}`;
      console.error(errorMessage);
      if (this.options.onError) {
        this.options.onError(err as Error);
      }

      this.state.hasPermission = false;
      this.state.error = (err as Error).message;
      return false;
    }
  }

  /**
   * Set up the audio context and analyzer for visualization
   */
  private setupAudioContext(): void {
    if (!this.stream) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        ((window as any).webkitAudioContext as typeof AudioContext);

      this.audioContext = new AudioContextClass();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);
    } catch (err) {
      console.error("Error setting up audio context:", err);
    }
  }

  /**
   * Start recording audio
   * @returns Promise resolving to whether recording started successfully
   */
  async start(): Promise<boolean> {
    this.log("Starting recording");
    if (this.state.isRecording) {
      this.log("Already recording");
      return true;
    }

    if (!this.state.hasPermission) {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) return false;
    }

    try {
      if (!this.stream) {
        throw new Error("No audio stream available");
      }

      this.currentMimeType = this.getSupportedMimeType();
      this.log("Using MIME type:", this.currentMimeType);

      const options: MediaRecorderOptions = {
        mimeType: this.currentMimeType,
        audioBitsPerSecond: this.options.audioBitsPerSecond,
      };

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          if (this.options.onDataAvailable) {
            this.options.onDataAvailable(event.data);
          }
        }
      };

      this.mediaRecorder.onstart = () => {
        this.log("Recording started");
        this.state.isRecording = true;
        this.startTime = Date.now();
        this.startDurationTracking();
        this.startVisualization();
        if (this.options.onStart) {
          this.options.onStart();
        }
      };

      this.mediaRecorder.onstop = () => {
        this.log("Recording stopped");
        this.state.isRecording = false;
        this.stopDurationTracking();
        this.stopVisualization();

        this.state.isProcessing = true;
        try {
          if (this.audioChunks.length === 0) {
            throw new Error("No audio data recorded");
          }

          const audioBlob = new Blob(this.audioChunks, {
            type: this.currentMimeType || "audio/webm",
          });
          this.log(`Created audio blob: ${audioBlob.size} bytes`);

          if (this.options.onStop) {
            this.options.onStop(audioBlob);
          }
        } catch (err) {
          console.error("Error processing audio:", err);
          if (this.options.onError) {
            this.options.onError(err as Error);
          }
        } finally {
          this.state.isProcessing = false;
        }
      };

      // Request data every 250ms for smoother updates
      this.mediaRecorder.start(250);
      this.log("MediaRecorder started");

      if (this.options.maxDuration) {
        setTimeout(() => {
          if (this.state.isRecording) {
            this.log(`Max duration reached, stopping`);
            this.stop();
          }
        }, this.options.maxDuration);
      }

      return true;
    } catch (err) {
      console.error("Error starting recording:", err);
      if (this.options.onError) {
        this.options.onError(err as Error);
      }
      return false;
    }
  }

  /**
   * Get a supported MIME type for audio recording
   * @returns A supported MIME type
   */
  private getSupportedMimeType(): string {
    const preferredTypes = [
      "audio/webm",
      "audio/webm;codecs=opus",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];

    // First try user-specified MIME type
    if (
      this.options.mimeType &&
      MediaRecorder.isTypeSupported(this.options.mimeType)
    ) {
      return this.options.mimeType;
    }

    // Then try preferred types
    for (const type of preferredTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // If no preferred types are supported, let browser choose
    this.log("No preferred MIME types supported, using browser default");
    return "audio/webm";
  }

  /**
   * Start tracking recording duration
   */
  private startDurationTracking(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }

    this.startTime = Date.now();
    this.durationInterval = setInterval(() => {
      if (this.state.isRecording) {
        this.state.duration = Date.now() - this.startTime;
        this.log("Duration updated:", this.state.duration);
      }
    }, 100);
  }

  /**
   * Stop tracking recording duration
   */
  private stopDurationTracking(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  /**
   * Start audio visualization
   */
  private startVisualization(): void {
    if (!this.analyser || !this.options.onVisualizationData) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const visualizationCallback = this.options.onVisualizationData;

    this.visualizationInterval = setInterval(() => {
      const analyser = this.analyser;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        visualizationCallback(dataArray);
      }
    }, 50);
  }

  /**
   * Stop audio visualization
   */
  private stopVisualization(): void {
    if (this.visualizationInterval) {
      clearInterval(this.visualizationInterval);
      this.visualizationInterval = null;
    }
  }

  /**
   * Stop recording audio
   */
  stop(): void {
    if (!this.state.isRecording || !this.mediaRecorder) return;

    try {
      this.mediaRecorder.stop();
    } catch (error) {
      console.error("Error stopping recording:", error);
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
    this.stopDurationTracking();
    this.stopVisualization();

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
    this.state.isRecording = false;
    this.state.duration = 0;
    this.state.isProcessing = false;
  }
}

/**
 * Create a hook-friendly recorder instance
 * @param options Configuration options for the recorder
 * @returns An object with recorder methods and state
 */
export function createRecorder(options: RecorderOptions = {}) {
  const recorder = new AudioRecorder(options);
  return {
    start: () => recorder.start(),
    stop: () => recorder.stop(),
    getState: () => recorder.getState(),
    requestPermission: () => recorder.requestPermission(),
    cleanup: () => recorder.cleanup(),
  };
}
