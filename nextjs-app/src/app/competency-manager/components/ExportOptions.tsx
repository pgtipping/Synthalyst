"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { CompetencyFramework } from "../types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ExportOptionsProps {
  framework: CompetencyFramework;
}

export default function ExportOptions({ framework }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState<{
    pdf: boolean;
    json: boolean;
    excel: boolean;
  }>({
    pdf: false,
    json: false,
    excel: false,
  });

  // Export to JSON
  const exportToJSON = () => {
    if (!framework) return;

    setIsExporting((prev) => ({ ...prev, json: true }));

    try {
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

      toast.success("JSON exported successfully");
    } catch (error) {
      console.error("Error exporting JSON:", error);
      toast.error("Failed to export JSON");
    } finally {
      setIsExporting((prev) => ({ ...prev, json: false }));
    }
  };

  // Export to CSV/Excel
  const exportToCSV = () => {
    if (!framework) return;

    setIsExporting((prev) => ({ ...prev, excel: true }));

    try {
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

      toast.success("Excel file exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting((prev) => ({ ...prev, excel: false }));
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (!framework) return;

    setIsExporting((prev) => ({ ...prev, pdf: true }));

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set document properties
      pdf.setProperties({
        title: `${framework.name} - Competency Framework`,
        subject: "Competency Framework",
        author: "Synthalyst Competency Manager",
        creator: "Synthalyst",
      });

      // Define constants for layout
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      const lineHeight = 7;

      // Helper function to add text with word wrapping
      const addWrappedText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize: number = 10
      ) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * (fontSize / 3); // Return the height of the text block
      };

      // Helper function to check if we need a new page
      const checkForNewPage = (currentY: number, neededSpace: number) => {
        if (currentY + neededSpace > pageHeight - margin) {
          pdf.addPage();
          return margin + 10; // Reset Y position with a small offset
        }
        return currentY;
      };

      // Add header
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(framework.name, margin, margin + 10);

      let yPos = margin + 20;

      // Add framework details
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Industry: ${framework.industry}`, margin, yPos);
      yPos += lineHeight;
      pdf.text(`Job Function: ${framework.jobFunction}`, margin, yPos);
      yPos += lineHeight;
      pdf.text(`Role Level: ${framework.roleLevel}`, margin, yPos);
      yPos += lineHeight * 2;

      // Add description if available
      if (framework.description) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Description:", margin, yPos);
        yPos += lineHeight;

        pdf.setFont("helvetica", "normal");
        const descHeight = addWrappedText(
          framework.description,
          margin,
          yPos,
          contentWidth
        );
        yPos += descHeight + lineHeight;
      }

      // Add competencies
      framework.competencies.forEach((competency, index) => {
        // Check if we need a new page for the competency header
        yPos = checkForNewPage(yPos, 40); // Minimum space needed for competency header

        // Add competency header
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${index + 1}. ${competency.name}`, margin, yPos);
        yPos += lineHeight;

        // Add competency type
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.text(`Type: ${competency.type}`, margin, yPos);
        yPos += lineHeight * 1.5;

        // Add competency description
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        const descHeight = addWrappedText(
          competency.description,
          margin,
          yPos,
          contentWidth
        );
        yPos += descHeight + lineHeight;

        // Check if we need a new page for business impact
        yPos = checkForNewPage(yPos, 30);

        // Add business impact
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Business Impact:", margin, yPos);
        yPos += lineHeight;

        pdf.setFont("helvetica", "normal");
        const impactHeight = addWrappedText(
          competency.businessImpact,
          margin,
          yPos,
          contentWidth
        );
        yPos += impactHeight + lineHeight * 1.5;

        // Add proficiency levels
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");

        // Check if we need a new page for proficiency levels
        yPos = checkForNewPage(yPos, 20);

        pdf.text("Proficiency Levels:", margin, yPos);
        yPos += lineHeight * 1.5;

        // Sort levels by order
        const sortedLevels = [...competency.levels].sort(
          (a, b) => a.levelOrder - b.levelOrder
        );

        sortedLevels.forEach((level) => {
          // Check if we need a new page for this level
          yPos = checkForNewPage(yPos, 50); // Minimum space for level header and some content

          // Add level name
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(level.name, margin + 5, yPos);
          yPos += lineHeight;

          // Add level description
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          const levelDescHeight = addWrappedText(
            level.description,
            margin + 5,
            yPos,
            contentWidth - 10
          );
          yPos += levelDescHeight + lineHeight;

          // Check if we need a new page for behavioral indicators
          yPos = checkForNewPage(yPos, 30);

          // Add behavioral indicators
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("Behavioral Indicators:", margin + 5, yPos);
          yPos += lineHeight;

          pdf.setFont("helvetica", "normal");
          level.behavioralIndicators.forEach((indicator) => {
            // Check if we need a new page for this indicator
            yPos = checkForNewPage(yPos, 15);

            const bulletText = `• ${indicator}`;
            const indicatorHeight = addWrappedText(
              bulletText,
              margin + 10,
              yPos,
              contentWidth - 15
            );
            yPos += indicatorHeight + 2;
          });

          yPos += lineHeight;

          // Check if we need a new page for development suggestions
          yPos = checkForNewPage(yPos, 30);

          // Add development suggestions
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("Development Suggestions:", margin + 5, yPos);
          yPos += lineHeight;

          pdf.setFont("helvetica", "normal");
          level.developmentSuggestions.forEach((suggestion) => {
            // Check if we need a new page for this suggestion
            yPos = checkForNewPage(yPos, 15);

            const bulletText = `• ${suggestion}`;
            const suggestionHeight = addWrappedText(
              bulletText,
              margin + 10,
              yPos,
              contentWidth - 15
            );
            yPos += suggestionHeight + 2;
          });

          yPos += lineHeight * 1.5;
        });

        // Add extra space between competencies
        yPos += lineHeight;
      });

      // Add footer to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");

        // Add page number
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin - 25,
          pageHeight - margin
        );

        // Add generation info
        pdf.text(
          "Generated with Synthalyst Competency Manager",
          margin,
          pageHeight - margin
        );
        pdf.text(
          new Date().toLocaleDateString(),
          pageWidth / 2,
          pageHeight - margin,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `${framework.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-competency-framework.pdf`;
      pdf.save(fileName);

      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting((prev) => ({ ...prev, pdf: false }));
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
          disabled={isExporting.pdf}
          className="flex items-center"
        >
          {isExporting.pdf ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          {isExporting.pdf ? "Generating PDF..." : "Export as PDF"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToJSON}
          disabled={isExporting.json}
          className="flex items-center"
        >
          {isExporting.json ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileJson className="h-4 w-4 mr-2" />
          )}
          {isExporting.json ? "Exporting..." : "Export as JSON"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          disabled={isExporting.excel}
          className="flex items-center"
        >
          {isExporting.excel ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 mr-2" />
          )}
          {isExporting.excel ? "Exporting..." : "Export as Excel"}
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Export your framework in different formats for sharing or offline use.
      </p>
    </div>
  );
}
