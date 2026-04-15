'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform } from 'motion/react';
import { isGif } from '@/lib/utils';

interface ScrollParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ScrollParallaxImage({
  src,
  alt,
  className = '',
  priority = false,
}: Readonly<ScrollParallaxImageProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of the container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'], // From entering screen bottom to leaving screen top
  });

  // The image is 120% container height. 
  // We need to move it up by 20% of the container height to perfectly align bottoms at the end.
  // -20% of container is (-20 / 120) * 100 = -16.6667% of the image element's height.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-16.6667%']);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Invisible placeholder to define the natural aspect-ratio/height of the container */}
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto invisible"
        unoptimized={isGif(src)}
        priority={priority}
      />

      {/* Absolutely positioned parallax layer (20% taller than the container) */}
      <m.div
        style={{
          y,
          height: '120%',
        }}
        className="absolute top-0 left-0 w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          unoptimized={isGif(src)}
          priority={priority}
          sizes="100vw"
        />
      </m.div>
    </div>
  );
}
