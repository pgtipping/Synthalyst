"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileJson, FileSpreadsheet } from "lucide-react";
import { CompetencyFramework } from "../types";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportOptionsProps {
  framework: CompetencyFramework;
}

export default function ExportOptions({ framework }: ExportOptionsProps) {
  // Export to JSON
  const exportToJSON = () => {
    if (!framework) return;

    const dataStr = JSON.stringify(framework, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${framework.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-competency-framework.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!framework) return;

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Create framework overview sheet
    const overviewData = [
      ["Framework Name", framework.name],
      ["Description", framework.description || ""],
      ["Industry", framework.industry],
      ["Job Function", framework.jobFunction],
      ["Role Level", framework.roleLevel],
      ["Number of Competencies", framework.competencies.length.toString()],
    ];
    const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewWs, "Framework Overview");

    // Create competencies sheet
    const competenciesData = [
      ["Competency Name", "Type", "Description", "Business Impact"],
    ];
    framework.competencies.forEach((comp) => {
      competenciesData.push([
        comp.name,
        comp.type,
        comp.description,
        comp.businessImpact,
      ]);
    });
    const competenciesWs = XLSX.utils.aoa_to_sheet(competenciesData);
    XLSX.utils.book_append_sheet(wb, competenciesWs, "Competencies");

    // Create levels sheet
    const levelsData = [
      [
        "Competency",
        "Level",
        "Description",
        "Behavioral Indicators",
        "Development Suggestions",
      ],
    ];
    framework.competencies.forEach((comp) => {
      comp.levels.forEach((level) => {
        levelsData.push([
          comp.name,
          level.name,
          level.description,
          level.behavioralIndicators.join("\n"),
          level.developmentSuggestions.join("\n"),
        ]);
      });
    });
    const levelsWs = XLSX.utils.aoa_to_sheet(levelsData);
    XLSX.utils.book_append_sheet(wb, levelsWs, "Proficiency Levels");

    // Generate file name
    const fileName = `${framework.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-competency-framework.xlsx`;

    // Export to file
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (!framework) return;

    // Get the print-friendly view element
    const printElement = document.getElementById("print-friendly-view");
    if (!printElement) {
      alert("Print view not available. Please try again.");
      return;
    }

    // Show loading state
    const loadingElement = document.createElement("div");
    loadingElement.style.position = "fixed";
    loadingElement.style.top = "0";
    loadingElement.style.left = "0";
    loadingElement.style.width = "100%";
    loadingElement.style.height = "100%";
    loadingElement.style.backgroundColor = "rgba(0,0,0,0.5)";
    loadingElement.style.display = "flex";
    loadingElement.style.justifyContent = "center";
    loadingElement.style.alignItems = "center";
    loadingElement.style.zIndex = "9999";
    loadingElement.innerHTML =
      '<div style="background: white; padding: 20px; border-radius: 5px;">Generating PDF...</div>';
    document.body.appendChild(loadingElement);

    try {
      // Create a new PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // margin in mm

      // Capture the element as canvas
      const canvas = await html2canvas(printElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      // Calculate the number of pages
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdfHeight - margin * 2;
      const pageCount = Math.ceil(imgHeight / pageHeight);

      // Convert to image
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF, potentially across multiple pages
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Simplified addImage call with fewer parameters
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          pdfWidth - margin * 2,
          pageHeight
        );
      }

      // Save the PDF
      const fileName = `${framework.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-competency-framework.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Remove loading element
      document.body.removeChild(loadingElement);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Export Options</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
          className="flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToJSON}
          className="flex items-center"
        >
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="flex items-center"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Export your framework in different formats for sharing or offline use.
      </p>
    </div>
  );
}
