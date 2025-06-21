import React from "react";

export default function CircularProgress({ percent, size = 120, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2563EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-medium text-gray-700">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}