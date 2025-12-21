import { type MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://financial.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          pt: `${siteUrl}/pt`,
        },
      },
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en/about`,
          pt: `${siteUrl}/pt/about`,
        },
      },
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en/pricing`,
          pt: `${siteUrl}/pt/pricing`,
        },
      },
    },
    {
      url: `${siteUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en/features`,
          pt: `${siteUrl}/pt/features`,
        },
      },
    },
    {
      url: `${siteUrl}/use-cases`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en/use-cases`,
          pt: `${siteUrl}/pt/use-cases`,
        },
      },
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}/en/faq`,
          pt: `${siteUrl}/pt/faq`,
        },
      },
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${siteUrl}/en/contact`,
          pt: `${siteUrl}/pt/contact`,
        },
      },
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: {
          en: `${siteUrl}/en/privacy`,
          pt: `${siteUrl}/pt/privacy`,
        },
      },
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: {
          en: `${siteUrl}/en/terms`,
          pt: `${siteUrl}/pt/terms`,
        },
      },
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          en: `${siteUrl}/en/login`,
          pt: `${siteUrl}/pt/login`,
        },
      },
    },
  ];
}
