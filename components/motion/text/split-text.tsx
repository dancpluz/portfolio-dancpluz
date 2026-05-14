'use client';

import React, { useRef, useMemo, ElementType } from 'react';
import { m, useInView, TargetAndTransition } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SplitType = 'chars' | 'words' | 'lines';

export interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger between tokens in **milliseconds** (matches the GSAP API). Default 50. */
  delay?: number;
  /** Animation duration per token in seconds. Default 0.6. */
  duration?: number;
  /** Split granularity. Default 'chars'. */
  splitType?: SplitType;
  /** Initial (hidden) variant — keys must be animatable Motion properties. */
  from?: TargetAndTransition;
  /** Final (visible) variant. */
  to?: TargetAndTransition;
  /** IntersectionObserver threshold (0–1). Default 0.1. */
  threshold?: number;
  /** IntersectionObserver rootMargin (CSS string). Default '-100px'. */
  rootMargin?: string;
  /** Whether the animation should only happen once. Default true. */
  once?: boolean;
  /** HTML tag to render. Default 'p'. */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

// ─── Token splitters ──────────────────────────────────────────────────────────

/** Splits a string into individual characters, keeping spaces as separate tokens. */
function splitChars(text: string): string[] {
  return Array.from(text); // handles emoji/multi-code-point correctly
}

/** Splits into words (preserves whitespace as ' ' between them). */
function splitWords(text: string): string[] {
  return text.split(/(\s+)/);
}

/**
 * Splits by explicit newlines only (the GSAP `lines` mode wraps by layout;
 * we approximate it with `\n` splits since layout-based wrapping requires DOM access).
 */
function splitLines(text: string): string[] {
  return text.split(/\n/);
}

function getTokens(text: string, splitType: SplitType): string[] {
  switch (splitType) {
    case 'chars':
      // Even for chars, we split by words first so we can wrap them in inline-blocks.
      // Character-level splitting happens in the render loop.
      return splitWords(text);
    case 'words':
      return splitWords(text);
    case 'lines':
      return splitLines(text);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 0.6,
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  once = true,
  tag = 'p',
  textAlign = 'center',
  onLetterAnimationComplete,
}: Readonly<SplitTextProps>) {
  const ref = useRef<HTMLElement>(null);

  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });

  const tokens = useMemo(() => getTokens(text, splitType), [text, splitType]);

  // Count total animatable elements to know when the animation is complete
  const visibleCount = useMemo(() => {
    if (splitType === 'chars') {
      return Array.from(text).filter((c) => c.trim().length > 0).length;
    }
    return tokens.filter((t) => t.trim().length > 0).length;
  }, [tokens, text, splitType]);

  const Tag = tag as ElementType;

  let visibleIndex = 0;

  return (
    <Tag
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ textAlign, wordWrap: 'break-word' }}
      aria-label={text}
    >
      {tokens.map((token, wordIdx) => {
        const isWhitespace = token.trim().length === 0;

        if (isWhitespace) {
          return splitType === 'lines' ? (
            <br key={wordIdx} />
          ) : (
            <span key={wordIdx} aria-hidden='true'>
              {token}
            </span>
          );
        }

        if (splitType === 'chars') {
          const chars = Array.from(token);
          return (
            <span key={wordIdx} className='inline-block whitespace-nowrap'>
              {chars.map((char, charIdx) => {
                const tokenIndex = visibleIndex++;
                const staggerSec = (delay / 1000) * tokenIndex;
                const isLast = tokenIndex === visibleCount - 1;

                return (
                  <m.span
                    key={charIdx}
                    aria-hidden='true'
                    className='inline-block will-change-[transform,opacity]'
                    initial={from}
                    animate={isInView ? to : from}
                    transition={{
                      duration,
                      delay: staggerSec,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    onAnimationComplete={
                      isLast && onLetterAnimationComplete
                        ? onLetterAnimationComplete
                        : undefined
                    }
                  >
                    {char}
                  </m.span>
                );
              })}
            </span>
          );
        }

        // Words or Lines
        const tokenIndex = visibleIndex++;
        const staggerSec = (delay / 1000) * tokenIndex;
        const isLast = tokenIndex === visibleCount - 1;

        return (
          <m.span
            key={wordIdx}
            aria-hidden='true'
            className='inline-block will-change-[transform,opacity]'
            initial={from}
            animate={isInView ? to : from}
            transition={{
              duration,
              delay: staggerSec,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            onAnimationComplete={
              isLast && onLetterAnimationComplete
                ? onLetterAnimationComplete
                : undefined
            }
          >
            {token}
          </m.span>
        );
      })}
    </Tag>
  );
}
