'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Social } from '@/types/api';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { AnimatePresence, m, stagger } from 'motion/react';
import { ArrowRight } from '@/components/ui/svg';
import Link from 'next/link';
import { useAutoFitText } from '@/hooks/use-auto-fit-text';
import { useResizeObserver } from '@/hooks/use-resize-observer';

interface VHSTapeProps {
  social: Social;
  index?: number;
}

// Base tape image is neutral, we apply a multiply mask to tint only the white areas
const TAPE_TINTS = [
  '#ff00ff', // neon-pink
  '#00f248', // electric-green
  '#00fbfe', // cyan-blue
];

// Typewriter-style character-stagger animation using stagger() from motion
const charVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.1,
      ease: [0.55, 0, 1, 0.45] as const,
    },
  },
};

function TypewriterText({
  text,
  className,
  fontSize,
}: Readonly<{
  text: string;
  className?: string;
  fontSize?: number;
}>) {
  return (
    <m.span
      className={className}
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={{
        visible: { transition: { delayChildren: stagger(0.025) } },
        exit: {
          transition: { delayChildren: stagger(0.015, { from: 'last' }) },
        },
      }}
      style={
        fontSize ? { fontSize: `${fontSize}px`, lineHeight: 1.2 } : undefined
      }
    >
      {text.split('').map((char, i) => (
        <m.span
          key={`${char}-${i}`}
          variants={charVariants}
          className='inline-block'
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </m.span>
      ))}
    </m.span>
  );
}

export default function VHSTape({ social, index = 0 }: Readonly<VHSTapeProps>) {
  const locale = useLocale();
  const subtext = locale === 'en' ? social.subtextEn : social.subtextPt;
  const [isFlipped, setIsFlipped] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelSize = useResizeObserver(labelRef);

  const textMaxWidth = Math.max(0, (labelSize?.width ?? 200) - 16);
  const subtextMaxWidth = Math.max(0, (labelSize?.width ?? 200) - 16);
  const textMaxHeight = Math.max(0, labelSize?.height ?? 40);

  const mainFontSize = useAutoFitText({
    text: social.text,
    maxWidth: textMaxWidth,
    maxHeight: textMaxHeight,
    baseSize: 42,
    minSize: 10,
    lineHeightMultiplier: 1.2,
    fontFamily: '"Permanent Marker", cursive',
    singleLine: true,
  });

  const subFontSize = useAutoFitText({
    text: subtext || social.text,
    maxWidth: subtextMaxWidth,
    maxHeight: textMaxHeight,
    baseSize: 36,
    minSize: 10,
    lineHeightMultiplier: 1.2,
    fontFamily: '"Permanent Marker", cursive',
    singleLine: true,
  });

  // Deterministic random tint per tape based on index
  const tapeColor = useMemo(() => {
    return TAPE_TINTS[index % TAPE_TINTS.length];
  }, [index]);

  const handleInteract = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, x: -40, rotate: -2 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: false, margin: '-30px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.25, 0, 1],
      }}
    >
      <m.div
        className='relative w-full cursor-pointer select-none'
        whileHover={{ scale: 1.03, rotate: -0.5 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={handleInteract}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteract();
          }
        }}
      >
        {/* Tape image as background */}
        <div
          className='relative w-full aspect-685/92'
          style={{ isolation: 'isolate' }}
        >
          {/* Subtle Label Background Tint */}
          <div
            className='absolute inset-0 z-20 transition-opacity duration-300 ease-in-out'
            style={{
              top: '21%',
              bottom: '25.7%',
              left: '12.4%',
              right: '84%',
              opacity: isFlipped ? 1 : 0.3,
              backgroundColor: tapeColor,
              mixBlendMode: 'multiply',
            }}
          />
          <Image
            src='/img/tape.webp'
            alt='VHS Tape'
            fill
            className='object-contain pointer-events-none select-none'
          />

          {/* Label overlay — positioned on the white label area */}
          <div
            className='absolute flex items-center z-10 overflow-hidden rounded-[2px]'
            style={{
              top: '8.5%',
              bottom: '15%',
              left: '17.5%',
              right: '17.5%',
            }}
          >
            {/* Text area */}
            <div
              ref={labelRef}
              className='flex-1 flex items-center min-w-0 h-full px-2 sm:px-3 z-10'
            >
              <AnimatePresence mode='wait'>
                {isFlipped ? (
                  <m.div
                    key='sub-content'
                    className='flex items-center gap-2 w-full'
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <TypewriterText
                      key='sub-text'
                      text={subtext || social.text}
                      className='font-marker text-black leading-tight whitespace-nowrap overflow-hidden w-full'
                      fontSize={subFontSize}
                    />
                  </m.div>
                ) : (
                  <TypewriterText
                    key='main-text'
                    text={social.text}
                    className='font-marker text-black leading-tight whitespace-nowrap overflow-hidden'
                    fontSize={mainFontSize}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Icon on middle-right of the tape body (past the label) */}
          <div
            className='absolute z-10 flex items-center justify-center group/icon'
            style={{
              top: '15%',
              bottom: '15%',
              right: '2%',
              width: '10%',
            }}
          >
            {/* Background Social Icon fades/shrinks slightly */}
            <div
              className={`relative size-6 sm:size-8 md:size-10 transition-all duration-300 ${
                isFlipped ? 'opacity-0 scale-75' : 'group-hover/icon:opacity-0 group-hover/icon:scale-75'
              }`}
            >
              <Image
                src={social.iconUrl}
                alt={social.iconAlt || social.text}
                fill
                className='object-contain invert'
              />
            </div>

            {/* Arrow Link */}
            <Link
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Visit ${social.text}`}
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 size-full hover:scale-[1.15] active:scale-95 drop-shadow-md ${
                isFlipped
                  ? 'opacity-100 scale-100 rotate-0 pointer-events-auto'
                  : 'opacity-0 scale-50 rotate-[-30deg] group-hover/icon:opacity-100 group-hover/icon:scale-100 group-hover/icon:rotate-0 group-hover/icon:pointer-events-auto'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowRight className='size-8 text-white drop-shadow-lg -rotate-45' />
            </Link>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}
