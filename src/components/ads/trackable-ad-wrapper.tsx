'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { trackAdImpression, trackAdClick } from '@/lib/ads/tracking';

interface TrackableAdWrapperProps {
  partnerId: string;
  partnerName: string;
  category: string;
  location: string;
  ctaUrl: string;
  children: ReactNode;
}

export function TrackableAdWrapper({
  partnerId,
  partnerName,
  category,
  location,
  ctaUrl,
  children,
}: TrackableAdWrapperProps) {
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    if (!hasTrackedImpression.current) {
      trackAdImpression({
        partnerId,
        partnerName,
        category,
        location,
      });
      hasTrackedImpression.current = true;
    }
  }, [partnerId, partnerName, category, location]);

  function handleClick() {
    trackAdClick({
      partnerId,
      partnerName,
      category,
      location,
    });
  }

  return (
    <a
      href={ctaUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block"
    >
      {children}
    </a>
  );
}
