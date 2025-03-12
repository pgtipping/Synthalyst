"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PricingSectionProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export function PricingSection({ isPremium, onUpgrade }: PricingSectionProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Choose the plan that works best for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Free Tier */}
        <div className="border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="text-muted-foreground">Basic resume transformation</p>
          </div>
          <div className="text-3xl font-bold">$0</div>
          <ul className="space-y-2 my-6">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>One-click resume transformation</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Basic ATS optimization</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Standard PDF export</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>One free cover letter</span>
            </li>
          </ul>
          <Button variant="outline" className="w-full" disabled={true}>
            Current Plan
          </Button>
        </div>

        {/* Premium Tier */}
        <div className="border rounded-lg p-6 space-y-4 bg-primary/5 border-primary/20 relative">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
            RECOMMENDED
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Premium</h3>
            <p className="text-gray-700">Advanced resume optimization</p>
          </div>
          <div className="text-3xl font-bold">
            $9.99
            <span className="text-base font-normal text-gray-700">/month</span>
          </div>
          <ul className="space-y-2 my-6">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Everything in Free, plus:</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Multiple transformation iterations</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Advanced ATS optimization</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Multiple design templates</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Multiple cover letter templates</span>
            </li>
          </ul>
          <Button className="w-full" onClick={onUpgrade} disabled={isPremium}>
            {isPremium ? "Current Plan" : "Upgrade Now"}
          </Button>
        </div>

        {/* Custom Plan */}
        <div className="border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Enterprise</h3>
            <p className="text-muted-foreground">For teams and businesses</p>
          </div>
          <div className="text-3xl font-bold">Custom</div>
          <ul className="space-y-2 my-6">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Everything in Premium, plus:</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Bulk resume processing</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Team management dashboard</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
          <Button
            variant="outline"
            className="w-full text-gray-900 border-gray-400 hover:bg-gray-100"
            asChild
          >
            <a href="/contact">Contact Sales</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
