"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileText, FileSpreadsheet } from "lucide-react";
import { CompetencyFramework } from "../types";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface ExportOptionsProps {
  framework: CompetencyFramework;
}

interface CompetencyRow {
  "Framework Name": string;
  Industry: string;
  "Job Function": string;
  "Role Level": string;
  "Competency Name": string;
  "Competency Type": string;
  "Competency Description": string;
  "Business Impact": string;
  "Level Name": string;
  "Level Description": string;
  "Level Order": number;
  "Behavioral Indicators": string;
  "Development Suggestions": string;
}

export default function ExportOptions({ framework }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const jsonString = JSON.stringify(framework, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      saveAs(blob, `${framework.name.replace(/\s+/g, "_")}_framework.json`);
    } catch (error) {
      console.error("Error exporting to JSON:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      // Flatten the competency framework into rows for CSV
      const rows: CompetencyRow[] = [];

      framework.competencies.forEach((competency) => {
        competency.levels.forEach((level) => {
          rows.push({
            "Framework Name": framework.name,
            Industry: framework.industry,
            "Job Function": framework.jobFunction,
            "Role Level": framework.roleLevel,
            "Competency Name": competency.name,
            "Competency Type": competency.type,
            "Competency Description": competency.description,
            "Business Impact": competency.businessImpact,
            "Level Name": level.name,
            "Level Description": level.description,
            "Level Order": level.levelOrder,
            "Behavioral Indicators": level.behavioralIndicators.join("; "),
            "Development Suggestions": level.developmentSuggestions.join("; "),
          });
        });
      });

      // Convert to worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Competency Framework");

      // Generate and save file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "csv",
        type: "array",
      });
      const blob = new Blob([excelBuffer], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `${framework.name.replace(/\s+/g, "_")}_framework.csv`);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Create a simple HTML representation of the framework
      let htmlContent = `
        <html>
        <head>
          <title>${framework.name} - Competency Framework</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; }
            h2 { color: #4b5563; margin-top: 20px; }
            h3 { color: #6b7280; }
            .competency { margin-bottom: 30px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px; }
            .level { margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #3b82f6; }
            .indicators, .suggestions { margin-top: 10px; }
            .indicators li, .suggestions li { margin-bottom: 5px; }
            .meta { color: #6b7280; font-size: 0.9em; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${framework.name}</h1>
          <div class="meta">
            <p><strong>Industry:</strong> ${framework.industry}</p>
            <p><strong>Job Function:</strong> ${framework.jobFunction}</p>
            <p><strong>Role Level:</strong> ${framework.roleLevel}</p>
            <p><strong>Description:</strong> ${framework.description}</p>
          </div>
      `;

      framework.competencies.forEach((competency) => {
        htmlContent += `
          <div class="competency">
            <h2>${competency.name} (${competency.type})</h2>
            <p>${competency.description}</p>
            <p><strong>Business Impact:</strong> ${competency.businessImpact}</p>
        `;

        competency.levels
          .sort((a, b) => a.levelOrder - b.levelOrder)
          .forEach((level) => {
            htmlContent += `
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

        htmlContent += `</div>`;
      });

      htmlContent += `
        </body>
        </html>
      `;

      // Convert HTML to PDF using browser's print functionality
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.onload = function () {
          printWindow.print();
          printWindow.close();
        };
      }
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
