"use client";

import { useState } from "react";
import { Competency } from "../types";

interface CompetencyVisualizationProps {
  competencies: Competency[];
}

export default function CompetencyVisualization({
  competencies,
}: CompetencyVisualizationProps) {
  const [visualizationType, setVisualizationType] = useState<
    "radar" | "heatmap" | "matrix"
  >("radar");

  // Group competencies by type
  const competencyTypes = Array.from(
    new Set(competencies.map((comp) => comp.type))
  );

  const getColorForLevel = (levelOrder: number, maxLevels: number) => {
    const intensity = (levelOrder / maxLevels) * 100;
    return `hsl(210, 100%, ${100 - intensity * 0.7}%)`;
  };

  const renderRadarChart = () => {
    // Simple radar chart visualization
    const angleStep = (2 * Math.PI) / competencies.length;

    // Calculate chart dimensions
    const size = 400;
    const center = size / 2;
    const radius = center - 50;

    // Generate points for each competency
    const points = competencies.map((comp, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      return {
        name: comp.name,
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
        angle,
      };
    });

    return (
      <div className="flex flex-col items-center mt-6">
        <h3 className="text-lg font-medium mb-4">Competency Radar Chart</h3>
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            {/* Background circles */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius * scale}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Axis lines */}
            {points.map((point, i) => (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Competency polygon */}
            <polygon
              points={points.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Competency labels */}
            {points.map((point, i) => {
              // Position labels outside the polygon
              const labelX = center + (radius + 20) * Math.cos(point.angle);
              const labelY = center + (radius + 20) * Math.sin(point.angle);
              const textAnchor =
                Math.abs(point.angle) < Math.PI / 2 ||
                Math.abs(point.angle) > (3 * Math.PI) / 2
                  ? "start"
                  : "end";

              return (
                <g key={i}>
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="500"
                    fill="#4b5563"
                  >
                    {point.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const renderHeatmap = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Competency Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competency
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                {Array.from({ length: 5 }, (_, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Level {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competencies.map((comp, i) => {
                return (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comp.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {comp.type}
                    </td>
                    {Array.from({ length: 5 }, (_, j) => {
                      const level = comp.levels.find(
                        (l) => l.levelOrder === j + 1
                      );
                      return (
                        <td
                          key={j}
                          className="px-6 py-4 whitespace-nowrap text-sm text-center"
                          style={{
                            backgroundColor: level
                              ? getColorForLevel(j + 1, 5)
                              : "#f9fafb",
                          }}
                        >
                          {level ? level.name : "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCompetencyMatrix = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Competency Matrix by Type</h3>
        {competencyTypes.map((type) => {
          const typeCompetencies = competencies.filter(
            (comp) => comp.type === type
          );
          return (
            <div key={type} className="mb-8">
              <h4 className="text-md font-medium mb-3">{type}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeCompetencies.map((comp, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h5 className="font-semibold mb-2">{comp.name}</h5>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {comp.description}
                    </p>
                    <div className="space-y-1">
                      {comp.levels.map((level, j) => (
                        <div
                          key={j}
                          className="text-xs py-1 px-2 rounded"
                          style={{
                            backgroundColor: getColorForLevel(
                              level.levelOrder,
                              comp.levels.length
                            ),
                          }}
                        >
                          {level.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Competency Visualization</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setVisualizationType("radar")}
            className={`px-3 py-1 text-sm rounded ${
              visualizationType === "radar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Radar Chart
          </button>
          <button
            onClick={() => setVisualizationType("heatmap")}
            className={`px-3 py-1 text-sm rounded ${
              visualizationType === "heatmap"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setVisualizationType("matrix")}
            className={`px-3 py-1 text-sm rounded ${
              visualizationType === "matrix"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Matrix
          </button>
        </div>
      </div>

      {visualizationType === "radar" && renderRadarChart()}
      {visualizationType === "heatmap" && renderHeatmap()}
      {visualizationType === "matrix" && renderCompetencyMatrix()}
    </div>
  );
}
