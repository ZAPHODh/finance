'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';

interface CookieConsentData {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const t = useI18n();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  function handleAcceptAll() {
    const consentData: CookieConsentData = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    setShow(false);
  }

  function handleEssentialOnly() {
    const consentData: CookieConsentData = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {t('shared.cookieConsent.description')}
              {' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                {t('shared.cookieConsent.privacyPolicy')}
              </Link>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleEssentialOnly}
              variant="outline"
              size="sm"
            >
              {t('shared.cookieConsent.rejectAll')}
            </Button>
            <Button
              onClick={handleAcceptAll}
              size="sm"
            >
              {t('shared.cookieConsent.acceptAll')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
