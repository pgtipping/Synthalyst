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
        placeholder="Paste the job description here to tailor your resume (optional)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={value.length > 0 && value.length < 10}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Adding a job description helps us tailor your resume to highlight
        relevant skills and experience.
      </p>
    </form>
  );
}
