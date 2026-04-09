'use client';

import { useRouter } from 'next/navigation';
import { triggerExitAnimation } from '@/components/motion/events';
import { useEffect, useState } from 'react';
import { m } from 'motion/react';
import { clientLogger } from '@/lib/logger';
import { ArrowRight } from '../ui/svg';

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
}

export default function BackButton({
  fallbackHref = '/blog',
  className = '',
}: Readonly<BackButtonProps>) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we have history from our own site
    if (globalThis.window !== undefined && globalThis.window.history.length > 1) {
      try {
        const referrerUrl = new URL(globalThis.window.document.referrer);
        // Only set we can go back if the referrer gives us an actual different page path,
        // not just a hash change within the exact same pathname
        if (
          referrerUrl.hostname === globalThis.window.location.hostname &&
          referrerUrl.pathname !== globalThis.window.location.pathname
        ) {
          setCanGoBack(true);
          clientLogger.debug(`[BackButton] Can go back`);
        }
      } catch (e) {
        // Fallback for invalid URLs in referrer
        setCanGoBack(false);
        clientLogger.debug(`[BackButton] Error getting referrer: ${e}`);
      }
    }
  }, []);

  const handleBack = async (e: React.MouseEvent) => {
    e.preventDefault();
    await triggerExitAnimation();

    if (canGoBack) {
      if (globalThis.window === undefined) {
        router.back();
      } else {
        // Because users click on multiple TableOfContents headers (adding `#` to the URL history)
        // we don't want router.back() to just jump between headings.
        // We navigate firmly to the fallback if we don't safely know how many headings were clicked.
        const hasHashInHistory = globalThis.window.location.hash !== '';

        if (hasHashInHistory) {
          router.push(fallbackHref);
        } else {
          router.back();
        }
      }
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <m.button
      onClick={handleBack}
      className={`group flex p-6 -m-6 items-center gap-2 ${className}`}
      whileHover='hover'
      whileTap={{ scale: 0.95 }}
      variants={{
        hover: {
          x: [0, -8, 0],
          transition: {
            repeat: Infinity,
            duration: 1.2,
            ease: 'easeInOut',
          },
        },
      }}
    >
      <ArrowRight className='text-foreground rotate-180 group-hover:text-accent-1 duration-800 transition-colors size-5 image-rendering-[pixelated] group-hover:-translate-x-1' />
    </m.button>
  );
}
