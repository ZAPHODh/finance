import { getCookieConsent } from '@/lib/server/cookie-consent/actions';
import { CookieConsentBanner } from './cookie-consent-banner';

export async function CookieConsent() {
  const consent = await getCookieConsent();

  return <CookieConsentBanner initialConsent={consent} />;
}
