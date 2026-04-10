'use client';

import { useRouter, usePathname } from 'next/navigation';
import { triggerExitAnimation } from '@/components/motion/events';
import React, { forwardRef, type ComponentProps } from 'react';
import { m } from 'motion/react';
import Link from 'next/link';
import { clientLogger } from '@/lib/logger';

type LinkProps = ComponentProps<typeof Link>;

const TransitionLinkInner = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, onClick, ...props }, ref) => {
    const router = useRouter();
    const currentPathname = usePathname();

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      const url = typeof href === 'string' ? href : href.pathname || '';
      const isExternal = url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:');
      const isHash = url.startsWith('#');
      
      // Check if we're navigating to the same URL or just a hash on the same page
      const isSamePage = !isHash && !isExternal && (url === currentPathname || (url === '/' && (currentPathname === '/' || currentPathname === '')));

      // Let default behavior handle modifier keys (ctrl+click, etc) or external links
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || isExternal) {
        if (onClick) onClick(e as any);
        return;
      }

      e.preventDefault();
      
      // Execute original onClick (important for closing menus, etc.)
      if (onClick) {
        onClick(e as any);
      }

      // Only animate if it's a new internal page
      if (!isHash && !isSamePage) {
        try {
          await Promise.race([
            triggerExitAnimation(),
            new Promise((resolve) => setTimeout(resolve, 800)),
          ]);
        } catch (error) {
          clientLogger.error(`[TransitionLink] Exit animation failed: ${error}`);
        }
      }
      
      // Finally perform the navigation
      if (href) {
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
