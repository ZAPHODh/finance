'use client';

import { GoogleAd } from './google-adsense';

interface AdSenseSidebarProps {
  slot: string;
  className?: string;
  sticky?: boolean;
}

export function AdSenseSidebar({ slot, className, sticky = true }: AdSenseSidebarProps) {
  return (
    <div className={sticky ? 'sticky top-4' : ''}>
      <GoogleAd
        slot={slot}
        format="vertical"
        responsive={true}
        className={className}
        style={{ minWidth: '160px', minHeight: '600px' }}
      />
    </div>
  );
}
