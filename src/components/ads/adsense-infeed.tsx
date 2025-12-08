'use client';

import { GoogleAd } from './google-adsense';
import { adsenseSlots } from '@/lib/ads/ad-config';

interface AdSenseInFeedProps {
  slot?: string;
  className?: string;
}

export function AdSenseInFeed({
  slot = adsenseSlots.inFeed,
  className,
}: AdSenseInFeedProps) {
  return (
    <GoogleAd
      slot={slot}
      format="auto"
      responsive
      className={className}
      style={{ minHeight: '100px' }}
    />
  );
}
