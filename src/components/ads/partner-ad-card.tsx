import { getScopedI18n } from '@/locales/server';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { TrackableAdWrapper } from './trackable-ad-wrapper';
import type { Partner } from '@prisma/client';

interface PartnerAdCardProps {
  partner: Partner;
  location: string;
  size?: 'small' | 'medium' | 'large';
}

export async function PartnerAdCard({
  partner,
  location,
  size = 'medium',
}: PartnerAdCardProps) {
  const t = await getScopedI18n('dashboard.ads');

  const cardClasses = {
    small: 'w-full',
    medium: 'w-full',
    large: 'w-full',
  };

  return (
    <TrackableAdWrapper
      partnerId={partner.id}
      partnerName={partner.name}
      category={partner.category}
      location={location}
      ctaUrl={partner.ctaUrl}
    >
      <Card className={`${cardClasses[size]} hover:shadow-lg transition-shadow`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {partner.logoUrl && (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-10 w-10 rounded object-contain"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{partner.name}</h3>
                <p className="text-sm text-muted-foreground">{partner.tagline}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t('sponsored')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm mb-3">{partner.benefit}</p>
          {partner.discountRate && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <span className="font-bold text-lg">
                {t('savingsUpTo', { discount: partner.discountRate })}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button variant="default" className="w-full group">
            {partner.ctaText}
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </TrackableAdWrapper>
  );
}
