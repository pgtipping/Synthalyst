"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface JobDescriptionProps {
  value: string;
  jobTitle: string;
  company: string;
  onChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onSubmit: (description: string, jobTitle: string, company: string) => void;
}

export function JobDescription({
  value,
  jobTitle,
  company,
  onChange,
  onJobTitleChange,
  onCompanyChange,
  onSubmit,
}: JobDescriptionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value, jobTitle, company);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="e.g. Software Engineer, Product Manager"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          placeholder="e.g. Google, Microsoft"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">
          Job Description{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here to tailor your resume..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px]"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!jobTitle.trim() || !company.trim()}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
