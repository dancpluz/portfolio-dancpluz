'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { uiLogger } from '@/lib/logger';

// --- Effect type definitions ---

interface PixelateEffect {
  type: 'pixelate';
  enabled: boolean;
  params: {
    size: number;
    maintainAspect?: boolean;
  };
}

interface PosterizeEffect {
  type: 'posterize';
  enabled: boolean;
  params: {
    levels: number;
    preserveHue?: boolean;
  };
}

interface VibranceEffect {
  type: 'vibrance';
  enabled: boolean;
  params: {
    vibrance: number;
    saturation?: number;
  };
}

interface ExposureEffect {
  type: 'exposure';
  enabled: boolean;
  params: {
    exposure?: number;
    highlights?: number;
    shadows?: number;
    blacks?: number;
    whites?: number;
    contrast?: number;
  };
}

export type ImageEffect =
  | PixelateEffect
  | PosterizeEffect
  | VibranceEffect
  | ExposureEffect;

interface CanvasImageProps {
  src: string;
  alt: string;
  effects?: ImageEffect[];
  className?: string;
}

// Module-level cache: processed bitmaps keyed by src URL
const bitmapCache = new Map<string, ImageBitmap>();

const CanvasImage = memo(function CanvasImage({
  src,
  alt,
  effects = [],
  className = '',
}: CanvasImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [loaded, setLoaded] = useState(false);

  const hasPixelate = effects.some(
    (fx) => fx.type === 'pixelate' && fx.enabled,
  );

  useEffect(() => {
    if (!src) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cached = bitmapCache.get(src);
    if (cached) {
      canvas.width = cached.width;
      canvas.height = cached.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(cached, 0, 0);
        setLoaded(true);
      }
      return;
    }

    setLoaded(false);

    // Terminate any previous worker
    workerRef.current?.terminate();

    const worker = new Worker(
      new URL('./canvas-image.worker.ts', import.meta.url),
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;

      if (msg.type === 'done') {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const bitmap: ImageBitmap = msg.bitmap;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0);
          setLoaded(true);
        }

        // Store a clone in the cache for future instances
        createImageBitmap(bitmap).then((clone) => {
          bitmapCache.set(src, clone);
        }).catch(() => {
          // bitmap may already be closed, ignore
        });

        bitmap.close();
      } else if (msg.type === 'error') {
        uiLogger.error(`[CanvasImage] Worker error: ${msg.error}`);
      }
    };

    worker.postMessage({
      type: 'process',
      src,
      effects,
    });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) {
        workerRef.current = null;
      }
    };
  }, [src, effects]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className={`w-full h-full object-cover ${className}`}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        ...(hasPixelate && { imageRendering: 'pixelated' as const }),
      }}
    />
  );
});

export default CanvasImage;
