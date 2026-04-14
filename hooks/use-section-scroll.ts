import { useLenis } from 'lenis/react';
import { useCallback } from 'react';

export function useSectionScroll() {
  const lenis = useLenis();

  const handleScroll = useCallback((path: string, onClick?: () => void, timeoutMs: number = 500) => {
    return (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>) => {
      const isHome = globalThis.window?.location.pathname === '/';

      if (path.includes('#') && isHome) {
        e.preventDefault();
        if (onClick) onClick();
        const hash = path.substring(path.indexOf('#'));
        setTimeout(() => {
          lenis?.scrollTo(hash, { duration: 3 });
        }, timeoutMs);
        return;
      }

      if (path === '/' && isHome) {
        e.preventDefault();
        if (onClick) onClick();
        setTimeout(() => {
          lenis?.scrollTo(0, { duration: 3 });
        }, timeoutMs);
        return;
      }

      if (onClick) onClick();
    };
  }, [lenis]);

  return handleScroll;
}
