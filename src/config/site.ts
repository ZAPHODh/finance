export const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "";

export interface SiteCompany {
  displayName: string;
}

export interface SiteEmails {
  noReply: string;
  support: string;
  privacy: string;
}

export const siteCompany: SiteCompany = {
  displayName: "Dive into Drive",
};

export const siteEmails: SiteEmails = {
  noReply: "no-reply@diveintodrive.com",
  support: "support@diveintodrive.com",
  privacy: "privacy@diveintodrive.com",
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};