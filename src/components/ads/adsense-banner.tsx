'use client';

import { GoogleAd } from './google-adsense';

interface AdSenseBannerProps {
  slot: string;
  className?: string;
}

export function AdSenseBanner({ slot, className }: AdSenseBannerProps) {
  return (
    <GoogleAd
      slot={slot}
      format="auto"
      responsive={true}
      className={className}
      style={{ minHeight: '90px' }}
    />
  );
}
