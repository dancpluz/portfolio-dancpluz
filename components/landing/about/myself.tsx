'use client';

import { Polaroid } from '@/types/api';
import Image from 'next/image';
import Folder from './folder';
import { m, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useRef } from 'react';

export default function Myself({
  polaroids,
}: Readonly<{ polaroids: Polaroid[] }>) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Depth 1 (closest)
  const x1 = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
  const y1 = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

  // Depth 2 (medium)
  const x2 = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const y2 = useTransform(smoothMouseY, [-1, 1], [-20, 20]);

  // Depth 3 (farthest)
  const x3 = useTransform(smoothMouseX, [-1, 1], [-80, 80]);
  const y3 = useTransform(smoothMouseY, [-1, 1], [-40, 40]);

  return (
    <section className='w-full relative overflow-visible'>
      <div
        ref={ref}
        className='w-full flex justify-center'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role='presentation'
      >
        <div className='relative w-110 max-w-full aspect-11/15'>
          {/* Folders with Parallax (Rendered behind the image) */}
          <m.div
            className='absolute top-1/3 left-[7%] z-0 pointer-events-auto'
            style={{ x: x2, y: y2 }}
          >
            <Folder color='#00f248' size={1} polaroids={polaroids || []} />
          </m.div>

          <m.div
            className='absolute top-1/2 -right-[11%] z-0 pointer-events-auto'
            style={{ x: x1, y: y1 }}
          >
            <Folder color='#ff00ff' size={1.1} polaroids={polaroids || []} />
          </m.div>

          <m.div
            className='absolute bottom-[4%] -left-[2%] z-15 pointer-events-auto shadow-xl'
            style={{ x: x3, y: y3 }}
          >
            <Folder color='#00fbfe' size={1.25} polaroids={polaroids || []} />
          </m.div>

          {/* Image and Effects (Isolated Stacking Context) */}
          <div
            className='absolute inset-0 z-10 pointer-events-none mask-[linear-gradient(to_bottom,black_70%,transparent_100%)]'
            style={{ isolation: 'isolate' }}
          >
            <Image
              src='/daniel.webp'
              alt='Daniel Luz Developer'
              fill
              className='object-contain'
            />

            {/* Gradient Blur Effect at the bottom */}
            <div className='absolute inset-0 backdrop-blur-[6px] mask-[linear-gradient(to_bottom,transparent_80%,black_100%)] z-20' />
          </div>
        </div>
      </div>
    </section>
  );
}
