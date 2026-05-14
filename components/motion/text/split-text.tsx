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
    case 'chars': return splitChars(text);
    case 'words': return splitWords(text);
    case 'lines': return splitLines(text);
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
  tag = 'p',
  textAlign = 'center',
  onLetterAnimationComplete,
}: Readonly<SplitTextProps>) {
  const ref = useRef<HTMLElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });

  const tokens = useMemo(() => getTokens(text, splitType), [text, splitType]);

  // Only count non-whitespace tokens for stagger calculation
  const visibleCount = useMemo(
    () => tokens.filter((t) => t.trim().length > 0).length,
    [tokens],
  );

  const Tag = tag as ElementType;

  let visibleIndex = 0;

  return (
    <Tag
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ textAlign, wordWrap: 'break-word' }}
      aria-label={text}
    >
      {tokens.map((token, i) => {
        const isWhitespace = token.trim().length === 0;

        if (isWhitespace) {
          // Render spaces / newlines as-is (no animation wrapper)
          return splitType === 'lines'
            ? <br key={i} />
            : <span key={i} aria-hidden='true'>{token}</span>;
        }

        const tokenIndex = visibleIndex++;
        const staggerSec = (delay / 1000) * tokenIndex;
        const isLast = tokenIndex === visibleCount - 1;

        return (
          <m.span
            key={i}
            aria-hidden='true'
            // Inline-block so transforms work correctly on each token
            className='inline-block will-change-[transform,opacity]'
            initial={from}
            animate={isInView ? to : from}
            transition={{
              duration,
              delay: staggerSec,
              ease: [0.215, 0.61, 0.355, 1], // power3.out cubic-bezier equivalent
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
