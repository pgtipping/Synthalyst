"use client";

import React from "react";
import { Upload, FileText, Sparkles, Download } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Step
          number={1}
          icon={<Upload className="h-8 w-8 text-primary" />}
          title="Upload Resume"
          description="Upload your current resume in PDF or DOCX format."
        />

        <Step
          number={2}
          icon={<FileText className="h-8 w-8 text-primary" />}
          title="Add Job Details"
          description="Optionally paste the job description to target your resume."
        />

        <Step
          number={3}
          icon={<Sparkles className="h-8 w-8 text-primary" />}
          title="Transform"
          description="Our AI enhances your resume with professional improvements."
        />

        <Step
          number={4}
          icon={<Download className="h-8 w-8 text-primary" />}
          title="Download"
          description="Get your enhanced resume and cover letter ready to use."
        />
      </div>
    </div>
  );
}

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Step({ number, icon, title, description }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
