'use client';

import { categoryEmoji } from '@/lib/const';
import { formatDateLocal, getFirstParagraphText } from '@/lib/utils';
import { PostsResponse } from '@/types/pocketbase';
import { m } from 'motion/react';
import TransitionLink from '@/components/transition-link';
import Image from 'next/image';
import { buildImageUrl } from '@/lib/api';
import { useLocale } from 'next-intl';
import { LineReveal, Reveal } from '../motion/reveal';

interface PostCardProps {
  post: PostsResponse;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const locale = useLocale();
  const { title, id, long_text, article, created } = post;

  const description = long_text || getFirstParagraphText(article);

  return (
    <m.li
      key={id}
      className='last:border-b-0 border-b border-foreground/20 transition-colors duration-500 group w-full'
      initial={{ scale: 0.8, opacity: 0, filter: 'blur(2px)' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      exit={{ scale: 0.8, opacity: 0, filter: 'blur(2px)' }}
      whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      layout
    >
      <TransitionLink href={`/blog/${id}`} aria-label={`Leia "${title}"`}>
        <article className='py-5 flex gap-4'>
          <div className='aspect-square size-20 bg-surface group-hover:scale-110 group-hover:rotate-3 group-hover:-translate-y-1 ease-spring duration-600 text-xs grid content-center place-items-center border-foreground border'>
            <ImageGif post={post} />
          </div>
          <div className='space-y-1 transition-[padding] group-hover:px-2 w-full'>
            <div className='flex gap-4 w-full justify-between'>
              <h2 className='leading-none text-xl font-bold underline-magical-2 group-hover:bg-size-[100%_100%] group-hover:text-background'>
                {title}
              </h2>
              <m.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.4 }}
                className='flex grow h-px bg-accent-1 self-center origin-left'
              />
              <time className='w-max whitespace-nowrap text-sm text-foreground/60'>
                {formatDateLocal(created, locale)}
              </time>
            </div>
            <Reveal direction='up' delay={index * 0.4} duration={0.6}>
              <p className='text-foreground/60 leading-tight line-clamp-3'>
                {description}
              </p>
            </Reveal>
          </div>
        </article>
      </TransitionLink>
    </m.li>
  );
}

function ImageGif({ post }: { post: PostsResponse }) {
  const { gifs, images, category, title } = post;

  const firstGif = gifs?.[0] ?? null;
  const firstImage = images?.[0] ?? null;

  if (firstGif) {
    return (
      <Image
        src={buildImageUrl(post, firstGif)}
        alt={title ?? 'gif'}
        width={100}
        height={100}
        className='size-full object-fill'
        unoptimized
      />
    );
  }

  if (firstImage) {
    return (
      <Image
        src={buildImageUrl(post, firstImage)}
        alt={title ?? 'image'}
        width={100}
        height={100}
        className='object-cover'
      />
    );
  }

  return (
    <p className='grayscale contrast-300 text-2xl'>
      {category ? categoryEmoji[category] : '🗒️'}
    </p>
  );
}
