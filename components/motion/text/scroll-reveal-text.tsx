'use client';

import React, { useRef, useMemo } from 'react';
import { m, useScroll, useTransform, MotionValue } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

function WordSpan({
  word,
  progress,
  range,
  baseOpacity,
  enableBlur,
  blurStrength,
}: Readonly<{
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  baseOpacity: number;
  enableBlur: boolean;
  blurStrength: number;
}>) {
  const opacity = useTransform(progress, range, [baseOpacity, 1]);
  const blur = useTransform(progress, range, [blurStrength, 0]);
  const filter = useTransform(blur, (v) =>
    enableBlur ? `blur(${v}px)` : 'none',
  );

  return (
    <m.span
      className='inline-block will-change-[opacity,filter]'
      style={{ opacity, filter }}
    >
      {word}
    </m.span>
  );
}

export default function ScrollRevealText({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}: Readonly<ScrollRevealProps>) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5], [baseRotation, 0]);

  const wordsWithIds = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const rawWords = text.split(/(\s+)/).filter(Boolean);
    return rawWords.map((word, idx) => ({
      id: `scroll-reveal-${idx}-${word}`,
      word,
      isSpace: !!new RegExp(/^\s+$/).exec(word),
    }));
  }, [children]);

  const totalWords = useMemo(() => wordsWithIds.filter((w) => !w.isSpace).length, [wordsWithIds]);

  let wordIndex = 0;

  return (
    <m.h2
      ref={containerRef}
      className={`my-5 ${containerClassName}`}
      style={{ rotate, transformOrigin: '0% 50%' }}
    >
      <p
        className={`text-[clamp(1.6rem,4vw,3rem)] leading-normal font-semibold ${textClassName}`}
      >
        {wordsWithIds.map((item) => {
          if (item.isSpace) {
            return <span key={item.id}> </span>;
          }

          const idx = wordIndex++;
          const start = (idx / totalWords) * 0.6;
          const end = start + 0.6 / totalWords + 0.1;

          return (
            <WordSpan
              key={item.id}
              word={item.word}
              progress={scrollYProgress}
              range={[Math.min(start, 0.9), Math.min(end, 1)]}
              baseOpacity={baseOpacity}
              enableBlur={enableBlur}
              blurStrength={blurStrength}
            />
          );
        })}
      </p>
    </m.h2>
  );
}
