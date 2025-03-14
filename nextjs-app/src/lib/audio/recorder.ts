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
  private state: RecordingState = {
    isRecording: false,
    duration: 0,
    isProcessing: false,
    hasPermission: false,
    isSupported: this.checkSupport(),
  };

  /**
   * Create a new AudioRecorder instance
   * @param options Configuration options for the recorder
   */
  constructor(options: RecorderOptions = {}) {
    this.options = {
      mimeType: "audio/webm",
      audioBitsPerSecond: 128000,
      noiseReduction: true,
      maxDuration: 5 * 60 * 1000, // 5 minutes
      ...options,
    };
  }

  /**
   * Check if the browser supports audio recording
   * @returns Whether audio recording is supported
   */
  private checkSupport(): boolean {
    return !!(
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
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
    console.log("Requesting microphone permission");
    if (!this.state.isSupported) {
      console.error("Audio recording is not supported in this browser");
      this.state.error = "Audio recording is not supported in this browser";
      return false;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: this.options.noiseReduction,
          noiseSuppression: this.options.noiseReduction,
          autoGainControl: this.options.noiseReduction,
        },
      };

      console.log("Requesting user media with constraints:", constraints);
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Permission granted, stream obtained");
      this.state.hasPermission = true;
      this.setupAudioContext();
      return true;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      this.state.hasPermission = false;
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * Set up the audio context and analyzer for visualization
   */
  private setupAudioContext(): void {
    if (!this.stream) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);
    } catch (error) {
      console.error("Error setting up audio context:", error);
    }
  }

  /**
   * Start recording audio
   * @returns Promise resolving to whether recording started successfully
   */
  async start(): Promise<boolean> {
    console.log("AudioRecorder.start called");
    if (this.state.isRecording) {
      console.log("Already recording, ignoring start call");
      return true;
    }

    if (!this.state.hasPermission) {
      console.log("No permission, requesting...");
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.error("Permission denied");
        return false;
      }
    }

    try {
      if (!this.stream) {
        console.error("No audio stream available");
        throw new Error("No audio stream available");
      }

      // Determine supported MIME type
      const mimeType = this.getSupportedMimeType();
      console.log("Using MIME type:", mimeType);

      // Create MediaRecorder with options
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType,
          audioBitsPerSecond: this.options.audioBitsPerSecond,
        });
        console.log("MediaRecorder created successfully");
      } catch (error) {
        console.error(
          "Failed to create MediaRecorder with specified options, trying with defaults"
        );
        // Try again with default options
        this.mediaRecorder = new MediaRecorder(this.stream);
      }

      // Set up event handlers
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log(`Data available: ${event.data.size} bytes`);
          if (this.options.onDataAvailable) {
            this.options.onDataAvailable(event.data);
          }
        }
      };

      this.mediaRecorder.onstart = () => {
        console.log("MediaRecorder.onstart fired");
        this.state.isRecording = true;
        this.startTime = Date.now();
        this.startDurationTracking();
        this.startVisualization();
        if (this.options.onStart) {
          this.options.onStart();
        }
      };

      this.mediaRecorder.onstop = () => {
        console.log("MediaRecorder.onstop fired");
        this.state.isRecording = false;
        this.stopDurationTracking();
        this.stopVisualization();

        // Create final audio blob
        if (this.audioChunks.length === 0) {
          console.warn("No audio chunks recorded");
          if (this.options.onError) {
            this.options.onError(new Error("No audio data recorded"));
          }
          return;
        }

        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        console.log(`Recording complete: ${audioBlob.size} bytes`);

        if (this.options.onStop) {
          this.options.onStop(audioBlob);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        this.state.error = "Recording error occurred";
        if (this.options.onError) {
          this.options.onError(
            new Error("MediaRecorder error: " + event.error)
          );
        }
      };

      // Start recording
      console.log("Starting MediaRecorder...");
      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log("MediaRecorder started");

      // Set up max duration timer if specified
      if (this.options.maxDuration) {
        setTimeout(() => {
          if (this.state.isRecording) {
            console.log(
              `Max duration (${this.options.maxDuration}ms) reached, stopping recording`
            );
            this.stop();
          }
        }, this.options.maxDuration);
      }

      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
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
      this.options.mimeType,
      "audio/webm",
      "audio/webm;codecs=opus",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];

    for (const type of preferredTypes) {
      if (type && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback to default
    return "";
  }

  /**
   * Start tracking recording duration
   */
  private startDurationTracking(): void {
    this.durationInterval = setInterval(() => {
      this.state.duration = Date.now() - this.startTime;
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

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    this.visualizationInterval = setInterval(() => {
      this.analyser!.getByteFrequencyData(dataArray);
      if (this.options.onVisualizationData) {
        this.options.onVisualizationData(dataArray);
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
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Pause recording audio
   */
  pause(): void {
    if (!this.state.isRecording || !this.mediaRecorder) return;

    try {
      if (this.mediaRecorder.state === "recording") {
        this.mediaRecorder.pause();
      }
    } catch (error) {
      this.state.error = (error as Error).message;
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Resume recording audio
   */
  resume(): void {
    if (!this.mediaRecorder) return;

    try {
      if (this.mediaRecorder.state === "paused") {
        this.mediaRecorder.resume();
      }
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
    this.stopDurationTracking();
    this.stopVisualization();

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      if (this.audioContext.state !== "closed") {
        this.audioContext.close();
      }
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
    pause: () => recorder.pause(),
    resume: () => recorder.resume(),
    getState: () => recorder.getState(),
    requestPermission: () => recorder.requestPermission(),
    cleanup: () => recorder.cleanup(),
  };
}
