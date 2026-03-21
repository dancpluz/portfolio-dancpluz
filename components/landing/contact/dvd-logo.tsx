'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types';

const ACCENT_COLORS = [
  'var(--color-neon-pink)',
  'var(--color-electric-green)',
  'var(--color-cyan-blue)',
] as const;

const CONFETTI_HEX_COLORS = [
  '#ff00ff',
  '#00f248',
  '#00fbfe',
];

const DEFAULT_WIDTH = 82;
const ASPECT_RATIO = 25 / 22; // Height / Width (from 22x25)
const DEFAULT_SPEED = 1.2;
const CORNER_MARGIN = 8;

interface DvdLogoProps {
  logoSize?: number; // Used as width
  speed?: number;
  className?: string;
}

export default function DvdLogo({
  logoSize = DEFAULT_WIDTH,
  speed = DEFAULT_SPEED,
  className = '',
}: Readonly<DvdLogoProps>) {
  const logoW = logoSize;
  const logoH = Math.round(logoSize * ASPECT_RATIO);

  const screenRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const confettiRef = useRef<TCanvasConfettiInstance | null>(null);

  const posRef = useRef({ x: 0, y: 0 });
  const deltaRef = useRef({ x: speed, y: speed });
  const colorIndexRef = useRef(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const isInitialized = useRef(false);

  const onInitConfetti = useCallback(({ confetti }: { confetti: TCanvasConfettiInstance }) => {
    confettiRef.current = confetti;
  }, []);

  const fireConfetti = useCallback((x: number, y: number) => {
    const confetti = confettiRef.current;
    const screen = screenRef.current;
    if (!confetti || !screen) return;

    const { w, h } = dimensionsRef.current;
    if (w === 0 || h === 0) return;

    const originX = (x + logoW / 2) / w;
    const originY = (y + logoH / 2) / h;

    confetti({
      particleCount: 80,
      spread: 360,
      startVelocity: 20,
      ticks: 60,
      origin: { x: originX, y: originY },
      colors: CONFETTI_HEX_COLORS,
      scalar: 0.8,
      gravity: 0.6,
    });
  }, [logoW, logoH]);

  const updateStyles = useCallback(() => {
    if (!logoRef.current) return;
    const color = ACCENT_COLORS[colorIndexRef.current];
    logoRef.current.style.color = color;
    logoRef.current.style.filter = `drop-shadow(0 0 2px ${color})`;
  }, []);

  const cycleColor = useCallback(() => {
    colorIndexRef.current = (colorIndexRef.current + 1) % ACCENT_COLORS.length;
    updateStyles();
  }, [updateStyles]);

  const handleLogoClick = useCallback(() => {
    const { x: dx, y: dy } = deltaRef.current;

    const flip = Math.floor(Math.random() * 3);
    deltaRef.current = {
      x: flip === 1 ? dx : -dx,
      y: flip === 0 ? dy : -dy,
    };

    cycleColor();
  }, [cycleColor]);

  useEffect(() => {
    const screen = screenRef.current;
    const logo = logoRef.current;
    if (!screen || !logo) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      dimensionsRef.current = { w: width, h: height };

      if (!isInitialized.current && width > 0 && height > 0) {
        const maxX = width - logoW;
        const maxY = height - logoH;
        posRef.current = {
          x: Math.random() * Math.max(0, maxX),
          y: Math.random() * Math.max(0, maxY),
        };
        
        deltaRef.current = {
          x: Math.random() > 0.5 ? speed : -speed,
          y: Math.random() > 0.5 ? speed : -speed,
        };

        colorIndexRef.current = Math.floor(Math.random() * ACCENT_COLORS.length);
        updateStyles();
        logo.style.opacity = '1';
        isInitialized.current = true;
      }
    });

    observer.observe(screen);

    const animate = () => {
      if (!isInitialized.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const { w, h } = dimensionsRef.current;
      const boundX = w - logoW;
      const boundY = h - logoH;

      let { x, y } = posRef.current;
      let { x: dx, y: dy } = deltaRef.current;

      x += dx;
      y += dy;

      let bouncedX = false;
      let bouncedY = false;

      if (x >= boundX) {
        x = boundX;
        dx = -speed;
        bouncedX = true;
      } else if (x <= 0) {
        x = 0;
        dx = speed;
        bouncedX = true;
      }

      if (y >= boundY) {
        y = boundY;
        dy = -speed;
        bouncedY = true;
      } else if (y <= 0) {
        y = 0;
        dy = speed;
        bouncedY = true;
      }

      if (bouncedX || bouncedY) cycleColor();

      const nearLeft = x <= CORNER_MARGIN;
      const nearRight = x >= boundX - CORNER_MARGIN;
      const nearTop = y <= CORNER_MARGIN;
      const nearBottom = y >= boundY - CORNER_MARGIN;

      const isCorner = (nearLeft || nearRight) && (nearTop || nearBottom);

      if (isCorner && (bouncedX || bouncedY)) {
        fireConfetti(x, y);
      }

      posRef.current = { x, y };
      deltaRef.current = { x: dx, y: dy };

      logo.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    logo.style.opacity = '0';
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [logoW, logoH, speed, cycleColor, updateStyles, fireConfetti]);

  return (
    <div
      ref={screenRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <div
        ref={logoRef}
        className='absolute top-0 left-0 will-change-transform'
        style={{ width: logoW, height: logoH }}
      >
        <m.button
          type='button'
          className='w-full h-full cursor-pointer border-0 bg-transparent p-0'
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          onClick={handleLogoClick}
          aria-label='Teleport logo'
        >
          <Image
            src='/logo.svg'
            alt='Logo'
            width={logoW}
            height={logoH}
            className='w-full h-full pointer-events-none'
          />
        </m.button>
      </div>
      <ReactCanvasConfetti
        onInit={onInitConfetti}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
