"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
  const features = {
    free: [
      "One-click resume transformation",
      "Professional language enhancements",
      "Accomplishment-focused rewording",
      "Basic ATS optimization",
      "Job description targeting",
      "Basic keyword alignment",
      "Standard PDF export",
      "One free cover letter",
    ],
    premium: [
      "Multiple transformation iterations",
      "Specific direction to the AI",
      "Industry-specific enhancements",
      "Advanced ATS optimization",
      "Multiple design templates",
      "LinkedIn-optimized version",
      "Multiple file formats (DOCX, PDF, TXT)",
      "Multiple cover letter templates",
      "Interview Prep App access",
    ],
  };

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Features</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Transform your resume with professional enhancements and targeted
          optimizations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Free Features</h3>
          <ul className="space-y-2">
            {features.free.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Premium Features</h3>
          <ul className="space-y-2">
            {features.premium.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
