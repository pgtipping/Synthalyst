"use client";

import React from "react";
import { CompetencyFramework } from "../types";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintFriendlyViewProps {
  framework: CompetencyFramework;
}

export default function PrintFriendlyView({
  framework,
}: PrintFriendlyViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Print Framework</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center print:hidden"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <p className="text-sm text-gray-500 print:hidden">
        Generate a print-friendly version of your competency framework.
      </p>

      {/* Print-friendly view (hidden until print) */}
      <div
        id="print-friendly-view"
        className="mt-6 p-6 border rounded-lg bg-white print:p-0 print:border-0 print:mt-0"
      >
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-friendly-view,
            #print-friendly-view * {
              visibility: visible;
            }
            #print-friendly-view {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: A4;
              margin: 2cm;
            }
          }
        `}</style>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{framework.name}</h1>
          <p className="text-gray-600 mt-2">{framework.description}</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>Industry: {framework.industry}</span>
            <span>Job Function: {framework.jobFunction}</span>
            <span>Role Level: {framework.roleLevel}</span>
          </div>
        </div>

        <div className="space-y-8">
          {framework.competencies.map((competency, index) => (
            <div key={index} className="border-b pb-6">
              <h2 className="text-xl font-semibold">{competency.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{competency.type}</p>
              <p className="mb-4">{competency.description}</p>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Business Impact</h3>
                <p>{competency.businessImpact}</p>
              </div>

              <h3 className="text-lg font-medium mb-2">Proficiency Levels</h3>
              <div className="space-y-4">
                {competency.levels
                  .sort((a, b) => a.levelOrder - b.levelOrder)
                  .map((level, levelIndex) => (
                    <div
                      key={levelIndex}
                      className="pl-4 border-l-2 border-gray-300"
                    >
                      <h4 className="font-medium">{level.name}</h4>
                      <p className="text-sm mb-2">{level.description}</p>

                      <div className="mb-2">
                        <h5 className="text-sm font-medium">
                          Behavioral Indicators
                        </h5>
                        <ul className="list-disc pl-5 text-sm">
                          {level.behavioralIndicators.map((indicator, i) => (
                            <li key={i}>{indicator}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium">
                          Development Suggestions
                        </h5>
                        <ul className="list-disc pl-5 text-sm">
                          {level.developmentSuggestions.map((suggestion, i) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Generated with Synthalyst Competency Manager</p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
