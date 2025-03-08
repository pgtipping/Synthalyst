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
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups for this website to print the framework");
      return;
    }

    // Generate the HTML content for the print window
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${framework.name} - Competency Framework</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 10px;
          }
          h2 {
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          h3 {
            font-size: 18px;
            margin-top: 15px;
            margin-bottom: 8px;
          }
          h4 {
            font-size: 16px;
            margin-top: 12px;
            margin-bottom: 5px;
          }
          h5 {
            font-size: 14px;
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
          }
          p {
            margin-bottom: 10px;
          }
          .header-info {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          .competency {
            margin-bottom: 30px;
          }
          .level {
            margin-left: 20px;
            padding-left: 10px;
            border-left: 2px solid #ddd;
            margin-bottom: 15px;
          }
          ul {
            margin-top: 5px;
            margin-bottom: 10px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              padding: 0;
            }
            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <h1>${framework.name}</h1>
        <p>${framework.description || ""}</p>
        <div class="header-info">
          <span>Industry: ${framework.industry}</span> | 
          <span>Job Function: ${framework.jobFunction}</span> | 
          <span>Role Level: ${framework.roleLevel}</span>
        </div>
        
        ${framework.competencies
          .map(
            (competency, index) => `
          <div class="competency">
            <h2>${competency.name}</h2>
            <p><em>${competency.type}</em></p>
            <p>${competency.description}</p>
            
            <h3>Business Impact</h3>
            <p>${competency.businessImpact}</p>
            
            <h3>Proficiency Levels</h3>
            ${competency.levels
              .sort((a, b) => a.levelOrder - b.levelOrder)
              .map(
                (level) => `
                <div class="level">
                  <h4>${level.name}</h4>
                  <p>${level.description}</p>
                  
                  <h5>Behavioral Indicators</h5>
                  <ul>
                    ${level.behavioralIndicators
                      .map(
                        (indicator) => `
                      <li>${indicator}</li>
                    `
                      )
                      .join("")}
                  </ul>
                  
                  <h5>Development Suggestions</h5>
                  <ul>
                    ${level.developmentSuggestions
                      .map(
                        (suggestion) => `
                      <li>${suggestion}</li>
                    `
                      )
                      .join("")}
                  </ul>
                </div>
              `
              )
              .join("")}
          </div>
          ${
            index < framework.competencies.length - 1
              ? '<div class="page-break"></div>'
              : ""
          }
        `
          )
          .join("")}
        
        <div class="footer">
          <p>Generated with Synthalyst Competency Manager</p>
          <p>${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for the content to load before printing
    printWindow.onload = function () {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.onafterprint = function() {
      //   printWindow.close();
      // };
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Print Framework</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Generate a print-friendly version of your competency framework.
      </p>
    </div>
  );
}
