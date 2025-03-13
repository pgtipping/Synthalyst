import type { Metadata } from "next";

// Define the structured data for the Career Bundle page
const careerBundleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Synthalyst Career Bundle",
  description:
    "Complete career solution combining ApplyRight and Interview Prep for end-to-end job application support.",
  offers: {
    "@type": "Offer",
    price: "19.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  category: "Career Development",
};

export const metadata: Metadata = {
  title: "Career Bundle | Synthalyst",
  description:
    "Get the complete career solution with our bundle of ApplyRight and Interview Prep tools for end-to-end job application support.",
  keywords: [
    "career bundle",
    "job application bundle",
    "resume and interview package",
    "career development",
    "job search tools",
    "professional development",
    "career advancement",
  ],
  openGraph: {
    title: "Career Bundle | Synthalyst",
    description:
      "Get the complete career solution with our bundle of ApplyRight and Interview Prep tools for end-to-end job application support.",
    url: "https://synthalyst.com/career-bundle",
    type: "website",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Synthalyst Career Bundle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Bundle | Synthalyst",
    description:
      "Get the complete career solution with our bundle of ApplyRight and Interview Prep tools for end-to-end job application support.",
    images: ["/icons/twitter-image.png"],
  },
  alternates: {
    canonical: "https://synthalyst.com/career-bundle",
  },
};

export default function CareerBundleLayout({
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
          __html: JSON.stringify(careerBundleJsonLd),
        }}
      />
      {children}
    </>
  );
}
