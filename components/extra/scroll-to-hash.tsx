'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

export default function ScrollToHash() {
  const lenis = useLenis();

  useEffect(() => {
    const hash = globalThis.window?.location.hash;
    if (hash && lenis) {
      setTimeout(() => {
        lenis.scrollTo(hash, { duration: 3 });
      }, 600); // Wait for page transition to finish
    }
  }, [lenis]);

  return null;
}
