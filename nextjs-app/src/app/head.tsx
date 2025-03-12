import React from "react";
import fs from "fs";
import path from "path";

// Read critical CSS at build time
let criticalCSS = "";
try {
  // Only read the file during build, not during development
  if (process.env.NODE_ENV === "production") {
    const cssPath = path.join(process.cwd(), "src/app/critical.css");
    criticalCSS = fs.readFileSync(cssPath, "utf8");
  }
} catch (error) {
  console.error("Error reading critical CSS:", error);
}

export default function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://synthalyst.com" />
      <link rel="alternate" hrefLang="en" href="https://synthalyst.com" />
      <meta name="theme-color" content="#4285F4" />
      <meta
        name="google-site-verification"
        content="google-site-verification-code"
      />

      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/geist-sans.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Inline critical CSS */}
      {criticalCSS && (
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      )}
    </>
  );
}
