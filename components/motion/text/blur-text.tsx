'use client';

import { useRef, useMemo } from 'react';
import { m, useInView, Transition, Easing } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimationSnapshot = Record<string, string | number>;

export interface BlurTextProps {
  text?: string;
  /** Stagger between tokens in **milliseconds**. Default 200. */
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationSnapshot;
  animationTo?: AnimationSnapshot[];
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  /** Duration of a single animation step in seconds. Default 0.35. */
  stepDuration?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a keyframes object accepted by Motion's `animate` prop.
 * Each key maps to an array: [fromValue, ...stepValues].
 */
function buildKeyframes(
  from: AnimationSnapshot,
  steps: AnimationSnapshot[],
): Record<string, (string | number)[]> {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, (string | number)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}: Readonly<BlurTextProps>) {
  const ref = useRef<HTMLParagraphElement>(null);

  const inView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });

  const elements = useMemo(
    () => (animateBy === 'words' ? text.split(' ') : text.split('')),
    [text, animateBy],
  );

  const defaultFrom = useMemo<AnimationSnapshot>(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo<AnimationSnapshot[]>(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [JSON.stringify(fromSnapshot), JSON.stringify(toSnapshots)],
  );

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`} aria-label={text}>
      {elements.map((segment, index) => {
        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <m.span
            key={index}
            aria-hidden='true'
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </m.span>
        );
      })}
    </p>
  );
}
