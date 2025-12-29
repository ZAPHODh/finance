"use server";

import { cookies } from "next/headers";
import {
  type CookiePreferences,
  type CookieConsentState,
  defaultPreferences,
  COOKIE_CONSENT_NAME,
  CONSENT_VERSION,
  CONSENT_DURATION_MONTHS,
} from "./types";

async function getCookieConsentState(): Promise<CookieConsentState | null> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(COOKIE_CONSENT_NAME)?.value;
    if (!cookieValue) return null;

    const state: CookieConsentState = JSON.parse(cookieValue);

    const consentDate = new Date(state.consentDate);
    const now = new Date();
    const monthsOld = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsOld > CONSENT_DURATION_MONTHS || state.version < CONSENT_VERSION) {
      await removeCookieConsentState();
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

async function setCookieConsentState(preferences: CookiePreferences) {
  const state: CookieConsentState = {
    hasConsented: true,
    preferences: { ...preferences, essential: true },
    consentDate: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_CONSENT_NAME, JSON.stringify(state), {
    expires: new Date(Date.now() + CONSENT_DURATION_MONTHS * 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  await applyCookiePreferences(preferences);
}

async function removeCookieConsentState() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_CONSENT_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

async function applyCookiePreferences(preferences: CookiePreferences) {
  const cookieStore = await cookies();

  if (!preferences.performance) {
    const performanceCookies = [
      "_ga", "_gid", "_gat", "_gtag",
      "__utma", "__utmb", "__utmc", "__utmt", "__utmz",
      "_gcl_au", "_dc_gtm_UA"
    ];

    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      const name = cookie.name;
      if (
        name.startsWith('_ga') ||
        name.startsWith('_gid') ||
        name.startsWith('_gat') ||
        name.startsWith('_gtag') ||
        name.startsWith('__utm') ||
        name.startsWith('_dc_gtm_')
      ) {
        cookieStore.set(name, "", {
          expires: new Date(0),
          path: "/",
        });
      }
    }

    for (const name of performanceCookies) {
      cookieStore.set(name, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  }

  if (!preferences.functional) {
    const functionalCookies = ["pref_", "lang_", "theme_"];
    for (const name of functionalCookies) {
      cookieStore.set(name, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  }

  if (!preferences.marketing) {
    const marketingCookies = [
      "fb_", "_fbp", "fr", "tr", "ads_", "marketing_",
      "_gcl_dc", "_gcl_aw", "_gcl_gb",
      "IDE", "ANID", "DSID", "FLC", "AID", "TAID",
      "_rdt_uuid", "_pinterest_ct_ua"
    ];

    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      const name = cookie.name;
      if (
        name.startsWith('fb_') ||
        name.startsWith('_fbp') ||
        name.startsWith('fr') ||
        name.startsWith('tr') ||
        name.startsWith('ads_') ||
        name.startsWith('marketing_') ||
        name.startsWith('_gcl_') ||
        name.startsWith('__Secure-') ||
        ['IDE', 'ANID', 'DSID', 'FLC', 'AID', 'TAID', '_rdt_uuid', '_pinterest_ct_ua'].includes(name)
      ) {
        cookieStore.set(name, "", {
          expires: new Date(0),
          path: "/",
        });
      }
    }

    for (const name of marketingCookies) {
      cookieStore.set(name, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  }
}

export async function getCookieConsent() {
  const state = await getCookieConsentState();
  return {
    hasConsented: state?.hasConsented ?? false,
    preferences: state?.preferences ?? defaultPreferences,
    consentDate: state?.consentDate ?? null,
    version: state?.version ?? 0,
  };
}

export async function setCookiePreferences(preferences: CookiePreferences) {
  const safePreferences = { ...preferences, essential: true };
  await setCookieConsentState(safePreferences);

  return {
    success: true,
    preferences: safePreferences,
    message: "Cookie preferences updated successfully",
  };
}

export async function acceptAllCookies() {
  const allAccepted: CookiePreferences = {
    essential: true,
    performance: true,
    functional: true,
    marketing: true,
  };

  await setCookieConsentState(allAccepted);

  return {
    success: true,
    preferences: allAccepted,
    message: "All cookies accepted",
  };
}

export async function rejectAllCookies() {
  await setCookieConsentState(defaultPreferences);

  return {
    success: true,
    preferences: defaultPreferences,
    message: "Non-essential cookies rejected",
  };
}

export async function withdrawConsent() {
  await removeCookieConsentState();
  await applyCookiePreferences(defaultPreferences);

  return {
    success: true,
    message: "Consent withdrawn successfully",
  };
}

export async function isCookieTypeAllowed(type: keyof CookiePreferences): Promise<boolean> {
  const state = await getCookieConsentState();
  if (!state) return type === 'essential';
  return state.preferences[type];
}

export async function hasUserConsented(): Promise<boolean> {
  const state = await getCookieConsentState();
  return state?.hasConsented ?? false;
}
