'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { page_path: pathname });

    return () => {
      document.head.removeChild(script);
    };
  }, [gaId]);

  useEffect(() => {
    if (!gaId || !window.gtag) return;
    window.gtag('config', gaId, { page_path: pathname });
  }, [gaId, pathname]);

  return null;
}
