'use client';

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
    };
  }
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return false;

    const consentData = JSON.parse(consent);
    return consentData.analytics === true;
  } catch {
    return false;
  }
}

interface AdTrackingParams {
  partnerId: string;
  partnerName: string;
  category: string;
  location: string;
}

export function trackAdImpression(params: AdTrackingParams): void {
  if (!hasAnalyticsConsent()) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'ad_impression', {
      partner_id: params.partnerId,
      partner_name: params.partnerName,
      partner_category: params.category,
      ad_location: params.location,
    });
  }

  if (window.posthog?.capture) {
    window.posthog.capture('ad_impression', {
      partner_id: params.partnerId,
      partner_name: params.partnerName,
      partner_category: params.category,
      ad_location: params.location,
    });
  }
}

export function trackAdClick(params: AdTrackingParams): void {
  if (!hasAnalyticsConsent()) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'ad_click', {
      partner_id: params.partnerId,
      partner_name: params.partnerName,
      partner_category: params.category,
      ad_location: params.location,
    });
  }

  if (window.posthog?.capture) {
    window.posthog.capture('ad_click', {
      partner_id: params.partnerId,
      partner_name: params.partnerName,
      partner_category: params.category,
      ad_location: params.location,
    });
  }
}

export function trackUpgradeClick(source: string): void {
  if (!hasAnalyticsConsent()) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'upgrade_click', {
      source,
    });
  }

  if (window.posthog?.capture) {
    window.posthog.capture('upgrade_click', {
      source,
    });
  }
}
