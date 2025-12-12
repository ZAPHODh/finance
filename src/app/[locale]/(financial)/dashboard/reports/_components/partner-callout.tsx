'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingDown, Sparkles } from 'lucide-react';
import type { PartnerRecommendation } from '@/lib/reports/types';

interface PartnerCalloutProps {
  recommendation: PartnerRecommendation;
}

export function PartnerCallout({ recommendation }: PartnerCalloutProps) {
  const { partner, potentialSavings, message } = recommendation;

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{partner.tagline}</CardTitle>
          </div>
          {partner.discountRate && (
            <Badge variant="secondary" className="text-sm">
              {partner.discountRate}% OFF
            </Badge>
          )}
        </div>
        <CardDescription className="text-base pt-2">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <TrendingDown className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-3xl font-bold text-green-600">
              R$ {potentialSavings.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              de economia potencial por mês
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground border-l-2 border-primary pl-4">
          {partner.benefit}
        </p>

        <Button asChild className="w-full">
          <a href={partner.ctaUrl} target="_blank" rel="noopener noreferrer">
            {partner.ctaText}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
