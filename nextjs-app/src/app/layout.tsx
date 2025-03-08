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
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Synthalyst - Digital HR Solutions",
  description: "Digital Human Resources Solutions powered by AI",
  manifest: "/manifest.json",
  metadataBase: new URL("https://synthalyst.com"),
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#4285F4",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://synthalyst.com",
    title: "Synthalyst - Digital HR Solutions",
    description: "Digital Human Resources Solutions powered by AI",
    siteName: "Synthalyst",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Synthalyst - Digital HR Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synthalyst - Digital HR Solutions",
    description: "Digital Human Resources Solutions powered by AI",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${moonDance.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <Header />
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ClientLayout>
      </body>
    </html>
  );
}
