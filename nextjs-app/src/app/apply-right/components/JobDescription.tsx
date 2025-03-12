"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function JobDescription({
  value,
  onChange,
  onSubmit,
}: JobDescriptionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Paste the job description here to optimize your resume for this specific role..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-y"
      />

      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={!value.trim()}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Adding a job description helps us:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identify key skills and requirements</li>
            <li>Highlight relevant experience</li>
            <li>Match industry terminology</li>
            <li>Optimize for ATS systems</li>
          </ul>
        </div>
      </div>
    </form>
  );
}
