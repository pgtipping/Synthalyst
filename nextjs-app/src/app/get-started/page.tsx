"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  UserPlus,
  Layers,
  Settings,
  Zap,
  BookOpen,
} from "lucide-react";

export default function GetStarted() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up for a free Synthalyst account to get started.",
      icon: <UserPlus className="w-6 h-6" />,
      action: {
        text: "Sign Up Now",
        link: "/login",
      },
    },
    {
      number: 2,
      title: "Choose Your Tools",
      description:
        "Select the tools that best fit your needs from our suite of AI-powered solutions.",
      icon: <Layers className="w-6 h-6" />,
      action: {
        text: "Explore Tools",
        link: "/services",
      },
    },
    {
      number: 3,
      title: "Customize Settings",
      description:
        "Configure your tools to match your organization&apos;s specific requirements.",
      icon: <Settings className="w-6 h-6" />,
      action: {
        text: "Learn More",
        link: "/services",
      },
    },
    {
      number: 4,
      title: "Start Using Synthalyst",
      description:
        "Begin using our tools to enhance your productivity and streamline your HR operations.",
      icon: <Zap className="w-6 h-6" />,
      action: {
        text: "Get Started",
        link: "/login",
      },
    },
  ];

  const faqs = [
    {
      question: "Is Synthalyst free to use?",
      answer:
        "Synthalyst offers both free and premium services. You can get started with our free tools and upgrade to premium features as your needs grow.",
    },
    {
      question: "Do I need technical knowledge to use Synthalyst?",
      answer:
        "No, Synthalyst is designed to be user-friendly and accessible to everyone, regardless of technical expertise.",
    },
    {
      question: "Can I use Synthalyst on mobile devices?",
      answer:
        "Yes, Synthalyst is a mobile-first web application that works seamlessly on smartphones, tablets, and desktop computers.",
    },
    {
      question: "How secure is my data with Synthalyst?",
      answer:
        "We take data security seriously. All data is encrypted and stored securely, and we never share your information with third parties without your consent.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your premium subscription at any time. Your data will remain accessible through our free tier.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Get Started", href: "/get-started", active: true },
          ]}
        />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Started with Synthalyst
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl">
            Follow these simple steps to start using our AI-powered tools and
            transform your HR operations.
          </p>
        </div>

        {/* Steps Section */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            How It Works
          </h2>

          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`border rounded-lg p-6 transition-all duration-300 ${
                  activeStep === step.number
                    ? "border-blue-500 shadow-md bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setActiveStep(step.number)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      activeStep === step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.number <= activeStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="text-lg font-semibold">
                        {step.number}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`${
                          activeStep === step.number
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <Link href={step.action.link}>
                      <Button
                        variant={
                          activeStep === step.number ? "default" : "outline"
                        }
                        className="group"
                      >
                        {step.action.text}
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
            <p className="text-gray-600 mb-4">
              Our intuitive interface makes it simple to get started, with no
              technical expertise required.
            </p>
            <div className="flex items-center text-blue-600">
              <Zap className="w-5 h-5 mr-2" />
              <span>Get up and running in minutes</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-4">AI-Powered</h3>
            <p className="text-gray-600 mb-4">
              Leverage the power of artificial intelligence to automate and
              enhance your HR processes.
            </p>
            <div className="flex items-center text-blue-600">
              <Zap className="w-5 h-5 mr-2" />
              <span>Save hours of manual work</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-4">Customizable</h3>
            <p className="text-gray-600 mb-4">
              Tailor our tools to match your organization&apos;s specific needs
              and requirements.
            </p>
            <div className="flex items-center text-blue-600">
              <Zap className="w-5 h-5 mr-2" />
              <span>Perfect fit for your business</span>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of organizations already using Synthalyst to
            streamline their HR processes.
          </p>
          <Link href="/login">
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[200px] group"
            >
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
