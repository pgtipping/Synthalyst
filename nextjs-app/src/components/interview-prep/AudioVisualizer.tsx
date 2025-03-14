"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  /** Whether the visualizer is active */
  isActive: boolean;
  /** Audio data for visualization */
  audioData?: Uint8Array;
  /** Width of the visualizer */
  width?: number;
  /** Height of the visualizer */
  height?: number;
  /** Bar width */
  barWidth?: number;
  /** Gap between bars */
  barGap?: number;
  /** Color of the bars */
  barColor?: string;
  /** CSS class name */
  className?: string;
}

/**
 * Audio visualizer component for the Mock Interview feature
 */
export function AudioVisualizer({
  isActive,
  audioData,
  width = 300,
  height = 60,
  barWidth = 4,
  barGap = 2,
  barColor = "currentColor",
  className,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If not active or no data, draw flat line
    if (!isActive || !audioData) {
      ctx.fillStyle = barColor;
      const flatLineHeight = 2;
      ctx.fillRect(0, height / 2 - flatLineHeight / 2, width, flatLineHeight);
      return;
    }

    // Calculate number of bars that fit in the canvas
    const totalBarWidth = barWidth + barGap;
    const numBars = Math.floor(width / totalBarWidth);

    // Draw bars
    ctx.fillStyle = barColor;

    for (let i = 0; i < numBars; i++) {
      // Get data point, or use a default value if no data
      const dataIndex = Math.floor(i * (audioData.length / numBars));
      const value = audioData ? audioData[dataIndex] || 0 : 0;

      // Scale value to fit canvas height (0-255 to 0-height)
      const barHeight = (value / 255) * height;

      // Center bars vertically
      const x = i * totalBarWidth;
      const y = (height - barHeight) / 2;

      // Draw bar
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }, [isActive, audioData, width, height, barWidth, barGap, barColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("rounded-md", className)}
    />
  );
}
