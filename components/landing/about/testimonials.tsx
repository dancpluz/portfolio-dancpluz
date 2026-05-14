'use client';

import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { cn, formatDateLocal } from '@/lib/utils';
import { Testimonial } from '@/types/api';
import Link from 'next/link';
import CanvasImage, { type ImageEffect } from '@/components/extra/canvas-image';
import { useAutoFitText } from '@/hooks/use-auto-fit-text';
import { useLocale } from 'next-intl';
import { AnimatePresence, m } from 'motion/react';
import { ExternalLink, Heart, Share } from '@/components/ui/svg';
import { useClickOutside } from '@/hooks/use-click-outside';

const PROFILE_EFFECTS: ImageEffect[] = [
  {
    type: 'pixelate',
    enabled: true,
    params: { size: 4, maintainAspect: true },
  },
  {
    type: 'posterize',
    enabled: true,
    params: { levels: 12, preserveHue: false },
  },
  {
    type: 'vibrance',
    enabled: true,
    params: { vibrance: 0.35, saturation: 0.15 },
  },
  { type: 'exposure', enabled: true, params: { exposure: 0, contrast: 0.1 } },
];

// Spacing between each stacked card (in px)
const X_STEP = 48;
const Y_STEP = 12;
const SM_X_STEP = 128;
const SM_Y_STEP = 24;

// Extra push distance when a card behind is hovered
const PUSH_X = 24;
const PUSH_Y = 16;
const SM_PUSH_X = 48;
const SM_PUSH_Y = 32;

// Lift when a card is hovered
const HOVER_LIFT = 30;
const SM_HOVER_LIFT = 40;

const SKEW = -8;

const OVERLAY_CLASSES =
  'before:absolute before:w-full before:h-full before:content-[""] before:bg-blend-overlay before:bg-surface/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0';

