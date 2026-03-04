'use client';

import React, { useRef, useEffect, useState } from 'react';
import { animate, m } from 'motion/react';
import Link from 'next/link';

const MotionLink = m.create(Link);

export interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  onItemClick?: () => void;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  onClick?: () => void;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  onItemClick,
}) => {
  return (
    <div className='w-full h-full overflow-hidden'>
      <nav className='flex flex-col h-full m-0 p-0'>
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            onClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  speed,
  onClick,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [contentWidth, setContentWidth] = useState(0);

  const EXPO_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];
  const HOVER_DURATION = 0.6;

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
  ): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(
        '.marquee-part',
      ) as HTMLElement;
      if (!marqueeContent) return;
      const needed =
        Math.ceil(window.innerWidth / marqueeContent.offsetWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const measure = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector(
        '.marquee-part',
      ) as HTMLElement;
      if (part) setContentWidth(part.offsetWidth);
    };
    const timer = setTimeout(measure, 50);
    return () => clearTimeout(timer);
  }, [text, image, repetitions]);

  useEffect(() => {
    if (!marqueeInnerRef.current || contentWidth === 0) return;

    scrollAnimRef.current?.stop();

    scrollAnimRef.current = animate(
      marqueeInnerRef.current,
      { x: [0, -contentWidth] },
      { duration: speed, ease: 'linear', repeat: Infinity },
    );

    return () => {
      scrollAnimRef.current?.stop();
    };
  }, [contentWidth, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );

    animate(
      marqueeRef.current,
      { y: [edge === 'top' ? '-101%' : '101%', '0%'] },
      { duration: HOVER_DURATION, ease: EXPO_EASE },
    );
    animate(
      marqueeInnerRef.current,
      { y: [edge === 'top' ? '101%' : '-101%', '0%'] },
      { duration: HOVER_DURATION, ease: EXPO_EASE },
    );
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );

    animate(
      marqueeRef.current,
      { y: edge === 'top' ? '-101%' : '101%' },
      { duration: HOVER_DURATION, ease: EXPO_EASE },
    );
    animate(
      marqueeInnerRef.current,
      { y: edge === 'top' ? '101%' : '-101%' },
      { duration: HOVER_DURATION, ease: EXPO_EASE },
    );
  };

  return (
    <div
      className={`flex-1 relative overflow-hidden text-center border-t border-foreground`}
      ref={itemRef}
    >
      <MotionLink
        className='flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-heading text-5xl text-foreground'
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        initial={{ x: -800 }}
        animate={{ x: 0 }}
        exit={{ x: -800 }}
        transition={{ delay: 0.2, duration: 1, ease: 'circInOut' }}
      >
        {text}
      </MotionLink>

      <div
        className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-foreground'
        ref={marqueeRef}
        style={{
          transform: 'translateY(101%)',
        }}
      >
        <div className='h-full w-fit flex' ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div
              className='marquee-part flex items-center flex-shrink-0 text-background'
              key={idx}
            >
              <span className='whitespace-nowrap uppercase font-heading text-5xl leading-[1] px-[1vw]'>
                {text}
              </span>
              <div
                className='w-[200px] h-[7vh] my-[2em] mx-[2vw] py-[1em] rounded-[50px] bg-cover bg-center'
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
