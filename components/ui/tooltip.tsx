'use client';
import { useState, useRef, useId, useCallback } from 'react';
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
  className?: string;
  as?: 'div' | 'button' | 'span';
}

export default function Tooltip({
  children,
  name,
  className = '',
  as = 'div',
}: Readonly<TooltipProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const id = useId();
  const animationFrameRef = useRef<number | null>(null);

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
      // ✅ Read synchronously — before React can null out currentTarget
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
    // Cancel any pending rAF so it doesn't fire after hover ends
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    x.set(0); // reset so next hover starts centered
    setIsHovered(false);
  }, [x]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') setIsHovered(false);
  }, []);

  const Component = as as React.ElementType;

  return (
    <Component
      className={`group relative inline-block w-fit cursor-default outline-hidden ${className}`}
      aria-describedby={isHovered ? id : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={handleMouseLeave}
      onKeyDown={handleKeyDown}
      type={as === 'button' ? 'button' : undefined}
      tabIndex={as !== 'div' ? 0 : undefined}
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
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
            className='absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 overflow-hidden rounded-md border border-foreground/20 bg-background px-4 py-2 shadow-xl shadow-black/20'
          >
            <div className='absolute bottom-0 left-1/2 h-px w-4/5 -translate-x-1/2 bg-linear-to-r from-transparent via-accent-1 to-transparent opacity-80' />
            <div className='absolute bottom-0 left-1/2 h-px w-2/5 -translate-x-1/2 bg-linear-to-r from-transparent via-accent-1 to-transparent' />

            <span className='font-heading relative z-30 text-base font-bold text-foreground'>
              {name}
            </span>
          </m.div>
        )}
      </AnimatePresence>
      {children}
    </Component>
  );
}
