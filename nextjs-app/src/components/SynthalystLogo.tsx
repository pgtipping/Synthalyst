import React from "react";

export default function SynthalystLogo() {
  // Generate a unique ID for the gradient
  const gradientId = `synthalystGradient-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  return (
    <svg
      width="240"
      height="70"
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#7baaf7" />
          <stop offset="100%" stopColor="#4285F4" />
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
