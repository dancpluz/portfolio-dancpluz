'use client';

import React, { useState } from 'react';
import { Social } from '@/types/api';
import { ArrowRight, Copy } from '@/components/ui/svg';
import { m } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';

const SHIMMER_CLASSES = [
  `via-accent-1/10`,
  `via-accent-2/10`,
  `via-accent-3/10`,
] as const;

const ARROW_CLASSES = [
  `group-hover:text-accent-1`,
  `group-hover:text-accent-2`,
  `group-hover:text-accent-3`,
] as const;

const TEXT_COLORS = [
  `text-accent-1`,
  `text-accent-2`,
  `text-accent-3`,
] as const;

interface SocialCardProps {
  social: Social;
  index: number;
}

function SocialCard({ social, index }: Readonly<SocialCardProps>) {
  const shimmer = SHIMMER_CLASSES[index % SHIMMER_CLASSES.length];
  const arrow = ARROW_CLASSES[index % ARROW_CLASSES.length];
  const color = TEXT_COLORS[index % TEXT_COLORS.length];
  const locale = useLocale();
  const t = useTranslations('common');
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(social.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <m.div
      className='group relative w-full h-full'
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.25, 0, 1],
      }}
    >
      <div className='relative h-full bg-linear-to-br from-surface to-background backdrop-blur-xl rounded-2xl p-8 pixel-corners-border transition-all duration-500 hover:scale-105'>
        <Link
          href={social.url}
          target='_blank'
          rel='noopener noreferrer'
          className='absolute inset-0 z-0'
          aria-label={social.text}
        />

        <button
          onClick={handleCopy}
          type='button'
          className={cn(
            'absolute top-4 right-4 z-20 p-2 rounded-lg transition-all duration-300 hover:bg-foreground/5 active:scale-95',
            copied
              ? `text-${color}`
              : 'text-foreground/50 hover:text-foreground',
          )}
          title={t('copy_to_clipboard')}
        >
          <Copy className='size-5' />
          {copied && (
            <m.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap font-heading'
            >
              {t('copied')}
            </m.span>
          )}
        </button>

        {/* Content */}
        <div className='relative z-10 flex flex-col h-full pointer-events-none'>
          <div className='mb-4 inline-flex transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 self-start'>
            <Image
              src={social.iconUrl}
              alt={social.iconAlt || social.text}
              width={32}
              height={32}
              className='object-contain theme-invert-0'
            />
          </div>

          <h3 className='text-foreground font-heading font-semibold text-xl transition-colors duration-300'>
            {social.text}
          </h3>

          <div className='mt-auto pt-4 flex items-center text-foreground/50 group-hover:text-foreground transition-colors duration-300'>
            <span className='text-md font-medium transition-all duration-300'>
              {locale === 'en' ? social.subtextEn : social.subtextPt}
            </span>
            <ArrowRight
              className={cn(
                'w-4 h-4 ml-2 text-foreground/50 transform transition-all duration-600 group-hover:translate-x-1',
                arrow,
              )}
            />
          </div>
        </div>

        {/* Shimmer Effect */}
        <div
          className={cn(
            'absolute inset-0 pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent to-transparent',
            shimmer,
          )}
        />
      </div>
    </m.div>
  );
}

export default function Connect({ socials }: Readonly<{ socials: Social[] }>) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
      {socials.map((social, index) => (
        <SocialCard key={social.id} social={social} index={index} />
      ))}
    </div>
  );
}
