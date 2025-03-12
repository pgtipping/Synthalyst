"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, Sparkles, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Upload Your Resume",
      description:
        "Upload your current resume in PDF, DOC, DOCX, or TXT format. Our system will extract the text for processing.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Add Job Description",
      description:
        "Optionally paste the job description to tailor your resume for a specific position and improve your chances of getting an interview.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Transform Your Resume",
      description:
        "Our AI analyzes your resume and enhances it with professional language, better formatting, and targeted improvements.",
    },
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: "Download & Apply",
      description:
        "Download your transformed resume and cover letter, then apply with confidence knowing your application is optimized.",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Transform your resume in just a few simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="mb-2">{step.icon}</div>
              <CardTitle className="text-xl">
                {index + 1}. {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                {step.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
