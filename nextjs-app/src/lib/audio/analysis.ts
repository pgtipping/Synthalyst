/**
 * Audio analysis utilities for the Interview Prep feature
 * Analyzes speech patterns, filler words, and other metrics
 */

export interface AudioMetrics {
  /** Words per minute */
  wordsPerMinute: number;
  /** Count of filler words (um, uh, like, etc.) */
  fillerWordCount: Record<string, number>;
  /** Total number of filler words */
  totalFillerWords: number;
  /** Pause patterns (duration and position) */
  pausePatterns: Array<{ duration: number; position: number }>;
  /** Average pause duration in milliseconds */
  averagePauseDuration: number;
  /** Standard deviation of volume (0-1) */
  volumeVariation: number;
  /** Standard deviation of pitch (Hz) */
  pitchVariation: number;
  /** Total speaking time in milliseconds */
  speakingTime: number;
  /** Total duration of the audio in milliseconds */
  totalDuration: number;
  /** Speaking ratio (speaking time / total duration) */
  speakingRatio: number;
}

export interface AnalysisOptions {
  /** Language for analysis (default: 'en-US') */
  language?: string;
  /** Custom list of filler words to detect */
  fillerWords?: string[];
  /** Minimum pause duration to count in milliseconds (default: 500) */
  minPauseDuration?: number;
  /** Whether to analyze volume variation (default: true) */
  analyzeVolume?: boolean;
  /** Whether to analyze pitch variation (default: true) */
  analyzePitch?: boolean;
}

/**
 * AudioAnalysis class for analyzing speech recordings
 */
export class AudioAnalysis {
  private options: AnalysisOptions;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private defaultFillerWords = [
    "um",
    "uh",
    "er",
    "ah",
    "like",
    "you know",
    "sort of",
    "kind of",
    "basically",
    "actually",
    "literally",
    "right",
    "so",
    "anyway",
  ];

  /**
   * Create a new AudioAnalysis instance
   * @param options Configuration options for analysis
   */
  constructor(options: AnalysisOptions = {}) {
    this.options = {
      language: "en-US",
      fillerWords: this.defaultFillerWords,
      minPauseDuration: 500,
      analyzeVolume: true,
      analyzePitch: true,
      ...options,
    };

    this.initializeAudioContext();
  }

