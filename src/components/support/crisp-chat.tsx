'use client';

import { useEffect } from 'react';

export function CrispChat() {
  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    if (!websiteId) {
      return;
    }

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    return () => {
      delete (window as any).$crisp;
      delete (window as any).CRISP_WEBSITE_ID;
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (crispScript) {
        crispScript.remove();
      }
    };
  }, []);

  return null;
}
