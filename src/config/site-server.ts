import { getScopedI18n } from "@/locales/server";
import { siteUrl, siteCompany, siteEmails } from "./site";

export async function siteConfig(locale: string) {
  const t = await getScopedI18n('marketing.siteMetadata');

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

export type SiteConfig = Awaited<ReturnType<typeof siteConfig>>;
