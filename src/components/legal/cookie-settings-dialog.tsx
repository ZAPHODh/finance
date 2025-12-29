'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Settings, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  setCookiePreferences,
  getCookieConsent,
} from '@/lib/server/cookie-consent/actions';
import type { CookiePreferences } from '@/lib/server/cookie-consent/types';
import { defaultPreferences } from '@/lib/server/cookie-consent/types';
import { useScopedI18n } from '@/locales/client';
import { toast } from 'sonner';

interface CookieSettingsDialogProps {
  children: React.ReactNode;
}

export function CookieSettingsDialog({ children }: CookieSettingsDialogProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useScopedI18n('shared.cookieConsent');

  useEffect(() => {
    if (isOpen) {
      startTransition(async () => {
        try {
          const consent = await getCookieConsent();
          setPreferences(consent.preferences);
        } catch (error) {
          console.error('Error loading cookie preferences:', error);
          setPreferences(defaultPreferences);
        }
      });
    }
  }, [isOpen]);

  function handleSave() {
    startTransition(async () => {
      try {
        const result = await setCookiePreferences(preferences);
        if (result?.success) {
          setIsOpen(false);
          toast.success(result.message);
        }
      } catch (error) {
        toast.error(t('toast.failed'));
        console.error('Error saving cookie preferences:', error);
      }
    });
  }

  function updatePreference(key: keyof CookiePreferences, value: boolean) {
    if (key === 'essential') return;
    setPreferences(prev => ({ ...prev, [key]: value }));
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('settings.title')}
          </DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4">
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

          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('compliance.gdpr')}</p>
            <p>{t('compliance.ccpa')}</p>
            <p>{t('compliance.lgpd')}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {t('savePreferences')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
