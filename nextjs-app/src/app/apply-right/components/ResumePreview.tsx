"use client";

import React from "react";

interface ResumePreviewProps {
  content: string | null;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  // This is a placeholder component
  // In a real implementation, this would render a properly formatted resume
  // with sections for contact info, experience, education, skills, etc.

  if (!content) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No resume content available</p>
      </div>
    );
  }

  // Mock resume sections for demonstration
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm min-h-[400px] max-h-[600px] overflow-y-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">John Smith</h2>
        <p className="text-muted-foreground">Senior Software Engineer</p>
        <div className="flex justify-center gap-4 mt-2 text-sm">
          <span>john.smith@example.com</span>
          <span>•</span>
          <span>(555) 123-4567</span>
          <span>•</span>
          <span>San Francisco, CA</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b pb-1 mb-3">Summary</h3>
        <p className="text-sm">
          Experienced software engineer with 8+ years of expertise in full-stack
          development, specializing in React, Node.js, and cloud infrastructure.
          Proven track record of delivering scalable applications and leading
          development teams.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b pb-1 mb-3">Experience</h3>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <h4 className="font-medium">Senior Software Engineer</h4>
            <span className="text-sm text-muted-foreground">
              2020 - Present
            </span>
          </div>
          <p className="text-sm font-medium mb-1">
            TechCorp Inc., San Francisco, CA
          </p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>
              Led development of cloud-based SaaS platform serving 50,000+ users
            </li>
            <li>
              Architected microservices infrastructure using Node.js and AWS
            </li>
            <li>
              Improved application performance by 40% through code optimization
            </li>
          </ul>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <h4 className="font-medium">Software Developer</h4>
            <span className="text-sm text-muted-foreground">2016 - 2020</span>
          </div>
          <p className="text-sm font-medium mb-1">InnovateSoft, Seattle, WA</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Developed front-end applications using React and TypeScript</li>
            <li>Collaborated with UX team to implement responsive designs</li>
            <li>
              Participated in agile development process with bi-weekly sprints
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b pb-1 mb-3">Education</h3>
        <div className="flex justify-between mb-1">
          <h4 className="font-medium">B.S. Computer Science</h4>
          <span className="text-sm text-muted-foreground">2012 - 2016</span>
        </div>
        <p className="text-sm">University of Washington, Seattle, WA</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold border-b pb-1 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "AWS",
            "Docker",
            "GraphQL",
            "MongoDB",
            "PostgreSQL",
            "CI/CD",
            "Agile Methodology",
          ].map((skill) => (
            <span key={skill} className="bg-muted px-2 py-1 rounded-md text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
