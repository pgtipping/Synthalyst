"use client";

import React from "react";
import FeedbackButton from "./FeedbackButton";

interface FeedbackLayoutProps {
  appName: string;
  children: React.ReactNode;
  buttonText?: string;
}

export default function FeedbackLayout({
  appName,
  children,
  buttonText = "Give feedback",
}: FeedbackLayoutProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <FeedbackButton
          appName={appName}
          buttonText={buttonText}
          buttonVariant="outline"
          buttonSize="sm"
        />
      </div>
      {children}
    </div>
  );
}
