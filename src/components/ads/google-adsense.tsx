'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = '',
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!adRef.current) return;

    // Check if ad is already loaded to prevent duplicate pushes
    const currentAd = adRef.current;
    if (currentAd.getAttribute('data-ad-status') === 'filled') {
      return;
    }

    try {
      // Small delay to ensure the DOM is ready
      const timeoutId = setTimeout(() => {
        if (window.adsbygoogle && currentAd) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [pathname, searchParams]);

  // Don't render in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`flex items-center justify-center bg-muted/50 border-2 border-dashed rounded-lg ${className}`} style={style}>
        <div className="p-4 text-center text-muted-foreground text-sm">
          <p className="font-semibold">AdSense Ad Placeholder</p>
          <p className="text-xs mt-1">Slot: {slot}</p>
          <p className="text-xs">Ads only show in production</p>
        </div>
      </div>
    );
  }

  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;

  if (!adClient) {
    console.warn('NEXT_PUBLIC_GOOGLE_ADSENSE is not configured');
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={style}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        aria-label="Advertisement"
      />
    </div>
  );
}
