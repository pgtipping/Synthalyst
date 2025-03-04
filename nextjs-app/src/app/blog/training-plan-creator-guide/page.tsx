import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Plan Creator Guide | Synthalyst",
  description:
    "Learn how to use the Training Plan Creator tool to generate comprehensive training plans powered by AI.",
};

export default function TrainingPlanCreatorGuide() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[850px]">
        <div className="bg-[#f5f5f7] rounded-xl shadow-sm p-8 sm:p-10">
          <div className="space-y-10">
            <div className="text-center pb-6 border-b border-gray-200">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Training Plan Creator Guide
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Learn how to create effective training plans with our AI-powered
                tool
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Introduction
              </h2>
              <p className="text-base leading-relaxed">
                The Training Plan Creator is a powerful tool that helps you
                generate comprehensive, structured training plans for various
                purposes. Whether you&apos;re creating a professional
                development program, a technical training course, or an
                educational curriculum, this tool streamlines the process by
                leveraging AI to generate detailed content based on your
                specifications.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Getting Started
              </h2>
              <p className="text-base leading-relaxed">
                To create a training plan, you&apos;ll need to provide some
                essential information about your training objectives and
                audience. The form is organized into two main sections:
              </p>
              <ul className="list-disc pl-8 space-y-3 my-6">
                <li className="text-base leading-relaxed">
                  <strong>Essential Information</strong>: These are the required
                  fields that provide the core details needed to generate a
                  basic training plan.
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Advanced Options</strong>: These optional fields allow
                  you to customize your training plan with more specific details
                  about learning styles, materials, and certification.
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Essential Fields
              </h2>
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-medium">Title</h3>
                <p className="text-base leading-relaxed">
                  A clear, descriptive title for your training plan. This should
                  reflect the main focus or purpose of the training.
                </p>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Learning Objectives</h3>
                <p className="text-base leading-relaxed">
                  List the specific learning outcomes you want participants to
                  achieve. Enter each objective on a new line. Be specific and
                  use action verbs (e.g., &ldquo;Understand the principles
                  of...&rdquo;, &ldquo;Apply techniques for...&rdquo;,
                  &ldquo;Develop skills in...&rdquo;).
                </p>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Target Audience Level</h3>
                <p className="text-base leading-relaxed">
                  Select the appropriate knowledge level of your intended
                  audience:
                </p>
                <ul className="list-disc pl-8 space-y-2 my-4">
                  <li className="text-base leading-relaxed">
                    <strong>Beginner</strong>: No prior knowledge required
                  </li>
                  <li className="text-base leading-relaxed">
                    <strong>Intermediate</strong>: Some basic knowledge or
                    experience needed
                  </li>
                  <li className="text-base leading-relaxed">
                    <strong>Advanced</strong>: Substantial prior knowledge or
                    experience required
                  </li>
                </ul>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Duration</h3>
                <p className="text-base leading-relaxed">
                  Specify the total duration of the training plan (e.g.,
                  &ldquo;12 weeks&rdquo;, &ldquo;3 days&rdquo;, &ldquo;40
                  hours&rdquo;). This helps determine the scope and depth of the
                  content.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Advanced Options
              </h2>
              <p className="text-base leading-relaxed">
                Expand the Advanced Options section to customize your training
                plan further with these optional fields:
              </p>
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-medium">Description</h3>
                <p className="text-base leading-relaxed">
                  A detailed overview of what the training plan covers and its
                  purpose. This helps the AI understand the context and generate
                  more relevant content.
                </p>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Prerequisites</h3>
                <p className="text-base leading-relaxed">
                  List any knowledge, skills, or experience participants should
                  have before starting the training. Enter each prerequisite on
                  a new line.
                </p>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">
                  Learning Style Preferences
                </h3>
                <p className="text-base leading-relaxed">
                  Select the primary learning style that best suits your
                  audience:
                </p>
                <ul className="list-disc pl-8 space-y-2 my-4">
                  <li className="text-base leading-relaxed">
                    <strong>Visual</strong>: Learning through images, diagrams,
                    and demonstrations
                  </li>
                  <li className="text-base leading-relaxed">
                    <strong>Auditory</strong>: Learning through listening and
                    discussion
                  </li>
                  <li className="text-base leading-relaxed">
                    <strong>Reading/Writing</strong>: Learning through
                    text-based materials
                  </li>
                  <li className="text-base leading-relaxed">
                    <strong>Kinesthetic</strong>: Learning through hands-on
                    activities and practice
                  </li>
                  <li className="text-base leading-relaxed">
                    <strong>Multimodal</strong>: Combining multiple learning
                    styles
                  </li>
                </ul>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Industry/Domain</h3>
                <p className="text-base leading-relaxed">
                  Specify the industry or domain context for the training. This
                  helps the AI generate more relevant examples and terminology
                  specific to your field.
                </p>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Materials Required</h3>
                <p className="text-base leading-relaxed">
                  List any materials, tools, or resources that participants will
                  need for the training. Enter each item on a new line.
                </p>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-medium">Certification Details</h3>
                <p className="text-base leading-relaxed">
                  Specify whether the training includes any form of
                  certification or credential, and if so, what type (e.g.,
                  Certificate of Completion, Professional Certification).
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Using the Generated Plan
              </h2>
              <p className="text-base leading-relaxed">
                After submitting the form, our AI will generate a comprehensive
                training plan based on your inputs. The generated plan includes:
              </p>
              <ul className="list-disc pl-8 space-y-3 my-6">
                <li className="text-base leading-relaxed">
                  <strong>Sections</strong>: Organized units of content,
                  typically aligned with your learning objectives
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Topics</strong>: Specific subjects covered within each
                  section
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Activities</strong>: Engaging exercises and tasks to
                  reinforce learning
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Resources</strong>: Recommended materials to support
                  the training
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Assessments</strong>: Methods to evaluate
                  participants&apos; understanding and progress
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                You can view, edit, and share your generated training plans from
                your dashboard. Plans can also be exported or used as templates
                for future training programs.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Tips for Effective Training Plans
              </h2>
              <ul className="list-disc pl-8 space-y-3 my-6">
                <li className="text-base leading-relaxed">
                  <strong>Be specific with objectives</strong>: Clearly defined
                  learning objectives lead to more focused and effective
                  training content.
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Consider your audience</strong>: Tailor the complexity
                  and approach based on your participants&apos; existing
                  knowledge and experience.
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Balance theory and practice</strong>: Include both
                  conceptual learning and hands-on application for better
                  retention.
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Provide context</strong>: The more information you
                  provide about your training context and goals, the more
                  relevant the generated plan will be.
                </li>
                <li className="text-base leading-relaxed">
                  <strong>Review and customize</strong>: The generated plan is a
                  starting point—review and adjust it to perfectly match your
                  specific needs.
                </li>
              </ul>
            </div>

            <div className="mt-10 flex justify-center pt-6 border-t border-gray-200">
              <Link
                href="/training-plan"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Create Your Training Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
