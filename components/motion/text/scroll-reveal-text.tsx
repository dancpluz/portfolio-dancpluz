'use client';

import React, { useRef, useMemo } from 'react';
import { m, useScroll, useTransform, MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

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
  isItalic,
}: Readonly<{
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  baseOpacity: number;
  enableBlur: boolean;
  blurStrength: number;
  isItalic?: boolean;
}>) {
  const opacity = useTransform(progress, range, [baseOpacity, 1]);
  const blur = useTransform(progress, range, [blurStrength, 0]);
  const filter = useTransform(blur, (v) =>
    enableBlur ? `blur(${v}px)` : 'none',
  );

  return (
    <m.span
      className={cn(
        'inline-block will-change-[opacity,filter]',
        isItalic && 'italic'
      )}
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

  const rotate = useTransform(scrollYProgress, [0, 0.45], [baseRotation, 0]);

  const wordsWithIds = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const rawWords = text.split(/(\s+)/).filter(Boolean);
    
    let isItalicActive = false;

    return rawWords.map((word, idx) => {
      let cleanWord = word;
      let isItalic = isItalicActive;

      if (cleanWord.startsWith('_')) {
        isItalicActive = true;
        isItalic = true;
        cleanWord = cleanWord.substring(1);
      }

      let endsWithUnderscore = false;
      if (cleanWord.endsWith('_')) {
        endsWithUnderscore = true;
        cleanWord = cleanWord.substring(0, cleanWord.length - 1);
      }

      const result = {
        id: `scroll-reveal-${idx}-${word}`,
        word: cleanWord,
        isSpace: !!new RegExp(/^\s+$/).exec(word),
        isItalic,
      };

      if (endsWithUnderscore) {
        isItalicActive = false;
      }

      return result;
    });
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
          const start = (idx / totalWords) * 0.35;
          const end = start + 0.35 / totalWords + 0.08;

          return (
            <WordSpan
              key={item.id}
              word={item.word}
              progress={scrollYProgress}
              range={[Math.min(start, 0.9), Math.min(end, 1)]}
              baseOpacity={baseOpacity}
              enableBlur={enableBlur}
              blurStrength={blurStrength}
              isItalic={item.isItalic}
            />
          );
        })}
      </p>
    </m.h2>
  );
}
