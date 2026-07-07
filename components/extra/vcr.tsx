'use client'

import { useState, useRef, useEffect, ReactNode } from 'react';
import { uiLogger } from '@/lib/logger';
import { useIsTouch, usePrefersReducedMotion } from '@/hooks/use-is-touch';

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

// --- SnowCanvas: uses transferControlToOffscreen + Web Worker ---

function SnowCanvas({
  opacity,
  width,
  height,
}: CanvasSize & { opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const transferredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || transferredRef.current) return;

    try {
      const offscreen = canvas.transferControlToOffscreen();
      const worker = new Worker(
        new URL('./snow.worker.ts', import.meta.url),
      );

      worker.postMessage(
        {
          type: 'init',
          canvas: offscreen,
          width,
          height,
        },
        [offscreen],
      );

      workerRef.current = worker;
      transferredRef.current = true;
    } catch (err) {
      uiLogger.warn(`[SnowCanvas] OffscreenCanvas not supported, snow effect disabled: ${err}`);
    }

    return () => {
      workerRef.current?.postMessage({ type: 'stop' });
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // Only run on mount — canvas transfer can only happen once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send resize messages when dimensions change
  useEffect(() => {
    workerRef.current?.postMessage({ type: 'resize', width, height });
  }, [width, height]);

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

// --- VCRCanvas: uses transferControlToOffscreen + Web Worker ---

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
  const workerRef = useRef<Worker | null>(null);
  const transferredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || transferredRef.current) return;

    try {
      const offscreen = canvas.transferControlToOffscreen();
      const worker = new Worker(
        new URL('./vcr-tape.worker.ts', import.meta.url),
      );

      worker.postMessage(
        {
          type: 'init',
          canvas: offscreen,
          width,
          height,
          blur,
          tracking,
          tapeAge,
        },
        [offscreen],
      );

      workerRef.current = worker;
      transferredRef.current = true;
    } catch (err) {
      uiLogger.warn(`[VCRCanvas] OffscreenCanvas not supported, VCR effect disabled: ${err}`);
    }

    return () => {
      workerRef.current?.postMessage({ type: 'stop' });
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send resize messages
  useEffect(() => {
    workerRef.current?.postMessage({ type: 'resize', width, height });
  }, [width, height]);

  // Send config updates
  useEffect(() => {
    workerRef.current?.postMessage({
      type: 'update',
      blur,
      tracking,
      tapeAge,
    });
  }, [blur, tracking, tapeAge]);

  return (
    <canvas
      ref={canvasRef}
      width={Math.max(1, width)}
      height={Math.max(1, height)}
      className='absolute inset-0 w-full h-full pointer-events-none'
      style={{ opacity, zIndex: 11, filter: `blur(${blur}px)` }}
    />
  );
}

export default function VCREffect({
  children,
  config: externalConfig,
  className = '',
}: Readonly<VCREffectProps>) {
  const isTouch = useIsTouch();
  const reduceMotion = usePrefersReducedMotion();
  const cfg: Required<VCRConfig> = { ...defaultConfig, ...externalConfig };

  // Mobile/reduced-motion: cut the most expensive bits (glitch + wobble) and,
  // when the user asked for reduced motion, drop the animated noise entirely.
  if (isTouch) {
    cfg.glitch = false;
    cfg.wobbleX = false;
    cfg.wobbleY = false;
  }
  if (reduceMotion) {
    cfg.glitch = false;
    cfg.wobbleX = false;
    cfg.wobbleY = false;
    cfg.snow = false;
  }

  // Lower canvas resolution on touch — the effect stretches to fill via CSS, so
  // a smaller backing store is cheaper with negligible visual loss.
  const pixelScale = isTouch ? 2 : 1;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 640, height: 360 });
  const renderSize: CanvasSize = {
    width: Math.max(1, Math.round(size.width / pixelScale)),
    height: Math.max(1, Math.round(size.height / pixelScale)),
  };

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
                  width={renderSize.width}
                  height={renderSize.height}
                />
              )}

              {cfg.vcr && (
                <VCRCanvas
                  opacity={cfg.vcrOpacity}
                  blur={cfg.vcrBlur}
                  tracking={cfg.tracking}
                  tapeAge={cfg.tapeAge}
                  width={renderSize.width}
                  height={renderSize.height}
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
