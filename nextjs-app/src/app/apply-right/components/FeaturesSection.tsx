"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Target, FileText, Download, Zap, Award } from "lucide-react";

export function FeaturesSection() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose ApplyRight</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform helps you create professional, ATS-optimized
          resumes and cover letters in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Sparkles className="h-8 w-8 text-primary" />}
          title="AI-Powered Transformation"
          description="Our advanced AI analyzes your resume and enhances it with professional language and accomplishment-focused rewording."
        />

        <FeatureCard
          icon={<Target className="h-8 w-8 text-primary" />}
          title="ATS Optimization"
          description="Get your resume past Applicant Tracking Systems with keyword optimization and proper formatting."
        />

        <FeatureCard
          icon={<FileText className="h-8 w-8 text-primary" />}
          title="Custom Cover Letters"
          description="Generate tailored cover letters that match your resume and highlight your qualifications for specific jobs."
        />

        <FeatureCard
          icon={<Download className="h-8 w-8 text-primary" />}
          title="Multiple Export Options"
          description="Download your resume and cover letter in various formats, including PDF, DOCX, and LinkedIn-optimized versions."
        />

        <FeatureCard
          icon={<Zap className="h-8 w-8 text-primary" />}
          title="Instant Results"
          description="Transform your resume in seconds, not hours. Save time and focus on your job search."
        />

        <FeatureCard
          icon={<Award className="h-8 w-8 text-primary" />}
          title="Professional Quality"
          description="Get professional-quality results that highlight your skills and experience in the best possible light."
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border border-muted h-full">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
