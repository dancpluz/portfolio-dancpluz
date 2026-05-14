'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, m } from 'motion/react';
import { shuffleArray } from '@/lib/utils';

import { Technology } from '@/types/api';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import Tooltip from '../../ui/tooltip';

const CYCLE_INTERVAL = 6000;
const COLUMN_DELAY = 600;

const distributeLogos = (
  allLogos: Technology[],
  columnCount: number,
): Technology[][] => {
  const shuffled = shuffleArray(allLogos);
  const columns: Technology[][] = Array.from({ length: columnCount }, () => []);

  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo);
  });

  const maxLength = Math.max(...columns.map((col) => col.length));
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
    }
  });

  return columns;
};

interface LogoColumnProps {
  logos: Technology[];
  index: number;
  currentTime: number;
}

const ENTER_DURATION = 0.45;
const EXIT_DURATION = 0.35;

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime }) => {
    const columnDelay = index * COLUMN_DELAY;
    const adjustedTime =
      (currentTime + columnDelay) % (CYCLE_INTERVAL * logos.length);
    const currentIndex = Math.floor(adjustedTime / CYCLE_INTERVAL);
    const currentLogo = useMemo(
      () => logos[currentIndex],
      [logos, currentIndex],
    );
    const locale = useLocale();

    if (!currentLogo) return null;

    const innerContent = (
      <m.div
        className='relative h-14 w-24 overflow-hidden md:h-24 md:w-48 cursor-pointer select-none'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '0px 0px -50px 0px' }}
        whileTap={{ scale: 0.85 }}
        transition={{
          delay: index * 0.08,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad — smooth settle
          scale: { type: 'spring', stiffness: 400, damping: 15 },
        }}
      >
        <AnimatePresence mode='popLayout'>
          <m.div
            key={`${currentLogo.id}-${currentIndex}`}
            className='absolute inset-0 flex items-center justify-center will-change-transform'
            initial={{ y: '18%', opacity: 0, filter: 'blur(6px)' }}
            animate={{
              y: '0%',
              opacity: 1,
              filter: 'blur(0px)',
              transition: {
                delay: 0.5,
                duration: ENTER_DURATION,
                ease: [0.22, 1, 0.36, 1], // easeOutExpo — fast settle, no bounce
              },
            }}
            exit={{
              y: '-18%',
              opacity: 0,
              filter: 'blur(6px)',
              transition: {
                duration: EXIT_DURATION,
                ease: [0.55, 0, 1, 0.45], // easeInExpo — snappy exit
              },
            }}
          >
            <Image
              src={currentLogo.imageUrl}
              alt={currentLogo.alt}
              width={128}
              height={128}
              loading='lazy'
              style={{
                width: 'auto',
                height: 'auto',
              }}
              className='pointer-events-none h-20 w-20 max-h-[80%] max-w-[80%] object-contain md:h-32 md:w-32 theme-invert-1 transition-all duration-300'
            />
          </m.div>
        </AnimatePresence>
      </m.div>
    );

    const tooltipText = locale === 'en' ? currentLogo.tooltipEn : currentLogo.tooltipPt;

    return tooltipText ? (
      <Tooltip name={tooltipText} alt={currentLogo.alt}>{innerContent}</Tooltip>
    ) : (
      innerContent
    );
  },
);

LogoColumn.displayName = 'LogoColumn';

interface LogoShowcaseProps {
  columnCount?: number;
  logos: Technology[];
}

export default function LogoShowcase({
  columnCount = 2,
  logos,
}: Readonly<LogoShowcaseProps>) {
  const [logoSets, setLogoSets] = useState<
    { id: string; items: Technology[] }[]
  >([]);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const tick = useCallback((timestamp: number) => {
    startTimeRef.current ??= timestamp;
    const elapsed = timestamp - startTimeRef.current;
    setCurrentTime(elapsed);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  useEffect(() => {
    if (!logos || logos.length === 0) return;

    const distributedLogos = distributeLogos(logos, columnCount);
    const columnsWithIds = distributedLogos.map((items, i) => ({
      id: `column-${i}-${items.map((l) => l.id).join('-')}`,
      items,
    }));
    setLogoSets(columnsWithIds);
  }, [logos, columnCount]);

  return (
    <div className='flex w-full justify-center'>
      {logoSets.map((column, index) => (
        <LogoColumn
          key={column.id}
          logos={column.items}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}
