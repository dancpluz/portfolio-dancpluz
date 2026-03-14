'use client';

import { useRouter } from 'next/navigation';
import { triggerExitAnimation } from '@/components/motion/events';
import React, { forwardRef, type ComponentProps } from 'react';
import { m } from 'motion/react';
import Link from 'next/link';

type LinkProps = ComponentProps<typeof Link>;

const TransitionLinkInner = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, onClick, ...props }, ref) => {
    const router = useRouter();

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let default behavior handle modifier keys (ctrl+click, etc)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        if (onClick) onClick(e as any);
        return;
      }

      e.preventDefault();
      
      // Execute original onClick (important for closing menus, etc.)
      if (onClick) {
        onClick(e as any);
      }

      // Trigger exit animation with a safety fallback timeout (800ms)
      // This prevents the application from hanging on pages without a transiton listener
      try {
        await Promise.race([
          triggerExitAnimation(),
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);
      } catch (error) {
        console.error('Exit animation failed:', error);
      }
      
      // Finally perform the navigation
      if (href) {
        const url = typeof href === 'string' ? href : (href.pathname || href.href || '');
        router.push(url.toString());
      }
    };

    return (
      <Link 
        ref={ref} 
        href={href} 
        onClick={handleClick} 
        {...props}
      >
        {children}
      </Link>
    );
  }
);

TransitionLinkInner.displayName = 'TransitionLinkInner';

/**
 * A specialized Link component that triggers global exit animations before navigating.
 * Wrapped with m.create to support all Framer Motion props (initial, animate, exit, etc.)
 */
const TransitionLink = m.create(TransitionLinkInner);

export default TransitionLink;
