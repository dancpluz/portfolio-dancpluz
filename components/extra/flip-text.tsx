'use client';

import { useMemo } from 'react';
import { m, type Variants, stagger } from 'motion/react';
import TransitionLink from '../transition-link';

interface FlipTextProps {
  text: string;
  href?: string;
  className?: string;
  duration?: number;
  staggerDelay?: number;
  isHovered?: boolean;
}

export default function FlipText({
  text,
  href,
  className = '',
  duration = 0.4,
  staggerDelay = 0.05,
  isHovered,
}: Readonly<FlipTextProps>) {
  const { parentContainerVariants, topLetterVariants, bottomLetterVariants } =
    useMemo(() => {
      const parentContainerVariants: Variants = {
        initial: { transition: { delayChildren: stagger(staggerDelay) } },
        hovered: { transition: { delayChildren: stagger(staggerDelay) } },
      };

      const topLetterVariants: Variants = {
        initial: { y: 0, transition: { duration, ease: 'easeInOut' } },
        hovered: { y: '-100%', transition: { duration, ease: 'easeInOut' } },
      };

      const bottomLetterVariants: Variants = {
        initial: { y: '100%', transition: { duration, ease: 'easeInOut' } },
        hovered: { y: 0, transition: { duration, ease: 'easeInOut' } },
      };

      return {
        parentContainerVariants,
        topLetterVariants,
        bottomLetterVariants,
      };
    }, [duration, staggerDelay]);

  const Component = href ? TransitionLink : m.div;

  let animateState: 'hovered' | 'initial' | undefined;
  let whileHoverState: 'hovered' | undefined;

  if (isHovered === undefined) {
    whileHoverState = 'hovered';
  } else {
    animateState = isHovered ? 'hovered' : 'initial';
  }

  return (
    <Component
      initial='initial'
      animate={animateState}
      whileHover={whileHoverState}
      href={href}
      className={`relative w-fit whitespace-nowrap text-4xl font-black uppercase ${className}`}
      style={{ lineHeight: 1.2, clipPath: 'inset(0)' }}
    >
      <m.div variants={parentContainerVariants}>
        {text.split('').map((l, i) => (
          <m.span
            variants={topLetterVariants}
            className='inline-block'
            key={`top-${l}-${i}`}
          >
            {l === ' ' ? '\u00A0' : l}
          </m.span>
        ))}
      </m.div>
      <m.div
        className='absolute inset-0 italic'
        variants={parentContainerVariants}
      >
        {text.split('').map((l, i) => (
          <m.span
            variants={bottomLetterVariants}
            className='inline-block'
            key={`bottom-${l}-${i}`}
          >
            {l === ' ' ? '\u00A0' : l}
          </m.span>
        ))}
      </m.div>
    </Component>
  );
}
