'use client';

import { useEffect, useRef, useState } from 'react';
import { m, useScroll, useTransform, useInView } from 'motion/react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Experience } from '@/types/api';
import BracketText from '@/components/ui/bracket-text';
import { formatDateLocal } from '@/lib/utils';
import SplitText from '@/components/motion/text/split-text';
import ScrollRevealText from '@/components/motion/text/scroll-reveal-text';

// ─── Single entry row ─────────────────────────────────────────────────────────
function EntryNode({
  exp,
  index,
}: Readonly<{ exp: Experience; index: number }>) {
  const locale = useLocale();
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { margin: '-15% 0px -15% 0px' });

  const title = locale === 'en' ? exp.titleEn : exp.titlePt;
  const description = locale === 'en' ? exp.descriptionEn : exp.descriptionPt;

  const accentClasses = ['text-accent-1', 'text-accent-2', 'text-accent-3'];
  const accentClass = accentClasses[index % accentClasses.length];
  const accentColors = [
    'var(--color-accent-1)',
    'var(--color-accent-2)',
    'var(--color-accent-3)',
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      ref={rowRef}
      className='grid grid-cols-[auto_1fr_auto] items-center justify-center gap-6 md:gap-32 pt-20 md:pt-32 min-h-[80vh]'
    >
      {/* ── Col 1: dot + date on the same row ─────────── */}
      <div className='sticky top-32 self-start flex flex-row items-center gap-4 z-20 shrink-0'>
        {/* Circle node */}
        <m.div
          className='size-7 rounded-full bg-foreground border-2 flex items-center justify-center shrink-0 border-foreground'
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isInView ? 1 : 0.4, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        >
          {exp.iconUrl ? (
            <Image
              src={exp.iconUrl}
              alt={exp.iconAlt || title}
              width={20}
              height={20}
              className='object-contain theme-invert-0 size-5'
              unoptimized
            />
          ) : (
            <div
              className='w-2.5 h-2.5 rounded-full'
              style={{ backgroundColor: accent }}
            />
          )}
        </m.div>

        {/* Date to the right of the dot */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <BracketText
            text={formatDateLocal(exp.startDate, locale, true)}
            accentClass={accentClass}
            className='text-xl md:text-3xl whitespace-nowrap'
          />
        </m.div>
      </div>

      {/* ── Col 2: title + description ───────────────── */}
      <div className='flex flex-col gap-2 overflow-hidden'>
        <SplitText
          text={title}
          tag='h3'
          className='text-2xl md:text-3xl font-bold font-heading text-foreground leading-tight'
          textAlign='left'
          delay={40}
        />

        {description && (
          <ScrollRevealText
            containerClassName='!my-0 !rotate-0'
            textClassName='text-foreground text-base md:text-lg leading-relaxed max-w-prose !font-sans !font-normal !text-left'
            baseRotation={3}
            blurStrength={1}
          >
            {description}
          </ScrollRevealText>
        )}
      </div>

      {/* ── Col 3: big icon with spring in/out animation ─ */}
      <div className='flex items-center justify-end shrink-0'>
        {exp.iconUrl ? (
          <m.div
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.6,
              filter: isInView ? 'blur(0px)' : 'blur(8px)',
            }}
            transition={{ duration: 0.55, ease: [0.175, 0.885, 0.32, 1.275] }}
            className='relative w-20 h-20 md:w-28 md:h-28 shrink-0'
          >
            <Image
              src={exp.iconUrl}
              alt={exp.iconAlt || title}
              fill
              className='object-contain theme-invert-1'
              unoptimized
            />
          </m.div>
        ) : (
          <m.div
            animate={{
              opacity: isInView ? 0.15 : 0,
              scale: isInView ? 1 : 0.5,
            }}
            transition={{ duration: 0.45 }}
            className='w-20 h-20 md:w-28 md:h-28 rounded-full border-2'
            style={{ borderColor: accent }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Timeline({
  experiences,
}: Readonly<{ experiences: Experience[] }>) {
  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (innerRef.current)
        setHeight(innerRef.current.getBoundingClientRect().height);
    });
    observer.observe(innerRef.current);
    setHeight(innerRef.current.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 15%', 'end 60%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  if (experiences.length === 0) return null;

  return (
    <div ref={containerRef} className='w-full px-8 md:px-24 lg:px-48'>
      <div ref={innerRef} className='relative pb-20'>
        {experiences.map((exp, index) => (
          <EntryNode key={exp.id} exp={exp} index={index} />
        ))}

        {/* Vertical track */}
        <div
          className='absolute left-3.5 top-0 -translate-x-px w-[2px] overflow-hidden pointer-events-none'
          style={{ height: height + 'px' }}
        >
          <div
            className='absolute inset-0 w-[2px]'
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, var(--color-foreground) 10%, var(--color-foreground) 90%, transparent 100%)',
              opacity: 0.1,
            }}
          />
          <m.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className='absolute inset-x-0 top-0 w-[2px] rounded-full bg-foreground'
          />
        </div>
      </div>
    </div>
  );
}
