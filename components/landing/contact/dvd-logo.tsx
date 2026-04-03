'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types';
import {
  prepareWithSegments,
  layoutNextLine,
  layoutWithLines,
  type PreparedTextWithSegments,
  type LayoutCursor,
  type LayoutLine,
} from '@chenglou/pretext';

const ACCENT_COLORS = [
  'var(--color-neon-pink)',
  'var(--color-electric-green)',
  'var(--color-cyan-blue)',
] as const;

const ACCENT_HEX = ['#ff00ff', '#00f248', '#00fbfe'] as const;

const CONFETTI_HEX_COLORS = ['#ff00ff', '#00f248', '#00fbfe'];

const FILL_TEXT =
  'Quer transformar a sua ideia em realidade? Eu posso te ajudar! ' +
  'Trabalho com desenvolvimento web, aplicações mobile, design de interfaces e sistemas completos do zero. ' +
  'Desde landing pages elegantes até plataformas complexas com backend robusto, banco de dados e integrações com APIs externas. ' +
  'Meu foco é entregar soluções modernas, performáticas e com uma experiência de usuário impecável. ' +
  'Se você precisa de um site institucional, um e-commerce, um dashboard administrativo, um app ou qualquer projeto digital — chama no contato! ' +
  'Vamos conversar sobre o seu projeto e encontrar a melhor abordagem técnica pra tirar ele do papel. ' +
  'Atendo freelancers, startups, agências e empresas de todos os tamanhos. ' +
  'Cada projeto é único, e eu adapto a stack e a arquitetura pra entregar exatamente o que você precisa. ' +
  'React, Next.js, TypeScript, Node.js, bancos SQL e NoSQL, deploy em cloud — tudo isso faz parte do meu dia a dia. ' +
  'Não importa se o projeto é pequeno ou gigante, o importante é fazer bem feito. ' +
  'Entre em contato agora e vamos criar algo incrível juntos! ' +
  'Consultoria técnica, code review, mentoria e pair programming também fazem parte dos serviços que ofereço. ' +
  'Quer melhorar o desempenho do seu site? Precisa de acessibilidade? SEO? Animações? Tudo isso é comigo. ' +
  'Me manda uma mensagem, um e-mail, ou me chama nas redes sociais ao lado. ' +
  'Estou sempre aberto a novos desafios e colaborações. Bora construir o futuro juntos? ';

const DEFAULT_WIDTH = 82;
const ASPECT_RATIO = 25 / 22;
const DEFAULT_SPEED = 1.2;
const CORNER_MARGIN = 8;

// Text layout config
const FONT_SIZE = 20;
const LINE_HEIGHT = 25;
const TEXT_PADDING = 16;
const LOGO_PADDING = 6; // Extra padding around the logo for text avoidance
const FONT_STR = `400 ${FONT_SIZE}px Offbit, sans-serif`;

// Pre-computed alpha buckets (quantized to avoid per-line hex string computation)
const ALPHA_BUCKETS = 16;
const alphaHexCache = new Map<string, string[]>();

function getAlphaHexArray(baseColor: string): string[] {
  let arr = alphaHexCache.get(baseColor);
  if (arr) return arr;
  arr = new Array(ALPHA_BUCKETS + 1);
  for (let i = 0; i <= ALPHA_BUCKETS; i++) {
    const alpha = i / ALPHA_BUCKETS;
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0');
    arr[i] = `${baseColor}${a}`;
  }
  alphaHexCache.set(baseColor, arr);
  return arr;
}

function quantizedAlpha(alphaArr: string[], alpha: number): string {
  const idx = Math.round(Math.min(1, Math.max(0, alpha)) * ALPHA_BUCKETS);
  return alphaArr[idx];
}

