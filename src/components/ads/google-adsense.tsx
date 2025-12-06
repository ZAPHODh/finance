'use client';

import { useEffect, useRef } from 'react';

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

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={style}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1727720137782691"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        aria-label="Advertisement"
      />
    </div>
  );
}
