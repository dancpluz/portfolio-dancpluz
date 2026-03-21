'use client';

import React, { memo, useCallback, useMemo, useState, useRef } from 'react';
import { cn, formatDateLocal } from '@/lib/utils';
import { Testimonial } from '@/types/api';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AnimatePresence, m } from 'motion/react';
import { ExternalLink, Heart, Share } from '@/components/ui/svg';
import { useClickOutside } from '@/hooks/use-click-outside';

// Spacing between each stacked card (in px)
const X_STEP = 48;
const Y_STEP = 12;
const SM_X_STEP = 96;
const SM_Y_STEP = 24;

// Extra push distance when a card behind is hovered
const PUSH_X = 24;
const PUSH_Y = 16;
const SM_PUSH_X = 48;
const SM_PUSH_Y = 32;

const SKEW = -8;

const OVERLAY_CLASSES =
  'before:absolute before:w-full before:h-full before:content-[""] before:bg-blend-overlay before:bg-surface/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0';

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  x: number;
  y: number;
  isLast: boolean;
  isSelected: boolean;
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
  onSelect,
  onDeselect,
  onHover,
  onLeave,
}: Readonly<TestimonialCardProps>) {
  const likes = useMemo(() => randomInRange(10, 700), []);
  const retweets = useMemo(() => randomInRange(1, 150), []);
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
        zIndex: isSelected ? 50 : index,
        filter: isSelected ? 'grayscale(0%)' : undefined,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 28,
      }}
      className={cn(
        '[grid-area:stack] relative flex h-auto min-h-[140px] sm:min-h-[180px] w-[260px] sm:w-[380px] select-none flex-col pixel-corners-border bg-card/90 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-4 cursor-pointer font-heading',
        isSelected && 'shadow-xl z-50',
        !isLast && !isSelected && OVERLAY_CLASSES,
      )}
    >
      <AnimatePresence>
        {isSelected && (
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
              className='flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform'
            >
              <ExternalLink className='size-4' />
            </Link>
          </m.div>
        )}
      </AnimatePresence>
      <div className='flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3'>
        <div className='size-9 sm:size-12 rounded-full bg-linear-to-br from-green-400 via-yellow-400 to-green-500 flex items-center justify-center pixel-corners-small overflow-hidden shrink-0'>
          {testimonial.profileUrl ? (
            <Image
              src={testimonial.profileUrl}
              alt={testimonial.title}
              width={48}
              height={48}
              className='w-full h-full object-cover'
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
      <p className='text-foreground font-text text-xs sm:text-[15px] leading-relaxed mb-2 sm:mb-3 line-clamp-3 sm:line-clamp-4'>
        {testimonial.content}
      </p>
      <div className='flex items-center justify-between text-foreground text-[10px] sm:text-sm mt-auto'>
        <span>{formatDateLocal(testimonial.date, locale)}</span>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Heart className='size-4' />
            <span>{likes}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Share className='size-4' />
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

  const cardPositions = useMemo(() => {
    const isSm =
      globalThis.window !== undefined && globalThis.window.innerWidth >= 640;

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

      return { x, y };
    });
  }, [testimonials, focusedIndex, total]);

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
      className='grid [grid-template-areas:"stack"] place-items-center opacity-100 animate-in fade-in-0 duration-700 mx-auto w-fit'
    >
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          index={index}
          x={cardPositions[index].x}
          y={cardPositions[index].y}
          isLast={index === total - 1}
          isSelected={selectedIndex === index}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          onHover={() => handleHover(index)}
          onLeave={handleLeave}
        />
      ))}
    </div>
  );
}
