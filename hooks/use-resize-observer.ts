import { useState, useEffect, type RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useResizeObserver(ref: RefObject<HTMLElement | null>): Size | null {
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize((prev) => {
          if (prev?.width === width && prev?.height === height) return prev;
          return { width, height };
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
