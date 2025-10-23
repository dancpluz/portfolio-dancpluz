'use client';

import { formatDatePtBR } from '@/lib/utils';
import { PostsResponse } from '@/types/pocketbase';
import { motion } from 'motion/react';
import Link from 'next/link';

interface PostCardProps {
  post: PostsResponse;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const { title, id, created, long_text } = post;

  return (
    <motion.li
      key={id}
      className='border-b border-accent/50 transition-colors duration-500'
      initial={{ scale: 0.8, opacity: 0, filter: 'blur(2px)' }}
      transition={{ duration: 0.6, delay: index / 10 }}
      whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
    >
      <Link href={`/blog/${id}`} aria-label={`Leia "${title}"`}>
        <article className='space-y-1 py-5'>
          <div className='flex gap-4 w-full items-center justify-between'>
            <h2 className='text-2xl w-full max-w-2xl truncate whitespace-nowrap pr-2 font-bold group-hover:underline'>
              {title}
            </h2>
            <div className='mx-1 flex flex-1' />
            <time className='w-max whitespace-nowrap text-sm pl-2'>
              {formatDatePtBR(created)}
            </time>
          </div>
          <p className=''>{long_text}</p>
        </article>
      </Link>
    </motion.li>
  );
}
