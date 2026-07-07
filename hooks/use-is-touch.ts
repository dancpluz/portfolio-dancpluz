import { useMediaQuery } from './use-media-query';

/**
 * True on touch-primary devices (no hover / coarse pointer). Gate for every
 * mouse-only interaction (parallax, magnet, cursor-preview) and for reducing
 * canvas-effect cost on mobile. SSR-safe: `false` until mount.
 */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)');
}

/**
 * True when the user asked the OS to minimize motion. Additional off-switch for
 * heavy/animated effects.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
