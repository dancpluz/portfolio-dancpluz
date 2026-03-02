'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, m } from 'motion/react';
import { shuffleArray } from '@/lib/utils';

import { IconsResponse } from '@/types/pocketbase';
import { buildImageUrl } from '@/lib/api';
import Image from 'next/image';

export interface ProcessedIcon extends IconsResponse {
  imageUrl: string;
}

const distributeLogos = (allLogos: ProcessedIcon[], columnCount: number): ProcessedIcon[][] => {
  const shuffled = shuffleArray(allLogos);
  const columns: ProcessedIcon[][] = Array.from({ length: columnCount }, () => []);

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
  logos: ProcessedIcon[];
  index: number;
  currentTime: number;
}

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime }) => {
    const cycleInterval = 2000;
    const columnDelay = index * 200;
    const adjustedTime =
      (currentTime + columnDelay) % (cycleInterval * logos.length);
    const currentIndex = Math.floor(adjustedTime / cycleInterval);
    const currentLogo = useMemo(
      () => logos[currentIndex],
      [logos, currentIndex],
    );

    return (
      <m.div
        className='relative h-14 w-24 overflow-hidden md:h-24 md:w-48'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        <AnimatePresence mode='wait'>
          <m.div
            key={`${currentLogo.id}-${currentIndex}`}
            className='absolute inset-0 flex items-center justify-center'
            initial={{ y: '10%', opacity: 0, filter: 'blur(8px)' }}
            animate={{
              y: '0%',
              opacity: 1,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: '-20%',
              opacity: 0,
              filter: 'blur(6px)',
              transition: {
                type: 'tween',
                ease: 'easeIn',
                duration: 0.3,
              },
            }}
          >
            <Image
              src={currentLogo.imageUrl}
              alt={currentLogo.alt}
              width={128}
              height={128}
              loading="lazy"
              style={{ width: 'auto', height: 'auto' }}
              className='pointer-events-none h-20 w-20 max-h-[80%] max-w-[80%] object-contain md:h-32 md:w-32'
            />
          </m.div>
        </AnimatePresence>
      </m.div>
    );
  },
);

interface LogoCarouselProps {
  columnCount?: number;
  logos: IconsResponse[];
}

export default function LogoCarousel({ columnCount = 2, logos }: LogoCarouselProps) {
  const [logoSets, setLogoSets] = useState<ProcessedIcon[][]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updateTime, 100);
    return () => clearInterval(intervalId);
  }, [updateTime]);

  useEffect(() => {
    // Process logos once to compute image URLs upfront
    const processedLogos: ProcessedIcon[] = logos.map(logo => ({
      ...logo,
      imageUrl: buildImageUrl(logo, logo.icon)
    }));

    const distributedLogos = distributeLogos(processedLogos, columnCount);
    setLogoSets(distributedLogos);
  }, [logos, columnCount]);

  return (
    <div className='flex space-x-4'>
      {logoSets.map((logos, index) => (
        <LogoColumn
          key={index}
          logos={logos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}

export { LogoColumn };
