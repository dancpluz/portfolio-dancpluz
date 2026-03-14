'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { lerp } from '@/lib/utils';
import FlipText from './flip-text';

interface Project {
  title: string;
  description: string;
  year: string;
  link: string;
  image: string;
}

const tempProjects: Project[] = [
  {
    title: 'Lumina',
    description: 'AI-powered design system generator.',
    year: '2024',
    link: '#',
    image:
      'https://plus.unsplash.com/premium_photo-1723489242223-865b4a8cf7b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D$0',
  },
  {
    title: 'Flux',
    description: 'Real-time collaboration for creative teams.',
    year: '2024',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1530435460869-d13625c69bbf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D$0',
  },
  {
    title: 'Prism',
    description: 'Color palette extraction from any image.',
    year: '2023',
    link: '#',
    image:
      'https://i.pinimg.com/1200x/99/ca/5c/99ca5cf82cf12df8801f7b2bef38d325.jpg',
  },
  {
    title: 'Vertex',
    description: '3D modeling toolkit for the web.',
    year: '2023',
    link: '#',
    image:
      'https://i.pinimg.com/736x/7c/15/39/7c1539cf7ff0207cb49ce0d338de1e5f.jpg',
  },
];

export default function ProjectShowcase({
  projects = tempProjects,
}: Readonly<{
  projects?: Project[];
}>) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div ref={containerRef} className='relative w-full mx-auto px-6 py-16'>
      <FlipText className='text-8xl font-heading' text='Projects' />

      <div
        className='pointer-events-none fixed z-20 overflow-hidden rounded-xl shadow-2xl'
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0)`,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition:
            'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='relative w-[280px] h-[180px] bg-secondary rounded-xl overflow-hidden'>
          {projects.map((project, index) => (
            <Image
              key={`img-${project.title}`}
              src={project.image || '/placeholder.svg'}
              alt={project.title}
              fill
              className='absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out'
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                scale: hoveredIndex === index ? 1 : 1.1,
                filter: hoveredIndex === index ? 'none' : 'blur(10px)',
              }}
            />
          ))}
          <div className='absolute inset-0 bg-linear-to-t from-background/20 to-transparent' />
        </div>
      </div>

      <div className='space-y-0'>
        {projects.map((project, index) => (
          <ProjectRow
            key={project.title}
            project={project}
            isHovered={hoveredIndex === index}
            onMouseEnter={() => {
              setHoveredIndex(index);
              setIsVisible(true);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              setIsVisible(false);
            }}
          />
        ))}
        <div className='border-t border-border' />
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  project: Project;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <Link
      href={project.link}
      className='group block'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='relative py-5 border-t border-border transition-all duration-300 ease-out'>
        <div
          className={`absolute inset-0 -mx-4 px-4 bg-secondary/50 rounded-lg transition-all duration-300 ease-out ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />

        <div className='relative flex items-start justify-between gap-4'>
          <div className='flex-1 min-w-0'>
            <div className='inline-flex items-center gap-2'>
              <FlipText
                text={project.title}
                className='font-heading font-bold text-md'
                isHovered={isHovered}
              />
              <ArrowUpRight
                className={`w-4 h-4 text-muted-foreground transition-all duration-300 ease-out ${
                  isHovered
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 -translate-x-2 translate-y-2'
                }`}
              />
            </div>
            <p
              className={`text-sm mt-1 leading-relaxed transition-all duration-300 ease-out ${
                isHovered ? 'text-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {project.description}
            </p>
          </div>
          <span
            className={`text-xs font-mono tabular-nums transition-all duration-300 ease-out ${
              isHovered ? 'text-foreground/60' : 'text-muted-foreground'
            }`}
          >
            {project.year}
          </span>
        </div>
      </div>
    </Link>
  );
}
