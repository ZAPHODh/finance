export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  consentDate: string;
  version: number;
}

export const COOKIE_CONSENT_NAME = "cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_DURATION_MONTHS = 12;

export const defaultPreferences: CookiePreferences = {
  essential: true,
  performance: false,
  functional: false,
  marketing: false,
};
