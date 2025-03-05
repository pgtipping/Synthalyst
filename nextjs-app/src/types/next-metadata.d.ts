// This file is used to provide TypeScript type definitions for Next.js Metadata
// It's a workaround for the TypeScript error in Next.js 15.2.0

declare module "next" {
  export interface Metadata {
    title?: string | null;
    description?: string | null;
    openGraph?: Record<string, unknown>;
    twitter?: Record<string, unknown>;
    icons?: Record<string, unknown>;
    robots?: Record<string, unknown>;
    viewport?: string;
    themeColor?: string;
    colorScheme?: string;
    manifest?: string;
    keywords?: string | string[];
    authors?: Array<{ name: string; url?: string }>;
    creator?: string;
    publisher?: string;
    formatDetection?: Record<string, boolean>;
    metadataBase?: URL;
    alternates?: Record<string, unknown>;
    archives?: string | string[];
    assets?: string | string[];
    bookmarks?: string | string[];
    category?: string;
    classification?: string;
    other?: Record<string, string | number | boolean | null | undefined>;
  }
}
