'use client';

import { Heading } from '@/types/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Handle scroll to bottom - activate last heading
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < 10) {
        const lastHeading = headings[headings.length - 1];
        if (lastHeading) {
          setActiveId(lastHeading.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const indentationClasses: { [key: number]: string } = {
    1: 'ml-0', // h1
    2: 'ml-3', // h2
    3: 'ml-6', // h3
    4: 'ml-9', // h4
  };

  return (
    <nav className=''>
      <div className='sticky top-24 w-58'>
        <h2 className='text-sm font-semibold mb-3'>Nessa página</h2>
        <ul className='space-y-1 text-sm'>
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            const marginClass = indentationClasses[heading.level] || 'ml-0';

            return (
              <li key={heading.id} className={marginClass}>
                <Link
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                      window.history.pushState(null, '', `#${heading.id}`);
                    }
                  }}
                  className={`group flex items-start gap-2 py-1 transition-all duration-200 ${
                    isActive
                      ? 'text-foreground ml-1' // 
                      : 'text-foreground/50 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`text-base transition-all duration-200 group-hover:scale-100 ${
                      isActive
                        ? 'text-accent scale-100'
                        : 'text-foreground/20 scale-0'
                    }`}
                  >
                    •
                  </span>
                  <span className={isActive ? 'underline' : ''}>
                    {heading.text}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
