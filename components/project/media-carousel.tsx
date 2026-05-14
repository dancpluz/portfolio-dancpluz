'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { isGif } from '@/lib/utils';

// ─── Parallax Card (landscape) ────────────────────────────────────────────────
interface MediaCardProps {
  src: string;
  alt: string;
  index: number;
  fill?: boolean; // stretch to fill grid cell
  onClick: (index: number) => void;
}

function MediaCard({ src, alt, index, fill = false, onClick }: MediaCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // image is 120% tall → drifts -16.67% on scroll
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-16.6667%']);

  return (
    <div
      ref={containerRef}
      onClick={() => onClick(index)}
      className={`relative rounded-2xl cursor-zoom-in pixel-corners-border group ${
        fill ? 'w-full h-full' : 'shrink-0 w-[480px] md:w-[600px] aspect-video'
      }`}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(index)}
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
        <div className='w-14 h-14 rounded-full bg-white/15 border border-white/30 flex items-center justify-center backdrop-blur-sm'>
          <svg width='22' height='22' viewBox='0 0 20 20' fill='none' stroke='white' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5' />
          </svg>
        </div>
      </div>

      {/* Bottom gradient + index badge */}
      <div className='absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3'>
        <span className='text-white/50 text-xs font-mono tracking-widest'>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
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
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-md'
      onClick={onClose}
    >
      {/* Close */}
      <button
        className='absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20'
        onClick={onClose}
        aria-label='Close lightbox'
      >
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
          <path d='M2 2l12 12M14 2L2 14' />
        </svg>
      </button>

      {/* Counter */}
      <div className='absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono tracking-widest z-20 pointer-events-none'>
        {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className='absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20'
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label='Previous image'
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M11 4L6 9l5 5' />
          </svg>
        </button>
      )}

      {/* Image — use <img> so we avoid the fill+unsized container problem */}
      <AnimatePresence mode='wait'>
        <m.div
          key={current}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className='relative z-10 flex items-center justify-center'
          style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`Image ${current + 1}`}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '12px',
            }}
          />
        </m.div>
      </AnimatePresence>

      {/* Next */}
      {images.length > 1 && (
        <button
          className='absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20'
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label='Next image'
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M7 4l5 5-5 5' />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-5' : 'bg-white/40 w-1.5 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </m.div>
  );
}

// ─── Smart Grid (≤ 3 images) ──────────────────────────────────────────────────
interface SmartGridProps {
  images: string[];
  title: string;
  onCardClick: (i: number) => void;
}

function SmartGrid({ images, title, onCardClick }: SmartGridProps) {
  const count = images.length;

  // 1 image → full width landscape
  if (count === 1) {
    return (
      <div className='w-full aspect-video'>
        <MediaCard src={images[0]} alt={`${title} — 1`} index={0} fill onClick={onCardClick} />
      </div>
    );
  }

  // 2 images → side by side
  if (count === 2) {
    return (
      <div className='grid grid-cols-2 gap-3 w-full'>
        {images.map((src, i) => (
          <div key={i} className='aspect-video'>
            <MediaCard src={src} alt={`${title} — ${i + 1}`} index={i} fill onClick={onCardClick} />
          </div>
        ))}
      </div>
    );
  }

  // 3 images → 1 large left + 2 stacked right
  return (
    <div className='grid grid-cols-2 gap-3 w-full'>
      <div className='aspect-video row-span-2'>
        <MediaCard src={images[0]} alt={`${title} — 1`} index={0} fill onClick={onCardClick} />
      </div>
      {images.slice(1).map((src, i) => (
        <div key={i + 1} className='aspect-video'>
          <MediaCard src={src} alt={`${title} — ${i + 2}`} index={i + 1} fill onClick={onCardClick} />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface MediaCarouselProps {
  images: string[];
  title: string;
}

export default function MediaCarousel({ images, title }: MediaCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    isDragging.current = false;
    startX.current = e.clientX;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!trackRef.current || !trackRef.current.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) isDragging.current = true;
    if (isDragging.current) trackRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (trackRef.current) trackRef.current.releasePointerCapture(e.pointerId);
  };

  const handleCardClick = useCallback((index: number) => {
    if (!isDragging.current) setLightboxIndex(index);
  }, []);

  if (images.length === 0) return null;

  const isSmall = images.length <= 3;

  return (
    <>
      <div className='w-full flex flex-col gap-4'>
        {/* Label row */}
        <div className='flex items-center gap-3 px-1'>
          <span className='text-foreground/40 text-xs font-mono tracking-[0.2em] uppercase'>
            media
          </span>
          <div className='flex-1 h-px bg-foreground/10' />
          <span className='text-foreground/40 text-xs font-mono tracking-widest'>
            {String(images.length).padStart(2, '0')}
          </span>
        </div>

        {isSmall ? (
          // ── Grid layout for ≤ 3 images ───────────────────────────────────
          <SmartGrid images={images} title={title} onCardClick={handleCardClick} />
        ) : (
          // ── Horizontal scrollable carousel for 4+ images ─────────────────
          <div
            ref={trackRef}
            className='flex gap-3 overflow-x-auto pb-3 cursor-grab active:cursor-grabbing select-none'
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
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
