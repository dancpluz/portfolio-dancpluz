'use client';

import { m } from 'motion/react';
import { usePageExit } from '@/hooks/use-page-exit';
import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  tag?: 'div' | 'main';
}

/**
 * Reusable component to wrap pages or sections with entrance and exit animations.
 * Entrance: Fade in and slide up from y: 100.
 * Exit: Fade out, slide back to y: 100, and scale down slightly with 3D perspective.
 */
export default function PageTransition({
  children,
  className = '',
  tag = 'div',
}: Readonly<PageTransitionProps>) {
  const isExiting = usePageExit(600);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('preloaderDone') === '1'
    ) {
      setIsPreloaderDone(true);
    }

    const handlePreloader = () => setIsPreloaderDone(true);
    window.addEventListener('preloaderComplete', handlePreloader);
    return () =>
      window.removeEventListener('preloaderComplete', handlePreloader);
  }, []);

  const Component = (tag === 'main' ? m.main : m.div) as any;

  return (
    <Component
      initial={{ opacity: 0, y: 100 }}
      animate={
        isPreloaderDone
          ? isExiting
            ? {
                opacity: 0,
                y: 100,
                z: 50,
                scale: 0.95,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              }
            : {
                opacity: 1,
                y: 0,
                z: 0,
                scale: 1,
                boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)',
              }
          : { opacity: 0, y: 100 }
      }
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className={`perspective-1000 origin-bottom ${className}`}
    >
      {children}
    </Component>
  );
}
