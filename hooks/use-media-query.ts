import { useEffect, useState } from 'react';

/**
 * SSR-safe media-query hook. Returns `false` on the server and on the first
 * client render (matching SSR output to avoid hydration mismatch), then updates
 * to the real match after mount and on every subsequent change.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
