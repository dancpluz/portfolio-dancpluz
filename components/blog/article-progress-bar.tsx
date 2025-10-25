'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import React from 'react';

export default function ArticleProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 60,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className='fixed w-full h-1 bg-accent top-0 left-0 origin-left z-50'
      style={{ scaleX }}
    />
  );
}
