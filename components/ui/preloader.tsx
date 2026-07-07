'use client';

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ROUTES } from '@/lib/constant';
import Loader from './loader';
import { useTranslations } from 'next-intl';

export default function Preloader() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const t = useTranslations('common');
  
  const videosToLoad = React.useMemo(() => Object.values(ROUTES)
    .map(route => ('media' in route ? (route as any).media : null))
    .filter(Boolean) as string[], []);

  useEffect(() => {
    if (globalThis.window !== undefined && globalThis.sessionStorage.getItem('preloaderDone') === '1') {
      setIsComplete(true);
      globalThis.dispatchEvent(new Event('preloaderComplete'));
      return;
    }

    if (videosToLoad.length === 0) {
      setIsComplete(true);
      globalThis.dispatchEvent(new Event('preloaderComplete'));
      return;
    }

    let loaded = 0;
    let hasCompleted = false;
    const videoElements: HTMLVideoElement[] = [];

    const handleLoad = () => {
      if (hasCompleted) return;
      loaded++;
      setLoadedCount(loaded);
      if (loaded >= videosToLoad.length) {
        hasCompleted = true;
        setTimeout(() => {
          if (globalThis.window !== undefined) globalThis.sessionStorage.setItem('preloaderDone', '1');
          setIsComplete(true);
          globalThis.dispatchEvent(new Event('preloaderComplete'));
        }, 600);
      }
    };

    videosToLoad.forEach(src => {
      const video = document.createElement('video');
      video.src = src;
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      
      video.addEventListener('canplaythrough', handleLoad, { once: true });
      video.addEventListener('error', handleLoad, { once: true });
      
      videoElements.push(video);
      video.load();
    });

    return () => {
      videoElements.forEach(video => {
        video.removeEventListener('canplaythrough', handleLoad);
        video.removeEventListener('error', handleLoad);
        video.removeAttribute('src');
        video.load();
      });
    };
  }, [videosToLoad]);

  const progressLine = Math.min((loadedCount / Math.max(1, videosToLoad.length)) * 100, 100);

  return (
    <AnimatePresence>
      {!isComplete && (
        <m.div
          key="global-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-background pointer-events-auto"
        >
          <m.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="flex flex-col items-center"
          >
            <Loader />
            
            <div className="mt-12 w-48 sm:w-64 h-[2px] bg-foreground/10 rounded-full overflow-hidden relative">
              <m.div 
                className="absolute top-0 left-0 h-full bg-foreground"
                initial={{ width: '0%' }}
                animate={{ width: `${progressLine}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <m.p 
              className="mt-4 font-heading text-foreground/50 uppercase text-xs tracking-[0.25em]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('loader')}
            </m.p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
