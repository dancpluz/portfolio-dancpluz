'use client';

import { m, useInView, type HTMLMotionProps } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 40,
  xOffset = 40,
  direction = 'up',
  className,
  once = true,
  margin = '-50px',
  ...props
}: RevealProps & { once?: boolean; margin?: string }) {
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: yOffset };
      case 'down':
        return { opacity: 0, y: -yOffset };
      case 'left':
        return { opacity: 0, x: xOffset };
      case 'right':
        return { opacity: 0, x: -xOffset };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: yOffset };
    }
  };

  const getAnimate = () => {
    return { opacity: 1, y: 0, x: 0 };
  };

  return (
    <m.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, margin: margin as any }}
      transition={{ duration, delay, ease: [0.25, 0.25, 0, 1] }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function LineReveal({
  direction = 'horizontal',
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: HTMLMotionProps<'div'> & {
  direction?: 'horizontal' | 'vertical';
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const isHorizontal = direction === 'horizontal';
  const animationState = isHorizontal
    ? { scaleX: isInView ? 1 : 0 }
    : { scaleY: isInView ? 1 : 0 };

  return (
    <div
      ref={ref}
      className={
        isHorizontal
          ? 'h-px w-full overflow-hidden'
          : 'w-px h-full overflow-hidden'
      }
    >
      <m.div
        className={`bg-accent-1 ${isHorizontal ? 'h-full w-full origin-left' : 'h-full w-full origin-top'} ${className || ''}`}
        initial={isHorizontal ? { scaleX: 0 } : { scaleY: 0 }}
        animate={animationState}
        transition={{ ease: [0.25, 0.25, 0, 1], duration, delay }}
        {...props}
      />
    </div>
  );
}
