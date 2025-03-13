import type { Metadata } from "next";

// Define the structured data for the ApplyRight page
const applyRightJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Synthalyst ApplyRight",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Web",
  description:
    "A powerful resume transformation tool that instantly improves resumes with professional enhancements and targeted optimizations.",
};

export const metadata: Metadata = {
  title: "ApplyRight | Synthalyst",
  description:
    "Transform your resume instantly with professional enhancements and targeted optimizations for your job applications.",
  keywords: [
    "resume optimization",
    "resume builder",
    "resume transformation",
    "job application",
    "ATS optimization",
    "career development",
    "professional resume",
  ],
  openGraph: {
    title: "ApplyRight | Synthalyst",
    description:
      "Transform your resume instantly with professional enhancements and targeted optimizations for your job applications.",
    url: "https://synthalyst.com/apply-right",
    type: "website",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Synthalyst ApplyRight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyRight | Synthalyst",
    description:
      "Transform your resume instantly with professional enhancements and targeted optimizations for your job applications.",
    images: ["/icons/twitter-image.png"],
  },
  alternates: {
    canonical: "https://synthalyst.com/apply-right",
  },
};

export default function ApplyRightLayout({
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
          __html: JSON.stringify(applyRightJsonLd),
        }}
      />
      {children}
    </>
  );
}
