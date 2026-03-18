import { useLenis } from 'lenis/react';

export function useSectionScroll() {
  const lenis = useLenis();

  const handleScroll = (path: string, onClick?: () => void) => {
    return (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
      const isHome = globalThis.window?.location.pathname === '/';

      if (path.includes('#') && isHome) {
        e.preventDefault();
        if (onClick) onClick();
        const hash = path.substring(path.indexOf('#'));
        setTimeout(() => {
          lenis?.scrollTo(hash, { duration: 3 });
        }, 500);
        return;
      }

      if (path === '/' && isHome) {
        e.preventDefault();
        if (onClick) onClick();
        setTimeout(() => {
          lenis?.scrollTo(0, { duration: 3 });
        }, 500);
        return;
      }

      if (onClick) onClick();
    };
  };

  return handleScroll;
}
