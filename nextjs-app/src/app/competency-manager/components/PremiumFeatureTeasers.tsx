"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Briefcase, GraduationCap, Grid3X3 } from "lucide-react";

export default function PremiumFeatureTeasers() {
  // This would be determined by user subscription status
  const isPremiumUser = false;

  const handleUpgradeClick = () => {
    // This would redirect to the pricing page or open a subscription modal
    window.alert(
      "This would redirect to the pricing page in the real application."
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Premium Integration Features</h3>
        {!isPremiumUser && (
          <Button onClick={handleUpgradeClick} size="sm">
            Upgrade to Premium
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Extract from JD</CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 hover:bg-amber-50"
              >
                Premium
              </Badge>
            </div>
            <CardDescription>
              Extract competencies directly from job descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Automatically identify key competencies from your job
                descriptions
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              disabled={!isPremiumUser}
            >
              Extract from JD
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">
                Use in Interview Questions
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 hover:bg-amber-50"
              >
                Premium
              </Badge>
            </div>
            <CardDescription>
              Generate interview questions based on competencies
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-muted-foreground">
              <FileQuestion className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Create targeted interview questions to assess each competency
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              disabled={!isPremiumUser}
            >
              Create Interview Questions
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Create Training Plan</CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 hover:bg-amber-50"
              >
                Premium
              </Badge>
            </div>
            <CardDescription>
              Generate training plans based on competency gaps
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-muted-foreground">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Develop targeted training plans to build competencies
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              disabled={!isPremiumUser}
            >
              Create Training Plan
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">
                Create Competency Matrix
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 hover:bg-amber-50"
              >
                Premium
              </Badge>
            </div>
            <CardDescription>
              Build role-based competency matrices for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-muted-foreground">
              <Grid3X3 className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Map competencies across roles and levels in your organization
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              disabled={!isPremiumUser}
            >
              Create Competency Matrix
            </Button>
          </CardFooter>
        </Card>
      </div>

      {!isPremiumUser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">
            Why Upgrade to Premium?
          </h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Integrate competency frameworks with other HR tools</li>
            <li>• Extract competencies directly from job descriptions</li>
            <li>• Generate interview questions based on competencies</li>
            <li>• Create training plans to develop competencies</li>
            <li>• Build organization-wide competency matrices</li>
            <li>• Share frameworks with your team</li>
          </ul>
          <Button
            onClick={handleUpgradeClick}
            className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </div>
  );
}
