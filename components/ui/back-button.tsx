'use client';

import { useRouter } from 'next/navigation';
import { triggerExitAnimation } from '@/components/motion/events';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { m } from 'motion/react';

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
}

export default function BackButton({
  fallbackHref = '/blog',
  className = '',
}: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we have history from our own site
    if (typeof window !== 'undefined' && window.history.length > 1) {
      try {
        const referrerUrl = new URL(document.referrer);
        // Only set we can go back if the referrer gives us an actual different page path,
        // not just a hash change within the exact same pathname
        if (
          referrerUrl.hostname === window.location.hostname &&
          referrerUrl.pathname !== window.location.pathname
        ) {
          setCanGoBack(true);
        }
      } catch (e) {
        // Fallback for invalid URLs in referrer
        setCanGoBack(false);
      }
    }
  }, []);

  const handleBack = async (e: React.MouseEvent) => {
    e.preventDefault();
    await triggerExitAnimation();

    if (canGoBack) {
      if (typeof window !== 'undefined') {
        // Because users click on multiple TableOfContents headers (adding `#` to the URL history)
        // we don't want router.back() to just jump between headings.
        // We navigate firmly to the fallback if we don't safely know how many headings were clicked.
        const hasHashInHistory = window.location.hash !== '';

        if (hasHashInHistory) {
          router.push(fallbackHref);
        } else {
          router.back();
        }
      } else {
        router.back();
      }
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <m.button
      onClick={handleBack}
      className={`group flex p-6 -m-6 items-center gap-2 hover:text-accent-1 duration-800 transition-colors ${className}`}
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
      <ArrowLeft
        size={32}
        className='transition-transform group-hover:-translate-x-1'
      />
    </m.button>
  );
}
