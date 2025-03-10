"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";
import { Competency } from "../types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Register Chart.js components
ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface CompetencyVisualizationProps {
  competencies: Competency[];
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    fill?: boolean;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
  }[];
}

export default function CompetencyVisualization({
  competencies,
}: CompetencyVisualizationProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [activeVisualization, setActiveVisualization] = useState<
    "radar" | "matrix" | "heatmap"
  >("radar");
  const [expanded, setExpanded] = useState(false);

  // Process data for radar chart
  useEffect(() => {
    const labels = competencies.map((comp) => comp.name);
    const datasets = [
      {
        label: "Competency Levels",
        data: competencies.map((comp) => comp.levels.length),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ];

    setChartData({
      labels,
      datasets,
    });
  }, [competencies]);

  // Generate matrix data for bar chart
  const generateMatrixData = () => {
    const labels = competencies.map((comp) => comp.name);

    // Get all unique level names across all competencies
    const allLevelNames = new Set<string>();
    competencies.forEach((comp) => {
      comp.levels.forEach((level) => {
        allLevelNames.add(level.name);
      });
    });

    const levelNamesList = Array.from(allLevelNames).sort();

    // Create datasets for each level
    const datasets = levelNamesList.map((levelName, index) => {
      // Create a color with increasing intensity
      const baseColor = `rgba(54, 162, 235, ${0.3 + index * 0.15})`;
      const borderColor = `rgba(54, 162, 235, ${0.6 + index * 0.1})`;

      return {
        label: levelName,
        data: competencies.map((comp) => {
          const level = comp.levels.find((l) => l.name === levelName);
          return level ? 1 : 0;
        }),
        backgroundColor: baseColor,
        borderColor: borderColor,
        borderWidth: 1,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  // Generate heatmap data (using Bar chart)
  const generateHeatmapData = () => {
    const labels = competencies.map((comp) => comp.name);

    const datasets = [
      {
        label: "Number of Behavioral Indicators",
        data: competencies.map((comp) => {
          let totalIndicators = 0;
          comp.levels.forEach((level) => {
            totalIndicators += level.behavioralIndicators.length;
          });
          return totalIndicators;
        }),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Number of Development Suggestions",
        data: competencies.map((comp) => {
          let totalSuggestions = 0;
          comp.levels.forEach((level) => {
            totalSuggestions += level.developmentSuggestions.length;
          });
          return totalSuggestions;
        }),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ];

    return {
      labels,
      datasets,
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!chartData) {
    return <div>Loading visualization...</div>;
  }

  return (
    <div>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium">Framework Visualization</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expanded ? "max-h-[1000px]" : "max-h-72"
          }`}
        >
          <Tabs
            defaultValue="radar"
            className="w-full"
            onValueChange={(value) =>
              setActiveVisualization(value as "radar" | "matrix" | "heatmap")
            }
          >
            <TabsList className="mb-4">
              <TabsTrigger value="radar">Radar Chart</TabsTrigger>
              <TabsTrigger value="matrix">Matrix View</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>

            <TabsContent value="radar" className="h-64 md:h-80">
              <Radar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="matrix" className="h-64 md:h-80">
              <Bar
                data={generateMatrixData()}
                options={{
                  ...barOptions,
                  plugins: {
                    ...barOptions.plugins,
                    title: {
                      display: true,
                      text: "Competency Matrix View",
                    },
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="heatmap" className="h-64 md:h-80">
              <Bar
                data={generateHeatmapData()}
                options={{
                  ...barOptions,
                  plugins: {
                    ...barOptions.plugins,
                    title: {
                      display: true,
                      text: "Competency Detail Heatmap",
                    },
                  },
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
