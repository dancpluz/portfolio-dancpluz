import { useState, useEffect } from 'react';
import { prepare, layout } from '@chenglou/pretext';
import { uiLogger } from '@/lib/logger';

export interface UseAutoFitTextParams {
  text: string;
  maxWidth: number;
  maxHeight: number;
  baseSize?: number;
  minSize?: number;
  lineHeightMultiplier?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  buffer?: number;
  /** When true, finds the largest font size where the full text fits in a single line (width only). */
  singleLine?: boolean;
}

export function useAutoFitText({
  text,
  maxWidth,
  maxHeight,
  baseSize = 16,
  minSize = 8,
  lineHeightMultiplier = 1.25,
  fontFamily = 'Inter, sans-serif',
  fontWeight = 400,
  buffer = 2,
  singleLine = false,
}: UseAutoFitTextParams): number {
  const [fontSize, setFontSize] = useState(baseSize);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.fonts.ready.then(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    if (!text || !fontLoaded) return;
    
    let bestSize = minSize;
    
    try {
      for (let size = baseSize; size >= minSize; size--) {
        const fontStr = `${fontWeight} ${size}px ${fontFamily}`;
        const prepared = prepare(text, fontStr);

        if (singleLine) {
          // If layout with the actual maxWidth produces only 1 line, the text fits
          const lh = size * lineHeightMultiplier;
          const result = layout(prepared, maxWidth, lh);
          if (result.lineCount <= 1) {
            bestSize = size;
            break;
          }
        } else {
          const lh = size * lineHeightMultiplier;
          const result = layout(prepared, maxWidth, lh);
          if (result.height <= maxHeight - buffer) {
            bestSize = size;  
            break;
          }
        }
      }
    } catch (err) {
      uiLogger.warn(`[useAutoFitText] Layout calculation failed for "${text.slice(0, 30)}", using baseSize: ${err}`);
      bestSize = baseSize;
    }
    
    setFontSize(bestSize);
  }, [
    text,
    maxWidth,
    maxHeight,
    baseSize,
    minSize,
    lineHeightMultiplier,
    fontFamily,
    fontWeight,
    buffer,
    fontLoaded,
    singleLine,
  ]);

  return fontSize;
}

