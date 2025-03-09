import { useState, useEffect } from 'react';

export function useAdBlocker(): boolean {
  const [adBlocked, setAdBlocked] = useState<boolean>(false);

  useEffect(() => {
    async function checkAdBlocker(): Promise<void> {
      try {
        const adUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        const response = await fetch(adUrl, { method: 'HEAD' });
        setAdBlocked(!response.ok);
      } catch (err: unknown) {
        // If any error occurs (likely due to ad blocker interference), assume ad blocking is enabled.
        setAdBlocked(true);
      }
    }

    checkAdBlocker();
  }, []);

  return adBlocked;
}
