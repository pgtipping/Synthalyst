import type { Metadata } from "next";
import type { Viewport } from "next/types";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ToastProvider } from "@/components/ui/use-toast";

// Import original components
import ClientLayout from "@/components/ClientLayout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import critical CSS
import "./critical.css";

// Define font variables without using next/font directly
const fontVariables = {
  geistSans: "--font-geist-sans",
  geistMono: "--font-geist-mono",
  moonDance: "--font-moon-dance",
};

export const viewport: Viewport = {
  themeColor: "#4285F4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: "Synthalyst - Business & Productivity Platform",
  description:
    "A comprehensive platform offering AI-powered tools, content, and services for professional development, productivity enhancement, and business solutions.",
  keywords: [
    "business solutions",
    "productivity tools",
    "AI tools",
    "professional development",
    "task management",
    "document management",
    "business automation",
    "AI consulting",
    "productivity enhancement",
    "digital solutions",
  ],
  creator: "Synthalyst",
  publisher: "Synthalyst",
  metadataBase: new URL("https://synthalyst.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icons/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/favicon/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/icons/favicon/favicon-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/icons/android-chrome/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome/android-chrome-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://synthalyst.com",
    title: "Synthalyst - Business & Productivity Platform",
    description:
      "A comprehensive platform offering AI-powered tools, content, and services for professional development, productivity enhancement, and business solutions.",
    siteName: "Synthalyst",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Synthalyst - Business & Productivity Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synthalyst - Business & Productivity Platform",
    description:
      "A comprehensive platform offering AI-powered tools, content, and services for professional development, productivity enhancement, and business solutions.",
    creator: "@synthalyst",
    images: ["/icons/twitter-image.png"],
  },
};

// Organization JSON-LD structured data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Synthalyst",
  url: "https://synthalyst.com",
  logo: "https://synthalyst.com/icons/logo.png",
  sameAs: [
    "https://twitter.com/synthalyst",
    "https://www.linkedin.com/company/synthalyst",
    "https://www.facebook.com/synthalyst",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-123-4567",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
  description:
    "A comprehensive platform offering AI-powered tools, content, and services for professional development, productivity enhancement, and business solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://synthalyst.com" />
        <link rel="alternate" hrefLang="en" href="https://synthalyst.com" />

        {/* Resource hints for external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Add Google Fonts directly */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Moon+Dance&display=swap"
          rel="stylesheet"
        />

        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        <meta name="theme-color" content="#4285F4" />
        <meta
          name="google-site-verification"
          content="google-site-verification-code"
        />
        <meta name="yandex-verification" content="yandex-verification-code" />
        <meta
          name="facebook-domain-verification"
          content="facebook-domain-verification-code"
        />

        {/* Load non-critical CSS asynchronously */}
        <link rel="preload" href="/styles/non-critical.css" as="style" />
        <noscript>
          <link rel="stylesheet" href="/styles/non-critical.css" />
        </noscript>

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${fontVariables.geistSans} ${fontVariables.geistMono} ${fontVariables.moonDance} antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <ClientLayout>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ClientLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
