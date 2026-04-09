'use client';
import { useState, useRef, useId, useCallback, useMemo } from 'react';
import {
  m,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'motion/react';

interface TooltipProps {
  children: React.ReactNode;
  name: string;
  alt?: string;
  className?: string;
  as?: 'div' | 'button' | 'span';
}

export default function Tooltip({
  children,
  name,
  alt,
  className = '',
  as = 'div',
}: Readonly<TooltipProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const id = useId();
  const animationFrameRef = useRef<number | null>(null);

  const randShimmer = useMemo(() => {
    const classes = ['via-accent-1', 'via-accent-2', 'via-accent-3'];
    return classes[Math.floor(Math.random() * classes.length)];
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;

      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => {
        x.set(offsetX);
      });
    },
    [x],
  );

  const handleMouseLeave = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    x.set(0);
    setIsHovered(false);
  }, [x]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') setIsHovered(false);
  }, []);

  const Component = as as React.ElementType;

  return (
    <Component
      className={`group relative inline-block w-fit outline-hidden ${className}`}
      aria-describedby={isHovered ? id : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={handleMouseLeave}
      onKeyDown={handleKeyDown}
      type={as === 'button' ? 'button' : undefined}
      tabIndex={as === 'div' ? undefined : 0}
      aria-label={as === 'button' ? name : undefined}
    >
      <AnimatePresence>
        {isHovered && (
          <m.div
            id={id}
            role='tooltip'
            initial={{ opacity: 0, y: 12, scale: 0.75 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 260, damping: 18 },
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.85,
              transition: { duration: 0.15, ease: 'easeIn' },
            }}
            style={{
              translateX,
              rotate,
              pointerEvents: 'none',
            }}
            className='absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 overflow-hidden rounded-md border border-foreground/20 bg-background px-4 py-2 shadow-xl shadow-black/20 w-max max-w-[250px]'
          >
            <div className={`absolute bottom-0 left-1/2 h-px w-4/5 -translate-x-1/2 bg-linear-to-r from-transparent ${randShimmer} to-transparent opacity-80`} />
            <div className={`absolute bottom-0 left-1/2 h-px w-2/5 -translate-x-1/2 bg-linear-to-r from-transparent ${randShimmer} to-transparent`} />

            {alt && (
              <span className='block text-left text-[10px] uppercase font-bold tracking-wider font-heading text-foreground/50 mb-1 leading-none'>
                {alt}
              </span>
            )}
            <span className='font-heading relative z-30 text-base font-bold text-foreground block text-center wrap-break-word whitespace-normal leading-tight'>
              {name}
            </span>
          </m.div>
        )}
      </AnimatePresence>
      {children}
    </Component>
  );
}
