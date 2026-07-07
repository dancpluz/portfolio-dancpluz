'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'motion/react';
import ScrollRevealText from '@/components/motion/text/scroll-reveal-text';
import Myself from './myself';
import LabelField from './label-field';
import { Polaroid } from '@/types/api';

interface AboutIntroProps {
  name: string;
  tagline: string;
  polaroids: Polaroid[];
}

/**
 * Name that fades/blurs in as it enters the viewport and back out as it
 * leaves — re-triggered on every scroll pass (not a one-shot reveal).
 */
function ScrollName({ text }: Readonly<{ text: string }>) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [50, 0, 0, -50]);
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <m.h3
      ref={ref}
      style={{ opacity, y, filter }}
      className='font-heading text-9xl uppercase leading-[0.9] will-change-[transform,opacity,filter] flex flex-col items-center lg:items-start text-center lg:text-left gap-1'
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className='block'>
          {word}
        </span>
      ))}
    </m.h3>
  );
}

export default function AboutIntro({
  name,
  tagline,
  polaroids,
}: Readonly<AboutIntroProps>) {
  return (
    <div className='relative flex w-full flex-col overflow-hidden py-16'>
      {/* Ambient labels rising and popping centered around the photo area */}
      <div className='absolute inset-0 flex justify-center pointer-events-none z-0'>
        <div className='relative w-full max-w-3xl h-full'>
          <LabelField />
        </div>
      </div>

      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-24 w-full max-w-full'>
        {/* Left Column: Name */}
        <div className='w-full flex justify-center lg:justify-start'>
          <ScrollName text={name} />
        </div>

        {/* Center Column: Photo */}
        <div className='w-full max-w-[440px] flex justify-center relative z-10'>
          <Myself polaroids={polaroids} />
        </div>

        {/* Right Column: Tagline */}
        <div className='w-full flex justify-center lg:justify-end lg:max-w-md'>
          <ScrollRevealText
            baseOpacity={0.08}
            blurStrength={6}
            baseRotation={2}
            containerClassName='!my-1 max-w-3xl overflow-visible py-2'
            textClassName='text-sm md:text-3xl font-text text-foreground text-center lg:text-right !leading-tight'
          >
            {tagline}
          </ScrollRevealText>
        </div>
      </div>
    </div>
  );
}
