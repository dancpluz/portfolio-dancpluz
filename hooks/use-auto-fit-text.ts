import { useState, useEffect } from 'react';
import { prepare, layout } from '@chenglou/pretext';

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
        const lh = size * lineHeightMultiplier;
        
        const result = layout(prepared, maxWidth, lh);
        
        if (result.height <= maxHeight - buffer) {
          bestSize = size;  
          break;
        }
      }
    } catch {
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
    fontLoaded
  ]);

  return fontSize;
}
