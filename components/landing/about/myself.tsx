'use client';

import { Polaroid } from '@/types/api';
import Image from 'next/image';
import Folder from './folder';
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { useIsTouch } from '@/hooks/use-is-touch';

export default function Myself({
  polaroids,
}: Readonly<{ polaroids: Polaroid[] }>) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Touch devices have no cursor — skip the mouse parallax entirely and let
    // the scroll-driven drift below take over.
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, isTouch]);

  // Scroll-driven drift for touch devices (no cursor). Smaller magnitudes so
  // folders never overflow the narrow mobile column.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const sy1 = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const sy2 = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const sy3 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Mouse parallax (desktop).
  // Green
  const mx1 = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const my1 = useTransform(smoothMouseY, [-1, 1], [-20, 20]);

  // Pink
  const mx2 = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
  const my2 = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

  // Cyan
  const mx3 = useTransform(smoothMouseX, [-1, 1], [-80, 80]);
  const my3 = useTransform(smoothMouseY, [-1, 1], [-40, 40]);

  // On touch, x stays put and y follows scroll; on desktop, both follow cursor.
  const x1 = isTouch ? 0 : mx1;
  const y1 = isTouch ? sy1 : my1;
  const x2 = isTouch ? 0 : mx2;
  const y2 = isTouch ? sy2 : my2;
  const x3 = isTouch ? 0 : mx3;
  const y3 = isTouch ? sy3 : my3;

  const [f1Polaroids, f2Polaroids, f3Polaroids] = useMemo(() => {
    const list1: Polaroid[] = [];
    const list2: Polaroid[] = [];
    const list3: Polaroid[] = [];
    
    const source = polaroids || [];
    source.forEach((p, i) => {
      if (i % 3 === 0) list1.push(p);
      else if (i % 3 === 1) list2.push(p);
      else list3.push(p);
    });
    
    return [list1, list2, list3];
  }, [polaroids]);

  return (
    <div className='w-full relative overflow-visible mb-16'>
      <div
        ref={ref}
        className='w-full flex justify-center'
      >
        <div className='relative w-110 max-w-full aspect-11/15'>
          {/* Folders with Parallax (Rendered behind the image) */}
          
          {/* Green */}
          <m.div
            className='absolute top-1/3 left-[7%] z-0 pointer-events-auto'
            style={{ x: x1, y: y1 }}
          >
            <Folder color='#00f248' size={1} polaroids={f1Polaroids} />
          </m.div>

          {/* Pink */}
          <m.div
            className='absolute top-1/2 right-[-11%] z-0 pointer-events-auto'
            style={{ x: x2, y: y2 }}
          >
            <Folder color='#ff00ff' size={1.1} polaroids={f2Polaroids} />
          </m.div>

          {/* Cyan */}
          <m.div
            className='absolute bottom-[4%] left-[-2%] z-15 pointer-events-auto shadow-xl'
            style={{ x: x3, y: y3 }}
          >
            <Folder color='#00fbfe' size={1.25} polaroids={f3Polaroids} />
          </m.div>

          {/* Image and Effects (Isolated Stacking Context) */}
          <div
            className='absolute inset-0 z-10 pointer-events-none mask-[linear-gradient(to_bottom,black_70%,transparent_100%)]'
            style={{ isolation: 'isolate' }}
          >
            <Image
              src='/img/daniel.png'
              alt='Daniel Luz Developer'
              fill
              className='object-contain'
            />

            {/* Gradient Blur Effect at the bottom */}
            <div className='absolute inset-0 backdrop-blur-[6px] mask-[linear-gradient(to_bottom,transparent_80%,black_100%)] z-20' />
          </div>
        </div>
      </div>
    </div>
  );
}
