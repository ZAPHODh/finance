export const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "";

export interface SiteCompany {
  displayName: string;
  legalName: string;
  cnpj?: string;
  brandName: string;
}

export interface SiteEmails {
  noReply: string;
  support: string;
  privacy: string;
}

export interface SiteContact {
  support: {
    email: string;
    responseTime: string;
  };
  privacy: {
    email: string;
    title: string;
  };
}

export const siteCompany: SiteCompany = {
  displayName: "Dive into Drive",
  legalName: "DriveFinance Tecnologia Ltda",
  cnpj: undefined,
  brandName: "DriveFinance",
};

export const siteEmails: SiteEmails = {
  noReply: "no-reply@diveintodrive.com",
  support: "notyet@diveintodrive.com",
  privacy: "notyet@diveintodrive.com",
};

export const siteContact: SiteContact = {
  support: {
    email: siteEmails.support,
    responseTime: "24 business hours",
  },
  privacy: {
    email: siteEmails.privacy,
    title: "Privacy and Data (DPO)",
  },
};

export const siteConfig = (locale: string = "en") => ({
  name: siteCompany.displayName,
  url: siteUrl + "/" + locale,
  ogImage: `${siteUrl}/${locale}/opengraph-image`,
  description: "A financial management tool for drivers to track income and expenses.",
  links: {
    twitter: "",
    github: "",
  },
  company: siteCompany,
  emails: siteEmails,
  contact: siteContact,
});

export type SiteConfig = ReturnType<typeof siteConfig>;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};