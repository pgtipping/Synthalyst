"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface PricingSectionProps {
  isPremiumUser: boolean;
}

export function PricingSection({ isPremiumUser }: PricingSectionProps) {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock advanced features and get more out of your resume
          transformation experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <Card
          className={`border-2 ${
            !isPremiumUser ? "border-primary" : "border-muted"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Basic resume transformation</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">/ forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeatureItem included>One-click resume transformation</FeatureItem>
            <FeatureItem included>Basic ATS optimization</FeatureItem>
            <FeatureItem included>
              Professional language enhancements
            </FeatureItem>
            <FeatureItem included>Basic job description targeting</FeatureItem>
            <FeatureItem included>One free cover letter</FeatureItem>
            <FeatureItem included>Standard PDF export</FeatureItem>
            <FeatureItem>Multiple transformation iterations</FeatureItem>
            <FeatureItem>Advanced ATS optimization</FeatureItem>
            <FeatureItem>Multiple design templates</FeatureItem>
            <FeatureItem>Interview Prep App access</FeatureItem>
          </CardContent>
          <CardFooter>
            {!isPremiumUser ? (
              <div className="w-full text-center">
                <p className="text-sm text-primary font-medium mb-2">
                  Current Plan
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Free Plan
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full">
                Downgrade
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Premium Tier */}
        <Card
          className={`border-2 ${
            isPremiumUser ? "border-primary" : "border-muted"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription>Advanced resume optimization</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeatureItem included>One-click resume transformation</FeatureItem>
            <FeatureItem included>Basic ATS optimization</FeatureItem>
            <FeatureItem included>
              Professional language enhancements
            </FeatureItem>
            <FeatureItem included>Basic job description targeting</FeatureItem>
            <FeatureItem included>One free cover letter</FeatureItem>
            <FeatureItem included>Standard PDF export</FeatureItem>
            <FeatureItem included>
              Multiple transformation iterations
            </FeatureItem>
            <FeatureItem included>Advanced ATS optimization</FeatureItem>
            <FeatureItem included>Multiple design templates</FeatureItem>
            <FeatureItem included>Interview Prep App access</FeatureItem>
          </CardContent>
          <CardFooter>
            {isPremiumUser ? (
              <div className="w-full text-center">
                <p className="text-sm text-primary font-medium mb-2">
                  Current Plan
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Premium Plan
                </Button>
              </div>
            ) : (
              <Button className="w-full">Upgrade to Premium</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  children: React.ReactNode;
  included?: boolean;
}

function FeatureItem({ children, included = false }: FeatureItemProps) {
  return (
    <div className="flex items-center">
      {included ? (
        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
      )}
      <span className={included ? "" : "text-muted-foreground"}>
        {children}
      </span>
    </div>
  );
}
