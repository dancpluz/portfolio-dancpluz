import { useState, useCallback, useEffect } from "react";

export default function useScrollProgress(target: React.RefObject<HTMLElement>, end) {
  const [readingProgress, setReadingProgress] = useState(0);

  const scrollListener = useCallback(() => {
    if (!target.current) return;

    const elementRect = target.current.getBoundingClientRect();

    const top = elementRect.top;
    const bottom = elementRect.bottom;
    const height = elementRect.height;

    // const middleOfViewport = window.scrollY + window.innerHeight / 2;

    // if (target.current.id == 'projetos') {
    //   console.log(height, middleOfViewport, top, bottom);
    // }

    // if (end) {
    //   const windowHeight = window.innerHeight;
    //   const scrollY = window.scrollY || document.documentElement.scrollTop;
    //   console.log(height, windowHeight, top, bottom, scrollY);
    // }

    if (top < 0 && bottom < 0) {
      setReadingProgress(100);
    } else if (top > 0 && bottom > 0) {
      setReadingProgress(0);
    } else {
      setReadingProgress(-top / (height - 88) * 100);
    } 

  }, [target]);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, [scrollListener]);

  return readingProgress;
}
