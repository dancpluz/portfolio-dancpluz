'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constant';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'motion/react';
import Socials from './socials';
import { useRef, useState, useEffect, memo, useMemo } from 'react';
import { useSectionScroll } from '@/hooks/use-section-scroll';
import { ArrowRight } from '../ui/svg';

const BAR_COUNT = 23;
const WAVES = Array.from({ length: BAR_COUNT }, (_, index) => ({
  id: `wave-${index}`,
  height: index + 1,
}));

export default function Footer() {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const pathname = usePathname();
  const handleScroll = useSectionScroll();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  useEffect(() => {
    let t = 0;

    const animateWave = () => {
      const waveElements = waveRefs.current;
      let offset = 0;

      waveElements.forEach((element, index) => {
        if (element) {
          offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
          element.style.transform = `translateY(${index + offset}px)`;
        }
      });

      t += 0.04;
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    if (isVisible) {
      animateWave();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVisible]);

  const navLinks = useMemo(() => Object.entries(ROUTES), []);

  const scrollToTop = useMemo(
    () => handleScroll(pathname, undefined, 100),
    [handleScroll, pathname],
  );

  return (
    <footer
      ref={footerRef}
      className='bg-background text-foreground relative flex flex-col w-full justify-between select-none mt-20'
    >
      <div className='flex flex-col md:flex-row justify-between w-full gap-8 pb-24 pt-8 section-px'>
        <div className='space-y-4'>
          <nav>
            <ul className='flex flex-wrap gap-x-6 gap-y-2'>
              {navLinks.map(([key, route]) => (
                <FooterLink key={route.path} route={route} text={tNav(key)} />
              ))}
            </ul>
          </nav>
          <p className='text-sm font-heading flex items-center gap-x-1'>
            {t('rights', { year: new Date().getFullYear() })}
          </p>
        </div>

        <div className='space-y-4'>
          <Socials />
          <div className='md:text-right'>
            <m.button
              onClick={scrollToTop}
              className='font-heading text-sm cursor-pointer'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {t('back_to_top')}
            </m.button>
          </div>
        </div>
      </div>

      <div aria-hidden='true' style={{ overflow: 'hidden', height: 200 }}>
        <div>
          {WAVES.map((wave, index) => (
            <div
              key={wave.id}
              ref={(el) => {
                waveRefs.current[index] = el;
              }}
              style={{
                height: `${wave.height}px`,
                backgroundColor: 'var(--color-foreground)',
                transition: 'transform 0.1s ease',
                willChange: 'transform',
                marginTop: '-2px',
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

const FooterLink = memo(function FooterLink({
  route,
  text,
}: {
  route: any;
  text: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const handleScroll = useSectionScroll();
  const onClick = useMemo(
    () => handleScroll(route.path, undefined, 100),
    [handleScroll, route.path],
  );

  return (
    <m.li
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        href={route.path}
        className='font-heading uppercase tracking-wider text-sm flex items-center gap-1 transition-colors'
        onClick={onClick}
      >
        <AnimatePresence mode='wait'>
          {isHovered && (
            <m.div
              initial={{ opacity: 0, width: 0, height: 0 }}
              animate={{ opacity: 1, width: 14, height: 14 }}
              exit={{ opacity: 0, width: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
              className='overflow-hidden shrink-0'
            >
              <ArrowRight className='text-accent-1 -rotate-45 w-full h-full' />
            </m.div>
          )}
        </AnimatePresence>
        {text}
      </Link>
    </m.li>
  );
});
