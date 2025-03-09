import { useState, useEffect } from 'react';

export function useAdBlocker(): boolean {
  const [adBlocked, setAdBlocked] = useState<boolean>(false);

  useEffect(() => {
    async function checkAdBlocker(): Promise<void> {
      try {
        // Example detection: attempt to fetch an ad-related resource.
        // Replace this logic with your actual ad blocker detection if needed.
        const adUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        const response = await fetch(adUrl, { method: 'HEAD' });
        // If the fetch fails (response.ok is false), assume an ad blocker is active.
        setAdBlocked(!response.ok);
      } catch (err: unknown) {
        // On error (possibly blocked by an ad blocker), assume ad blocking is enabled.
        setAdBlocked(true);
      }
    }

    checkAdBlocker();
  }, []);

  return adBlocked;
}
