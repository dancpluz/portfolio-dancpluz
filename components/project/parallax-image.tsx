'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { m, useMotionValue, useSpring, useTransform } from 'motion/react';
import { isGif } from '@/lib/utils';

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** How much bigger the image is than the container (e.g. 1.2 = 20% overflow on each axis) */
  overflow?: number;
  /** Spring stiffness — lower = more inertia */
  stiffness?: number;
  /** Spring damping — higher = less oscillation */
  damping?: number;
  /** Track mouse globally (window-level) instead of only inside the container */
  global?: boolean;
  className?: string;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  overflow = 1.15,
  stiffness = 120,
  damping = 30,
  global = false,
  className = '',
  priority = false,
}: Readonly<ParallaxImageProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness, damping, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const overflowPercent = (overflow - 1) * 100;

  const x = useTransform(smoothX, [0, 1], [0, -overflowPercent]);
  const y = useTransform(smoothY, [0, 1], [0, -overflowPercent]);

  const handleLocalMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (global || !containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - left) / width);
      mouseY.set((e.clientY - top) / height);
    },
    [global, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    if (global) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [global, mouseX, mouseY]);

  useEffect(() => {
    if (!global) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth;
      const cy = e.clientY / window.innerHeight;
      mouseX.set(Math.max(0, Math.min(1, cx)));
      mouseY.set(Math.max(0, Math.min(1, cy)));
    };

    globalThis.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => globalThis.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [global, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleLocalMouseMove}
      onMouseLeave={handleMouseLeave}
      role='presentation'
    >
      <m.div
        className='absolute top-0 left-0'
        style={{
          width: `${overflow * 100}%`,
          height: `${overflow * 100}%`,
          x: useTransform(x, (v) => `${v}%`),
          y: useTransform(y, (v) => `${v}%`),
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          unoptimized={isGif(src)}
          priority={priority}
          onLoad={() => setLoaded(true)}
        />
      </m.div>
    </div>
  );
}

