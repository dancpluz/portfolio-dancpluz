'use client';

import { AnimatePresence, m } from 'motion/react';
import FlowingNav from './flowing-nav';
import { useMenu } from '@/hooks/use-menu';
import Socials from './socials';
import Image from 'next/image';

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
          <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center relative overflow-hidden'>
            <AnimatePresence>
              <m.div
                key={hoverMedia.src}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className='absolute inset-0 bg-surface/50'
              >
                {hoverMedia.isVideo ? (
                  <video
                    src={hoverMedia.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='object-cover w-full h-full'
                  />
                ) : (
                  <Image
                    src={hoverMedia.src}
                    alt='Image'
                    fill
                    className='object-cover'
                    priority
                  />
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
