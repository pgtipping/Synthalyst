"use client";

import React, { useId, useState, useEffect, useRef, useCallback } from "react";

export default function SynthalystLogoAnimated() {
  // Generate a stable ID for the gradient using React's useId hook
  const uniqueId = useId();
  const gradientId = `synthalystGradient-${uniqueId.replace(/:/g, "")}`;

  // Define our three colors - two blues and black
  const primaryBlue = "#4285F4"; // Google blue
  const secondaryBlue = "#1A73E8"; // Darker blue
  const black = "#000000";

  // State for gradient colors
  const [startColor, setStartColor] = useState(primaryBlue);
  const [midColor, setMidColor] = useState(secondaryBlue);
  const [endColor, setEndColor] = useState(black);

  // Animation frame reference
  const animationRef = useRef<number | null>(null);

  // Track the current pattern index
  const patternIndexRef = useRef(0);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Define the color rotation patterns
  const colorPatterns = [
    { start: primaryBlue, mid: secondaryBlue, end: black }, // Pattern 1
    { start: black, mid: primaryBlue, end: secondaryBlue }, // Pattern 2
    { start: secondaryBlue, mid: black, end: primaryBlue }, // Pattern 3
  ];

  // Update colors based on the current pattern
  const updateColors = useCallback(() => {
    if (!isMountedRef.current) return;

    try {
      // Get the next pattern
      const nextPattern = colorPatterns[patternIndexRef.current];

      // Update the colors
      setStartColor(nextPattern.start);
      setMidColor(nextPattern.mid);
      setEndColor(nextPattern.end);

      // Move to the next pattern
      patternIndexRef.current =
        (patternIndexRef.current + 1) % colorPatterns.length;
    } catch (error) {
      console.error("Error in color animation:", error);
    }

    // Continue animation after a longer delay (3 seconds)
    if (isMountedRef.current) {
      animationRef.current = setTimeout(() => {
        updateColors();
      }, 8000) as unknown as number;
    }
  }, [colorPatterns]);

  // Set up and clean up animation
  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Start animation with a small delay to avoid hydration issues
    animationRef.current = setTimeout(() => {
      updateColors();
    }, 100) as unknown as number;

    // Clean up animation on unmount
    return () => {
      // Mark as unmounted to prevent further updates
      isMountedRef.current = false;

      // Clear any pending timeouts
      if (animationRef.current) {
        clearTimeout(animationRef.current as unknown as NodeJS.Timeout);
      }
    };
  }, [updateColors]);

  return (
    <svg
      width="240"
      height="70"
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
      aria-label="Synthalyst Logo"
      style={{ filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.2))" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="50%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="var(--font-moon-dance), serif"
        fontSize="90"
        fill={`url(#${gradientId})`}
      >
        Synthalyst
      </text>
    </svg>
  );
}
