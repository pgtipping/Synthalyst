"use client";

import React from "react";
import { useSession } from "next-auth/react";
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
import { Toaster } from "@/components/ui/sonner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  CheckCircle,
  ArrowRight,
  FileCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function CareerBundle() {
  const { data: session, status } = useSession();

  // Check if user is premium based on session
  const checkPremiumStatus = () => {
    if (status === "authenticated" && session?.user) {
      // This is where you would check if the user has a premium subscription
      // For now, we'll just check if they're logged in
      return true;
    }
    return false;
  };

  const handleSignIn = () => {
    // Implement sign-in functionality
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Career Bundle", href: "/career-bundle", active: true },
          ]}
        />

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Career Success Bundle
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete end-to-end job application solution: Resume transformation,
            cover letter generation, and interview preparation
          </p>
          <div>
            {status === "authenticated" ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Premium Features Available
              </Badge>
            ) : (
              <Button variant="outline" onClick={handleSignIn} className="mt-2">
                Sign in for Premium Features
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-md">
              Included in Bundle
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                ApplyRight
              </CardTitle>
              <CardDescription>
                Transform your resume with professional enhancements and
                targeted optimizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Key Features:</h3>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      One-click resume transformation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Job description targeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Professional cover letter generation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Multiple export options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">ATS optimization</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/apply-right">
                  Go to ApplyRight <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-md">
              Included in Bundle
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Interview Prep
              </CardTitle>
              <CardDescription>
                Prepare for your interviews with AI-powered assistance tailored
                to your job application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Key Features:</h3>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Job-specific preparation plans
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Practice with tailored questions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Interactive mock interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Comprehensive question library
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Performance feedback</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/interview-prep">
                  Go to Interview Prep <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Bundle Benefits
            </CardTitle>
            <CardDescription>
              Why the Career Success Bundle is your best choice
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Complete Solution</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end job application journey from resume to interview
                </p>
                <ul className="space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Seamless workflow between apps
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Data sharing between apps</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Cost Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Save with our bundle pricing compared to individual
                  subscriptions
                </p>
                <ul className="space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">20% discount on bundle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Single subscription management
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Premium Features</h3>
                <p className="text-sm text-muted-foreground">
                  Access all premium features across both applications
                </p>
                <ul className="space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Unlimited usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed monthly. Cancel anytime.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="annual" className="pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold">$191.90</span>
                    <span className="text-muted-foreground ml-1">/year</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed annually. Save $48 per year.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button size="lg" className="w-full max-w-md mx-auto">
              {checkPremiumStatus() ? "Manage Subscription" : "Subscribe Now"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <CardTitle className="text-lg">Transform Your Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload your resume to ApplyRight and get a professionally
                  enhanced version optimized for your target job.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <CardTitle className="text-lg">Generate Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ApplyRight automatically creates a tailored cover letter based
                  on your resume and job description.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <CardTitle className="text-lg">
                  Prepare for Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your job details are shared with Interview Prep to create a
                  personalized interview preparation plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">
                Can I purchase the apps separately?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Yes, you can subscribe to ApplyRight or Interview Prep
                individually, but the bundle offers the best value.
              </p>
            </div>
            <div>
              <h3 className="font-medium">
                How does data sharing work between the apps?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                When you use ApplyRight, your job details and resume can be
                automatically shared with Interview Prep to create a tailored
                preparation plan.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Yes, you can cancel your subscription at any time. You&apos;ll
                continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Both apps offer limited free features. You can try the basic
                functionality before subscribing to the premium bundle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
