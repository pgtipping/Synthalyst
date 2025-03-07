"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, RadarIcon, Grid3X3 } from "lucide-react";

// Define the types locally if the import is not working
interface CompetencyLevel {
  id?: string;
  name: string;
  description: string;
  levelOrder: number;
  behavioralIndicators: string[];
  developmentSuggestions: string[];
  competencyId?: string;
}

interface Competency {
  id?: string;
  name: string;
  description: string;
  businessImpact: string;
  type: string;
  levels: CompetencyLevel[];
  frameworkId?: string;
  categoryId?: string;
  industryId?: string;
}

interface CompetencyVisualizationProps {
  competencies: Competency[];
}

export default function CompetencyVisualization({
  competencies,
}: CompetencyVisualizationProps) {
  const [visualizationType, setVisualizationType] = useState<
    "radar" | "heatmap" | "distribution" | "levels"
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
                    className="text-xs font-medium fill-gray-700"
                  >
                    {competencies[i].name}
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
    // Group competencies by type
    const groupedCompetencies: Record<string, Competency[]> = {};
    competencyTypes.forEach((type) => {
      groupedCompetencies[type] = competencies.filter(
        (comp) => comp.type === type
      );
    });

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Competency Heatmap</h3>
        <div className="space-y-6">
          {Object.entries(groupedCompetencies).map(([type, comps]) => (
            <div key={type} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{type} Competencies</h4>
              <div className="grid grid-cols-1 gap-3">
                {comps.map((comp) => {
                  const maxLevel = Math.max(
                    ...comp.levels.map((l: CompetencyLevel) => l.levelOrder)
                  );
                  return (
                    <div key={comp.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{comp.name}</span>
                        <span className="text-xs text-gray-500">
                          {comp.levels.length} levels
                        </span>
                      </div>
                      <div className="flex h-8 rounded-md overflow-hidden">
                        {comp.levels
                          .sort(
                            (a: CompetencyLevel, b: CompetencyLevel) =>
                              a.levelOrder - b.levelOrder
                          )
                          .map((level: CompetencyLevel) => (
                            <div
                              key={level.name}
                              className="flex-1 flex items-center justify-center text-xs text-white font-medium"
                              style={{
                                backgroundColor: getColorForLevel(
                                  level.levelOrder,
                                  maxLevel
                                ),
                              }}
                              title={`${level.name}: ${level.description}`}
                            >
                              {level.levelOrder}
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDistribution = () => {
    // Count competencies by type
    const typeCounts: Record<string, number> = {};
    competencyTypes.forEach((type) => {
      typeCounts[type] = competencies.filter(
        (comp) => comp.type === type
      ).length;
    });

    // Calculate percentages
    const total = competencies.length;
    const typePercentages = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100),
    }));

    // Sort by count (descending)
    typePercentages.sort((a, b) => b.count - a.count);

    // Chart dimensions
    const width = 400;
    const height = 300;
    const barHeight = 40;
    const barGap = 20;
    const maxBarWidth = width - 150;

    return (
      <div className="flex flex-col items-center mt-6">
        <h3 className="text-lg font-medium mb-4">
          Competency Type Distribution
        </h3>
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height}>
            {typePercentages.map((item, i) => {
              const barWidth = (item.count / total) * maxBarWidth;
              const y = i * (barHeight + barGap) + 10;

              return (
                <g key={item.type}>
                  {/* Bar */}
                  <rect
                    x={100}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={4}
                    fill="#3b82f6"
                    opacity={0.7 + (0.3 * i) / typePercentages.length}
                  />

                  {/* Type label */}
                  <text
                    x={95}
                    y={y + barHeight / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-sm font-medium fill-gray-700"
                  >
                    {item.type}
                  </text>

                  {/* Count and percentage */}
                  <text
                    x={barWidth + 110}
                    y={y + barHeight / 2}
                    dominantBaseline="middle"
                    className="text-sm fill-gray-700"
                  >
                    {item.count} ({item.percentage}%)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const renderLevelDistribution = () => {
    // Get all unique level names across all competencies
    const allLevels = new Set<string>();
    competencies.forEach((comp) => {
      comp.levels.forEach((level: CompetencyLevel) => {
        allLevels.add(level.name);
      });
    });

    // Sort levels by typical order
    const commonLevelOrder = [
      "Novice",
      "Beginner",
      "Basic",
      "Foundational",
      "Intermediate",
      "Proficient",
      "Advanced",
      "Expert",
      "Master",
    ];

    const sortedLevels = Array.from(allLevels).sort((a, b) => {
      const aIndex = commonLevelOrder.findIndex((level) =>
        a.toLowerCase().includes(level.toLowerCase())
      );
      const bIndex = commonLevelOrder.findIndex((level) =>
        b.toLowerCase().includes(level.toLowerCase())
      );

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    // Count competencies for each level
    const levelCounts: Record<string, number> = {};
    sortedLevels.forEach((level) => {
      levelCounts[level] = 0;
      competencies.forEach((comp) => {
        if (comp.levels.some((l) => l.name === level)) {
          levelCounts[level]++;
        }
      });
    });

    // Chart dimensions
    const width = 400;
    const height = 300;
    const barWidth = 40;
    const barGap = 20;
    const maxBarHeight = height - 80;

    return (
      <div className="flex flex-col items-center mt-6">
        <h3 className="text-lg font-medium mb-4">Level Distribution</h3>
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height}>
            {/* X-axis */}
            <line
              x1={50}
              y1={height - 40}
              x2={width - 20}
              y2={height - 40}
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            {Object.entries(levelCounts).map(([level, count], i) => {
              const x = i * (barWidth + barGap) + 70;
              const barHeight = (count / competencies.length) * maxBarHeight;
              const y = height - 40 - barHeight;

              return (
                <g key={level}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={4}
                    fill="#3b82f6"
                    opacity={0.6 + (0.4 * i) / Object.keys(levelCounts).length}
                  />

                  {/* Level label */}
                  <text
                    x={x + barWidth / 2}
                    y={height - 25}
                    textAnchor="middle"
                    className="text-xs fill-gray-700"
                  >
                    {level}
                  </text>

                  {/* Count */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-700"
                  >
                    {count}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="radar"
        value={visualizationType}
        onValueChange={(value) =>
          setVisualizationType(
            value as "radar" | "heatmap" | "distribution" | "levels"
          )
        }
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="radar" className="flex items-center">
            <RadarIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Radar</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center">
            <Grid3X3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Heatmap</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Types</span>
          </TabsTrigger>
          <TabsTrigger value="levels" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Levels</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="radar" className="mt-0">
          {renderRadarChart()}
        </TabsContent>
        <TabsContent value="heatmap" className="mt-0">
          {renderHeatmap()}
        </TabsContent>
        <TabsContent value="distribution" className="mt-0">
          {renderDistribution()}
        </TabsContent>
        <TabsContent value="levels" className="mt-0">
          {renderLevelDistribution()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
