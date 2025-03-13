import { MetadataRoute } from "next/types";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/auth/",
          "/_next/",
          "/coming-soon/",
          "/dashboard/",
          "/preview/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/auth/",
          "/_next/",
          "/coming-soon/",
          "/dashboard/",
          "/preview/",
        ],
        crawlDelay: 2,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/auth/",
          "/_next/",
          "/coming-soon/",
          "/dashboard/",
          "/preview/",
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: "https://synthalyst.com/sitemap.xml",
    host: "https://synthalyst.com",
  };
}
