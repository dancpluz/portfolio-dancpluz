'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { lerp } from '@/lib/utils';
import FlipText from '../../extra/flip-text';
import { Project } from '@/types/api';
import { LineReveal } from '../../motion/reveal';
import { AnimatePresence, m } from 'motion/react';
import { ArrowRight } from '../../ui/svg';
import TransitionLink from '../../transition-link';

export default function ProjectShowcase({
  projects = [],
}: Readonly<{
  projects?: Project[];
}>) {
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [projects]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const prevHoveredRef = useRef<number | null>(null);
  useEffect(() => {
    if (hoveredIndex !== null) {
      prevHoveredRef.current = hoveredIndex;
    }
  }, [hoveredIndex]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });

  const containerRect = useRef<DOMRect | null>(null);

  const updateContainerRect = useCallback(() => {
    if (containerRef.current) {
      containerRect.current = containerRef.current.getBoundingClientRect();
    }
  }, []);

  useEffect(() => {
    const animate = () => {
      smoothPos.current = {
        x: lerp(smoothPos.current.x, mousePos.current.x, 0.15),
        y: lerp(smoothPos.current.y, mousePos.current.y, 0.15),
      };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${smoothPos.current.x + 20}px, ${smoothPos.current.y - 100}px, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRect.current) {
        mousePos.current = {
          x: e.clientX - containerRect.current.left,
          y: e.clientY - containerRect.current.top,
        };
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    updateContainerRect();
    window.addEventListener('scroll', updateContainerRect, { passive: true });
    window.addEventListener('resize', updateContainerRect, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateContainerRect);
      window.removeEventListener('resize', updateContainerRect);
    };
  }, [updateContainerRect]);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setIsVisible(false);
  }, []);

  const visibleImageIndices = useMemo(() => {
    const indices = new Set<number>();
    if (hoveredIndex !== null) indices.add(hoveredIndex);
    if (prevHoveredRef.current !== null) indices.add(prevHoveredRef.current);
    return indices;
  }, [hoveredIndex]);

  return (
    <div ref={containerRef} className='relative w-full mx-auto'>
      <div
        ref={cursorRef}
        className='pointer-events-none fixed z-20 overflow-hidden shadow-2xl'
        style={{
          left: containerRect.current?.left ?? 0,
          top: containerRect.current?.top ?? 0,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition:
            'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='relative aspect-3/2 w-[360px] pixel-corners-big bg-secondary overflow-hidden'>
          {sortedProjects.map((project, index) => {
            if (!visibleImageIndices.has(index)) return null;
            return (
              <Image
                key={`img-${project.id}`}
                src={project.coverUrl || '/placeholder.svg'}
                alt={project.title}
                fill
                className='absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out'
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 1.1,
                  filter: hoveredIndex === index ? 'none' : 'blur(10px)',
                }}
              />
            );
          })}
          <div className='absolute inset-0 bg-linear-to-t from-background/20 to-transparent' />
        </div>
      </div>

      <div className='space-y-0'>
        {sortedProjects.map((project, index) => (
          <MemoizedProjectRow
            key={project.id}
            project={project}
            index={index}
            isHovered={hoveredIndex === index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}
        <LineReveal
          className='bg-foreground/50 origin-left'
          delay={sortedProjects.length * 0.1}
        />
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: Readonly<{
  project: Project;
  index: number;
  isHovered: boolean;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}>) {
  const formattedDate = useMemo(() => {
    const d = new Date(project.date);
    if (Number.isNaN(d.getTime())) return project.date;
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${month} / ${d.getFullYear()}`;
  }, [project.date]);

  const accentColor = useMemo(() => {
    const colors = ['text-accent-1', 'text-accent-2', 'text-accent-3'];
    return colors[index % colors.length];
  }, [index]);

  const handleEnter = useCallback(
    () => onMouseEnter(index),
    [onMouseEnter, index],
  );

  return (
    <TransitionLink
      href={`obra/${project.id}`}
      className='group block'
      onMouseEnter={handleEnter}
      onMouseLeave={onMouseLeave}
    >
      <LineReveal className='bg-foreground/50' delay={index * 0.1} />
      <div className='relative py-5 transition-all duration-300 ease-out'>
        <div className='relative flex items-stretch justify-between gap-4'>
          <div className='flex-1 min-w-0'>
            <div className='inline-flex items-center gap-2'>
              <AnimatePresence mode='wait'>
                {isHovered && (
                  <m.div
                    initial={{ opacity: 0, width: 0, height: 0 }}
                    animate={{ opacity: 1, width: 24, height: 24 }}
                    exit={{ opacity: 0, width: 0, height: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                    className='overflow-hidden shrink-0'
                  >
                    <ArrowRight className={`${accentColor} -rotate-45`} />
                  </m.div>
                )}
              </AnimatePresence>
              <FlipText
                duration={0.2}
                staggerDelay={0.02}
                text={project.title}
                className='font-heading font-bold text-md'
                isHovered={isHovered}
              />
              {project.projectType && (
                <div className='px-2 py-0.5 text-lg font-heading font-bold tracking-wider text-foreground'>
                  <span className={accentColor}>[</span> {project.projectType}{' '}
                  <span className={accentColor}>]</span>
                </div>
              )}
            </div>
            <p
              className={`text-sm leading-relaxed transition-all duration-300 ease-out`}
            >
              {project.subtitle}
            </p>
          </div>
          <div className='flex flex-col justify-between items-end gap-1'>
            <span
              className={`text-xs font-heading font-bold tabular-nums transition-all duration-300 ease-out`}
            >
              {formattedDate}
            </span>
            {project.client && (
              <span
                className={`text-xs font-heading font-bold tabular-nums transition-all duration-300 ease-out`}
              >
                made for {project.client}
              </span>
            )}
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}

const MemoizedProjectRow = memo(ProjectRow);
