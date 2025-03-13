import type { Metadata } from "next";

// Define the structured data for the Interview Prep page
const interviewPrepJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Synthalyst Interview Prep",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Web",
  description:
    "AI-powered interview preparation tool that helps you prepare for job interviews with personalized practice questions and feedback.",
};

export const metadata: Metadata = {
  title: "Interview Prep | Synthalyst",
  description:
    "Prepare for your job interviews with AI-powered assistance tailored to your specific job application.",
  keywords: [
    "interview preparation",
    "job interview",
    "interview questions",
    "AI interview prep",
    "interview practice",
    "career development",
    "job application",
  ],
  openGraph: {
    title: "Interview Prep | Synthalyst",
    description:
      "Prepare for your job interviews with AI-powered assistance tailored to your specific job application.",
    url: "https://synthalyst.com/interview-prep",
    type: "website",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Synthalyst Interview Prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Prep | Synthalyst",
    description:
      "Prepare for your job interviews with AI-powered assistance tailored to your specific job application.",
    images: ["/icons/twitter-image.png"],
  },
  alternates: {
    canonical: "https://synthalyst.com/interview-prep",
  },
};

export default function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(interviewPrepJsonLd),
        }}
      />
      {children}
    </>
  );
}
