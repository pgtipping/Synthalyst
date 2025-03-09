import type { Metadata } from "next";
import type { Viewport } from "next/types";
import { Geist, Geist_Mono, Moon_Dance } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Import original components
import ClientLayout from "@/components/ClientLayout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const moonDance = Moon_Dance({
  variable: "--font-moon-dance",
  subsets: ["latin"],
  weight: "400",
});

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
        <meta name="theme-color" content="#4285F4" />
        <meta
          name="google-site-verification"
          content="google-site-verification-code"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${moonDance.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ClientLayout>
      </body>
    </html>
  );
}