  /**
   * Initialize the audio context
   */
  private initializeAudioContext(): void {
    if (typeof window !== "undefined") {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
      } catch (error) {
        console.error("Error initializing audio context:", error);
      }
    }
  }

  /**
   * Analyze audio from a blob
   * @param audioBlob Audio blob to analyze
   * @param transcript Transcript of the audio
   * @returns Promise resolving to audio metrics
   */
  async analyzeAudio(
    audioBlob: Blob,
    transcript: string
  ): Promise<AudioMetrics> {
    const metrics: AudioMetrics = {
      wordsPerMinute: 0,
      fillerWordCount: {},
      totalFillerWords: 0,
      pausePatterns: [],
      averagePauseDuration: 0,
      volumeVariation: 0,
      pitchVariation: 0,
      speakingTime: 0,
      totalDuration: 0,
      speakingRatio: 0,
    };

    try {
      // Calculate basic metrics from transcript
      this.analyzeTranscript(transcript, metrics);

      // Analyze audio data if available
      if (audioBlob && this.audioContext) {
        await this.analyzeAudioData(audioBlob, metrics);
      }

      return metrics;
    } catch (error) {
      console.error("Error analyzing audio:", error);
      return metrics;
    }
  }

  /**
   * Analyze transcript for word count, filler words, etc.
   * @param transcript Transcript to analyze
   * @param metrics Metrics object to update
   */
  private analyzeTranscript(transcript: string, metrics: AudioMetrics): void {
    if (!transcript) return;

    // Clean transcript
    const cleanTranscript = transcript.toLowerCase().trim();

    // Count words
    const words = cleanTranscript
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const wordCount = words.length;

    // Count filler words
    const fillerWords = this.options.fillerWords || this.defaultFillerWords;
    const fillerWordCount: Record<string, number> = {};
    let totalFillerWords = 0;

    fillerWords.forEach((filler) => {
      // Count occurrences of each filler word
      const regex = new RegExp(`\\b${filler}\\b`, "gi");
      const matches = cleanTranscript.match(regex);
      const count = matches ? matches.length : 0;

      if (count > 0) {
        fillerWordCount[filler] = count;
        totalFillerWords += count;
      }
    });

    // Update metrics
    metrics.fillerWordCount = fillerWordCount;
    metrics.totalFillerWords = totalFillerWords;

    // Calculate words per minute if duration is available
    if (metrics.totalDuration > 0) {
      const minutes = metrics.totalDuration / 60000;
      metrics.wordsPerMinute = Math.round(wordCount / minutes);
    }
  }

  /**
   * Analyze audio data for pauses, volume, pitch, etc.
   * @param audioBlob Audio blob to analyze
   * @param metrics Metrics object to update
   */
  private async analyzeAudioData(
    audioBlob: Blob,
    metrics: AudioMetrics
  ): Promise<void> {
    if (!this.audioContext || !this.analyser) return;

    try {
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Get audio data
      const channelData = audioBuffer.getChannelData(0);
      const duration = audioBuffer.duration * 1000; // Convert to milliseconds

      // Update total duration
      metrics.totalDuration = duration;

      // Analyze pauses
      this.analyzePauses(channelData, audioBuffer.sampleRate, metrics);

      // Analyze volume variation if enabled
      if (this.options.analyzeVolume) {
        metrics.volumeVariation = this.calculateVolumeVariation(channelData);
      }

      // Analyze pitch variation if enabled
      if (this.options.analyzePitch) {
        metrics.pitchVariation = this.estimatePitchVariation(
          channelData,
          audioBuffer.sampleRate
        );
      }

      // Calculate speaking time and ratio
      metrics.speakingTime =
        duration -
        metrics.pausePatterns.reduce(
          (total, pause) => total + pause.duration,
          0
        );
      metrics.speakingRatio = metrics.speakingTime / duration;

      // Recalculate words per minute now that we have the duration
      if (metrics.totalDuration > 0) {
        const transcript = ""; // This would need to be passed in or stored
        this.analyzeTranscript(transcript, metrics);
      }
    } catch (error) {
      console.error("Error analyzing audio data:", error);
    }
  }

  /**
   * Analyze pauses in audio
   * @param channelData Audio channel data
   * @param sampleRate Sample rate of the audio
   * @param metrics Metrics object to update
   */
  private analyzePauses(
    channelData: Float32Array,
    sampleRate: number,
    metrics: AudioMetrics
  ): void {
    const minPauseDuration = this.options.minPauseDuration || 500;
    const pauseThreshold = 0.05; // Amplitude threshold for silence
    const pausePatterns: Array<{ duration: number; position: number }> = [];

    let isPause = false;
    let pauseStart = 0;
    let totalPauseDuration = 0;

    // Process audio in chunks
    const chunkSize = Math.floor(sampleRate / 10); // 100ms chunks

    for (let i = 0; i < channelData.length; i += chunkSize) {
      // Calculate RMS amplitude for this chunk
      let sumSquares = 0;
      const end = Math.min(i + chunkSize, channelData.length);

      for (let j = i; j < end; j++) {
        sumSquares += channelData[j] * channelData[j];
      }

      const rms = Math.sqrt(sumSquares / (end - i));
      const timeMs = (i / sampleRate) * 1000;

      // Detect pause start
      if (!isPause && rms < pauseThreshold) {
        isPause = true;
        pauseStart = timeMs;
      }
      // Detect pause end
      else if (isPause && rms >= pauseThreshold) {
        isPause = false;
        const pauseDuration = timeMs - pauseStart;

        // Only count pauses longer than the minimum duration
        if (pauseDuration >= minPauseDuration) {
          pausePatterns.push({
            duration: pauseDuration,
            position: pauseStart,
          });
          totalPauseDuration += pauseDuration;
        }
      }
    }

    // Handle pause at the end of the audio
    if (isPause) {
      const timeMs = (channelData.length / sampleRate) * 1000;
      const pauseDuration = timeMs - pauseStart;

      if (pauseDuration >= minPauseDuration) {
        pausePatterns.push({
          duration: pauseDuration,
          position: pauseStart,
        });
        totalPauseDuration += pauseDuration;
      }
    }

    // Update metrics
    metrics.pausePatterns = pausePatterns;
    metrics.averagePauseDuration =
      pausePatterns.length > 0 ? totalPauseDuration / pausePatterns.length : 0;
  }

  /**
   * Calculate volume variation (standard deviation)
   * @param channelData Audio channel data
   * @returns Standard deviation of volume
   */
  private calculateVolumeVariation(channelData: Float32Array): number {
    // Calculate mean amplitude
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
      sum += Math.abs(channelData[i]);
    }
    const mean = sum / channelData.length;

    // Calculate variance
    let variance = 0;
    for (let i = 0; i < channelData.length; i++) {
      const diff = Math.abs(channelData[i]) - mean;
      variance += diff * diff;
    }
    variance /= channelData.length;

    // Return standard deviation
    return Math.sqrt(variance);
  }

  /**
   * Estimate pitch variation (simplified)
   * @param channelData Audio channel data
   * @param sampleRate Sample rate of the audio
   * @returns Estimated standard deviation of pitch
   */
  private estimatePitchVariation(
    channelData: Float32Array,
    sampleRate: number
  ): number {
    // This is a simplified estimation and would need a more sophisticated
    // algorithm for accurate pitch detection

    // For now, return a placeholder value
    return 0.1;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
  }
}

/**
 * Create a hook-friendly audio analysis instance
 * @param options Configuration options for analysis
 * @returns An object with analysis methods
 */
export function createAudioAnalysis(options: AnalysisOptions = {}) {
  const analyzer = new AudioAnalysis(options);

  return {
    analyzeAudio: (audioBlob: Blob, transcript: string) =>
      analyzer.analyzeAudio(audioBlob, transcript),
    cleanup: () => analyzer.cleanup(),
  };
}
