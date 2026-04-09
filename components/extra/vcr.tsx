'use client'

import { getRandomInt } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

interface VCRConfig {
  scanlines?: boolean;
  vignette?: boolean;
  snow?: boolean;
  snowOpacity?: number;
  vcr?: boolean;
  vcrOpacity?: number;
  vcrBlur?: number;
  tracking?: number;
  tapeAge?: number;
  wobbleX?: boolean;
  wobbleY?: boolean;
  glitch?: boolean;
  roll?: boolean;
  rollSpeed?: number;
  contentBlur?: number;
}

interface VCREffectProps {
  children: ReactNode;
  config?: VCRConfig;
  className?: string;
}

const defaultConfig: Required<VCRConfig> = {
  scanlines: true,
  vignette: true,
  snow: true,
  snowOpacity: 0.18,
  vcr: true,
  vcrOpacity: 0.9,
  vcrBlur: 1,
  tracking: 220,
  tapeAge: 60,
  wobbleX: true,
  wobbleY: true,
  glitch: true,
  roll: false,
  rollSpeed: 3000,
  contentBlur: 0,
};

interface CanvasSize {
  width: number;
  height: number;
}

function SnowCanvas({
  opacity,
  width,
  height,
}: CanvasSize & { opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const w = Math.max(1, Math.floor(width / 2));
    const h = Math.max(1, Math.floor(height / 2));

    const offscreen = document.createElement('canvas');
    const offscreenW = w * 2;
    const offscreenH = h * 2;
    offscreen.width = offscreenW;
    offscreen.height = offscreenH;

    const ctx = offscreen.getContext('2d', { alpha: true });
    if (!ctx) return;

    const d = ctx.createImageData(offscreenW, offscreenH);
    const b = new Uint32Array(d.data.buffer);
    for (let i = 0; i < b.length; i++) {
      b[i] = Math.trunc(255 * Math.random()) << 24;
    }
    ctx.putImageData(d, 0, 0);
    offscreenCanvasRef.current = offscreen;
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let lastTime = 0;
    const fps = 24; // Limit to 24fps for VCR feel and lower CPU usage
    const interval = 1000 / fps;

    const draw = (time: number) => {
      rafRef.current = requestAnimationFrame(draw);

      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      const offscreen = offscreenCanvasRef.current;
      if (!offscreen || canvas.width === 0 || canvas.height === 0) return;

      const w = canvas.width;
      const h = canvas.height;
      const dx = -(Math.random() * w);
      const dy = -(Math.random() * h);

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(offscreen, dx, dy);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={Math.max(1, Math.floor(width / 2))}
      height={Math.max(1, Math.floor(height / 2))}
      className='absolute inset-0 w-full h-full pointer-events-none'
      style={{ opacity, zIndex: 10, mixBlendMode: 'screen' }}
    />
  );
}

interface VCRCanvasProps extends CanvasSize {
  opacity: number;
  blur: number;
  tracking: number;
  tapeAge: number;
}

function VCRCanvas({
  opacity,
  blur,
  tracking,
  tapeAge,
  width,
  height,
}: Readonly<VCRCanvasProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const renderTail = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
      const n = getRandomInt(1, 50);
      const dir = Math.random() < 0.5 ? 1 : -1;
      for (let i = 0; i < n; i++) {
        const r = Math.max(0, radius - 0.1 * i);
        const dx = getRandomInt(1, 4) * dir;
        ctx.fillRect((x += dx), y, r, r);
      }
      ctx.fill();
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    const fps = 16;
    const interval = 1000 / fps;

    const draw = (time: number) => {
      rafRef.current = requestAnimationFrame(draw);

      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      if (canvas.width === 0 || canvas.height === 0) return;

      canvas.style.filter = `blur(${blur}px)`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';

      ctx.beginPath();
      for (let i = 0; i <= tapeAge; i++) {
        const x = Math.random() * canvas.width;
        const y1 = getRandomInt(
          Math.min(tracking + i * 3, canvas.height),
          canvas.height,
        );
        const y2 = getRandomInt(
          0,
          Math.max(canvas.height - tracking - i * 3, 0),
        );
        ctx.fillRect(x, y1, 2, 2);
        ctx.fillRect(x, y2, 2, 2);
        ctx.fill();
        renderTail(ctx, x, y1, 2);
        renderTail(ctx, x, y2, 2);
      }
      ctx.closePath();
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [blur, tracking, tapeAge, renderTail]);

  return (
    <canvas
      ref={canvasRef}
      width={Math.max(1, width)}
      height={Math.max(1, height)}
      className='absolute inset-0 w-full h-full pointer-events-none'
      style={{ opacity, zIndex: 11 }}
    />
  );
}

export default function VCREffect({
  children,
  config: externalConfig,
  className = '',
}: Readonly<VCREffectProps>) {
  const cfg: Required<VCRConfig> = { ...defaultConfig, ...externalConfig };

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 640, height: 360 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wobbleXStyle: React.CSSProperties = cfg.wobbleX
    ? { animation: 'vcrWobbleX 100ms infinite' }
    : {};

  const wobbleYStyle: React.CSSProperties = cfg.wobbleY
    ? { animation: 'vcrWobbleY 100ms infinite' }
    : {};

  const glitchStyle: React.CSSProperties = cfg.glitch
    ? { animation: 'vcrGlitch 5s ease 2s infinite' }
    : {};

  const rollStyle: React.CSSProperties = cfg.roll
    ? { animation: `vcrRoll ${cfg.rollSpeed}ms linear infinite` }
    : {};

  const blurStyle: React.CSSProperties =
    cfg.contentBlur > 0 ? { filter: `blur(${cfg.contentBlur}px)` } : {};

  return (
    <>
      <style>{`
        @keyframes vcrWobbleX {
          50% { transform: translateX(1px); }
          51% { transform: translateX(0); }
        }
        @keyframes vcrWobbleY {
          0%   { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
        @keyframes vcrGlitch {
          40% { opacity: 1; transform: scale(1,1) skew(0deg); }
          41% { opacity: 0.8; transform: scale(1,1.15) skew(60deg); }
          42% { opacity: 0.8; transform: scale(1,1.15) skew(-40deg); }
          43% { opacity: 1; transform: scale(1,1) skew(0deg); }
        }
        @keyframes vcrRoll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
      `}</style>

      <div
        className={`relative inline-block w-full ${className}`}
        ref={containerRef}
      >
        <div
          className='relative overflow-hidden w-full h-full'
          style={wobbleXStyle}
        >
          <div className='w-full h-full' style={wobbleYStyle}>
            <div className='w-full h-full' style={glitchStyle}>
              {cfg.roll ? (
                <div style={rollStyle} className='w-full h-full relative'>
                  <div style={blurStyle} className='w-full h-full relative'>
                    {children}
                  </div>
                  <div style={blurStyle} className='w-full h-full relative'>
                    {children}
                  </div>
                </div>
              ) : (
                <div style={blurStyle} className='w-full h-full relative'>
                  {children}
                </div>
              )}

              {cfg.snow && (
                <SnowCanvas
                  opacity={cfg.snowOpacity}
                  width={size.width}
                  height={size.height}
                />
              )}

              {cfg.vcr && (
                <VCRCanvas
                  opacity={cfg.vcrOpacity}
                  blur={cfg.vcrBlur}
                  tracking={cfg.tracking}
                  tapeAge={cfg.tapeAge}
                  width={size.width}
                  height={size.height}
                />
              )}

              {cfg.scanlines && (
                <div
                  className='absolute inset-0 pointer-events-none'
                  style={{
                    zIndex: 12,
                    background: `
                      linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 50%),
                      linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03))
                    `,
                    backgroundSize: '100% 2px, 3px 100%',
                  }}
                />
              )}

              {cfg.vignette && (
                <div
                  className='absolute inset-0 pointer-events-none'
                  style={{
                    zIndex: 13,
                    background:
                      'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.75) 100%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
