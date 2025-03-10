"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface NewsletterSignupProps {
  source?: string;
  buttonText?: string;
  placeholder?: string;
  variant?: string;
  className?: string;
  title?: string;
  description?: string;
}

export default function NewsletterSignup({
  source = "website",
  buttonText = "Subscribe",
  placeholder = "Enter your email",
  variant = "default",
  className = "",
  title,
  description,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");
    setErrorDetails(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
        if (data.details) {
          setErrorDetails(data.details);
          console.error("Subscription error details:", data.details);
        }
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
      console.error("Newsletter signup error:", error);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div
          className={`flex ${
            variant === "minimal" ? "flex-row" : "flex-col sm:flex-row"
          } space-x-0 sm:space-x-2 space-y-2 sm:space-y-0`}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className={`flex-grow ${variant === "minimal" ? "h-9" : ""}`}
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            size={variant === "minimal" ? "sm" : "default"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {status === "success" && (
          <Alert
            className={`bg-green-50 border-green-200 ${
              variant === "minimal" ? "py-2 text-sm" : ""
            }`}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert
            className={`bg-red-50 border-red-200 ${
              variant === "minimal" ? "py-2 text-sm" : ""
            }`}
          >
            <AlertDescription>
              {message}
              {errorDetails && process.env.NODE_ENV === "development" && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-1 p-2 bg-red-100 rounded overflow-x-auto">
                    {errorDetails}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
