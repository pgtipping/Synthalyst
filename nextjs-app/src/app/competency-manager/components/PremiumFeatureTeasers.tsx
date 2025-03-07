"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  MessageSquare,
  BookOpen,
  Grid,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";

export default function PremiumFeatureTeasers() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Premium Features</h3>
        <Link href="/premium">
          <Button variant="outline" size="sm" className="flex items-center">
            <Crown className="h-4 w-4 mr-2 text-yellow-500" />
            Upgrade
          </Button>
        </Link>
      </div>

      <p className="text-sm text-gray-500">
        Unlock these powerful features with a premium subscription.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                disabled
              >
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium flex items-center">
                      Extract from JD
                      <Lock className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Extract competencies directly from job descriptions
                    </p>
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                Premium feature: Automatically extract competencies from your
                job descriptions to create tailored frameworks.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                disabled
              >
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium flex items-center">
                      Use in Interview Questions
                      <Lock className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Generate interview questions based on competencies
                    </p>
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                Premium feature: Generate tailored interview questions based on
                your competency framework to assess candidates effectively.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                disabled
              >
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium flex items-center">
                      Create Training Plan
                      <Lock className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Generate training plans based on competency gaps
                    </p>
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                Premium feature: Create personalized training plans to develop
                specific competencies and close skill gaps.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                disabled
              >
                <div className="flex items-start">
                  <Grid className="h-5 w-5 mr-3 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium flex items-center">
                      Create Competency Matrix
                      <Lock className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Build role-based competency matrices for your organization
                    </p>
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                Premium feature: Create comprehensive competency matrices to map
                skills across different roles and levels in your organization.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
