"use client";

import React from "react";

interface CoverLetterPreviewProps {
  content: string | null;
}

export function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  if (!content) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          No cover letter content available
        </p>
      </div>
    );
  }

  // Mock cover letter for demonstration
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm min-h-[400px] max-h-[600px] overflow-y-auto">
      <div className="mb-6">
        <div className="text-right mb-6">
          <p>John Smith</p>
          <p>123 Main Street</p>
          <p>San Francisco, CA 94105</p>
          <p>john.smith@example.com</p>
          <p>(555) 123-4567</p>
        </div>

        <p className="mb-4">March 12, 2025</p>

        <div className="mb-6">
          <p>Hiring Manager</p>
          <p>TechInnovate Inc.</p>
          <p>456 Tech Boulevard</p>
          <p>San Francisco, CA 94107</p>
        </div>

        <p className="mb-4">Dear Hiring Manager,</p>

        <p className="mb-4">
          I am writing to express my interest in the Senior Software Engineer
          position at TechInnovate Inc., as advertised on your company website.
          With over 8 years of experience in full-stack development and a proven
          track record of delivering scalable applications, I am confident in my
          ability to make significant contributions to your engineering team.
        </p>

        <p className="mb-4">
          Throughout my career, I have specialized in React, Node.js, and cloud
          infrastructure, which aligns perfectly with the technical requirements
          outlined in your job description. At TechCorp Inc., I led the
          development of a cloud-based SaaS platform that now serves over 50,000
          users, demonstrating my ability to architect and implement complex
          systems at scale.
        </p>

        <p className="mb-4">
          I am particularly drawn to TechInnovate&apos;s mission to
          revolutionize the fintech industry through innovative software
          solutions. Your focus on creating user-centric products that solve
          real-world problems resonates with my own professional philosophy, and
          I am excited about the possibility of contributing to your team&apos;s
          success.
        </p>

        <p className="mb-4">
          I would welcome the opportunity to discuss how my skills and
          experience align with your needs. Thank you for considering my
          application. I look forward to the possibility of working with the
          talented team at TechInnovate Inc.
        </p>

        <p className="mb-6">Sincerely,</p>

        <p>John Smith</p>
      </div>
    </div>
  );
}
