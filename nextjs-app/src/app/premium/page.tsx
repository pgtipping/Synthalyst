import React from "react";
import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PremiumPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock powerful features to streamline your HR processes and get the
          most out of Synthalyst&apos;s AI-powered tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Individual Plan */}
        <Card className="border-2 hover:border-blue-400 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Individual</CardTitle>
            <CardDescription>
              Perfect for independent professionals
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$10</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>All free features</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Extract competencies from job descriptions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Generate interview questions from competencies</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Create training plans based on competencies</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to competency matrix creator</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        {/* Small Business Plan */}
        <Card className="border-2 border-blue-500 shadow-lg relative">
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center">
            <Crown className="h-4 w-4 mr-1" />
            Popular
          </div>
          <CardHeader>
            <CardTitle>Small Business</CardTitle>
            <CardDescription>For teams and small businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$15</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>All Individual features</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Up to 5 team members</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Team sharing and collaboration</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Advanced analytics and reporting</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-500 hover:bg-blue-600" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="border-2 hover:border-blue-400 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For larger organizations</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">Custom</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>All Small Business features</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Unlimited team members</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>SLA and enterprise support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4">Individual</th>
                <th className="text-center py-3 px-4">Small Business</th>
                <th className="text-center py-3 px-4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">
                  Competency Framework Generator
                </td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">
                  Job Description Generator
                </td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">
                  Interview Questions Generator
                </td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">Training Plan Creator</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">
                  Cross-tool Integration
                </td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">
                  Competency Matrix Creator
                </td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">Team Collaboration</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">Advanced Analytics</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">Custom Integrations</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">Dedicated Support</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to upgrade?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get access to all premium features and take your HR processes to the
          next level with Synthalyst.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" disabled>
            Coming Soon
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
