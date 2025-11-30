"use client";

import { useScopedI18n } from "@/locales/client";
import { siteUrl, siteCompany, siteEmails } from "./site";

export function useSiteConfig(locale: string) {
  const t = useScopedI18n('marketing.siteMetadata');

  return {
    name: siteCompany.displayName,
    url: siteUrl + "/" + locale,
    ogImage: `${siteUrl}/${locale}/opengraph-image`,
    description: t('description'),
    links: {
      twitter: "",
      github: "",
    },
    company: siteCompany,
    emails: siteEmails,
    contact: {
      support: {
        email: siteEmails.support,
        responseTime: t('supportResponseTime'),
      },
      privacy: {
        email: siteEmails.privacy,
        title: t('privacyOfficerTitle'),
      },
    },
  };
}
