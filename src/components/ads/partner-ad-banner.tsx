import { getScopedI18n } from '@/locales/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { TrackableAdWrapper } from './trackable-ad-wrapper';
import { getRandomPartnerByCategory } from '@/app/actions/partners';
import type { PartnerCategory } from '@prisma/client';

interface PartnerAdBannerProps {
  category: PartnerCategory;
  location: string;
}

export async function PartnerAdBanner({
  category,
  location,
}: PartnerAdBannerProps) {
  const t = await getScopedI18n('dashboard.ads');
  const partner = await getRandomPartnerByCategory(category);

  if (!partner) return null;

  return (
    <TrackableAdWrapper
      partnerId={partner.id}
      partnerName={partner.name}
      category={partner.category}
      location={location}
      ctaUrl={partner.ctaUrl}
    >
      <div className="w-full border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4 flex-1">
            {partner.logoUrl && (
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 w-12 rounded object-contain flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{partner.name}</h4>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {t('sponsored')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {partner.benefit}
              </p>
              {partner.discountRate && (
                <p className="text-sm font-semibold text-primary mt-1">
                  {t('savingsUpTo', { discount: partner.discountRate })}
                </p>
              )}
            </div>
          </div>

          <Button size="sm" className="flex-shrink-0 group">
            {partner.ctaText}
            <ExternalLink className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </TrackableAdWrapper>
  );
}
