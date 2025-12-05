import { getScopedI18n } from '@/locales/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { TrackableAdWrapper } from './trackable-ad-wrapper';
import { getPartnersForUser } from '@/app/actions/partners';

interface PartnerAdSidebarProps {
  location: string;
  maxPartners?: number;
}

export async function PartnerAdSidebar({
  location,
  maxPartners = 3,
}: PartnerAdSidebarProps) {
  const t = await getScopedI18n('dashboard.ads');
  const allPartners = await getPartnersForUser();

  const shuffled = [...allPartners].sort(() => Math.random() - 0.5);
  const partners = shuffled.slice(0, maxPartners);

  if (partners.length === 0) return null;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {t('partnerOffer')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {partners.map((partner) => (
          <TrackableAdWrapper
            key={partner.id}
            partnerId={partner.id}
            partnerName={partner.name}
            category={partner.category}
            location={location}
            ctaUrl={partner.ctaUrl}
          >
            <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-2">
                {partner.logoUrl && (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-8 w-8 rounded object-contain flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold text-sm truncate">
                      {partner.name}
                    </h5>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {t('sponsored')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {partner.benefit}
                  </p>
                </div>
              </div>

              {partner.discountRate && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold mb-2">
                  {t('savingsUpTo', { discount: partner.discountRate })}
                </div>
              )}

              <Button size="sm" variant="outline" className="w-full text-xs group">
                {partner.ctaText}
                <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </TrackableAdWrapper>
        ))}

        <p className="text-xs text-center text-muted-foreground">
          {t('poweredByPartners')}
        </p>
      </CardContent>
    </Card>
  );
}