/** Advance cursor through prepared text, wrapping to start if exhausted */
function getNextLine(
  prepared: PreparedTextWithSegments,
  cursor: LayoutCursor,
  width: number,
): { line: LayoutLine; cursor: LayoutCursor } | null {
  let line = layoutNextLine(prepared, cursor, width);
  if (line === null) {
    // Wrap around to beginning
    const resetCursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    line = layoutNextLine(prepared, resetCursor, width);
    if (line === null) return null;
  }
  return { line, cursor: line.end };
}

interface CachedLine {
  text: string;
  x: number;
  y: number;
}

interface DvdLogoProps {
  logoSize?: number;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const confettiRef = useRef<TCanvasConfettiInstance | null>(null);

  const posRef = useRef({ x: 0, y: 0 });
  const deltaRef = useRef({ x: speed, y: speed });
  const colorIndexRef = useRef(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const isInitialized = useRef(false);
  const preparedRef = useRef<PreparedTextWithSegments | null>(null);

  // Cached full-width line layout (recomputed only on resize)
  const cachedLinesRef = useRef<CachedLine[]>([]);
  const cachedCursorRef = useRef<LayoutCursor>({ segmentIndex: 0, graphemeIndex: 0 });
  const cachedContainerRef = useRef({ w: 0, h: 0 });
  const fontSetRef = useRef(false);

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });
  }, []);

  // Prepare the text when the font is loaded. Repeat the text enough to fill large screens.
  useEffect(() => {
    if (!fontLoaded) return;
    const longText = FILL_TEXT.repeat(20);
    try {
      preparedRef.current = prepareWithSegments(longText, FONT_STR);
    } catch {
      preparedRef.current = prepareWithSegments(longText, `400 ${FONT_SIZE}px sans-serif`);
    }
    // Invalidate cached lines when text is re-prepared
    cachedLinesRef.current = [];
    cachedContainerRef.current = { w: 0, h: 0 };
  }, [fontLoaded]);

  const onInitConfetti = useCallback(
    ({ confetti }: { confetti: TCanvasConfettiInstance }) => {
      confettiRef.current = confetti;
    },
    [],
  );

  const fireConfetti = useCallback(
    (x: number, y: number) => {
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
    },
    [logoW, logoH],
  );

  const updateStyles = useCallback(() => {
    if (!logoRef.current) return;
    const color = ACCENT_COLORS[colorIndexRef.current];
    logoRef.current.style.color = color;
  }, []);

  const cycleColor = useCallback(() => {
    colorIndexRef.current =
      (colorIndexRef.current + 1) % ACCENT_COLORS.length;
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

  /**
   * Rebuild the full-width line cache.
   * Uses layoutWithLines for lines that don't need per-line width variation,
   * which is much faster than iterating layoutNextLine for every line.
   */
  const rebuildLineCache = useCallback(
    (containerW: number, containerH: number) => {
      const prepared = preparedRef.current;
      if (!prepared) return;

      const maxWidth = containerW - TEXT_PADDING * 2;
      if (maxWidth <= 20) {
        cachedLinesRef.current = [];
        return;
      }

      // Use layoutWithLines for bulk line computation — single call, much faster
      const result = layoutWithLines(prepared, maxWidth, LINE_HEIGHT);
      const lines: CachedLine[] = [];
      const maxLines = Math.floor(containerH / LINE_HEIGHT);

      // If the prepared text doesn't produce enough lines, wrap around
      let sourceLines = result.lines;
      let lineIdx = 0;

      while (lines.length < maxLines) {
        if (lineIdx >= sourceLines.length) {
          // Wrap: re-layout from start
          lineIdx = 0;
        }
        const srcLine = sourceLines[lineIdx];
        lines.push({
          text: srcLine.text,
          x: TEXT_PADDING,
          y: lines.length * LINE_HEIGHT + TEXT_PADDING,
        });
        lineIdx++;
      }

      cachedLinesRef.current = lines;
      // Store the cursor at end for potential future use
      if (result.lines.length > 0) {
        cachedCursorRef.current = result.lines[result.lines.length - 1].end;
      }
      cachedContainerRef.current = { w: containerW, h: containerH };
    },
    [],
  );

  const drawText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      containerW: number,
      containerH: number,
      logoX: number,
      logoY: number,
      dpr: number,
    ) => {
      const prepared = preparedRef.current;
      if (!prepared) return;

      // Rebuild cache if container size changed
      const cached = cachedContainerRef.current;
      if (cached.w !== containerW || cached.h !== containerH) {
        rebuildLineCache(containerW, containerH);
      }

      const cachedLines = cachedLinesRef.current;
      if (cachedLines.length === 0) return;

      // Scale canvas context
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, containerW, containerH);

      const accentIdx = colorIndexRef.current;
      const baseColor = ACCENT_HEX[accentIdx];
      const alphaArr = getAlphaHexArray(baseColor);

      // Set font only once (or when it needs changing)
      if (fontSetRef.current) {
        ctx.font = FONT_STR;
      } else {
        ctx.font = FONT_STR;
        fontSetRef.current = true;
      }
      ctx.textBaseline = 'top';

      // Logo collision box (with padding)
      const lx1 = logoX - LOGO_PADDING;
      const lx2 = logoX + logoW + LOGO_PADDING;
      const ly1 = logoY - LOGO_PADDING;
      const ly2 = logoY + logoH + LOGO_PADDING;

      const TEXT_ALPHA = 0.12;
      ctx.fillStyle = quantizedAlpha(alphaArr, TEXT_ALPHA);

      // Cursor for split-line segments around the logo
      let splitCursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

      for (const element of cachedLines) {
        const cl = element;
        const lineY = cl.y;
        const lineBottom = lineY + LINE_HEIGHT;

        // Does this line vertically overlap the logo?
        const overlapsLogo =
          lineBottom > ly1 &&
          lineY < ly2 &&
          lx1 < containerW - TEXT_PADDING &&
          lx2 > TEXT_PADDING;

        if (overlapsLogo) {
          const leftWidth = Math.max(0, lx1 - TEXT_PADDING);
          const rightStart = lx2;
          const rightWidth = Math.max(0, containerW - TEXT_PADDING - rightStart);

          if (leftWidth > 20) {
            const result = getNextLine(prepared, splitCursor, leftWidth);
            if (result) {
              ctx.fillText(result.line.text, TEXT_PADDING, lineY);
              splitCursor = result.cursor;
            }
          }

          if (rightWidth > 20) {
            const result = getNextLine(prepared, splitCursor, rightWidth);
            if (result) {
              ctx.fillText(result.line.text, rightStart, lineY);
              splitCursor = result.cursor;
            }
          }
        } else {
          ctx.fillText(cl.text, cl.x, lineY);
        }
      }

      ctx.restore();
    },
    [logoW, logoH, rebuildLineCache],
  );

  useEffect(() => {
    const screen = screenRef.current;
    const logo = logoRef.current;
    const canvas = canvasRef.current;
    if (!screen || !logo || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      dimensionsRef.current = { w: width, h: height };

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      fontSetRef.current = false;

      cachedContainerRef.current = { w: 0, h: 0 };

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

        colorIndexRef.current = Math.floor(
          Math.random() * ACCENT_COLORS.length,
        );
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

      const dpr = window.devicePixelRatio || 1;
      drawText(ctx, w, h, x, y, dpr);

      rafRef.current = requestAnimationFrame(animate);
    };

    logo.style.opacity = '0';
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [logoW, logoH, speed, cycleColor, updateStyles, fireConfetti, drawText]);

  return (
    <div
      ref={screenRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* Background text canvas */}
      <canvas
        ref={canvasRef}
        className='absolute inset-0 pointer-events-none'
        style={{ imageRendering: 'auto' }}
      />

      {/* Bouncing DVD Logo */}
      <div
        ref={logoRef}
        className='absolute top-0 left-0 will-change-transform z-10'
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
