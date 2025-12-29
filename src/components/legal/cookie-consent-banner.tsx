'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Shield, Eye, Settings, Target } from 'lucide-react';
import {
  setCookiePreferences,
  acceptAllCookies,
  rejectAllCookies,
} from '@/lib/server/cookie-consent/actions';
import type {
  CookiePreferences,
} from '@/lib/server/cookie-consent/types';
import { defaultPreferences } from '@/lib/server/cookie-consent/types';
import { useScopedI18n } from '@/locales/client';
import { toast } from 'sonner';

interface CookieConsentBannerProps {
  initialConsent?: {
    hasConsented: boolean;
    preferences: CookiePreferences;
    consentDate: string | null;
    version: number;
  };
}

export function CookieConsentBanner({ initialConsent }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isPending, startTransition] = useTransition();
  const t = useScopedI18n('shared.cookieConsent');

  useEffect(() => {
    const hasConsented = initialConsent?.hasConsented ?? false;
    setIsVisible(!hasConsented);
    if (initialConsent?.preferences) {
      setPreferences(initialConsent.preferences);
    }
  }, [initialConsent]);

  function handleAcceptAll() {
    startTransition(async () => {
      try {
        const result = await acceptAllCookies();
        if (result?.success) {
          setIsVisible(false);
          toast.success(t('toast.success'));
        }
      } catch (error) {
        toast.error(t('toast.failed'));
        console.error('Error accepting all cookies:', error);
      }
    });
  }

  function handleAcceptSelected() {
    startTransition(async () => {
      try {
        const result = await setCookiePreferences(preferences);
        if (result?.success) {
          setIsVisible(false);
          toast.success(result.message);
        }
      } catch (error) {
        toast.error(t('toast.failed'));
        console.error('Error saving cookie preferences:', error);
      }
    });
  }

  function handleRejectAll() {
    startTransition(async () => {
      try {
        const result = await rejectAllCookies();
        if (result?.success) {
          setIsVisible(false);
          toast.success(result.message);
        }
      } catch (error) {
        toast.error(t('toast.failed'));
        console.error('Error rejecting cookies:', error);
      }
    });
  }

  function updatePreference(key: keyof CookiePreferences, value: boolean) {
    if (key === 'essential') return;
    setPreferences(prev => ({ ...prev, [key]: value }));
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('title')}
                </CardTitle>
                <CardDescription className="max-w-2xl">
                  {t('description')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="shrink-0">
                {t('required')}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {!showDetails ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{t('weUse')}</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm font-normal"
                    onClick={() => setShowDetails(true)}
                  >
                    {t('learnMore')}
                  </Button>
                  <span>•</span>
                  <a
                    href="/privacy"
                    className="inline-flex items-center gap-1 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('privacyPolicy')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                    disabled={isPending}
                  >
                    {t('rejectAll')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    disabled={isPending}
                  >
                    {t('customize')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    disabled={isPending}
                  >
                    {t('acceptAll')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 mt-0.5 text-green-600" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t('essential.title')}</span>
                          <Badge variant="secondary" className="text-xs">
                            {t('essential.required')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('essential.description')}
                        </p>
                      </div>
                    </div>
                    <Switch checked={true} disabled />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 mt-0.5 text-blue-600" />
                      <div className="space-y-1">
                        <span className="font-medium">{t('performance.title')}</span>
                        <p className="text-sm text-muted-foreground">
                          {t('performance.description')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.performance}
                      onCheckedChange={(checked) => updatePreference('performance', checked)}
                    />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 mt-0.5 text-purple-600" />
                      <div className="space-y-1">
                        <span className="font-medium">{t('functional.title')}</span>
                        <p className="text-sm text-muted-foreground">
                          {t('functional.description')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.functional}
                      onCheckedChange={(checked) => updatePreference('functional', checked)}
                    />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 mt-0.5 text-orange-600" />
                      <div className="space-y-1">
                        <span className="font-medium">{t('marketing.title')}</span>
                        <p className="text-sm text-muted-foreground">
                          {t('marketing.description')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => updatePreference('marketing', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p>{t('compliance.gdpr')}</p>
                    <p>{t('compliance.ccpa')}</p>
                    <p>{t('compliance.lgpd')}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails(false)}
                      disabled={isPending}
                    >
                      {t('back')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectAll}
                      disabled={isPending}
                    >
                      {t('rejectAll')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAcceptSelected}
                      disabled={isPending}
                    >
                      {t('savePreferences')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
