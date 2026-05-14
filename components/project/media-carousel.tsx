'use client';

import { useRef, useState, useCallback, useEffect, memo, useMemo } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { isGif } from '@/lib/utils';
import { ChevronUp, Expand, WindowClose } from '@/components/ui/svg';

// ─── Parallax Card (landscape) ────────────────────────────────────────────────
interface MediaCardProps {
  src: string;
  alt: string;
  index: number;
  fill?: boolean;
  onClick: (index: number) => void;
}

const MediaCard = memo(function MediaCard({
  src,
  alt,
  index,
  fill = false,
  onClick,
}: Readonly<MediaCardProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // image is 120% tall → drifts -16.67% on scroll
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-16.6667%']);

  const handleClick = useCallback(() => onClick(index), [onClick, index]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(index),
    [onClick, index],
  );

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative rounded-2xl cursor-zoom-in pixel-corners-small group ${
        fill ? 'w-full h-full' : 'shrink-0 w-[520px] md:w-[800px] aspect-video'
      }`}
      role='button'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={alt}
    >
      {/* Size placeholder (only needed in non-fill carousel mode) */}
      {!fill && <div className='w-full aspect-video' />}

      {/* Parallax image layer */}
      <m.div
        style={{ y, height: '120%' }}
        className='absolute top-0 left-0 w-full'
      >
        <Image
          src={src}
          alt={alt}
          fill
          className='object-cover transition-[filter,transform] duration-500 group-hover:brightness-75'
          unoptimized={isGif(src)}
          sizes='(max-width: 768px) 100vw, 800px'
        />
      </m.div>

      {/* Hover overlay */}
      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <Expand className='size-10 text-white mix-blend-difference' />
      </div>

      {/* Bottom gradient + index badge */}
      <div className='absolute bottom-0 left-0 right-0 h-14 bg-linear-to-t from-black/50 to-transparent flex items-end p-3'>
        <span className='text-white/50 text-xs font-mono tracking-widest'>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
});

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox = memo(function Lightbox({
  images,
  initialIndex,
  onClose,
}: Readonly<LightboxProps>) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    globalThis.addEventListener('keydown', handler);
    return () => globalThis.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const goTo = useCallback((i: number) => setCurrent(i), []);

  const src = images[current];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className='fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm'
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close */}
      <button
        className='absolute top-5 right-5 z-20 text-white hover:opacity-70 transition-opacity'
        onClick={onClose}
        aria-label='Close lightbox'
      >
        <WindowClose className='size-7 text-white mix-blend-difference' />
      </button>

      {/* Counter */}
      <div className='absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono tracking-widest z-20 pointer-events-none'>
        {String(current + 1).padStart(2, '0')} /{' '}
        {String(images.length).padStart(2, '00')}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className='absolute left-4 md:left-8 z-20 text-white hover:opacity-70 transition-opacity'
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label='Previous image'
        >
          <ChevronUp className='size-7 -rotate-90' />
        </button>
      )}

      {/* Image with crossfade */}
      <div
        className='relative z-10 w-[90vw] h-[90vh] flex items-center justify-center'
      >
        <AnimatePresence mode='wait'>
          <m.div
            key={current}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className='absolute inset-0'
          >
            <Image
              src={src}
              alt={`Image ${current + 1}`}
              fill
              className='object-contain rounded-xl'
              unoptimized={isGif(src)}
              sizes='90vw'
              priority
            />
          </m.div>
        </AnimatePresence>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className='absolute right-4 md:right-8 z-20 text-white hover:opacity-70 transition-opacity'
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label='Next image'
        >
          <ChevronUp className='size-7 rotate-90' />
        </button>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {images.map((_, i) => (
            <LightboxDot key={i} index={i} current={current} goTo={goTo} />
          ))}
        </div>
      )}
    </m.div>
  );
});

// Extracted so goTo callback is stable and dots don't re-render each other on change
const LightboxDot = memo(function LightboxDot({
  index,
  current,
  goTo,
}: {
  index: number;
  current: number;
  goTo: (i: number) => void;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      goTo(index);
    },
    [goTo, index],
  );

  return (
    <button
      onClick={handleClick}
      aria-label={`Go to image ${index + 1}`}
      className={`h-1.5 rounded-full transition-all duration-300 ${
        index === current
          ? 'bg-white w-5'
          : 'bg-white/40 w-1.5 hover:bg-white/70'
      }`}
    />
  );
});

// ─── Smart Grid (≤ 3 images) ──────────────────────────────────────────────────
interface SmartGridProps {
  images: string[];
  title: string;
  onCardClick: (i: number) => void;
}

const SmartGrid = memo(function SmartGrid({
  images,
  title,
  onCardClick,
}: Readonly<SmartGridProps>) {
  const count = images.length;

  if (count === 1) {
    return (
      <div className='w-full aspect-video'>
        <MediaCard
          src={images[0]}
          alt={`${title} — 1`}
          index={0}
          fill
          onClick={onCardClick}
        />
      </div>
    );
  }

  // 2 images → side by side
  return (
    <div className='grid grid-cols-2 gap-3 w-full'>
      {images.map((src, i) => (
        <div key={i} className='aspect-video'>
          <MediaCard
            src={src}
            alt={`${title} — ${i + 1}`}
            index={i}
            fill
            onClick={onCardClick}
          />
        </div>
      ))}
    </div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
interface MediaCarouselProps {
  images: string[];
  title: string;
}

export default function MediaCarousel({
  images,
  title,
}: Readonly<MediaCarouselProps>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // drag-to-scroll state (refs → no re-renders)
  const isDragging = useRef(false);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!trackRef.current) return;
    isPointerDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    scrollLeft.current = trackRef.current.scrollLeft;
    // Do NOT setPointerCapture here — deferring to onPointerMove so that
    // pure clicks never get captured, letting onClick reach the card element.
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!trackRef.current || !isPointerDown.current) return;
    const dx = e.clientX - startX.current;
    if (!isDragging.current && Math.abs(dx) > 10) {
      isDragging.current = true;
      // Only capture once we're sure this is a drag
      trackRef.current.setPointerCapture(e.pointerId);
    }
    if (isDragging.current) {
      trackRef.current.scrollLeft = scrollLeft.current - dx;
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isPointerDown.current = false;
    if (trackRef.current?.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    // Reset after click event fires (click is dispatched synchronously after pointerup)
    requestAnimationFrame(() => { isDragging.current = false; });
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (!isDragging.current) setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const isSmall = useMemo(() => images.length <= 2, [images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className='w-full flex flex-col gap-4'>

        {isSmall ? (
          // ── Grid layout for ≤ 3 images ───────────────────────────────────
          <SmartGrid
            images={images}
            title={title}
            onCardClick={handleCardClick}
          />
        ) : (
          // ── Horizontal scrollable carousel for 4+ images ─────────────────
          <div
            ref={trackRef}
            className='flex gap-6 overflow-x-auto pb-3 cursor-grab active:cursor-grabbing select-none'
            style={{ scrollbarWidth: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className='shrink-0 w-1' />
            {images.map((src, index) => (
              <MediaCard
                key={`${title}-${index}`}
                src={src}
                alt={`${title} — ${index + 1}`}
                index={index}
                onClick={handleCardClick}
              />
            ))}
            <div className='shrink-0 w-1' />
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
}
