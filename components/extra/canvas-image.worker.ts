// Canvas image effect processing in a Web Worker via OffscreenCanvas

// --- Effect type definitions (mirrored from canvas-image.tsx) ---

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

type ImageEffect =
  | PixelateEffect
  | PosterizeEffect
  | VibranceEffect
  | ExposureEffect;

interface ProcessMessage {
  type: 'process';
  src: string;
  effects: ImageEffect[];
}

// --- Effect processors ---

function applyPixelate(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  source: ImageBitmap,
  params: PixelateEffect['params'],
) {
  const w = canvas.width;
  const h = canvas.height;
  const pixelSize = Math.max(1, params.size);
  const smallW = Math.max(1, Math.ceil(w / pixelSize));
  const smallH = Math.max(1, Math.ceil(h / pixelSize));

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, smallW, smallH);
  ctx.drawImage(canvas, 0, 0, smallW, smallH, 0, 0, w, h);
}

function buildPosterizeLUT(levels: number): Uint8Array {
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(
      (Math.round((i / 255) * (levels - 1)) / (levels - 1)) * 255,
    );
  }
  return lut;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

interface PixelConfig {
  posterizeLUT: Uint8Array | null;
  preserveHue: boolean;
  vibranceAmt: number;
  saturationBoost: number;
  hasVibrance: boolean;
  contrastFactor: number;
  exposureFactor: number;
  hasExposure: boolean;
}

function buildPixelConfig(effects: ImageEffect[]): PixelConfig {
  const config: PixelConfig = {
    posterizeLUT: null,
    preserveHue: false,
    vibranceAmt: 0,
    saturationBoost: 0,
    hasVibrance: false,
    contrastFactor: 1,
    exposureFactor: 1,
    hasExposure: false,
  };

  for (const fx of effects) {
    if (!fx.enabled) continue;
    if (fx.type === 'posterize') {
      config.posterizeLUT = buildPosterizeLUT(Math.max(2, fx.params.levels));
      config.preserveHue = fx.params.preserveHue ?? false;
    }
    if (fx.type === 'vibrance') {
      config.vibranceAmt = fx.params.vibrance;
      config.saturationBoost = fx.params.saturation ?? 0;
      config.hasVibrance = true;
    }
    if (fx.type === 'exposure') {
      const c = fx.params.contrast ?? 0;
      config.contrastFactor = (259 * (c * 255 + 255)) / (255 * (259 - c * 255));
      config.exposureFactor = Math.pow(2, fx.params.exposure ?? 0);
      config.hasExposure = true;
    }
  }

  return config;
}

const clamp = (v: number) => Math.min(255, Math.max(0, v));

function applyPosterize(r: number, g: number, b: number, lut: Uint8Array, preserveHue: boolean) {
  if (preserveHue) {
    const [h, s] = rgbToHsl(r, g, b);
    const [, , lNew] = rgbToHsl(lut[r], lut[g], lut[b]);
    return hslToRgb(h, s, lNew);
  }
  return [lut[r], lut[g], lut[b]] as [number, number, number];
}

function applyVibrance(r: number, g: number, b: number, vibrance: number, saturation: number) {
  const avg = (r + g + b) / 3;
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const satRatio = maxC === 0 ? 0 : 1 - minC / maxC;
  const totalAmt = vibrance * (1 - satRatio) + saturation;
  return [
    clamp(r + (r - avg) * totalAmt),
    clamp(g + (g - avg) * totalAmt),
    clamp(b + (b - avg) * totalAmt),
  ] as [number, number, number];
}

function applyExposureContrast(r: number, g: number, b: number, expFactor: number, contFactor: number) {
  if (expFactor !== 1) {
    r = clamp(r * expFactor);
    g = clamp(g * expFactor);
    b = clamp(b * expFactor);
  }
  if (contFactor !== 1) {
    r = clamp(contFactor * (r - 128) + 128);
    g = clamp(contFactor * (g - 128) + 128);
    b = clamp(contFactor * (b - 128) + 128);
  }
  return [r, g, b] as [number, number, number];
}

function processPixels(data: Uint8ClampedArray, effects: ImageEffect[]) {
  const cfg = buildPixelConfig(effects);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];

    if (cfg.posterizeLUT) {
      [r, g, b] = applyPosterize(r, g, b, cfg.posterizeLUT, cfg.preserveHue);
    }
    if (cfg.hasVibrance) {
      [r, g, b] = applyVibrance(r, g, b, cfg.vibranceAmt, cfg.saturationBoost);
    }
    if (cfg.hasExposure) {
      [r, g, b] = applyExposureContrast(r, g, b, cfg.exposureFactor, cfg.contrastFactor);
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

// --- Main worker handler ---

globalThis.onmessage = async (e: MessageEvent<ProcessMessage>) => {
  const { src, effects } = e.data;

  try {
    // Fetch the image and decode it as an ImageBitmap (available in workers)
    const response = await fetch(src);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const w = bitmap.width;
    const h = bitmap.height;
    if (w === 0 || h === 0) {
      globalThis.postMessage({ type: 'error', error: 'Image has zero dimensions' });
      return;
    }

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      globalThis.postMessage({ type: 'error', error: 'Could not get 2d context' });
      return;
    }

    // Check for pixelate first (needs raw source draw)
    const pixelateFx = effects.find(
      (fx) => fx.type === 'pixelate' && fx.enabled,
    ) as PixelateEffect | undefined;

    if (pixelateFx) {
      applyPixelate(ctx, canvas, bitmap, pixelateFx.params);
    } else {
      ctx.drawImage(bitmap, 0, 0, w, h);
    }

    // Remaining per-pixel effects
    const pixelEffects = effects.filter(
      (fx) => fx.type !== 'pixelate' && fx.enabled,
    );

    if (pixelEffects.length > 0) {
      const imageData = ctx.getImageData(0, 0, w, h);
      processPixels(imageData.data, pixelEffects);
      ctx.putImageData(imageData, 0, 0);
    }

    // Transfer the result back as an ImageBitmap (zero-copy)
    const resultBitmap = canvas.transferToImageBitmap();
    globalThis.postMessage({ type: 'done', bitmap: resultBitmap }, [resultBitmap] as any);

    bitmap.close();
  } catch (err) {
    globalThis.postMessage({
      type: 'error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
