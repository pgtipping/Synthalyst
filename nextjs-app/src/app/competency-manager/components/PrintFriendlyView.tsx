"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { CompetencyFramework } from "../types";

interface PrintFriendlyViewProps {
  framework: CompetencyFramework;
}

export default function PrintFriendlyView({
  framework,
}: PrintFriendlyViewProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);

    try {
      // Create a print-friendly HTML representation of the framework
      let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${framework.name} - Competency Framework</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                color: #000;
                background: #fff;
                margin: 0;
                padding: 20px;
              }
              
              h1 {
                font-size: 24px;
                margin-bottom: 10px;
                color: #2563eb;
              }
              
              h2 {
                font-size: 20px;
                margin-top: 20px;
                margin-bottom: 10px;
                color: #4b5563;
              }
              
              h3 {
                font-size: 16px;
                margin-top: 15px;
                margin-bottom: 5px;
                color: #6b7280;
              }
              
              p {
                margin-bottom: 10px;
              }
              
              .meta {
                margin-bottom: 20px;
                font-size: 14px;
                color: #6b7280;
              }
              
              .competency {
                margin-bottom: 30px;
                border: 1px solid #e5e7eb;
                padding: 15px;
                page-break-inside: avoid;
              }
              
              .level {
                margin-bottom: 15px;
                padding-left: 15px;
                border-left: 3px solid #3b82f6;
              }
              
              .indicators, .suggestions {
                margin-top: 10px;
              }
              
              .indicators li, .suggestions li {
                margin-bottom: 5px;
              }
              
              .page-break {
                page-break-after: always;
              }
              
              .header {
                position: running(header);
                text-align: right;
                font-size: 12px;
                color: #9ca3af;
              }
              
              .footer {
                position: running(footer);
                text-align: center;
                font-size: 12px;
                color: #9ca3af;
              }
              
              @page {
                margin: 2cm;
                @top-right { content: element(header) }
                @bottom-center { content: element(footer) }
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${framework.name} - Competency Framework
          </div>
          
          <h1>${framework.name}</h1>
          
          <div class="meta">
            <p><strong>Industry:</strong> ${framework.industry}</p>
            <p><strong>Job Function:</strong> ${framework.jobFunction}</p>
            <p><strong>Role Level:</strong> ${framework.roleLevel}</p>
            <p><strong>Description:</strong> ${framework.description}</p>
          </div>
      `;

      framework.competencies.forEach((competency, index) => {
        // Add page break after every 2 competencies (except the last one)
        const needsPageBreak =
          index > 0 &&
          index % 2 === 0 &&
          index < framework.competencies.length - 1;

        printContent += `
          <div class="competency">
            <h2>${competency.name} (${competency.type})</h2>
            <p>${competency.description}</p>
            <p><strong>Business Impact:</strong> ${competency.businessImpact}</p>
        `;

        competency.levels
          .sort((a, b) => a.levelOrder - b.levelOrder)
          .forEach((level) => {
            printContent += `
            <div class="level">
              <h3>${level.name}</h3>
              <p>${level.description}</p>
              
              <div class="indicators">
                <strong>Behavioral Indicators:</strong>
                <ul>
                  ${level.behavioralIndicators
                    .map((indicator) => `<li>${indicator}</li>`)
                    .join("")}
                </ul>
              </div>
              
              <div class="suggestions">
                <strong>Development Suggestions:</strong>
                <ul>
                  ${level.developmentSuggestions
                    .map((suggestion) => `<li>${suggestion}</li>`)
                    .join("")}
                </ul>
              </div>
            </div>
          `;
          });

        printContent += `</div>`;

        if (needsPageBreak) {
          printContent += `<div class="page-break"></div>`;
        }
      });

      printContent += `
          <div class="footer">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        </body>
        </html>
      `;

      // Open a new window with the print-friendly content
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load before printing
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
          printWindow.onafterprint = function () {
            printWindow.close();
            setIsPrinting(false);
          };
        };
      } else {
        // If popup was blocked, inform the user
        alert("Please allow popups to use the print feature.");
        setIsPrinting(false);
      }
    } catch (error) {
      console.error("Error generating print view:", error);
      setIsPrinting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handlePrint}
      disabled={isPrinting}
      className="print:hidden"
    >
      <Printer className="mr-2 h-4 w-4" />
      {isPrinting ? "Preparing..." : "Print View"}
    </Button>
  );
}
