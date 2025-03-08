import { MetadataRoute } from "next/types";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://synthalyst.com";
  const lastModified = new Date().toISOString();

  // Main pages
  const mainPages = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8,
    },
  ];

  // Tool pages
  const toolPages = [
    {
      url: `${baseUrl}/jd-developer`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/training-plan`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/competency-manager`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interview-questions`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/2do`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge-gpt`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learning-content`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/the-synth`,
      lastModified,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.7,
    },
  ];

  // Premium pages
  const premiumPages = [
    {
      url: `${baseUrl}/premium`,
      lastModified,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-started`,
      lastModified,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.8,
    },
  ];

  return [...mainPages, ...toolPages, ...premiumPages];
}
