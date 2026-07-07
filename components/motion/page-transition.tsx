'use client';

import { m, type Variants } from 'motion/react';
import { usePageExit } from '@/hooks/use-page-exit';
import { useState, useEffect, useMemo } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  tag?: 'div' | 'main';
}

const variants: Variants = {
  hidden: { opacity: 0, y: 100, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 100, scale: 0.95 },
};

export default function PageTransition({
  children,
  className = '',
  tag = 'div',
}: Readonly<PageTransitionProps>) {
  const isExiting = usePageExit(600);

  // Lazy initializer: read sessionStorage on first render (client only),
  // avoiding the flash-of-hidden caused by a false → true state flip.
  const [isPreloaderDone, setIsPreloaderDone] = useState<boolean>(() => {
    if (globalThis.window === undefined) return false;
    return sessionStorage.getItem('preloaderDone') === '1';
  });

  useEffect(() => {
    const handlePreloader = () => setIsPreloaderDone(true);
    globalThis.addEventListener('preloaderComplete', handlePreloader);
    return () =>
      globalThis.removeEventListener('preloaderComplete', handlePreloader);
  }, []);

  const animateState = useMemo(() => {
    if (!isPreloaderDone) return 'hidden';
    return isExiting ? 'exit' : 'visible';
  }, [isPreloaderDone, isExiting]);

  const Component = tag === 'main' ? m.main : m.div;

  return (
    <Component
      variants={variants}
      initial='hidden'
      animate={animateState}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className={`perspective-1000 origin-bottom ${className}`}
    >
      {children}
    </Component>
  );
}
