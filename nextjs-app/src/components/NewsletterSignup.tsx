"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertCircle, Mail } from "lucide-react";

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "minimal";
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSignup({
  variant = "card",
  title = "Subscribe to our newsletter",
  description = "Get the latest insights and updates delivered to your inbox.",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      // Call the API to subscribe the user
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `${variant}-${window.location.pathname}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again later."
      );
      console.error("Newsletter subscription error:", error);
    }
  };

  if (variant === "minimal") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-2 ${className}`}
      >
        <div className="relative flex-grow">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="pr-10"
          />
          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading"
            ? "Subscribing..."
            : status === "success"
            ? "Subscribed!"
            : "Subscribe"}
        </Button>

        {status === "error" && (
          <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
        )}

        {status === "success" && (
          <p className="text-sm text-green-500 mt-1 flex items-center">
            <Check className="h-4 w-4 mr-1" /> Thanks for subscribing!
          </p>
        )}
      </form>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <div className="flex items-center mb-2">
          <Mail className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="flex-grow"
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading"
              ? "Subscribing..."
              : status === "success"
              ? "Subscribed!"
              : "Subscribe"}
          </Button>
        </form>

        {status === "error" && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {status === "success" && (
          <Alert className="mt-2 py-2 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Thanks for subscribing! We&apos;ll be in touch soon.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 text-primary mr-2" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading"
              ? "Subscribing..."
              : status === "success"
              ? "Subscribed!"
              : "Subscribe"}
          </Button>

          {status === "error" && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert className="mt-2 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>
                Thanks for subscribing! We&apos;ll be in touch soon.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
