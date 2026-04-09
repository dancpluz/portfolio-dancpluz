'use client';

import { m, useScroll, useSpring, useTransform } from 'motion/react';

export default function ArticleProgressBar() {
  const { scrollYProgress } = useScroll();
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 60,
    restDelta: 0.001,
  });

  const clipPath = useTransform(
    springProgress,
    (val) => `inset(0 ${100 - val * 100}% 0 0)`,
  );

  return (
    <m.div
      className='fixed w-full h-1 top-0 left-0 z-50 bg-[linear-gradient(to_right,var(--color-accent-1)_33.33%,var(--color-accent-2)_33.33%,var(--color-accent-2)_66.66%,var(--color-accent-3)_66.66%)]'
      style={{ clipPath }}
    />
  );
}