function getMockStat(seed: string, min: number, max: number, offset = 0) {
  let hash = 0;
  const combinedSeed = seed + offset.toString();
  for (let i = 0; i < combinedSeed.length; i++) {
    hash = (combinedSeed.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  }
  return (Math.abs(hash) % (max - min + 1)) + min;
}

const AutoFitText = memo(function AutoFitText({
  text,
  maxWidth,
  maxHeight,
  baseSize,
}: {
  text: string;
  maxWidth: number;
  maxHeight: number;
  baseSize: number;
}) {
  const fontSize = useAutoFitText({
    text,
    maxWidth,
    maxHeight,
    baseSize,
    minSize: 8,
    lineHeightMultiplier: 1.625,
  });

  return (
    <p
      className='text-foreground font-text mb-2 sm:mb-3 leading-relaxed wrap-break-word'
      style={{ fontSize: `${fontSize}px` }}
    >
      {text}
    </p>
  );
});

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  x: number;
  y: number;
  isLast: boolean;
  isSelected: boolean;
  isSm: boolean;
  onSelect: (index: number) => void;
  onDeselect: () => void;
  onHover: () => void;
  onLeave: () => void;
}

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  index,
  x,
  y,
  isLast,
  isSelected,
  isSm,
  onSelect,
  onDeselect,
  onHover,
  onLeave,
}: Readonly<TestimonialCardProps>) {
  const likes = useMemo(
    () => getMockStat(testimonial.id, 10, 700, 1),
    [testimonial.id],
  );
  const retweets = useMemo(
    () => getMockStat(testimonial.id, 1, 150, 2),
    [testimonial.id],
  );
  const locale = useLocale();

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSelected) {
        onDeselect();
      } else {
        onSelect(index);
      }
    },
    [isSelected, onSelect, onDeselect, index],
  );

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <m.div
      layout
      onClick={handleCardClick}
      onMouseEnter={isSelected ? undefined : onHover}
      onMouseLeave={isSelected ? undefined : onLeave}
      animate={{
        x: isSelected ? 0 : x,
        y: isSelected ? 0 : y,
        skewY: isSelected ? 0 : SKEW,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 28,
      }}
      className={cn(
        'relative flex h-auto min-h-[140px] sm:min-h-[180px] w-[260px] sm:w-[380px] select-none flex-col pixel-corners-border backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-4 cursor-pointer font-heading transition-[filter] duration-500',
        isSelected && 'shadow-xl z-50',
        !isLast && !isSelected && OVERLAY_CLASSES,
      )}
    >
      <AnimatePresence>
        {isSelected && testimonial.url && (
          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className='absolute top-3 right-3 z-50'
          >
            <Link
              href={testimonial.url}
              target='_blank'
              rel='noopener noreferrer'
              onClick={handleLinkClick}
              className='flex items-center justify-center size-8 rounded-full bg-primary text-accent-2 hover:scale-110 transition-transform'
            >
              <ExternalLink className='size-4' />
            </Link>
          </m.div>
        )}
      </AnimatePresence>
      <div className='flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3'>
        <div className='size-9 sm:size-12 rounded-full flex items-center justify-center pixel-corners-small overflow-hidden shrink-0'>
          {testimonial.profileUrl ? (
            <CanvasImage
              src={testimonial.profileUrl}
              alt={testimonial.title}
              effects={PROFILE_EFFECTS}
            />
          ) : (
            <span className='text-lg sm:text-2xl'>🐸</span>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-1'>
            <span className='font-bold text-foreground truncate text-xs sm:text-base'>
              {testimonial.title}
            </span>
          </div>
          <span className='text-foreground text-xs sm:text-sm'>
            {testimonial.subtitle}
          </span>
        </div>
      </div>
      <AutoFitText
        text={testimonial.content}
        maxWidth={isSm ? 348 : 236}
        maxHeight={isSm ? 100 : 60}
        baseSize={isSm ? 15 : 12}
      />
      <div className='flex items-center justify-between text-foreground text-[10px] sm:text-sm mt-auto'>
        <span>{formatDateLocal(testimonial.date, locale)}</span>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Heart className='size-4 text-accent-1' />
            <span>{likes}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Share className='size-4 text-accent-3' />
            <span>{retweets}</span>
          </div>
        </div>
      </div>
    </m.div>
  );
});

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({
  testimonials,
}: Readonly<TestimonialsProps>) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const total = testimonials.length;
  const focusedIndex = selectedIndex === null ? hoveredIndex : null;

  const [isSm, setIsSm] = useState(false);

  useEffect(() => {
    const updateSize = () => setIsSm(globalThis.window.innerWidth >= 640);
    updateSize();
    globalThis.addEventListener('resize', updateSize);
    return () => globalThis.removeEventListener('resize', updateSize);
  }, []);

  const cardPositions = useMemo(() => {
    const xStep = isSm ? SM_X_STEP : X_STEP;
    const yStep = isSm ? SM_Y_STEP : Y_STEP;
    const pushXVal = isSm ? SM_PUSH_X : PUSH_X;
    const pushYVal = isSm ? SM_PUSH_Y : PUSH_Y;

    const xOffset = -((total - 1) * xStep) / 2;
    const yOffset = -((total - 1) * yStep) / 2;

    return testimonials.map((_, index) => {
      let x = index * xStep + xOffset;
      let y = index * yStep + yOffset;

      if (focusedIndex !== null && index > focusedIndex) {
        const distance = index - focusedIndex;
        x += distance * pushXVal;
        y += distance * pushYVal;
      }

      if (focusedIndex === index) {
        y -= isSm ? SM_HOVER_LIFT : HOVER_LIFT;
      }

      return { x, y };
    });
  }, [testimonials, focusedIndex, total, isSm]);

  const handleHover = useCallback(
    (index: number) => setHoveredIndex(index),
    [],
  );

  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    setHoveredIndex(null);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDeselect = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useClickOutside(containerRef, handleDeselect, selectedIndex !== null);

  return (
    <div
      ref={containerRef}
      className='grid [grid-template-areas:"stack"] place-items-center mx-auto w-fit my-48 perspective-[1000px]'
    >
      {testimonials.map((testimonial, index) => {
        const isSelected = selectedIndex === index;
        return (
          <m.div
            key={testimonial.id}
            className='[grid-area:stack]'
            style={{ zIndex: isSelected ? 50 : index }}
            initial={{ opacity: 0, x: 120, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
            transition={{
              duration: 3.2,
              delay: index * 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TestimonialCard
              testimonial={testimonial}
              index={index}
              x={cardPositions[index].x}
              y={cardPositions[index].y}
              isLast={index === total - 1}
              isSelected={isSelected}
              isSm={isSm}
              onSelect={handleSelect}
              onDeselect={handleDeselect}
              onHover={() => handleHover(index)}
              onLeave={handleLeave}
            />
          </m.div>
        );
      })}
    </div>
  );
}
