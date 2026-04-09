'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { animate } from 'motion/react';
import Image from 'next/image';
import MotionLink from '../motion/motion-link';
import { HoverMedia } from '@/hooks/use-menu';
import { useSectionScroll } from '@/hooks/use-section-scroll';
import TransitionLink from '../transition-link';
import { ROUTES } from '@/lib/constant';
import { RouteItem } from '@/types/utils';
import { useTranslations } from 'next-intl';

const FlowingNav = React.memo(function FlowingNav({
  speed = 15,
  onItemClick,
  setHoverMedia
}: Readonly<{ speed?: number; onItemClick?: () => void; setHoverMedia: (m: HoverMedia) => void; }>) {
  const t = useTranslations('nav');

  useEffect(() => {
    Object.values(ROUTES).forEach((item) => {
      if (typeof globalThis !== 'undefined') {
        const media = (item as any).media;
        if (typeof media === 'string') {
          const isVideo = !!new RegExp(/\.(webm|mp4|ogg)$/i).exec(media);
          if (isVideo) {
            const video = document.createElement('video');
            video.src = media;
            video.preload = 'auto';
          } else {
            const img = new globalThis.Image();
            img.src = media;
          }
        }
      }
    });
  }, []);

  return (
    <div className='w-full h-full overflow-hidden'>
      <nav className='flex flex-col h-full m-0 p-0'>
        {Object.entries(ROUTES).map(([key, item]) => (
          <MenuItem
            key={item.path}
            route={{ ...item, text: t(key) }}
            speed={speed}
            onClick={onItemClick}
            setHoverMedia={setHoverMedia}
          />
        ))}
      </nav>
    </div>
  );
});
export default FlowingNav;

const MenuItem = React.memo(function MenuItem({
  route,
  speed,
  onClick,
  setHoverMedia
}: Readonly<{ route: Omit<RouteItem, 'text'> & { text: string }; speed: number; onClick?: () => void; setHoverMedia: (m: HoverMedia) => void; }>) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [contentWidth, setContentWidth] = useState(0);

  const { path, text } = route;
  const media = (route as any).media;
  const isVideo = typeof media === 'string' && !!new RegExp(/\.(webm|mp4|ogg)$/i).exec(media);
  const EXPO_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];
  const HOVER_DURATION = 0.6;

  const handleScroll = useSectionScroll();

  const handleLinkClick = handleScroll(path, onClick);

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
  }, [text, media]);

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
  }, [text, media, repetitions]);

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

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setHoverMedia({ src: media, isVideo });
    }, 100);

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
  }, [media, isVideo, setHoverMedia]);

  const handleMouseLeave = useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

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
  }, []);

  const isSection = path.includes('#');
  const LinkComponent = isSection ? MotionLink : TransitionLink;

  return (
    <div
      className={`flex-1 relative overflow-hidden text-center border-t border-foreground`}
      ref={itemRef}
    >
      <LinkComponent
        className='flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-heading font-bold text-5xl text-foreground'
        href={path}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleLinkClick}
        initial={{ x: -800 }}
        animate={{ x: 0 }}
        exit={{ x: -800 }}
        transition={{ delay: 0.2, duration: 1, ease: 'circInOut' }}
      >
        {text}
      </LinkComponent>

      <div
        className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-foreground'
        ref={marqueeRef}
        style={{
          transform: 'translateY(101%)',
        }}
      >
        <div className='h-full w-fit flex' ref={marqueeInnerRef}>
          {Array.from({ length: repetitions }).map((_, idx) => (
            <div
              className='marquee-part flex items-center shrink-0 text-background'
              key={`${path}-${idx}`}
            >
              <span className='whitespace-nowrap uppercase font-heading text-5xl leading-none px-[1vw]'>
                {text}
              </span>
              <div className='relative w-[200px] h-[7vh] my-[2em] mx-[2vw] py-[1em] pixel-corners-small overflow-hidden shrink-0'>
                {isVideo ? (
                  <video
                    src={media}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='object-cover w-full h-full absolute inset-0'
                  />
                ) : (
                  <Image
                    src={media || '/placeholder.svg'}
                    alt={text}
                    fill
                    sizes='200px'
                    className='object-cover'
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
