import { useLenis } from 'lenis/react';
import { useCallback } from 'react';

export function useSectionScroll() {
  const lenis = useLenis();

  const handleScroll = useCallback((path: string, onClick?: () => void, timeoutMs: number = 500) => {
    return (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>) => {
      const currentPath = globalThis.window?.location.pathname;
      const pathBase = path.split('#')[0];
      const isTargetingCurrentPage =
        path === currentPath ||
        (path.includes('#') &&
          (pathBase === currentPath ||
            (pathBase === '' && currentPath === '/')));

      if (isTargetingCurrentPage) {
        e.preventDefault();
        if (onClick) onClick();

        const target = path.includes('#') ? path.substring(path.indexOf('#')) : 0;

        setTimeout(() => {
          lenis?.scrollTo(target, { duration: 3 });
        }, timeoutMs);
        return;
      }

      if (onClick) onClick();
    };
  }, [lenis]);

  return handleScroll;
}
