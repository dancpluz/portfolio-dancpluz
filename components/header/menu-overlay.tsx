'use client';

import { AnimatePresence, m } from 'motion/react';
import FlowingNav from './flowing-nav';
import { useMenu } from '@/hooks/use-menu';
import Socials from './socials';
import Image from 'next/image';
import { ROUTES } from '@/lib/constant';

export default function MenuOverlay() {
  const { isOpen, closeMenu, hoverMedia, setHoverMedia } = useMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className={`h-screen w-full fixed inset-0 bg-surface z-30 origin-top flex flex-col lg:flex-row`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.2, ease: 'circInOut' }}
        >
          <div className='w-full lg:w-1/2 relative border-r border-foreground pt-26'>
            <div className='w-full h-4/5'>
              <FlowingNav onItemClick={closeMenu} setHoverMedia={setHoverMedia} />
            </div>
            <div className='w-full h-1/5'>
              <Socials />
            </div>
          </div>
          <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center relative overflow-hidden bg-surface'>
            {Array.from(new Set(Object.values(ROUTES).map((r: any) => r.media as string))).map((mediaUrl) => {
              const isVideo = !!new RegExp(/\.(webm|mp4|ogg)$/i).exec(mediaUrl);
              const isActive = hoverMedia?.src === mediaUrl;
              
              return (
                <m.div
                  key={mediaUrl}
                  initial={false}
                  animate={{ 
                    opacity: isActive ? 1 : 0, 
                    scale: isActive ? 1 : 0.95 
                  }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className='absolute inset-0 pointer-events-none'
                  style={{ willChange: 'opacity, transform', zIndex: isActive ? 10 : 0 }} 
                >
                  {isVideo ? (
                    <video
                      src={mediaUrl} 
                      autoPlay
                      loop
                      muted
                      playsInline
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <Image
                      src={mediaUrl || '/placeholder.jpg'}
                      alt='Preview'
                      fill
                      className='object-cover'
                      priority={isActive}
                    />
                  )}
                </m.div>
              );
            })}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
